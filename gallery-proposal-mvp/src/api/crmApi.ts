/**
 * Gallery CRM API Functions
 *
 * This module provides all backend functions for querying and manipulating
 * CRM data including clients, artworks, consignments, and history.
 *
 * In production, these would be actual API endpoints or database queries.
 * For this MVP, they operate on in-memory mock data.
 */

import type {
  Client,
  Artwork,
  ClientFilters,
  ArtworkFilters,
  Consignment,
  Purchase,
  DigitalEngagement
} from '../types'

import {
  clients,
  artworks,
  consignments,
  purchases,
  digitalEngagements
} from '../data/crmMockData'

import {
  updateClientFromFreeTextNote,
  parseClientNotesToProfile
} from '../utils/notesParser'

// In-memory storage (simulating a database)
let clientsData = [...clients]
let artworksData = [...artworks]
let consignmentsData = [...consignments]
let purchasesData = [...purchases]
let engagementsData = [...digitalEngagements]

// ============================================================================
// CLIENT QUERIES
// ============================================================================

/**
 * Get client by ID
 */
export function getClientById(clientId: string): Client | undefined {
  return clientsData.find(c => c.id === clientId)
}

/**
 * Get all clients
 */
export function getAllClients(): Client[] {
  return clientsData
}

/**
 * Search clients with filters
 */
export function searchClients(filters: ClientFilters = {}): Client[] {
  return clientsData.filter(client => {
    // Filter by tags
    if (filters.tags && filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some(tag =>
        client.tags.some(ct => ct.toLowerCase().includes(tag.toLowerCase()))
      )
      if (!hasMatchingTag) return false
    }

    // Filter by price band
    if (filters.priceBandMin !== undefined) {
      if (client.typicalPriceBand.max < filters.priceBandMin) return false
    }
    if (filters.priceBandMax !== undefined) {
      if (client.typicalPriceBand.min > filters.priceBandMax) return false
    }

    // Filter by preferred artist
    if (filters.preferredArtist) {
      const hasArtist = client.preferredArtists.some(artist =>
        artist.toLowerCase().includes(filters.preferredArtist!.toLowerCase())
      )
      if (!hasArtist) return false
    }

    // Filter by location
    if (filters.location) {
      if (!client.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false
      }
    }

    // Filter by relationship status
    if (filters.relationshipStatus) {
      if (client.structuredProfile.relationshipStatus !== filters.relationshipStatus) {
        return false
      }
    }

    return true
  })
}

/**
 * Get client's full history (engagements + purchases + consignments)
 */
export function getClientHistory(clientId: string) {
  const client = getClientById(clientId)
  if (!client) return null

  return {
    client,
    engagements: client.digitalEngagements,
    purchases: client.purchaseHistory,
    consignments: client.consignmentHistory,
    summary: {
      totalPurchases: client.purchaseHistory.length,
      totalSpent: client.purchaseHistory.reduce((sum, p) => sum + p.pricePaid, 0),
      totalEngagements: client.digitalEngagements.length,
      totalConsignments: client.consignmentHistory.length,
      successfulConsignments: client.consignmentHistory.filter(c =>
        c.status === 'sold_here'
      ).length,
      failedConsignments: client.consignmentHistory.filter(c =>
        ['withdrawn', 'expired', 'sale_failed'].includes(c.status)
      ).length
    }
  }
}

/**
 * Get client's consignment history
 */
export function getClientConsignments(clientId: string): Consignment[] {
  return consignmentsData.filter(c => c.clientId === clientId)
}

/**
 * Update client notes and parse into structured profile
 */
export function updateClientNotes(clientId: string, newNote: string): Client | null {
  const clientIndex = clientsData.findIndex(c => c.id === clientId)
  if (clientIndex === -1) return null

  const updatedClient = updateClientFromFreeTextNote(clientsData[clientIndex], newNote)
  clientsData[clientIndex] = updatedClient

  return updatedClient
}

/**
 * Update client structured profile directly
 */
export function updateClientProfile(
  clientId: string,
  profileUpdates: Partial<Client['structuredProfile']>
): Client | null {
  const clientIndex = clientsData.findIndex(c => c.id === clientId)
  if (clientIndex === -1) return null

  clientsData[clientIndex] = {
    ...clientsData[clientIndex],
    structuredProfile: {
      ...clientsData[clientIndex].structuredProfile,
      ...profileUpdates,
      lastUpdated: new Date().toISOString()
    }
  }

  return clientsData[clientIndex]
}

// ============================================================================
// ARTWORK QUERIES
// ============================================================================

/**
 * Get artwork by ID
 */
export function getArtworkById(artworkId: string): Artwork | undefined {
  return artworksData.find(a => a.id === artworkId)
}

/**
 * Get all artworks
 */
export function getAllArtworks(): Artwork[] {
  return artworksData
}

/**
 * Search artworks with filters
 */
export function searchArtworks(filters: ArtworkFilters = {}): Artwork[] {
  return artworksData.filter(artwork => {
    // Filter by artist name
    if (filters.artistName) {
      if (!artwork.artistName.toLowerCase().includes(filters.artistName.toLowerCase())) {
        return false
      }
    }

    // Filter by category
    if (filters.category) {
      if (!artwork.category.toLowerCase().includes(filters.category.toLowerCase())) {
        return false
      }
    }

    // Filter by price band
    if (filters.priceBandMin !== undefined && artwork.currentAskingPrice) {
      if (artwork.currentAskingPrice < filters.priceBandMin) return false
    }
    if (filters.priceBandMax !== undefined && artwork.currentAskingPrice) {
      if (artwork.currentAskingPrice > filters.priceBandMax) return false
    }

    // Filter by primary/secondary
    if (filters.primaryOrSecondary) {
      if (artwork.primaryOrSecondary !== filters.primaryOrSecondary) return false
    }

    // Filter by tags
    if (filters.tags && filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some(tag =>
        artwork.tags.some(at => at.toLowerCase().includes(tag.toLowerCase()))
      )
      if (!hasMatchingTag) return false
    }

    // Filter by status
    if (filters.status) {
      if (artwork.currentStatus !== filters.status) return false
    }

    return true
  })
}

/**
 * Get artwork price history and analysis
 */
export function getArtworkPriceHistory(artworkId: string) {
  const artwork = getArtworkById(artworkId)
  if (!artwork) return null

  const history = artwork.priceHistory || []

  // Calculate price trend
  const sortedHistory = [...history].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  let trend: 'rising' | 'falling' | 'stable' | 'unknown' = 'unknown'
  if (sortedHistory.length >= 2) {
    const oldest = sortedHistory[0].price
    const newest = sortedHistory[sortedHistory.length - 1].price
    const change = ((newest - oldest) / oldest) * 100

    if (change > 10) trend = 'rising'
    else if (change < -10) trend = 'falling'
    else trend = 'stable'
  }

  return {
    artwork,
    priceHistory: sortedHistory,
    currentPrice: artwork.currentAskingPrice,
    trend,
    lowestPrice: history.length > 0 ? Math.min(...history.map(h => h.price)) : null,
    highestPrice: history.length > 0 ? Math.max(...history.map(h => h.price)) : null,
    averagePrice: history.length > 0
      ? history.reduce((sum, h) => sum + h.price, 0) / history.length
      : null
  }
}

/**
 * Get consignments related to an artwork
 */
export function getArtworkConsignments(artworkId: string): Consignment[] {
  return consignmentsData.filter(c => c.artworkId === artworkId)
}

// ============================================================================
// CONSIGNMENT QUERIES
// ============================================================================

/**
 * Get consignment by ID
 */
export function getConsignmentById(consignmentId: string): Consignment | undefined {
  return consignmentsData.find(c => c.id === consignmentId)
}

/**
 * Get all consignments
 */
export function getAllConsignments(): Consignment[] {
  return consignmentsData
}

/**
 * Get consignments by status
 */
export function getConsignmentsByStatus(status: Consignment['status']): Consignment[] {
  return consignmentsData.filter(c => c.status === status)
}

/**
 * Get active consignments (consigned, on_approval, on_hold)
 */
export function getActiveConsignments(): Consignment[] {
  return consignmentsData.filter(c =>
    ['consigned', 'on_approval', 'on_hold'].includes(c.status)
  )
}

/**
 * Get failed/incomplete consignments (withdrawn, expired, sale_failed)
 */
export function getFailedConsignments(): Consignment[] {
  return consignmentsData.filter(c =>
    ['withdrawn', 'expired', 'sale_failed'].includes(c.status)
  )
}

// ============================================================================
// PURCHASE QUERIES
// ============================================================================

/**
 * Get purchase by ID
 */
export function getPurchaseById(purchaseId: string): Purchase | undefined {
  return purchasesData.find(p => p.id === purchaseId)
}

/**
 * Get all purchases
 */
export function getAllPurchases(): Purchase[] {
  return purchasesData
}

/**
 * Get purchases by client
 */
export function getPurchasesByClient(clientId: string): Purchase[] {
  return purchasesData.filter(p => p.clientId === clientId)
}

/**
 * Get purchases by artwork
 */
export function getPurchasesByArtwork(artworkId: string): Purchase[] {
  return purchasesData.filter(p => p.artworkId === artworkId)
}

// ============================================================================
// ENGAGEMENT QUERIES
// ============================================================================

/**
 * Get engagement by ID
 */
export function getEngagementById(engagementId: string): DigitalEngagement | undefined {
  return engagementsData.find(e => e.id === engagementId)
}

/**
 * Get all engagements
 */
export function getAllEngagements(): DigitalEngagement[] {
  return engagementsData
}

/**
 * Get engagements by client
 */
export function getEngagementsByClient(clientId: string): DigitalEngagement[] {
  return engagementsData.filter(e => e.clientId === clientId)
}

/**
 * Get engagements by artwork
 */
export function getEngagementsByArtwork(artworkId: string): DigitalEngagement[] {
  return engagementsData.filter(e => e.artworkId === artworkId)
}

/**
 * Get recent engagements (last N days)
 */
export function getRecentEngagements(days: number = 30): DigitalEngagement[] {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)

  return engagementsData.filter(e =>
    new Date(e.timestamp) >= cutoffDate
  ).sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
}

// ============================================================================
// ANALYTICS & INSIGHTS
// ============================================================================

/**
 * Get client engagement score (0-100)
 */
export function getClientEngagementScore(clientId: string): number {
  const engagements = getEngagementsByClient(clientId)
  const recentEngagements = engagements.filter(e => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return new Date(e.timestamp) >= thirtyDaysAgo
  })

  // Simple scoring: more recent engagement = higher score
  const baseScore = Math.min(recentEngagements.length * 10, 50)

  // Bonus for high-value engagement types
  const highValueEngagements = recentEngagements.filter(e =>
    ['viewing_room_view', 'fair_visit'].includes(e.type)
  )
  const bonusScore = Math.min(highValueEngagements.length * 15, 50)

  return Math.min(baseScore + bonusScore, 100)
}

/**
 * Get client lifetime value
 */
export function getClientLifetimeValue(clientId: string): number {
  const purchases = getPurchasesByClient(clientId)
  return purchases.reduce((sum, p) => sum + p.pricePaid, 0)
}

/**
 * Analyze client's consignment behavior
 */
export function analyzeClientConsignmentBehavior(clientId: string) {
  const consignments = getClientConsignments(clientId)

  const successful = consignments.filter(c => c.status === 'sold_here').length
  const failed = consignments.filter(c =>
    ['withdrawn', 'expired', 'sale_failed'].includes(c.status)
  ).length
  const active = consignments.filter(c =>
    ['consigned', 'on_approval', 'on_hold'].includes(c.status)
  ).length

  let reliability: 'high' | 'medium' | 'low' | 'unknown' = 'unknown'
  if (consignments.length >= 3) {
    const successRate = successful / consignments.length
    if (successRate >= 0.7) reliability = 'high'
    else if (successRate >= 0.4) reliability = 'medium'
    else reliability = 'low'
  }

  return {
    totalConsignments: consignments.length,
    successful,
    failed,
    active,
    reliability,
    hasWithdrawals: consignments.some(c => c.status === 'withdrawn'),
    hasExpired: consignments.some(c => c.status === 'expired'),
    hasSaleFailed: consignments.some(c => c.status === 'sale_failed')
  }
}

/**
 * Get summary statistics for dashboard
 */
export function getDashboardStats() {
  return {
    totalClients: clientsData.length,
    activeClients: clientsData.filter(c =>
      c.structuredProfile.relationshipStatus === 'active'
    ).length,
    vipClients: clientsData.filter(c => c.tags.includes('VIP')).length,
    totalArtworks: artworksData.length,
    availableArtworks: artworksData.filter(a =>
      a.currentStatus === 'available'
    ).length,
    activeConsignments: getActiveConsignments().length,
    failedConsignments: getFailedConsignments().length,
    totalPurchasesThisYear: purchasesData.filter(p => {
      const thisYear = new Date().getFullYear()
      return new Date(p.date).getFullYear() === thisYear
    }).length,
    revenueThisYear: purchasesData
      .filter(p => new Date(p.date).getFullYear() === new Date().getFullYear())
      .reduce((sum, p) => sum + p.pricePaid, 0)
  }
}

// ============================================================================
// MUTATION FUNCTIONS (for testing/demo)
// ============================================================================

/**
 * Add new engagement
 */
export function addEngagement(engagement: Omit<DigitalEngagement, 'id'>): DigitalEngagement {
  const newEngagement: DigitalEngagement = {
    ...engagement,
    id: `eng-${engagementsData.length + 1}`
  }
  engagementsData.push(newEngagement)

  // Update client's engagement array
  const client = getClientById(engagement.clientId)
  if (client) {
    client.digitalEngagements.push(newEngagement)
  }

  return newEngagement
}

/**
 * Add new purchase
 */
export function addPurchase(purchase: Omit<Purchase, 'id'>): Purchase {
  const newPurchase: Purchase = {
    ...purchase,
    id: `purch-${purchasesData.length + 1}`
  }
  purchasesData.push(newPurchase)

  // Update client's purchase history
  const client = getClientById(purchase.clientId)
  if (client) {
    client.purchaseHistory.push(newPurchase)
  }

  return newPurchase
}

/**
 * Add new consignment
 */
export function addConsignment(consignment: Omit<Consignment, 'id'>): Consignment {
  const newConsignment: Consignment = {
    ...consignment,
    id: `cons-${consignmentsData.length + 1}`
  }
  consignmentsData.push(newConsignment)

  // Update client's consignment history
  const client = getClientById(consignment.clientId)
  if (client) {
    client.consignmentHistory.push(newConsignment)
  }

  return newConsignment
}

/**
 * Update consignment status
 */
export function updateConsignmentStatus(
  consignmentId: string,
  status: Consignment['status'],
  outcomeDetails?: string
): Consignment | null {
  const consignmentIndex = consignmentsData.findIndex(c => c.id === consignmentId)
  if (consignmentIndex === -1) return null

  consignmentsData[consignmentIndex] = {
    ...consignmentsData[consignmentIndex],
    status,
    ...(outcomeDetails && { outcomeDetails }),
    ...(status === 'sold_here' || status === 'sold_elsewhere' || status === 'withdrawn'
      ? { endDate: new Date().toISOString() }
      : {})
  }

  return consignmentsData[consignmentIndex]
}
