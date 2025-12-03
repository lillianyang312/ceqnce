/**
 * Recommendation Engine
 *
 * This module provides sophisticated recommendation logic for matching:
 * - Clients to artworks (who should buy this?)
 * - Artworks to clients (what should they buy?)
 *
 * Uses rule-based scoring over client history, preferences, and behavior.
 * In production, this could be augmented with ML models.
 */

import type {
  Client,
  Artwork,
  ClientRecommendation,
  ArtworkRecommendation
} from '../types'

import {
  getClientById,
  getAllClients,
  getArtworkById,
  getAllArtworks,
  getClientEngagementScore,
  analyzeClientConsignmentBehavior
} from './crmApi'

// ============================================================================
// SCORING WEIGHTS
// ============================================================================

const CLIENT_RECOMMENDATION_WEIGHTS = {
  artistAlignment: 0.30,      // 30% - matches preferred artists
  categoryAlignment: 0.20,    // 20% - matches preferred media
  priceFit: 0.20,            // 20% - within price range
  engagementScore: 0.15,     // 15% - recent engagement activity
  purchaseHistory: 0.10,     // 10% - relevant past purchases
  consignmentSignals: 0.05   // 5% - consignment behavior (can be negative)
}

const ARTWORK_RECOMMENDATION_WEIGHTS = {
  artistAlignment: 0.30,      // 30% - artist preference match
  categoryAlignment: 0.20,    // 20% - category preference match
  priceFit: 0.20,            // 20% - price within range
  similarPurchases: 0.15,    // 15% - similar to past purchases
  recentEngagement: 0.10,    // 10% - recent engagement with similar works
  profileAlignment: 0.05     // 5% - structured profile alignment
}

// ============================================================================
// CLIENT RECOMMENDATIONS (for a given artwork)
// ============================================================================

/**
 * Get likely clients for a specific artwork
 */
export function getLikelyClientsForArtwork(
  artworkId: string,
  limit: number = 10
): ClientRecommendation[] {
  const artwork = getArtworkById(artworkId)
  if (!artwork) return []

  const clients = getAllClients()
  const recommendations: ClientRecommendation[] = []

  for (const client of clients) {
    const score = scoreClientForArtwork(client, artwork)
    const explanation = explainClientRecommendation(client, artwork, score.factors)

    recommendations.push({
      client,
      score: score.total,
      explanation,
      matchFactors: score.factors
    })
  }

  // Sort by score descending and return top N
  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

/**
 * Score how well a client matches an artwork (0-100)
 */
function scoreClientForArtwork(client: Client, artwork: Artwork) {
  const factors = {
    artistAlignment: 0,
    categoryAlignment: 0,
    priceFit: 0,
    engagementScore: 0,
    purchaseHistory: 0,
    consignmentSignals: 0
  }

  // 1. Artist Alignment (0-100)
  const artistMatch = client.preferredArtists.some(artist =>
    artwork.artistName.toLowerCase().includes(artist.toLowerCase()) ||
    artist.toLowerCase().includes(artwork.artistName.toLowerCase())
  )
  factors.artistAlignment = artistMatch ? 100 : 0

  // Partial match on interests
  if (!artistMatch) {
    const interestMatch = client.structuredProfile.interests.some(interest =>
      artwork.tags.some(tag => tag.toLowerCase().includes(interest.toLowerCase()))
    )
    factors.artistAlignment = interestMatch ? 50 : 0
  }

  // 2. Category Alignment (0-100)
  const categoryMatch = client.preferredMedia.some(media =>
    artwork.category.toLowerCase().includes(media.toLowerCase())
  )
  factors.categoryAlignment = categoryMatch ? 100 : 0

  // 3. Price Fit (0-100)
  if (artwork.currentAskingPrice) {
    const priceInRange = artwork.currentAskingPrice >= client.typicalPriceBand.min &&
                         artwork.currentAskingPrice <= client.typicalPriceBand.max

    if (priceInRange) {
      factors.priceFit = 100
    } else {
      // Partial credit if close
      const priceDiff = artwork.currentAskingPrice < client.typicalPriceBand.min
        ? (artwork.currentAskingPrice / client.typicalPriceBand.min) * 100
        : (client.typicalPriceBand.max / artwork.currentAskingPrice) * 100

      factors.priceFit = Math.max(0, priceDiff - 20) // Penalty for being outside range
    }
  } else {
    factors.priceFit = 50 // Unknown price, neutral score
  }

  // 4. Engagement Score (0-100)
  factors.engagementScore = getClientEngagementScore(client.id)

  // Check for specific engagement with this artist or similar works
  const relevantEngagements = client.digitalEngagements.filter(e => {
    if (e.artworkId) {
      const engagedArtwork = getArtworkById(e.artworkId)
      if (engagedArtwork) {
        return engagedArtwork.artistName === artwork.artistName ||
               engagedArtwork.category === artwork.category
      }
    }
    return false
  })
  if (relevantEngagements.length > 0) {
    factors.engagementScore = Math.min(factors.engagementScore + 20, 100)
  }

  // 5. Purchase History (0-100)
  const relevantPurchases = client.purchaseHistory.filter(p => {
    const purchasedArtwork = getArtworkById(p.artworkId)
    if (purchasedArtwork) {
      // Same artist
      if (purchasedArtwork.artistName === artwork.artistName) return true

      // Similar category and price range
      if (purchasedArtwork.category === artwork.category &&
          artwork.currentAskingPrice &&
          Math.abs(purchasedArtwork.price - artwork.currentAskingPrice) / artwork.currentAskingPrice < 0.5) {
        return true
      }
    }
    return false
  })

  factors.purchaseHistory = Math.min(relevantPurchases.length * 30, 100)

  // 6. Consignment Signals (-50 to +50)
  const consignmentBehavior = analyzeClientConsignmentBehavior(client.id)

  if (consignmentBehavior.reliability === 'high') {
    factors.consignmentSignals = 50 // Good track record
  } else if (consignmentBehavior.reliability === 'medium') {
    factors.consignmentSignals = 25
  } else if (consignmentBehavior.reliability === 'low') {
    factors.consignmentSignals = -25 // Risky client for consignment-related sales
  } else {
    factors.consignmentSignals = 0 // Unknown
  }

  // Check for recent withdrawals or failed sales (warning sign)
  if (consignmentBehavior.hasWithdrawals || consignmentBehavior.hasSaleFailed) {
    // This doesn't necessarily disqualify them for purchases, but worth noting
    // Don't reduce score heavily here
    factors.consignmentSignals = Math.max(factors.consignmentSignals - 10, -50)
  }

  // Calculate weighted total
  const total =
    factors.artistAlignment * CLIENT_RECOMMENDATION_WEIGHTS.artistAlignment +
    factors.categoryAlignment * CLIENT_RECOMMENDATION_WEIGHTS.categoryAlignment +
    factors.priceFit * CLIENT_RECOMMENDATION_WEIGHTS.priceFit +
    factors.engagementScore * CLIENT_RECOMMENDATION_WEIGHTS.engagementScore +
    factors.purchaseHistory * CLIENT_RECOMMENDATION_WEIGHTS.purchaseHistory +
    factors.consignmentSignals * CLIENT_RECOMMENDATION_WEIGHTS.consignmentSignals

  return { total, factors }
}

/**
 * Generate explanation for why a client was recommended
 */
function explainClientRecommendation(
  client: Client,
  artwork: Artwork,
  factors: ClientRecommendation['matchFactors']
): string {
  const reasons: string[] = []

  // Artist alignment
  if (factors.artistAlignment >= 80) {
    reasons.push(`Strong interest in ${artwork.artistName} (preferred artist)`)
  } else if (factors.artistAlignment >= 40) {
    reasons.push(`Interest in similar artists/movements`)
  }

  // Category alignment
  if (factors.categoryAlignment >= 80) {
    reasons.push(`Collects ${artwork.category}`)
  }

  // Price fit
  if (factors.priceFit >= 80) {
    const priceStr = artwork.currentAskingPrice?.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    })
    reasons.push(`Price (${priceStr}) fits budget range perfectly`)
  } else if (factors.priceFit >= 50) {
    reasons.push(`Price is within reach of budget`)
  } else if (factors.priceFit < 50) {
    reasons.push(`⚠️ Price may be outside typical range`)
  }

  // Engagement
  if (factors.engagementScore >= 70) {
    reasons.push(`Highly engaged recently (viewed similar works)`)
  } else if (factors.engagementScore >= 40) {
    reasons.push(`Moderate engagement activity`)
  }

  // Purchase history
  if (factors.purchaseHistory >= 60) {
    reasons.push(`Has purchased similar works before`)
  } else if (factors.purchaseHistory >= 30) {
    reasons.push(`Some purchase history in this category`)
  }

  // Consignment signals
  if (factors.consignmentSignals < 0) {
    reasons.push(`⚠️ Previous consignment didn't complete (may indicate hesitancy)`)
  } else if (factors.consignmentSignals >= 40) {
    reasons.push(`Reliable track record (successfully consigned works)`)
  }

  // Decision speed insight
  if (client.structuredProfile.decisionSpeed === 'fast') {
    reasons.push(`✓ Fast decision maker`)
  } else if (client.structuredProfile.decisionSpeed === 'committee') {
    reasons.push(`ℹ️ Requires committee approval (allow 2-4 weeks)`)
  }

  // Negotiation style
  if (client.structuredProfile.negotiationStyle === 'hard' ||
      client.structuredProfile.priceSensitivity === 'high') {
    reasons.push(`💰 Likely to negotiate on price`)
  }

  return reasons.join(' • ')
}

// ============================================================================
// ARTWORK RECOMMENDATIONS (for a given client)
// ============================================================================

/**
 * Get likely artworks for a specific client
 */
export function getLikelyArtworksForClient(
  clientId: string,
  limit: number = 10
): ArtworkRecommendation[] {
  const client = getClientById(clientId)
  if (!client) return []

  const artworks = getAllArtworks().filter(a => a.currentStatus === 'available')
  const recommendations: ArtworkRecommendation[] = []

  for (const artwork of artworks) {
    const score = scoreArtworkForClient(artwork, client)
    const explanation = explainArtworkRecommendation(artwork, client, score.factors)

    recommendations.push({
      artwork,
      score: score.total,
      explanation,
      matchFactors: score.factors
    })
  }

  // Sort by score descending and return top N
  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

/**
 * Score how well an artwork matches a client (0-100)
 */
function scoreArtworkForClient(artwork: Artwork, client: Client) {
  const factors = {
    artistAlignment: 0,
    categoryAlignment: 0,
    priceFit: 0,
    similarPurchases: 0,
    recentEngagement: 0,
    profileAlignment: 0
  }

  // 1. Artist Alignment (0-100)
  const artistMatch = client.preferredArtists.some(artist =>
    artwork.artistName.toLowerCase().includes(artist.toLowerCase()) ||
    artist.toLowerCase().includes(artwork.artistName.toLowerCase())
  )
  factors.artistAlignment = artistMatch ? 100 : 0

  // Partial match on interests
  if (!artistMatch) {
    const interestMatch = client.structuredProfile.interests.some(interest =>
      artwork.tags.some(tag => tag.toLowerCase().includes(interest.toLowerCase()))
    )
    factors.artistAlignment = interestMatch ? 50 : 0
  }

  // 2. Category Alignment (0-100)
  const categoryMatch = client.preferredMedia.some(media =>
    artwork.category.toLowerCase().includes(media.toLowerCase())
  )
  factors.categoryAlignment = categoryMatch ? 100 : 0

  // 3. Price Fit (0-100)
  if (artwork.currentAskingPrice) {
    const priceInRange = artwork.currentAskingPrice >= client.typicalPriceBand.min &&
                         artwork.currentAskingPrice <= client.typicalPriceBand.max

    if (priceInRange) {
      factors.priceFit = 100
    } else {
      // Penalize if outside range, but not too harshly
      if (artwork.currentAskingPrice < client.typicalPriceBand.min) {
        factors.priceFit = 60 // Too cheap might not be interesting
      } else {
        // Too expensive - how much over?
        const overagePercent = ((artwork.currentAskingPrice - client.typicalPriceBand.max) /
                               client.typicalPriceBand.max) * 100
        if (overagePercent < 20) factors.priceFit = 70 // Slightly over
        else if (overagePercent < 50) factors.priceFit = 40 // Significantly over
        else factors.priceFit = 10 // Way over budget
      }
    }
  } else {
    factors.priceFit = 50 // Unknown price
  }

  // Adjust for price sensitivity
  if (client.structuredProfile.priceSensitivity === 'high' && factors.priceFit < 100) {
    factors.priceFit *= 0.7 // More penalty for sensitive clients
  } else if (client.structuredProfile.priceSensitivity === 'low') {
    factors.priceFit = Math.min(factors.priceFit + 20, 100) // More forgiving
  }

  // 4. Similar Purchases (0-100)
  const similarPurchases = client.purchaseHistory.filter(p => {
    const purchasedArtwork = getArtworkById(p.artworkId)
    if (purchasedArtwork) {
      // Same artist
      if (purchasedArtwork.artistName === artwork.artistName) return true

      // Similar category
      if (purchasedArtwork.category === artwork.category) return true

      // Similar tags
      const tagOverlap = purchasedArtwork.tags.filter(tag =>
        artwork.tags.includes(tag)
      )
      if (tagOverlap.length >= 2) return true
    }
    return false
  })

  factors.similarPurchases = Math.min(similarPurchases.length * 40, 100)

  // 5. Recent Engagement (0-100)
  const recentEngagements = client.digitalEngagements.filter(e => {
    // Check if engaged with this specific artwork
    if (e.artworkId === artwork.id) return true

    // Check if engaged with same artist
    if (e.artworkId) {
      const engagedArtwork = getArtworkById(e.artworkId)
      if (engagedArtwork && engagedArtwork.artistName === artwork.artistName) {
        return true
      }
    }

    return false
  })

  factors.recentEngagement = Math.min(recentEngagements.length * 30, 100)

  // 6. Profile Alignment (0-100)
  let profileScore = 0

  // Risk tolerance vs artwork type
  if (artwork.primaryOrSecondary === 'primary' && client.structuredProfile.riskTolerance === 'high') {
    profileScore += 30
  } else if (artwork.primaryOrSecondary === 'secondary' && client.structuredProfile.riskTolerance === 'low') {
    profileScore += 30
  } else {
    profileScore += 15
  }

  // Museum quality + institution
  if (artwork.tags.includes('museum-quality') &&
      client.structuredProfile.relationshipStatus === 'institution') {
    profileScore += 40
  }

  // Blue chip + conservative
  if (artwork.tags.includes('blue-chip') && client.structuredProfile.riskTolerance === 'low') {
    profileScore += 30
  }

  factors.profileAlignment = Math.min(profileScore, 100)

  // Calculate weighted total
  const total =
    factors.artistAlignment * ARTWORK_RECOMMENDATION_WEIGHTS.artistAlignment +
    factors.categoryAlignment * ARTWORK_RECOMMENDATION_WEIGHTS.categoryAlignment +
    factors.priceFit * ARTWORK_RECOMMENDATION_WEIGHTS.priceFit +
    factors.similarPurchases * ARTWORK_RECOMMENDATION_WEIGHTS.similarPurchases +
    factors.recentEngagement * ARTWORK_RECOMMENDATION_WEIGHTS.recentEngagement +
    factors.profileAlignment * ARTWORK_RECOMMENDATION_WEIGHTS.profileAlignment

  return { total, factors }
}

/**
 * Generate explanation for why an artwork was recommended
 */
function explainArtworkRecommendation(
  artwork: Artwork,
  client: Client,
  factors: ArtworkRecommendation['matchFactors']
): string {
  const reasons: string[] = []

  // Artist alignment
  if (factors.artistAlignment >= 80) {
    reasons.push(`Matches preferred artist (${artwork.artistName})`)
  } else if (factors.artistAlignment >= 40) {
    reasons.push(`Aligns with collecting interests`)
  }

  // Category alignment
  if (factors.categoryAlignment >= 80) {
    reasons.push(`Preferred medium (${artwork.category})`)
  }

  // Price fit
  const priceStr = artwork.currentAskingPrice?.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  })

  if (factors.priceFit >= 80) {
    reasons.push(`Perfect price fit (${priceStr})`)
  } else if (factors.priceFit >= 50) {
    reasons.push(`Within budget range (${priceStr})`)
  } else if (factors.priceFit < 50) {
    reasons.push(`⚠️ Above typical budget (${priceStr}) - but may be worth proposing`)
  }

  // Similar purchases
  if (factors.similarPurchases >= 60) {
    reasons.push(`Similar to previous acquisitions`)
  } else if (factors.similarPurchases >= 30) {
    reasons.push(`Complements existing collection`)
  }

  // Recent engagement
  if (factors.recentEngagement >= 60) {
    reasons.push(`✓ Recently viewed similar works`)
  } else if (factors.recentEngagement >= 30) {
    reasons.push(`Some engagement with ${artwork.artistName}`)
  }

  // Profile alignment
  if (factors.profileAlignment >= 70) {
    reasons.push(`Strong fit with collector profile`)
  }

  // Special notes based on artwork attributes
  if (artwork.tags.includes('museum-quality')) {
    reasons.push(`Museum-quality work`)
  }
  if (artwork.significance) {
    reasons.push(`Special significance: ${artwork.significance.slice(0, 60)}...`)
  }

  return reasons.join(' • ')
}

/**
 * Get similar artworks (for "customers who viewed this also viewed...")
 */
export function getSimilarArtworks(artworkId: string, limit: number = 5): Artwork[] {
  const artwork = getArtworkById(artworkId)
  if (!artwork) return []

  const allArtworks = getAllArtworks().filter(a =>
    a.id !== artworkId && a.currentStatus === 'available'
  )

  // Score similarity
  const scored = allArtworks.map(other => {
    let score = 0

    // Same artist (highest weight)
    if (other.artistName === artwork.artistName) score += 50

    // Same category
    if (other.category === artwork.category) score += 20

    // Similar price
    if (artwork.currentAskingPrice && other.currentAskingPrice) {
      const priceDiff = Math.abs(artwork.currentAskingPrice - other.currentAskingPrice)
      const priceRatio = priceDiff / artwork.currentAskingPrice
      if (priceRatio < 0.3) score += 20
      else if (priceRatio < 0.5) score += 10
    }

    // Tag overlap
    const tagOverlap = other.tags.filter(tag => artwork.tags.includes(tag))
    score += tagOverlap.length * 5

    // Same primary/secondary
    if (other.primaryOrSecondary === artwork.primaryOrSecondary) score += 10

    return { artwork: other, score }
  })

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.artwork)
}
