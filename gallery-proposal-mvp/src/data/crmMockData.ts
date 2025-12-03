/**
 * Comprehensive Mock Data for Gallery CRM System
 *
 * This file contains simulated data for:
 * - Clients (with structured profiles and history)
 * - Artworks (expanded from original)
 * - Digital Engagements
 * - Purchases
 * - Consignments (including incomplete/failed ones)
 * - Price Histories
 * - Artists
 */

import type {
  Client,
  Artwork,
  Artist,
  DigitalEngagement,
  Purchase,
  Consignment,
  PriceHistory
} from '../types'

// ============================================================================
// ARTISTS
// ============================================================================

export const artists: Artist[] = [
  {
    id: "artist-1",
    name: "Helen Frankenthaler",
    birthYear: 1928,
    deathYear: 2011,
    nationality: "American",
    movement: "Abstract Expressionism, Color Field",
    keyThemes: ["color", "landscape", "abstraction", "feminism"],
    typicalPriceRange: { min: 500000, max: 5000000, currency: "USD" },
    careerStage: "blue-chip"
  },
  {
    id: "artist-2",
    name: "Anselm Kiefer",
    birthYear: 1945,
    nationality: "German",
    movement: "Neo-Expressionism",
    keyThemes: ["history", "memory", "war", "mythology"],
    typicalPriceRange: { min: 300000, max: 3000000, currency: "USD" },
    careerStage: "blue-chip"
  },
  {
    id: "artist-3",
    name: "Mark Rothko",
    birthYear: 1903,
    deathYear: 1970,
    nationality: "American",
    movement: "Abstract Expressionism",
    keyThemes: ["spirituality", "emotion", "color", "transcendence"],
    typicalPriceRange: { min: 2000000, max: 50000000, currency: "USD" },
    careerStage: "blue-chip"
  },
  {
    id: "artist-4",
    name: "Joan Mitchell",
    birthYear: 1925,
    deathYear: 1992,
    nationality: "American",
    movement: "Abstract Expressionism",
    keyThemes: ["landscape", "memory", "gesture", "nature"],
    typicalPriceRange: { min: 800000, max: 15000000, currency: "USD" },
    careerStage: "blue-chip"
  },
  {
    id: "artist-5",
    name: "Cy Twombly",
    birthYear: 1928,
    deathYear: 2011,
    nationality: "American",
    movement: "Abstract Expressionism, Neo-Expressionism",
    keyThemes: ["mythology", "poetry", "writing", "gesture"],
    typicalPriceRange: { min: 500000, max: 20000000, currency: "USD" },
    careerStage: "blue-chip"
  },
  {
    id: "artist-6",
    name: "Gerhard Richter",
    birthYear: 1932,
    nationality: "German",
    movement: "Contemporary",
    keyThemes: ["photography", "abstraction", "history", "perception"],
    typicalPriceRange: { min: 1000000, max: 30000000, currency: "USD" },
    careerStage: "blue-chip"
  },
  {
    id: "artist-7",
    name: "Julie Mehretu",
    birthYear: 1970,
    nationality: "Ethiopian-American",
    movement: "Contemporary",
    keyThemes: ["architecture", "mapping", "globalization", "layering"],
    typicalPriceRange: { min: 400000, max: 5000000, currency: "USD" },
    careerStage: "established"
  },
  {
    id: "artist-8",
    name: "Cecily Brown",
    birthYear: 1969,
    nationality: "British",
    movement: "Contemporary",
    keyThemes: ["figuration", "abstraction", "body", "baroque"],
    typicalPriceRange: { min: 300000, max: 6000000, currency: "USD" },
    careerStage: "established"
  }
]

// ============================================================================
// ARTWORKS (Expanded from original mockData.js)
// ============================================================================

export const artworks: Artwork[] = [
  {
    id: "artwork-1",
    artistName: "Helen Frankenthaler",
    artistId: "artist-1",
    title: "Mountains and Sea",
    year: 1952,
    medium: "Oil and charcoal on canvas",
    dimensions: "220 × 298 cm (86 5/8 × 117 3/8 in)",
    category: "painting",
    primaryOrSecondary: "secondary",
    currentStatus: "available",
    currentAskingPrice: 1850000,
    currency: "USD",
    imageUrl: "/images/01-frankenthaler.jpg",
    provenance: [
      "Private Collection, New York, 1952-1967",
      "André Emmerich Gallery, New York",
      "Acquired by current owner, 1967"
    ],
    exhibition: [
      "Jewish Museum, New York, 1960",
      "Whitney Museum of American Art, New York, 1969",
      "Museum of Modern Art, 'Abstract Expressionism', 1976"
    ],
    description: "A pioneering Color Field painting featuring Frankenthaler's revolutionary soak-stain technique. Museum-quality example from a pivotal moment in postwar American art.",
    significance: "Fresh to market after 56 years in the same collection. Comparable works in MoMA and Guggenheim permanent collections.",
    tags: ["color field", "abstract expressionism", "museum-quality", "landmark work"],
    priceHistory: []
  },
  {
    id: "artwork-2",
    artistName: "Anselm Kiefer",
    artistId: "artist-2",
    title: "Ash Flower",
    year: 2015,
    medium: "Mixed media on canvas",
    dimensions: "280 × 380 cm (110 × 150 in)",
    category: "painting",
    primaryOrSecondary: "primary",
    currentStatus: "available",
    currentAskingPrice: 420000,
    currency: "USD",
    imageUrl: "/images/02-kiefer.jpg",
    provenance: [
      "Directly from the artist's studio, 2015",
      "Private Collection, Germany, 2015-2023"
    ],
    exhibition: [
      "Gagosian Gallery, New York, 2016",
      "Royal Academy of Arts, London, 2017"
    ],
    description: "Large-scale work from Kiefer's celebrated series exploring memory, history, and transformation through densely layered materials.",
    significance: "Monumental scale ideal for corporate installation. Recent solo exhibition at Pompidou Center.",
    tags: ["neo-expressionism", "monumental", "contemporary", "textured"],
    priceHistory: []
  },
  {
    id: "artwork-3",
    artistName: "Mark Rothko",
    artistId: "artist-3",
    title: "No. 14",
    year: 1960,
    medium: "Oil on canvas",
    dimensions: "290 × 268 cm (114 × 105 in)",
    category: "painting",
    primaryOrSecondary: "secondary",
    currentStatus: "available",
    currentAskingPrice: 2500000,
    currency: "USD",
    imageUrl: "/images/03-rothko.jpg",
    provenance: [
      "Marlborough Gallery, New York, 1961",
      "Private Collection, Switzerland, 1965-2020",
      "Christie's New York, November 2020"
    ],
    exhibition: [
      "Museum of Modern Art, New York, 1961",
      "Tate Modern, London, 'Rothko Retrospective', 2008"
    ],
    description: "Classic Rothko from his mature period, featuring luminous fields of deep red and gold. Meditative presence ideal for contemplative viewing.",
    significance: "Museum-quality example from peak creative period. Works from this year held by National Gallery and Tate.",
    tags: ["abstract expressionism", "color field", "museum-quality", "meditative"],
    priceHistory: []
  },
  {
    id: "artwork-4",
    artistName: "Joan Mitchell",
    artistId: "artist-4",
    title: "Ladybug",
    year: 1957,
    medium: "Oil on canvas",
    dimensions: "197 × 269 cm (77 5/8 × 106 in)",
    category: "painting",
    primaryOrSecondary: "secondary",
    currentStatus: "available",
    currentAskingPrice: 1200000,
    currency: "USD",
    imageUrl: "/images/04-mitchell.jpg",
    provenance: [
      "Stable Gallery, New York, 1957",
      "Private Collection, Chicago, 1960-1998",
      "Sotheby's New York, May 2010"
    ],
    exhibition: [
      "Stable Gallery, New York, 1958",
      "Whitney Museum of American Art, 'Joan Mitchell Retrospective', 2002"
    ],
    description: "Vibrant gestural abstraction from Mitchell's breakthrough period in the late 1950s. Powerful energy balanced with chromatic sophistication.",
    significance: "Key woman artist of Abstract Expressionism. Growing institutional recognition and market strength.",
    tags: ["abstract expressionism", "gestural", "vibrant", "female artist"],
    priceHistory: []
  },
  {
    id: "artwork-5",
    artistName: "Cy Twombly",
    artistId: "artist-5",
    title: "Untitled (Bacchus)",
    year: 2005,
    medium: "Acrylic on canvas",
    dimensions: "220 × 300 cm (86 5/8 × 118 in)",
    category: "painting",
    primaryOrSecondary: "secondary",
    currentStatus: "available",
    currentAskingPrice: 980000,
    currency: "USD",
    imageUrl: "/images/05-twombly.jpg",
    provenance: [
      "Gagosian Gallery, New York, 2005",
      "Private Collection, New York, 2006-present"
    ],
    exhibition: [
      "Gagosian Gallery, 'Cy Twombly: Bacchus', 2005",
      "Tate Modern, London, 2008"
    ],
    description: "From Twombly's late Bacchus series, featuring exuberant gestural marks and vivid color. Celebrates vitality and transformation.",
    significance: "Late masterwork from final creative period. Recent record prices for Bacchus series at auction.",
    tags: ["abstract expressionism", "gestural", "late period", "bacchus series"],
    priceHistory: []
  },
  {
    id: "artwork-6",
    artistName: "Gerhard Richter",
    artistId: "artist-6",
    title: "Abstraktes Bild (809-4)",
    year: 1994,
    medium: "Oil on canvas",
    dimensions: "200 × 200 cm (78 3/4 × 78 3/4 in)",
    category: "painting",
    primaryOrSecondary: "secondary",
    currentStatus: "available",
    currentAskingPrice: 3200000,
    currency: "USD",
    imageUrl: "/images/richter.jpg",
    provenance: [
      "Marian Goodman Gallery, New York, 1994",
      "Private Collection, London, 1995-2022"
    ],
    tags: ["contemporary", "abstraction", "blue-chip", "museum-quality"],
    description: "Signature abstract work with Richter's characteristic squeegee technique. Luminous layers of color create optical depth.",
    priceHistory: []
  },
  {
    id: "artwork-7",
    artistName: "Julie Mehretu",
    artistId: "artist-7",
    title: "Conjured Parts (eye), 2016",
    year: 2016,
    medium: "Ink and acrylic on canvas",
    dimensions: "213 × 274 cm (84 × 108 in)",
    category: "painting",
    primaryOrSecondary: "primary",
    currentStatus: "available",
    currentAskingPrice: 850000,
    currency: "USD",
    imageUrl: "/images/mehretu.jpg",
    tags: ["contemporary", "architectural", "layered", "mapping"],
    description: "Complex layered composition mapping urban and social landscapes. Mehretu's signature architectural mark-making.",
    priceHistory: []
  },
  {
    id: "artwork-8",
    artistName: "Cecily Brown",
    artistId: "artist-8",
    title: "The Triumph of the Vanities II",
    year: 2018,
    medium: "Oil on linen",
    dimensions: "229 × 305 cm (90 × 120 in)",
    category: "painting",
    primaryOrSecondary: "primary",
    currentStatus: "available",
    currentAskingPrice: 650000,
    currency: "USD",
    imageUrl: "/images/brown.jpg",
    tags: ["contemporary", "figuration", "abstraction", "female artist"],
    description: "Sensuous interplay of figuration and abstraction. Brown's characteristic baroque energy and chromatic intensity.",
    priceHistory: []
  }
]

// Add price histories for secondary market works
artworks[0].priceHistory = [
  {
    id: "ph-1",
    artworkId: "artwork-1",
    date: "2020-11-12",
    context: "auction",
    price: 1650000,
    currency: "USD",
    notes: "Strong bidding from institutional buyers",
    source: "Christie's New York"
  },
  {
    id: "ph-2",
    artworkId: "artwork-1",
    date: "2015-05-08",
    context: "private_sale",
    price: 1200000,
    currency: "USD",
    notes: "Private sale between collectors",
    source: "Sotheby's Private Sales"
  }
]

artworks[2].priceHistory = [
  {
    id: "ph-3",
    artworkId: "artwork-3",
    date: "2020-11-10",
    context: "auction",
    price: 2800000,
    currency: "USD",
    notes: "Sold above estimate",
    source: "Christie's New York"
  },
  {
    id: "ph-4",
    artworkId: "artwork-3",
    date: "2018-05-15",
    context: "auction",
    price: 2200000,
    currency: "USD",
    notes: "Within estimate range",
    source: "Sotheby's New York"
  },
  {
    id: "ph-5",
    artworkId: "artwork-3",
    date: "2012-11-14",
    context: "auction",
    price: 1850000,
    currency: "USD",
    notes: "Strong market for Rothko",
    source: "Phillips New York"
  }
]

artworks[3].priceHistory = [
  {
    id: "ph-6",
    artworkId: "artwork-4",
    date: "2021-05-12",
    context: "auction",
    price: 1350000,
    currency: "USD",
    notes: "Record for work from this period",
    source: "Christie's New York"
  },
  {
    id: "ph-7",
    artworkId: "artwork-4",
    date: "2010-05-18",
    context: "auction",
    price: 950000,
    currency: "USD",
    notes: "Pre-market surge for Mitchell",
    source: "Sotheby's New York"
  }
]

// ============================================================================
// CLIENTS
// ============================================================================

export const clients: Client[] = [
  {
    id: "client-1",
    name: "Jane Chen",
    email: "jane.chen@chenventures.com",
    location: "New York, NY",
    preferredArtists: ["Helen Frankenthaler", "Joan Mitchell", "Agnes Martin"],
    preferredMedia: ["painting"],
    typicalPriceBand: { min: 250000, max: 1000000, currency: "USD" },
    notes: "Building collection focused on women abstract expressionists. Recently acquired Helen Frankenthaler work. New downtown office with 20ft ceilings and abundant natural light. Very decisive, usually makes decisions within 48 hours. Loves geometric abstraction.",
    structuredProfile: {
      riskTolerance: "high",
      negotiationStyle: "flexible",
      decisionSpeed: "fast",
      interests: ["abstract expressionism", "women artists", "color field", "postwar art"],
      preferredFairs: ["Art Basel Miami Beach", "Frieze New York"],
      relationshipStatus: "active",
      priceSensitivity: "low",
      communicationPreference: "email",
      lastUpdated: "2024-11-15"
    },
    tags: ["VIP", "active collector", "contemporary focus"],
    digitalEngagements: [],
    purchaseHistory: [],
    consignmentHistory: [],
    createdAt: "2023-01-15",
    lastContactDate: "2024-11-20"
  },
  {
    id: "client-2",
    name: "Michael Rostov",
    email: "m.rostov@rostovfoundation.org",
    location: "London, UK",
    preferredArtists: ["Gerhard Richter", "Anselm Kiefer", "Cy Twombly"],
    preferredMedia: ["painting", "mixed media"],
    typicalPriceBand: { min: 500000, max: 5000000, currency: "USD" },
    notes: "Major institutional collector. Foundation focuses on postwar European art. Committee-based decisions, typically takes 2-3 weeks. Previously consigned a Gerhard Richter but withdrew due to reserve not being met. Very price-sensitive despite high budget. Prefers auction comparables.",
    structuredProfile: {
      riskTolerance: "low",
      negotiationStyle: "hard",
      decisionSpeed: "committee",
      interests: ["postwar european", "german art", "institutional quality"],
      preferredFairs: ["Art Basel Basel", "Frieze London"],
      relationshipStatus: "institution",
      priceSensitivity: "high",
      communicationPreference: "email",
      lastUpdated: "2024-10-22"
    },
    tags: ["institution", "high-value", "committee approval"],
    digitalEngagements: [],
    purchaseHistory: [],
    consignmentHistory: [],
    createdAt: "2022-03-10",
    lastContactDate: "2024-10-25"
  },
  {
    id: "client-3",
    name: "Sarah Kim",
    email: "sarah@kimcollection.com",
    location: "Los Angeles, CA",
    preferredArtists: ["Julie Mehretu", "Cecily Brown", "Joan Mitchell"],
    preferredMedia: ["painting", "works on paper"],
    typicalPriceBand: { min: 100000, max: 800000, currency: "USD" },
    notes: "Emerging collector, bought first major work last year. Very enthusiastic but sometimes needs time to secure financing. Backed out of consignment opportunity last Basel because nervous about pricing and market timing. Loves contemporary female artists.",
    structuredProfile: {
      riskTolerance: "medium",
      negotiationStyle: "flexible",
      decisionSpeed: "slow",
      interests: ["contemporary art", "female artists", "emerging artists"],
      preferredFairs: ["Frieze LA", "Art Basel Miami Beach"],
      relationshipStatus: "active",
      priceSensitivity: "medium",
      communicationPreference: "phone",
      lastUpdated: "2024-11-01"
    },
    tags: ["young collector", "growing", "contemporary focus"],
    digitalEngagements: [],
    purchaseHistory: [],
    consignmentHistory: [],
    createdAt: "2023-06-20",
    lastContactDate: "2024-11-18"
  },
  {
    id: "client-4",
    name: "Robert & Diana Hartwell",
    email: "hartwell.collection@gmail.com",
    location: "San Francisco, CA",
    preferredArtists: ["Mark Rothko", "Cy Twombly", "Robert Motherwell"],
    preferredMedia: ["painting"],
    typicalPriceBand: { min: 400000, max: 2500000, currency: "USD" },
    notes: "Established collectors with museum-quality collection. Recently donated works to SFMOMA. Looking for late Rothko. Slow and methodical decision process. Enjoy visiting studios. Previously consigned a Motherwell that sold successfully.",
    structuredProfile: {
      riskTolerance: "low",
      negotiationStyle: "discreet",
      decisionSpeed: "slow",
      interests: ["abstract expressionism", "museum quality", "blue chip"],
      preferredFairs: ["Art Basel Basel", "TEFAF Maastricht"],
      relationshipStatus: "VIP",
      priceSensitivity: "low",
      communicationPreference: "in-person",
      lastUpdated: "2024-09-30"
    },
    tags: ["VIP", "museum donors", "established collection"],
    digitalEngagements: [],
    purchaseHistory: [],
    consignmentHistory: [],
    createdAt: "2020-01-12",
    lastContactDate: "2024-10-05"
  },
  {
    id: "client-5",
    name: "Marcus Webb",
    email: "m.webb@techcorp.com",
    location: "Seattle, WA",
    preferredArtists: ["Julie Mehretu", "Anselm Kiefer"],
    preferredMedia: ["painting", "sculpture"],
    typicalPriceBand: { min: 200000, max: 1200000, currency: "USD" },
    notes: "Tech entrepreneur building corporate collection. Moves very fast on decisions. Always asks for discount. Interested in large-scale works for office spaces. Previously tried to consign early acquisition but sale fell through.",
    structuredProfile: {
      riskTolerance: "high",
      negotiationStyle: "hard",
      decisionSpeed: "fast",
      interests: ["contemporary", "monumental scale", "corporate collection"],
      preferredFairs: ["Frieze LA", "Art Basel Miami Beach"],
      relationshipStatus: "active",
      priceSensitivity: "high",
      communicationPreference: "email",
      lastUpdated: "2024-11-10"
    },
    tags: ["tech collector", "corporate", "volume buyer"],
    digitalEngagements: [],
    purchaseHistory: [],
    consignmentHistory: [],
    createdAt: "2023-02-28",
    lastContactDate: "2024-11-15"
  },
  {
    id: "client-6",
    name: "Patricia Gould",
    email: "pgould@gouldlaw.com",
    location: "Boston, MA",
    preferredArtists: ["Helen Frankenthaler", "Agnes Martin", "Ellsworth Kelly"],
    preferredMedia: ["painting", "prints"],
    typicalPriceBand: { min: 150000, max: 600000, currency: "USD" },
    notes: "Lawyer with focused minimalist collection. Very detail-oriented, asks many questions about provenance. Consigned work successfully twice before. Prefers direct communication.",
    structuredProfile: {
      riskTolerance: "low",
      negotiationStyle: "institutional",
      decisionSpeed: "slow",
      interests: ["minimalism", "color field", "american postwar"],
      preferredFairs: ["ADAA Art Show"],
      relationshipStatus: "active",
      priceSensitivity: "medium",
      communicationPreference: "phone",
      lastUpdated: "2024-10-15"
    },
    tags: ["detail-oriented", "provenance focused"],
    digitalEngagements: [],
    purchaseHistory: [],
    consignmentHistory: [],
    createdAt: "2021-09-05",
    lastContactDate: "2024-10-20"
  },
  {
    id: "client-7",
    name: "The Morrison Museum",
    email: "acquisitions@morrisonmuseum.org",
    location: "Dallas, TX",
    preferredArtists: ["Mark Rothko", "Joan Mitchell", "Gerhard Richter"],
    preferredMedia: ["painting", "sculpture"],
    typicalPriceBand: { min: 500000, max: 10000000, currency: "USD" },
    notes: "Regional museum with strong acquisition budget. Board approval required for purchases over $1M. Focus on postwar American and European art. Long decision timeline (3-6 months typical).",
    structuredProfile: {
      riskTolerance: "low",
      negotiationStyle: "institutional",
      decisionSpeed: "committee",
      interests: ["postwar art", "institutional quality", "exhibition history"],
      preferredFairs: [],
      relationshipStatus: "institution",
      priceSensitivity: "high",
      communicationPreference: "email",
      lastUpdated: "2024-08-20"
    },
    tags: ["institution", "museum", "major buyer"],
    digitalEngagements: [],
    purchaseHistory: [],
    consignmentHistory: [],
    createdAt: "2021-03-15",
    lastContactDate: "2024-09-10"
  },
  {
    id: "client-8",
    name: "Alexander Petrov",
    email: "a.petrov@private.com",
    location: "Miami, FL",
    preferredArtists: ["Cecily Brown", "Julie Mehretu", "Anselm Kiefer"],
    preferredMedia: ["painting"],
    typicalPriceBand: { min: 300000, max: 2000000, currency: "USD" },
    notes: "Real estate developer, new to collecting. Very impulsive buyer. Doesn't negotiate on price. Previously inquired about consigning work but never followed through after initial conversation.",
    structuredProfile: {
      riskTolerance: "high",
      negotiationStyle: "flexible",
      decisionSpeed: "fast",
      interests: ["contemporary", "bold works", "statement pieces"],
      preferredFairs: ["Art Basel Miami Beach"],
      relationshipStatus: "active",
      priceSensitivity: "low",
      communicationPreference: "phone",
      lastUpdated: "2024-11-05"
    },
    tags: ["new collector", "impulsive", "high value"],
    digitalEngagements: [],
    purchaseHistory: [],
    consignmentHistory: [],
    createdAt: "2024-01-20",
    lastContactDate: "2024-11-12"
  }
]

// ============================================================================
// DIGITAL ENGAGEMENTS
// ============================================================================

export const digitalEngagements: DigitalEngagement[] = [
  // Jane Chen (client-1) - Very active
  {
    id: "eng-1",
    clientId: "client-1",
    type: "email_open",
    artworkId: "artwork-1",
    timestamp: "2024-11-20T10:30:00Z",
    metadata: { source: "Monthly newsletter" }
  },
  {
    id: "eng-2",
    clientId: "client-1",
    type: "click_artwork_detail",
    artworkId: "artwork-1",
    timestamp: "2024-11-20T10:32:00Z",
    metadata: { duration: 180, source: "Email link" }
  },
  {
    id: "eng-3",
    clientId: "client-1",
    type: "viewing_room_view",
    artworkId: "artwork-4",
    timestamp: "2024-11-18T14:20:00Z",
    metadata: { duration: 420, source: "Website" }
  },
  {
    id: "eng-4",
    clientId: "client-1",
    type: "fair_visit",
    timestamp: "2024-11-15T11:00:00Z",
    metadata: { location: "Frieze New York", duration: 7200 }
  },

  // Michael Rostov (client-2) - Moderate, research-focused
  {
    id: "eng-5",
    clientId: "client-2",
    type: "click_artwork_detail",
    artworkId: "artwork-6",
    timestamp: "2024-10-25T09:15:00Z",
    metadata: { duration: 600, source: "Direct website" }
  },
  {
    id: "eng-6",
    clientId: "client-2",
    type: "email_open",
    artworkId: "artwork-2",
    timestamp: "2024-10-22T08:00:00Z",
    metadata: { source: "Kiefer exhibition announcement" }
  },

  // Sarah Kim (client-3) - Active, contemporary focus
  {
    id: "eng-7",
    clientId: "client-3",
    type: "viewing_room_view",
    artworkId: "artwork-7",
    timestamp: "2024-11-18T16:45:00Z",
    metadata: { duration: 480, source: "Website" }
  },
  {
    id: "eng-8",
    clientId: "client-3",
    type: "click_artwork_detail",
    artworkId: "artwork-8",
    timestamp: "2024-11-17T13:20:00Z",
    metadata: { duration: 320, source: "Instagram" }
  },
  {
    id: "eng-9",
    clientId: "client-3",
    type: "instagram_interaction",
    artworkId: "artwork-7",
    timestamp: "2024-11-16T20:30:00Z",
    metadata: { source: "Instagram post like and save" }
  },

  // Marcus Webb (client-5) - Quick interactions
  {
    id: "eng-10",
    clientId: "client-5",
    type: "email_open",
    artworkId: "artwork-2",
    timestamp: "2024-11-15T07:30:00Z",
    metadata: { source: "Available works email" }
  },
  {
    id: "eng-11",
    clientId: "client-5",
    type: "click_artwork_detail",
    artworkId: "artwork-7",
    timestamp: "2024-11-14T09:00:00Z",
    metadata: { duration: 90, source: "Email link" }
  },

  // Patricia Gould (client-6) - Detailed research
  {
    id: "eng-12",
    clientId: "client-6",
    type: "viewing_room_view",
    artworkId: "artwork-1",
    timestamp: "2024-10-20T11:30:00Z",
    metadata: { duration: 900, source: "Website" }
  },
  {
    id: "eng-13",
    clientId: "client-6",
    type: "click_artwork_detail",
    artworkId: "artwork-1",
    timestamp: "2024-10-20T11:15:00Z",
    metadata: { duration: 450, source: "Direct website" }
  },

  // Alexander Petrov (client-8) - Recent high engagement
  {
    id: "eng-14",
    clientId: "client-8",
    type: "fair_visit",
    timestamp: "2024-11-12T10:00:00Z",
    metadata: { location: "Art Basel Miami Beach preview", duration: 5400 }
  },
  {
    id: "eng-15",
    clientId: "client-8",
    type: "click_artwork_detail",
    artworkId: "artwork-8",
    timestamp: "2024-11-10T15:20:00Z",
    metadata: { duration: 240, source: "Website" }
  }
]

// Add engagements to clients
clients.forEach(client => {
  client.digitalEngagements = digitalEngagements.filter(e => e.clientId === client.id)
})

// ============================================================================
// PURCHASES
// ============================================================================

export const purchases: Purchase[] = [
  // Jane Chen - 2 previous purchases
  {
    id: "purch-1",
    clientId: "client-1",
    artworkId: "artwork-1",
    date: "2023-05-15",
    pricePaid: 850000,
    currency: "USD",
    channel: "gallery",
    paymentTerms: "Full payment, 30 days",
    notes: "First major Frankenthaler acquisition"
  },
  {
    id: "purch-2",
    clientId: "client-1",
    artworkId: "artwork-4",
    date: "2024-03-20",
    pricePaid: 420000,
    currency: "USD",
    channel: "fair",
    paymentTerms: "50% deposit, balance in 60 days",
    notes: "Purchased at Frieze New York"
  },

  // Robert & Diana Hartwell - Established collectors
  {
    id: "purch-3",
    clientId: "client-4",
    artworkId: "artwork-3",
    date: "2022-11-10",
    pricePaid: 2200000,
    currency: "USD",
    channel: "auction",
    paymentTerms: "Full payment, immediate",
    notes: "Auction purchase, we provided advisory"
  },
  {
    id: "purch-4",
    clientId: "client-4",
    artworkId: "artwork-5",
    date: "2023-09-05",
    pricePaid: 780000,
    currency: "USD",
    channel: "gallery",
    paymentTerms: "Full payment, 14 days",
    notes: "Private sale"
  },

  // Patricia Gould - Regular buyer
  {
    id: "purch-5",
    clientId: "client-6",
    artworkId: "artwork-1",
    date: "2022-03-15",
    pricePaid: 95000,
    currency: "USD",
    channel: "gallery",
    paymentTerms: "Full payment, immediate",
    notes: "Frankenthaler print, not painting"
  },
  {
    id: "purch-6",
    clientId: "client-6",
    artworkId: "artwork-4",
    date: "2023-06-20",
    pricePaid: 180000,
    currency: "USD",
    channel: "online_viewing_room",
    paymentTerms: "Full payment, 30 days",
    notes: "Works on paper"
  },

  // Marcus Webb - Recent buyer
  {
    id: "purch-7",
    clientId: "client-5",
    artworkId: "artwork-2",
    date: "2024-08-12",
    pricePaid: 380000,
    currency: "USD",
    channel: "gallery",
    paymentTerms: "Full payment, immediate",
    notes: "Negotiated 10% discount"
  },

  // Alexander Petrov - New collector, one purchase
  {
    id: "purch-8",
    clientId: "client-8",
    artworkId: "artwork-8",
    date: "2024-02-28",
    pricePaid: 650000,
    currency: "USD",
    channel: "fair",
    paymentTerms: "Full payment, immediate",
    notes: "First major purchase, Art Basel Miami Beach"
  },

  // Morrison Museum - Institutional purchase
  {
    id: "purch-9",
    clientId: "client-7",
    artworkId: "artwork-3",
    date: "2021-12-01",
    pricePaid: 1850000,
    currency: "USD",
    channel: "private_sale",
    paymentTerms: "Payment plan, 12 months",
    notes: "Board approved acquisition"
  }
]

// Add purchases to clients
clients.forEach(client => {
  client.purchaseHistory = purchases.filter(p => p.clientId === client.id)
})

// ============================================================================
// CONSIGNMENTS (Including incomplete/failed)
// ============================================================================

export const consignments: Consignment[] = [
  // Michael Rostov - WITHDRAWN (Richter, reserve not met)
  {
    id: "cons-1",
    clientId: "client-2",
    artworkId: "artwork-6",
    startDate: "2024-06-01",
    endDate: "2024-08-15",
    status: "withdrawn",
    intendedSaleChannel: "auction",
    targetPrice: 3500000,
    reservePrice: 3200000,
    currency: "USD",
    outcomeDetails: "Client withdrew after reserve was not met at Christie's evening sale. Market for Richter abstracts softened in H2 2024.",
    notes: "Client was disappointed but understanding. May reconsider in 2025."
  },

  // Sarah Kim - WITHDRAWN (Basel, nervous about pricing)
  {
    id: "cons-2",
    clientId: "client-3",
    artworkId: "artwork-7",
    startDate: "2023-11-15",
    endDate: "2023-12-10",
    status: "withdrawn",
    intendedSaleChannel: "fair",
    targetPrice: 450000,
    currency: "USD",
    outcomeDetails: "Client got nervous about market timing and pricing during Art Basel Miami Beach. Withdrew work before fair opened.",
    notes: "First-time consignor, anxiety about selling too soon. Need to rebuild confidence."
  },

  // Marcus Webb - SALE FAILED (tried to consign too early)
  {
    id: "cons-3",
    clientId: "client-5",
    artworkId: "artwork-2",
    startDate: "2023-10-01",
    endDate: "2024-01-15",
    status: "sale_failed",
    intendedSaleChannel: "gallery",
    targetPrice: 480000,
    reservePrice: 420000,
    currency: "USD",
    outcomeDetails: "Work was too fresh to market (purchased only 6 months prior). No serious interest despite good quality.",
    notes: "Client wanted quick flip. Market doesn't support flipping at this level. Relationship strained."
  },

  // Robert & Diana Hartwell - SOLD HERE (successful)
  {
    id: "cons-4",
    clientId: "client-4",
    artworkId: "artwork-5",
    startDate: "2023-02-01",
    endDate: "2023-05-20",
    status: "sold_here",
    intendedSaleChannel: "gallery",
    targetPrice: 850000,
    reservePrice: 750000,
    currency: "USD",
    outcomeDetails: "Sold for $820,000 to European collector. Clean transaction, all parties satisfied.",
    notes: "Model consignment relationship. They trusted our timing and pricing."
  },

  // Patricia Gould - SOLD HERE (successful, repeat consignor)
  {
    id: "cons-5",
    clientId: "client-6",
    artworkId: "artwork-1",
    startDate: "2023-09-01",
    endDate: "2023-11-28",
    status: "sold_here",
    intendedSaleChannel: "gallery",
    targetPrice: 125000,
    reservePrice: 110000,
    currency: "USD",
    outcomeDetails: "Sold Frankenthaler print to upgrade to painting. Achieved $118,000.",
    notes: "She was thrilled. Now looking to sell more works on paper."
  },

  // Patricia Gould - SOLD HERE (second successful)
  {
    id: "cons-6",
    clientId: "client-6",
    artworkId: "artwork-4",
    startDate: "2024-03-01",
    endDate: "2024-06-15",
    status: "sold_here",
    intendedSaleChannel: "fair",
    targetPrice: 220000,
    reservePrice: 190000,
    currency: "USD",
    outcomeDetails: "Sold at ADAA Art Show for $205,000. Buyer from Chicago.",
    notes: "Second successful consignment. Strong repeat relationship."
  },

  // Alexander Petrov - ENQUIRY (never followed through)
  {
    id: "cons-7",
    clientId: "client-8",
    artworkId: "artwork-8",
    startDate: "2024-06-20",
    status: "enquiry",
    intendedSaleChannel: "gallery",
    targetPrice: 750000,
    currency: "USD",
    outcomeDetails: "Initial inquiry about selling Cecily Brown purchased in February. Never provided documentation or followed up.",
    notes: "Possible buyer's remorse or just testing waters. Hasn't responded to follow-ups."
  },

  // Sarah Kim - CONSIGNED (currently active, on hold)
  {
    id: "cons-8",
    clientId: "client-3",
    artworkId: "artwork-4",
    startDate: "2024-09-01",
    status: "on_hold",
    intendedSaleChannel: "gallery",
    targetPrice: 550000,
    reservePrice: 480000,
    currency: "USD",
    outcomeDetails: "Consignment active but client asked to pause marketing while she decides if she really wants to sell.",
    notes: "Second attempt at consigning. She's more confident but still hesitant. Being patient."
  },

  // Michael Rostov - EXPIRED (long consignment, no sale)
  {
    id: "cons-9",
    clientId: "client-2",
    artworkId: "artwork-2",
    startDate: "2023-03-01",
    endDate: "2024-03-01",
    status: "expired",
    intendedSaleChannel: "gallery",
    targetPrice: 480000,
    reservePrice: 420000,
    currency: "USD",
    outcomeDetails: "12-month consignment expired without finding buyer. Price was fair but limited market for Kiefer at this level during that period.",
    notes: "Client was patient throughout. Decided to keep work after all."
  },

  // Morrison Museum - They don't consign, but here's a donation record
  // (Museums don't typically consign, but for completeness)
  {
    id: "cons-10",
    clientId: "client-7",
    artworkId: "artwork-4",
    startDate: "2022-06-01",
    endDate: "2022-06-01",
    status: "sold_elsewhere",
    intendedSaleChannel: "auction",
    targetPrice: 0,
    currency: "USD",
    outcomeDetails: "Museum deaccessioned work through Sotheby's per their policy. We were consulted but museum handled directly.",
    notes: "Advisory role only. Standard deaccession process."
  }
]

// Add consignments to clients
clients.forEach(client => {
  client.consignmentHistory = consignments.filter(c => c.clientId === client.id)
})

// ============================================================================
// GALLERY INFO (from original mockData)
// ============================================================================

export const galleryInfo = {
  name: "Ashford Contemporary",
  tagline: "Postwar & Contemporary Art",
  address: "425 West 13th Street, New York, NY 10014",
  phone: "(212) 555-0147",
  email: "proposals@ashfordcontemporary.com",
  website: "www.ashfordcontemporary.com",
  contact: {
    name: "Sarah Martinez",
    role: "Senior Art Advisor",
    email: "smartinez@ashfordcontemporary.com",
    phone: "(212) 555-0148"
  }
}
