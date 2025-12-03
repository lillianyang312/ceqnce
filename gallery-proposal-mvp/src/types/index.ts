/**
 * Gallery CRM + Recommendation Engine Type Definitions
 *
 * This file contains all TypeScript interfaces for the expanded gallery system
 * including clients, artworks, consignments, engagements, and recommendation logic.
 */

// ============================================================================
// CLIENT TYPES
// ============================================================================

export interface Client {
  id: string
  name: string
  email: string
  location: string // "City, Country"
  preferredArtists: string[] // Artist names or IDs
  preferredMedia: string[] // e.g., "painting", "sculpture", "photography"
  typicalPriceBand: {
    min: number
    max: number
    currency: string
  }
  notes: string // Raw free text entered by staff
  structuredProfile: StructuredProfile // Parsed from notes and history
  tags: string[] // e.g., "institution", "VIP", "young collector"
  digitalEngagements: DigitalEngagement[]
  purchaseHistory: Purchase[]
  consignmentHistory: Consignment[]
  createdAt: string // ISO date
  lastContactDate: string // ISO date
}

export interface StructuredProfile {
  riskTolerance: "low" | "medium" | "high"
  negotiationStyle: "hard" | "flexible" | "discreet" | "institutional"
  decisionSpeed: "fast" | "slow" | "committee"
  interests: string[] // Keywords/topics
  preferredFairs: string[]
  relationshipStatus: "prospect" | "active" | "dormant" | "institution" | "VIP"
  priceSensitivity: "high" | "medium" | "low"
  communicationPreference: "email" | "phone" | "in-person"
  lastUpdated: string // ISO date
}

export interface ParsedProfileUpdate {
  riskTolerance?: "low" | "medium" | "high"
  negotiationStyle?: "hard" | "flexible" | "discreet" | "institutional"
  decisionSpeed?: "fast" | "slow" | "committee"
  interests?: string[]
  preferredFairs?: string[]
  relationshipStatus?: "prospect" | "active" | "dormant" | "institution" | "VIP"
  priceSensitivity?: "high" | "medium" | "low"
  communicationPreference?: "email" | "phone" | "in-person"
  tags?: string[] // New tags to add
}

// ============================================================================
// ENGAGEMENT TYPES
// ============================================================================

export interface DigitalEngagement {
  id: string
  clientId: string
  type: "email_open" | "viewing_room_view" | "fair_visit" | "click_artwork_detail" |
        "proposal_view" | "website_visit" | "instagram_interaction"
  artworkId?: string // Optional, if engagement relates to specific work
  timestamp: string // ISO date
  metadata: {
    duration?: number // seconds
    source?: string // e.g., "Art Basel email blast"
    location?: string // e.g., "Art Basel Miami Beach"
    [key: string]: any
  }
}

// ============================================================================
// PURCHASE TYPES
// ============================================================================

export interface Purchase {
  id: string
  clientId: string
  artworkId: string
  date: string // ISO date
  pricePaid: number
  currency: string
  channel: "fair" | "gallery" | "online_viewing_room" | "auction" | "private_sale"
  paymentTerms: string
  notes?: string
}

// ============================================================================
// CONSIGNMENT TYPES
// ============================================================================

export type ConsignmentStatus =
  | "enquiry"           // Initial inquiry
  | "offered"           // Gallery offered to take on consignment
  | "consigned"         // Formally consigned
  | "on_approval"       // Work is with potential buyer
  | "on_hold"           // Temporarily paused
  | "withdrawn"         // Client withdrew the work
  | "expired"           // Consignment period expired without sale
  | "sale_failed"       // Sale attempt failed (reserve not met, etc.)
  | "sold_here"         // Successfully sold through this gallery
  | "sold_elsewhere"    // Client sold through another channel

export interface Consignment {
  id: string
  clientId: string
  artworkId: string
  startDate: string // ISO date
  endDate?: string // ISO date, optional if still ongoing
  status: ConsignmentStatus
  intendedSaleChannel: "gallery" | "fair" | "auction" | "online_viewing_room"
  targetPrice: number
  reservePrice?: number
  currency: string
  outcomeDetails: string // Free text explanation of outcome
  notes: string // Internal notes
}

// ============================================================================
// ARTWORK TYPES
// ============================================================================

export interface Artwork {
  id: string
  artistName: string
  artistId?: string // Optional reference to Artist entity
  title: string
  year: number
  medium: string
  dimensions: string
  category: string // e.g., "painting", "works on paper", "photography"
  primaryOrSecondary: "primary" | "secondary"
  currentStatus: "available" | "reserved" | "sold" | "not_for_sale" | "on_consignment"
  currentAskingPrice?: number
  currency: string
  priceHistory: PriceHistory[]
  tags: string[] // e.g., "geometric abstraction", "museum-quality"
  imageUrl: string
  provenance?: string[]
  exhibition?: string[]
  description: string
  significance?: string
}

export interface PriceHistory {
  id: string
  artworkId: string
  date: string // ISO date
  context: "primary_sale" | "auction" | "private_sale" | "valuation_only" | "fair_sale"
  price: number
  currency: string
  notes: string
  source: string // e.g., "Sotheby's NY", "Gallery sale"
}

// ============================================================================
// ARTIST TYPES
// ============================================================================

export interface Artist {
  id: string
  name: string
  birthYear?: number
  deathYear?: number
  nationality: string
  movement: string
  keyThemes: string[]
  typicalPriceRange: {
    min: number
    max: number
    currency: string
  }
  careerStage: "emerging" | "mid-career" | "established" | "blue-chip"
  biography?: string
}

// ============================================================================
// RECOMMENDATION TYPES
// ============================================================================

export interface ClientRecommendation {
  client: Client
  score: number
  explanation: string
  matchFactors: {
    artistAlignment: number
    categoryAlignment: number
    priceFit: number
    engagementScore: number
    purchaseHistory: number
    consignmentSignals: number
  }
}

export interface ArtworkRecommendation {
  artwork: Artwork
  score: number
  explanation: string
  matchFactors: {
    artistAlignment: number
    categoryAlignment: number
    priceFit: number
    similarPurchases: number
    recentEngagement: number
    profileAlignment: number
  }
}

// ============================================================================
// API FUNCTION TYPES
// ============================================================================

export interface ClientFilters {
  tags?: string[]
  priceBandMin?: number
  priceBandMax?: number
  preferredArtist?: string
  location?: string
  relationshipStatus?: StructuredProfile['relationshipStatus']
}

export interface ArtworkFilters {
  artistName?: string
  category?: string
  priceBandMin?: number
  priceBandMax?: number
  primaryOrSecondary?: "primary" | "secondary"
  tags?: string[]
  status?: Artwork['currentStatus']
}

// ============================================================================
// CHAT TOOL TYPES
// ============================================================================

export type ChatContext = {
  type: "client" | "artwork" | "general"
  clientId?: string
  artworkId?: string
}

export interface ChatTool {
  name: string
  description: string
  parameters: Record<string, any>
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: string
  toolCalls?: ToolCall[]
  context?: ChatContext
}

export interface ToolCall {
  tool: string
  parameters: Record<string, any>
  result?: any
}
