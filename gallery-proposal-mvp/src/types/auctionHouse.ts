// Auction House Specialist Copilot Types

export interface Specialist {
  id: string
  name: string
  division: 'Contemporary Art' | 'Post-War Art' | 'Impressionist & Modern' | 'Photography' | 'Design'
}

export interface ObjectWork {
  id: string
  title: string
  artist: string
  year: string
  medium: string
  dimensions: string
  division: 'Contemporary Art' | 'Post-War Art' | 'Impressionist & Modern' | 'Photography' | 'Design'
  estimateLow: number
  estimateHigh: number
  currency: string

  // Sale info
  isBeingSoldNow: boolean
  saleDate?: string
  saleName?: string
  lotNumber?: string

  // Known work info
  isKnownWork: boolean
  lastSoldDate?: string
  lastSoldPrice?: number
  provenance?: string

  // Additional metadata
  imageUrl: string
  condition: string
  literature?: string
  exhibited?: string

  // Specialist assignment
  primarySpecialistId: string
}

export interface ClientNote {
  id: string
  clientId: string
  timestamp: string
  source: 'manual' | 'auto-parse'
  text: string
  createdBy: string // specialist name

  // If auto-parsed, what was extracted
  parsedData?: {
    interests?: string[]
    budget?: { min: number; max: number }
    riskTolerance?: string
    decisionSpeed?: string
  }
}

export interface HistoryEntry {
  id: string
  date: string
  type: 'buying' | 'bidding' | 'consignment' | 'digital'
  description: string
  objectId?: string
  objectTitle?: string
  artist?: string
  amount?: number
  currency?: string
  outcome: string
  specialistId: string
}

export interface ClientHistory {
  clientId: string
  buying: HistoryEntry[]
  bidding: HistoryEntry[]
  consignment: HistoryEntry[]
  digital: HistoryEntry[]
}

// Extended Client type with specialist relationship
export interface AuctionClient {
  id: string
  name: string
  email: string
  phone: string
  location: string
  primarySpecialistId: string

  // Relationship info
  relationshipStatus: 'active' | 'occasional' | 'inactive' | 'prospect'
  clientSince: string
  totalSpent: number
  currency: string

  // Profile
  structuredProfile: {
    interests: string[]
    preferredArtists: string[]
    preferredCategories: string[]
    typicalPriceBand: { min: number; max: number }
    riskTolerance: 'conservative' | 'moderate' | 'adventurous'
    decisionSpeed: 'slow' | 'moderate' | 'fast'
    negotiationStyle: 'firm' | 'flexible' | 'aggressive'
  }

  // Recent activity
  lastContactDate: string
  lastPurchaseDate?: string
  upcomingFollowUp?: string
}
