// AI Logic Service for Specialist Copilot
// All functions use simulated logic - can be replaced with real AI/ML models in production

import {
  AuctionClient,
  ObjectWork,
  ClientHistory,
  ClientNote,
  HistoryEntry
} from '../types/auctionHouse'
import {
  auctionClients,
  objects,
  clientHistories,
  getClientById,
  getObjectById,
  getClientHistory
} from '../data/auctionMockData'

// ============================================
// 1. GET LIKELY BUYERS FOR OBJECT
// ============================================

export interface BuyerMatch {
  client: AuctionClient
  score: number
  reasons: string[]
}

export function getLikelyBuyersForObject(objectId: string): BuyerMatch[] {
  const object = getObjectById(objectId)
  if (!object) return []

  const matches: BuyerMatch[] = []

  for (const client of auctionClients) {
    const score = scoreClientForObject(client, object)
    if (score.total > 0) {
      matches.push({
        client,
        score: score.total,
        reasons: score.reasons
      })
    }
  }

  // Sort by score descending
  return matches.sort((a, b) => b.score - a.score).slice(0, 10)
}

interface ScoringResult {
  total: number
  reasons: string[]
}

function scoreClientForObject(client: AuctionClient, object: ObjectWork): ScoringResult {
  let score = 0
  const reasons: string[] = []

  // 1. Artist alignment (30 points max)
  if (client.structuredProfile.preferredArtists.includes(object.artist)) {
    score += 30
    reasons.push(`Collects ${object.artist}`)
  }

  // 2. Price fit (25 points max)
  const objectPrice = object.isBeingSoldNow
    ? (object.estimateLow + object.estimateHigh) / 2
    : object.lastSoldPrice || 0

  if (objectPrice >= client.structuredProfile.typicalPriceBand.min &&
      objectPrice <= client.structuredProfile.typicalPriceBand.max) {
    score += 25
    reasons.push('Within budget')
  } else if (objectPrice < client.structuredProfile.typicalPriceBand.max * 1.2) {
    score += 15
    reasons.push('Slightly above typical range')
  }

  // 3. Category/interest alignment (20 points max)
  const objectCategories = [object.medium.toLowerCase(), object.division.toLowerCase()]
  const clientInterests = client.structuredProfile.interests.map(i => i.toLowerCase())

  let categoryMatches = 0
  for (const category of objectCategories) {
    for (const interest of clientInterests) {
      if (interest.includes(category) || category.includes(interest)) {
        categoryMatches++
      }
    }
  }
  if (categoryMatches > 0) {
    const categoryScore = Math.min(20, categoryMatches * 10)
    score += categoryScore
    reasons.push('Matches collecting interests')
  }

  // 4. Purchase history alignment (15 points max)
  const history = getClientHistory(client.id)
  if (history) {
    // Check if they've bought similar works
    const boughtSimilarArtist = history.buying.some(h => h.artist === object.artist)
    if (boughtSimilarArtist) {
      score += 15
      reasons.push(`Previously purchased ${object.artist}`)
    }

    // Check if they've bid on similar works
    const bidOnSimilarArtist = history.bidding.some(h => h.artist === object.artist)
    if (bidOnSimilarArtist && !boughtSimilarArtist) {
      score += 10
      reasons.push(`Previously bid on ${object.artist}`)
    }
  }

  // 5. Activity level bonus (10 points max)
  if (client.relationshipStatus === 'active') {
    score += 10
    reasons.push('Active buyer')
  } else if (client.relationshipStatus === 'occasional') {
    score += 5
  }

  // 6. Recent engagement (10 points max)
  const daysSinceLastContact = getDaysSince(client.lastContactDate)
  if (daysSinceLastContact < 30) {
    score += 10
    reasons.push('Recently engaged')
  } else if (daysSinceLastContact < 90) {
    score += 5
  }

  return { total: score, reasons }
}

// ============================================
// 2. SUMMARIZE CLIENT BUYING HISTORY
// ============================================

export interface BuyingHistorySummary {
  totalPurchases: number
  totalSpent: number
  currency: string
  averagePurchasePrice: number
  preferredArtists: { artist: string; count: number }[]
  winRate: number
  recentActivity: string
  patterns: string[]
}

export function summarizeClientBuyingHistory(clientId: string): BuyingHistorySummary | null {
  const client = getClientById(clientId)
  const history = getClientHistory(clientId)

  if (!client || !history) return null

  const purchases = history.buying
  const bids = history.bidding
  const totalTransactions = purchases.length + bids.length

  // Calculate artist preferences
  const artistCounts: Record<string, number> = {}
  for (const purchase of purchases) {
    if (purchase.artist) {
      artistCounts[purchase.artist] = (artistCounts[purchase.artist] || 0) + 1
    }
  }
  const preferredArtists = Object.entries(artistCounts)
    .map(([artist, count]) => ({ artist, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // Calculate win rate
  const winRate = totalTransactions > 0 ? (purchases.length / totalTransactions) * 100 : 0

  // Calculate total spent
  const totalSpent = purchases.reduce((sum, p) => sum + (p.amount || 0), 0)
  const averagePurchasePrice = purchases.length > 0 ? totalSpent / purchases.length : 0

  // Identify patterns
  const patterns: string[] = []

  if (client.structuredProfile.decisionSpeed === 'fast') {
    patterns.push('Quick decision-maker - acts decisively')
  } else if (client.structuredProfile.decisionSpeed === 'slow') {
    patterns.push('Thoughtful buyer - takes time to research')
  }

  if (client.structuredProfile.negotiationStyle === 'aggressive') {
    patterns.push('Competitive bidder - willing to push price')
  } else if (client.structuredProfile.negotiationStyle === 'firm') {
    patterns.push('Disciplined bidder - sticks to budget')
  }

  if (client.structuredProfile.riskTolerance === 'adventurous') {
    patterns.push('Open to emerging artists and new categories')
  } else if (client.structuredProfile.riskTolerance === 'conservative') {
    patterns.push('Prefers established blue-chip artists')
  }

  // Recent activity
  const daysSinceLastPurchase = client.lastPurchaseDate
    ? getDaysSince(client.lastPurchaseDate)
    : 999
  let recentActivity = 'No recent purchases'
  if (daysSinceLastPurchase < 60) {
    recentActivity = 'Very active - purchased within last 2 months'
  } else if (daysSinceLastPurchase < 180) {
    recentActivity = 'Active - purchased within last 6 months'
  } else if (daysSinceLastPurchase < 365) {
    recentActivity = 'Occasional - last purchase within past year'
  }

  return {
    totalPurchases: purchases.length,
    totalSpent,
    currency: client.currency,
    averagePurchasePrice,
    preferredArtists,
    winRate,
    recentActivity,
    patterns
  }
}

// ============================================
// 3. GET RELEVANT OBJECTS FOR CLIENT
// ============================================

export interface ObjectMatch {
  object: ObjectWork
  score: number
  reasons: string[]
}

export function getRelevantObjectsForClient(clientId: string, onSaleOnly: boolean = true): ObjectMatch[] {
  const client = getClientById(clientId)
  if (!client) return []

  const relevantObjects = onSaleOnly
    ? objects.filter(o => o.isBeingSoldNow)
    : objects

  const matches: ObjectMatch[] = []

  for (const object of relevantObjects) {
    const score = scoreObjectForClient(object, client)
    if (score.total > 0) {
      matches.push({
        object,
        score: score.total,
        reasons: score.reasons
      })
    }
  }

  // Sort by score descending
  return matches.sort((a, b) => b.score - a.score)
}

function scoreObjectForClient(object: ObjectWork, client: AuctionClient): ScoringResult {
  let score = 0
  const reasons: string[] = []

  // 1. Artist match (30 points)
  if (client.structuredProfile.preferredArtists.includes(object.artist)) {
    score += 30
    reasons.push(`${object.artist} is a preferred artist`)
  }

  // 2. Price fit (25 points)
  const objectPrice = object.isBeingSoldNow
    ? (object.estimateLow + object.estimateHigh) / 2
    : object.lastSoldPrice || 0

  if (objectPrice >= client.structuredProfile.typicalPriceBand.min &&
      objectPrice <= client.structuredProfile.typicalPriceBand.max) {
    score += 25
    reasons.push('Perfect price fit')
  } else if (objectPrice < client.structuredProfile.typicalPriceBand.max * 1.2) {
    score += 15
    reasons.push('Within extended budget')
  }

  // 3. Category alignment (20 points)
  const objectKeywords = [
    object.division.toLowerCase(),
    object.medium.toLowerCase(),
    ...object.title.toLowerCase().split(' ')
  ]
  const clientInterests = client.structuredProfile.interests.map(i => i.toLowerCase())

  let matchCount = 0
  for (const keyword of objectKeywords) {
    for (const interest of clientInterests) {
      if (interest.includes(keyword) || keyword.includes(interest)) {
        matchCount++
      }
    }
  }
  if (matchCount > 0) {
    const categoryScore = Math.min(20, matchCount * 5)
    score += categoryScore
    reasons.push('Matches collecting interests')
  }

  // 4. Historical preference (15 points)
  const history = getClientHistory(client.id)
  if (history) {
    const boughtSimilar = history.buying.some(h => h.artist === object.artist)
    if (boughtSimilar) {
      score += 15
      reasons.push(`Previously collected ${object.artist}`)
    }
  }

  // 5. Division match (10 points)
  const divisionMatch = client.structuredProfile.interests.some(interest =>
    interest.toLowerCase().includes(object.division.toLowerCase())
  )
  if (divisionMatch) {
    score += 10
    reasons.push(`Collects ${object.division}`)
  }

  return { total: score, reasons }
}

// ============================================
// 4. AUTO-GENERATE CLIENT NOTE
// ============================================

export function autoGenerateClientNote(clientId: string): string {
  const client = getClientById(clientId)
  const history = getClientHistory(clientId)
  const summary = summarizeClientBuyingHistory(clientId)

  if (!client || !summary) {
    return `Viewing ${client?.name || 'client'} profile.`
  }

  const parts: string[] = []

  // Client status
  parts.push(`${client.name} - ${client.relationshipStatus} client since ${new Date(client.clientSince).getFullYear()}.`)

  // Spending summary
  if (summary.totalPurchases > 0) {
    parts.push(`Total purchases: ${summary.totalPurchases} (${formatCurrency(summary.totalSpent, client.currency)}). Average: ${formatCurrency(summary.averagePurchasePrice, client.currency)}.`)
  } else {
    parts.push(`Prospect - no purchases yet.`)
  }

  // Preferred artists
  if (summary.preferredArtists.length > 0) {
    const topArtists = summary.preferredArtists.slice(0, 3).map(a => a.artist).join(', ')
    parts.push(`Collects: ${topArtists}.`)
  }

  // Interests
  if (client.structuredProfile.interests.length > 0) {
    parts.push(`Interested in: ${client.structuredProfile.interests.slice(0, 3).join(', ')}.`)
  }

  // Budget
  parts.push(`Budget range: ${formatCurrency(client.structuredProfile.typicalPriceBand.min, client.currency)} - ${formatCurrency(client.structuredProfile.typicalPriceBand.max, client.currency)}.`)

  // Buying patterns
  if (summary.patterns.length > 0) {
    parts.push(summary.patterns[0])
  }

  // Recent activity
  const daysSinceContact = getDaysSince(client.lastContactDate)
  if (daysSinceContact < 7) {
    parts.push(`Last contact: ${daysSinceContact} days ago.`)
  } else if (daysSinceContact < 30) {
    parts.push(`Last contact: ~${Math.floor(daysSinceContact / 7)} weeks ago.`)
  }

  // Upcoming follow-up
  if (client.upcomingFollowUp) {
    parts.push(`Follow-up scheduled: ${client.upcomingFollowUp}.`)
  }

  return parts.join(' ')
}

// ============================================
// 5. GET FOLLOW-UP CLIENTS FOR OBJECT
// ============================================

export interface FollowUpClient {
  client: AuctionClient
  priority: 'high' | 'medium' | 'low'
  reason: string
  suggestedAction: string
}

export function getFollowUpClientsForObject(objectId: string): FollowUpClient[] {
  const object = getObjectById(objectId)
  if (!object) return []

  const matches = getLikelyBuyersForObject(objectId)
  const followUps: FollowUpClient[] = []

  for (const match of matches.slice(0, 10)) {
    let priority: 'high' | 'medium' | 'low' = 'low'
    let suggestedAction = 'Send catalog and information'

    // Determine priority
    if (match.score > 60) {
      priority = 'high'
      suggestedAction = 'Call immediately - strong match'
    } else if (match.score > 40) {
      priority = 'medium'
      suggestedAction = 'Email with details and schedule call'
    }

    // Check recent engagement
    const daysSinceContact = getDaysSince(match.client.lastContactDate)
    if (daysSinceContact < 14 && match.score > 40) {
      priority = 'high'
      suggestedAction = 'Follow up on recent conversation'
    }

    // Check if they have upcoming follow-up
    if (match.client.upcomingFollowUp) {
      priority = 'high'
      suggestedAction = `Scheduled follow-up: ${match.client.upcomingFollowUp}`
    }

    followUps.push({
      client: match.client,
      priority,
      reason: match.reasons.join('; '),
      suggestedAction
    })
  }

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 }
  return followUps.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
}

// ============================================
// 6. ADD NEW KNOWN OBJECTS (SIMULATED)
// ============================================

export interface ImportedObject {
  title: string
  artist: string
  year: string
  estimateRange?: string
  source: string
}

export function addNewKnownObjects(importData: ImportedObject[], specialistId: string, division: string): ObjectWork[] {
  // In production, this would actually add to database
  // For now, we simulate by creating object structures

  const newObjects: ObjectWork[] = []

  for (const data of importData) {
    const newObject: ObjectWork = {
      id: `obj-import-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: data.title,
      artist: data.artist,
      year: data.year,
      medium: 'Unknown',
      dimensions: 'Unknown',
      division: division as any,
      estimateLow: 0,
      estimateHigh: 0,
      currency: 'USD',
      isBeingSoldNow: false,
      isKnownWork: true,
      imageUrl: '/images/placeholder.jpg',
      condition: 'Unknown',
      provenance: `Imported from ${data.source}`,
      primarySpecialistId: specialistId
    }

    newObjects.push(newObject)
  }

  return newObjects
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getDaysSince(dateString: string): number {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

// ============================================
// CHAT INTEGRATION HELPERS
// ============================================

export function generateContextualGreeting(specialistId: string): string {
  const specialist = auctionClients.find(c => c.primarySpecialistId === specialistId)
  return `Hi! I'm Ceqnce, your AI copilot. How can I help you today?`
}

export function generateObjectInsight(objectId: string): string {
  const matches = getLikelyBuyersForObject(objectId)
  const object = getObjectById(objectId)

  if (!object || matches.length === 0) {
    return 'No strong buyer matches found for this object.'
  }

  const topMatch = matches[0]
  return `Top buyer match: ${topMatch.client.name} (${topMatch.score}% match). ${topMatch.reasons.join(', ')}.`
}

export function generateClientInsight(clientId: string): string {
  const summary = summarizeClientBuyingHistory(clientId)
  const client = getClientById(clientId)

  if (!summary || !client) {
    return 'Unable to generate client insight.'
  }

  return `${client.name} has made ${summary.totalPurchases} purchases totaling ${formatCurrency(summary.totalSpent, client.currency)}. ${summary.recentActivity}. ${summary.patterns[0] || ''}`
}
