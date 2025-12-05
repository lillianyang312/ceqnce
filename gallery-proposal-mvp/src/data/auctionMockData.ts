import {
  Specialist,
  ObjectWork,
  AuctionClient,
  ClientNote,
  ClientHistory,
  HistoryEntry
} from '../types/auctionHouse'

// ============================================
// SPECIALISTS
// ============================================

export const specialists: Specialist[] = [
  {
    id: 'spec-1',
    name: 'Sarah Chen',
    division: 'Contemporary Art'
  },
  {
    id: 'spec-2',
    name: 'Marcus Williams',
    division: 'Post-War Art'
  },
  {
    id: 'spec-3',
    name: 'Isabella Rossi',
    division: 'Impressionist & Modern'
  },
  {
    id: 'spec-4',
    name: 'James Park',
    division: 'Photography'
  },
  {
    id: 'spec-5',
    name: 'Emma Laurent',
    division: 'Design'
  }
]

// ============================================
// OBJECTS (On Sale + Known Works)
// ============================================

export const objects: ObjectWork[] = [
  // Contemporary Art - On Sale
  {
    id: 'obj-1',
    title: 'Untitled (Mirror Series #7)',
    artist: 'Anish Kapoor',
    year: '2023',
    medium: 'Stainless steel and lacquer',
    dimensions: '120 × 120 × 30 cm',
    division: 'Contemporary Art',
    estimateLow: 800000,
    estimateHigh: 1200000,
    currency: 'USD',
    isBeingSoldNow: true,
    saleDate: '2025-12-15',
    saleName: 'Contemporary Art Evening Sale',
    lotNumber: '12',
    isKnownWork: false,
    imageUrl: '/images/kapoor-mirror.jpg',
    condition: 'Excellent',
    exhibited: 'Gagosian Gallery, New York, 2023',
    primarySpecialistId: 'spec-1'
  },
  {
    id: 'obj-2',
    title: 'Infinity Net (QWERTY)',
    artist: 'Yayoi Kusama',
    year: '2022',
    medium: 'Acrylic on canvas',
    dimensions: '194 × 259 cm',
    division: 'Contemporary Art',
    estimateLow: 2500000,
    estimateHigh: 3500000,
    currency: 'USD',
    isBeingSoldNow: true,
    saleDate: '2025-12-15',
    saleName: 'Contemporary Art Evening Sale',
    lotNumber: '8',
    isKnownWork: false,
    imageUrl: '/images/kusama-infinity.jpg',
    condition: 'Excellent',
    exhibited: 'David Zwirner, New York, 2022',
    primarySpecialistId: 'spec-1'
  },
  {
    id: 'obj-3',
    title: 'Balloon Dog (Orange)',
    artist: 'Jeff Koons',
    year: '2019',
    medium: 'Mirror-polished stainless steel with transparent color coating',
    dimensions: '307 × 363 × 114 cm',
    division: 'Contemporary Art',
    estimateLow: 15000000,
    estimateHigh: 20000000,
    currency: 'USD',
    isBeingSoldNow: true,
    saleDate: '2025-12-15',
    saleName: 'Contemporary Art Evening Sale',
    lotNumber: '25',
    isKnownWork: false,
    imageUrl: '/images/koons-balloon.jpg',
    condition: 'Excellent',
    literature: 'Jeff Koons: A Retrospective, Whitney Museum, 2014',
    primarySpecialistId: 'spec-1'
  },

  // Post-War Art - On Sale
  {
    id: 'obj-4',
    title: 'Abstraktes Bild (947-3)',
    artist: 'Gerhard Richter',
    year: '2016',
    medium: 'Oil on canvas',
    dimensions: '200 × 200 cm',
    division: 'Post-War Art',
    estimateLow: 5000000,
    estimateHigh: 7000000,
    currency: 'USD',
    isBeingSoldNow: true,
    saleDate: '2025-12-18',
    saleName: 'Post-War & Contemporary Art Day Sale',
    lotNumber: '45',
    isKnownWork: false,
    imageUrl: '/images/richter-abstract.jpg',
    condition: 'Excellent',
    exhibited: 'Marian Goodman Gallery, New York, 2017',
    primarySpecialistId: 'spec-2'
  },
  {
    id: 'obj-5',
    title: 'Silver Car Crash (Double Disaster)',
    artist: 'Andy Warhol',
    year: '1963',
    medium: 'Silkscreen ink and acrylic on linen',
    dimensions: '266.7 × 417 cm',
    division: 'Post-War Art',
    estimateLow: 60000000,
    estimateHigh: 80000000,
    currency: 'USD',
    isBeingSoldNow: true,
    saleDate: '2025-12-18',
    saleName: 'Post-War & Contemporary Art Evening Sale',
    lotNumber: '15',
    isKnownWork: false,
    imageUrl: '/images/warhol-crash.jpg',
    condition: 'Very good',
    provenance: 'Private collection, Europe (acquired from Leo Castelli Gallery, 1963)',
    exhibited: 'Guggenheim Museum, New York, 1968',
    literature: 'Andy Warhol: Death and Disaster, Menil Collection, 2003',
    primarySpecialistId: 'spec-2'
  },

  // Known Works
  {
    id: 'obj-6',
    title: 'Spider (Maman)',
    artist: 'Louise Bourgeois',
    year: '1999',
    medium: 'Bronze, stainless steel, and marble',
    dimensions: '927 × 891 × 1024 cm',
    division: 'Contemporary Art',
    estimateLow: 0,
    estimateHigh: 0,
    currency: 'USD',
    isBeingSoldNow: false,
    isKnownWork: true,
    lastSoldDate: '2019-05-15',
    lastSoldPrice: 32000000,
    imageUrl: '/images/bourgeois-spider.jpg',
    condition: 'Excellent',
    provenance: 'Private collection, acquired from Cheim & Read, New York, 2000',
    exhibited: 'Guggenheim Bilbao, 2000-present',
    primarySpecialistId: 'spec-1'
  },
  {
    id: 'obj-7',
    title: 'Orange, Red, Yellow',
    artist: 'Mark Rothko',
    year: '1961',
    medium: 'Oil on canvas',
    dimensions: '236.2 × 206.4 cm',
    division: 'Post-War Art',
    estimateLow: 0,
    estimateHigh: 0,
    currency: 'USD',
    isBeingSoldNow: false,
    isKnownWork: true,
    lastSoldDate: '2012-05-08',
    lastSoldPrice: 86882500,
    imageUrl: '/images/rothko-orange.jpg',
    condition: 'Excellent',
    provenance: 'Collection of David Pincus (acquired from Marlborough Gallery, 1967)',
    exhibited: 'MoMA, New York; Tate Modern, London; National Gallery of Art, Washington',
    literature: 'Mark Rothko: The Works on Canvas, 1998, no. 845',
    primarySpecialistId: 'spec-2'
  },
  {
    id: 'obj-8',
    title: 'Untitled (Skull)',
    artist: 'Jean-Michel Basquiat',
    year: '1981',
    medium: 'Acrylic and oilstick on canvas',
    dimensions: '205.7 × 175.9 cm',
    division: 'Contemporary Art',
    estimateLow: 0,
    estimateHigh: 0,
    currency: 'USD',
    isBeingSoldNow: false,
    isKnownWork: true,
    lastSoldDate: '2017-05-18',
    lastSoldPrice: 110500000,
    imageUrl: '/images/basquiat-skull.jpg',
    condition: 'Very good',
    provenance: 'Private collection, Japan (acquired from Gagosian Gallery, 1998)',
    exhibited: 'Whitney Museum, New York, 1992; Fondation Louis Vuitton, Paris, 2018',
    literature: 'Jean-Michel Basquiat: The Notebooks, 2015',
    primarySpecialistId: 'spec-1'
  },
  {
    id: 'obj-9',
    title: 'Les Femmes d\'Alger (Version O)',
    artist: 'Pablo Picasso',
    year: '1955',
    medium: 'Oil on canvas',
    dimensions: '114 × 146.4 cm',
    division: 'Impressionist & Modern',
    estimateLow: 0,
    estimateHigh: 0,
    currency: 'USD',
    isBeingSoldNow: false,
    isKnownWork: true,
    lastSoldDate: '2015-05-11',
    lastSoldPrice: 179365000,
    imageUrl: '/images/picasso-femmes.jpg',
    condition: 'Excellent',
    provenance: 'Estate of Victor and Sally Ganz; Khalifa bin Hamad bin Khalifa Al Thani',
    exhibited: 'MoMA, New York; Tate Modern, London; Musée Picasso, Paris',
    literature: 'Picasso: The Mediterranean Years, 2010',
    primarySpecialistId: 'spec-3'
  },
  {
    id: 'obj-10',
    title: 'Untitled',
    artist: 'Cy Twombly',
    year: '2005',
    medium: 'Acrylic on canvas',
    dimensions: '250 × 500 cm',
    division: 'Contemporary Art',
    estimateLow: 0,
    estimateHigh: 0,
    currency: 'USD',
    isBeingSoldNow: false,
    isKnownWork: true,
    lastSoldDate: '2014-11-12',
    lastSoldPrice: 69605000,
    imageUrl: '/images/twombly-untitled.jpg',
    condition: 'Excellent',
    provenance: 'Gagosian Gallery, New York',
    exhibited: 'Tate Modern, London, 2008; Centre Pompidou, Paris, 2016',
    primarySpecialistId: 'spec-1'
  },

  // Photography - On Sale
  {
    id: 'obj-11',
    title: '99 Cent II Diptychon',
    artist: 'Andreas Gursky',
    year: '2001',
    medium: 'Chromogenic print, diasec',
    dimensions: '207 × 337 cm',
    division: 'Photography',
    estimateLow: 1500000,
    estimateHigh: 2000000,
    currency: 'USD',
    isBeingSoldNow: true,
    saleDate: '2025-12-20',
    saleName: 'Photographs',
    lotNumber: '28',
    isKnownWork: false,
    imageUrl: '/images/gursky-99cent.jpg',
    condition: 'Excellent',
    exhibited: 'Museum of Modern Art, New York, 2001',
    primarySpecialistId: 'spec-4'
  },

  // Design - On Sale
  {
    id: 'obj-12',
    title: 'Dragon Chair',
    artist: 'Eileen Gray',
    year: '1917-1919',
    medium: 'Lacquered wood',
    dimensions: '98 × 67 × 72 cm',
    division: 'Design',
    estimateLow: 3000000,
    estimateHigh: 5000000,
    currency: 'USD',
    isBeingSoldNow: true,
    saleDate: '2025-12-22',
    saleName: 'Design',
    lotNumber: '5',
    isKnownWork: false,
    imageUrl: '/images/gray-dragon.jpg',
    condition: 'Very good',
    provenance: 'Private collection, France',
    exhibited: 'Victoria and Albert Museum, London, 2013',
    primarySpecialistId: 'spec-5'
  }
]

// ============================================
// CLIENTS
// ============================================

export const auctionClients: AuctionClient[] = [
  {
    id: 'client-1',
    name: 'Jennifer Park',
    email: 'jennifer.park@techventures.com',
    phone: '+1 415-555-0123',
    location: 'San Francisco, CA',
    primarySpecialistId: 'spec-1',
    relationshipStatus: 'active',
    clientSince: '2018-03-15',
    totalSpent: 12500000,
    currency: 'USD',
    structuredProfile: {
      interests: ['Contemporary Art', 'Minimalism', 'Large-scale sculpture'],
      preferredArtists: ['Anish Kapoor', 'Richard Serra', 'Olafur Eliasson'],
      preferredCategories: ['Sculpture', 'Installation', 'Abstract painting'],
      typicalPriceBand: { min: 500000, max: 3000000 },
      riskTolerance: 'adventurous',
      decisionSpeed: 'fast',
      negotiationStyle: 'flexible'
    },
    lastContactDate: '2025-11-28',
    lastPurchaseDate: '2025-10-15',
    upcomingFollowUp: '2025-12-10'
  },
  {
    id: 'client-2',
    name: 'Marcus Chen',
    email: 'mchen@globalfinance.com',
    phone: '+852 9123-4567',
    location: 'Hong Kong',
    primarySpecialistId: 'spec-2',
    relationshipStatus: 'active',
    clientSince: '2015-06-20',
    totalSpent: 45000000,
    currency: 'USD',
    structuredProfile: {
      interests: ['Post-War Art', 'Blue-chip artists', 'Museum-quality works'],
      preferredArtists: ['Andy Warhol', 'Gerhard Richter', 'Mark Rothko'],
      preferredCategories: ['Painting', 'Print', 'Drawing'],
      typicalPriceBand: { min: 2000000, max: 15000000 },
      riskTolerance: 'conservative',
      decisionSpeed: 'slow',
      negotiationStyle: 'firm'
    },
    lastContactDate: '2025-12-01',
    lastPurchaseDate: '2025-09-22',
    upcomingFollowUp: '2025-12-15'
  },
  {
    id: 'client-3',
    name: 'Sophie Dubois',
    email: 'sophie@duboisart.fr',
    phone: '+33 6 12 34 56 78',
    location: 'Paris, France',
    primarySpecialistId: 'spec-1',
    relationshipStatus: 'active',
    clientSince: '2019-11-10',
    totalSpent: 8200000,
    currency: 'USD',
    structuredProfile: {
      interests: ['Contemporary Art', 'Female artists', 'Conceptual art'],
      preferredArtists: ['Yayoi Kusama', 'Louise Bourgeois', 'Kara Walker'],
      preferredCategories: ['Sculpture', 'Installation', 'Mixed media'],
      typicalPriceBand: { min: 800000, max: 4000000 },
      riskTolerance: 'moderate',
      decisionSpeed: 'moderate',
      negotiationStyle: 'flexible'
    },
    lastContactDate: '2025-11-20',
    lastPurchaseDate: '2025-08-30',
    upcomingFollowUp: '2025-12-12'
  },
  {
    id: 'client-4',
    name: 'David Goldstein',
    email: 'david.goldstein@hedgecapital.com',
    phone: '+1 212-555-7890',
    location: 'New York, NY',
    primarySpecialistId: 'spec-2',
    relationshipStatus: 'occasional',
    clientSince: '2020-01-25',
    totalSpent: 3500000,
    currency: 'USD',
    structuredProfile: {
      interests: ['Post-War Art', 'Abstract Expressionism', 'Color field painting'],
      preferredArtists: ['Mark Rothko', 'Barnett Newman', 'Clyfford Still'],
      preferredCategories: ['Painting'],
      typicalPriceBand: { min: 500000, max: 2000000 },
      riskTolerance: 'moderate',
      decisionSpeed: 'moderate',
      negotiationStyle: 'aggressive'
    },
    lastContactDate: '2025-10-15',
    lastPurchaseDate: '2024-12-10',
    upcomingFollowUp: '2026-01-05'
  },
  {
    id: 'client-5',
    name: 'Priya Sharma',
    email: 'priya.sharma@mumbaitech.in',
    phone: '+91 98765 43210',
    location: 'Mumbai, India',
    primarySpecialistId: 'spec-4',
    relationshipStatus: 'active',
    clientSince: '2021-05-12',
    totalSpent: 1800000,
    currency: 'USD',
    structuredProfile: {
      interests: ['Photography', 'Documentary photography', 'South Asian artists'],
      preferredArtists: ['Andreas Gursky', 'Rinko Kawauchi', 'Dayanita Singh'],
      preferredCategories: ['Photography', 'Video art'],
      typicalPriceBand: { min: 100000, max: 500000 },
      riskTolerance: 'adventurous',
      decisionSpeed: 'fast',
      negotiationStyle: 'flexible'
    },
    lastContactDate: '2025-11-30',
    lastPurchaseDate: '2025-11-01',
    upcomingFollowUp: '2025-12-08'
  },
  {
    id: 'client-6',
    name: 'Isabella Moretti',
    email: 'isabella@moretticollection.it',
    phone: '+39 335 123 4567',
    location: 'Milan, Italy',
    primarySpecialistId: 'spec-3',
    relationshipStatus: 'active',
    clientSince: '2012-09-05',
    totalSpent: 28000000,
    currency: 'USD',
    structuredProfile: {
      interests: ['Impressionist & Modern', 'Italian Futurism', 'Classical Modernism'],
      preferredArtists: ['Pablo Picasso', 'Giorgio de Chirico', 'Amedeo Modigliani'],
      preferredCategories: ['Painting', 'Drawing', 'Sculpture'],
      typicalPriceBand: { min: 1000000, max: 8000000 },
      riskTolerance: 'conservative',
      decisionSpeed: 'slow',
      negotiationStyle: 'firm'
    },
    lastContactDate: '2025-12-02',
    lastPurchaseDate: '2025-07-20',
    upcomingFollowUp: '2025-12-18'
  },
  {
    id: 'client-7',
    name: 'Thomas Müller',
    email: 'thomas.muller@automotivetycoon.de',
    phone: '+49 172 345 6789',
    location: 'Munich, Germany',
    primarySpecialistId: 'spec-5',
    relationshipStatus: 'active',
    clientSince: '2017-02-28',
    totalSpent: 5600000,
    currency: 'USD',
    structuredProfile: {
      interests: ['Design', 'Mid-century modern', 'Bauhaus', 'Industrial design'],
      preferredArtists: ['Eileen Gray', 'Jean Prouvé', 'Charlotte Perriand'],
      preferredCategories: ['Furniture', 'Decorative arts', 'Architecture'],
      typicalPriceBand: { min: 300000, max: 2000000 },
      riskTolerance: 'moderate',
      decisionSpeed: 'moderate',
      negotiationStyle: 'flexible'
    },
    lastContactDate: '2025-11-25',
    lastPurchaseDate: '2025-10-08',
    upcomingFollowUp: '2025-12-20'
  },
  {
    id: 'client-8',
    name: 'Emily Washington',
    email: 'emily@washingtonmuseum.org',
    phone: '+1 202-555-3456',
    location: 'Washington, DC',
    primarySpecialistId: 'spec-1',
    relationshipStatus: 'prospect',
    clientSince: '2024-08-15',
    totalSpent: 0,
    currency: 'USD',
    structuredProfile: {
      interests: ['Contemporary Art', 'Social practice', 'Performance art'],
      preferredArtists: ['Tania Bruguera', 'Theaster Gates', 'Ai Weiwei'],
      preferredCategories: ['Installation', 'Video', 'Performance documentation'],
      typicalPriceBand: { min: 50000, max: 500000 },
      riskTolerance: 'adventurous',
      decisionSpeed: 'slow',
      negotiationStyle: 'firm'
    },
    lastContactDate: '2025-11-18',
    upcomingFollowUp: '2025-12-15'
  }
]

// ============================================
// CLIENT NOTES
// ============================================

export const clientNotes: ClientNote[] = [
  // Jennifer Park notes
  {
    id: 'note-1',
    clientId: 'client-1',
    timestamp: '2025-11-28T14:30:00Z',
    source: 'manual',
    text: 'Jennifer visited the gallery preview for the Contemporary Evening Sale. Very interested in the Kapoor mirror piece (lot 12). Mentioned she\'s looking for something for her new SF office space. Budget seems flexible around $1M. Asked about shipping and installation logistics.',
    createdBy: 'Sarah Chen'
  },
  {
    id: 'note-2',
    clientId: 'client-1',
    timestamp: '2025-10-15T10:00:00Z',
    source: 'auto-parse',
    text: 'Client purchased Richard Serra sculpture at Contemporary Day Sale for $2.8M. Fast decision-maker, no negotiation needed. Interested in large-scale contemporary sculpture.',
    createdBy: 'System',
    parsedData: {
      interests: ['large-scale contemporary sculpture'],
      budget: { min: 2000000, max: 5000000 },
      decisionSpeed: 'fast'
    }
  },

  // Marcus Chen notes
  {
    id: 'note-3',
    clientId: 'client-2',
    timestamp: '2025-12-01T16:45:00Z',
    source: 'manual',
    text: 'Marcus called about the Warhol "Silver Car Crash" coming up in December evening sale. He\'s very serious about this one - says it would be the centerpiece of his Hong Kong residence. Wants detailed condition report and provenance documentation. Mentioned he\'s willing to go above estimate for the right piece. Will need 2 weeks to arrange financing.',
    createdBy: 'Marcus Williams'
  },
  {
    id: 'note-4',
    clientId: 'client-2',
    timestamp: '2025-09-22T11:20:00Z',
    source: 'auto-parse',
    text: 'Successfully acquired Gerhard Richter abstract at Post-War sale for $6.2M. Client prefers blue-chip, museum-quality works. Conservative buyer who takes time to research.',
    createdBy: 'System',
    parsedData: {
      interests: ['blue-chip artists', 'museum-quality'],
      budget: { min: 5000000, max: 15000000 },
      riskTolerance: 'conservative',
      decisionSpeed: 'slow'
    }
  },

  // Sophie Dubois notes
  {
    id: 'note-5',
    clientId: 'client-3',
    timestamp: '2025-11-20T09:15:00Z',
    source: 'manual',
    text: 'Sophie expressed strong interest in the Kusama Infinity Net painting (lot 8, est. $2.5-3.5M). She\'s been actively collecting Kusama over the past 2 years. Mentioned she might bring her advisor to view it in person next week. Very knowledgeable about the artist\'s market.',
    createdBy: 'Sarah Chen'
  },

  // David Goldstein notes
  {
    id: 'note-6',
    clientId: 'client-4',
    timestamp: '2025-10-15T13:00:00Z',
    source: 'manual',
    text: 'David came in to view the Rothko retrospective materials. He\'s interested in expanding his Abstract Expressionist collection but is being cautious given market conditions. Prefers to wait for the right opportunity rather than rush. Asked to be kept informed of any Rothko, Newman, or Still works coming up.',
    createdBy: 'Marcus Williams'
  },

  // Priya Sharma notes
  {
    id: 'note-7',
    clientId: 'client-5',
    timestamp: '2025-11-30T08:30:00Z',
    source: 'manual',
    text: 'Priya is very excited about the Gursky photograph in the December sale. She\'s building a major photography collection for her Mumbai tech campus. Wants to bid but is concerned about the estimate - thinks $1.5-2M might be high. Asked if there are other Gursky works available privately.',
    createdBy: 'James Park'
  },
  {
    id: 'note-8',
    clientId: 'client-5',
    timestamp: '2025-11-01T15:45:00Z',
    source: 'auto-parse',
    text: 'Client purchased two Dayanita Singh photographs for combined $320K. Fast decision-maker, interested in South Asian contemporary photography. Budget flexible for the right pieces.',
    createdBy: 'System',
    parsedData: {
      interests: ['South Asian artists', 'contemporary photography'],
      budget: { min: 100000, max: 500000 },
      decisionSpeed: 'fast',
      riskTolerance: 'adventurous'
    }
  },

  // Isabella Moretti notes
  {
    id: 'note-9',
    clientId: 'client-6',
    timestamp: '2025-12-02T17:00:00Z',
    source: 'manual',
    text: 'Isabella is one of our most important Impressionist & Modern clients. She inquired about the Picasso "Les Femmes d\'Alger" - knows it from the 2015 sale. Wants to be informed if it ever comes back to market or if there are other major Picasso works available. Very discreet buyer, prefers private sales when possible.',
    createdBy: 'Isabella Rossi'
  },

  // Thomas Müller notes
  {
    id: 'note-10',
    clientId: 'client-7',
    timestamp: '2025-11-25T12:30:00Z',
    source: 'manual',
    text: 'Thomas is targeting the Eileen Gray Dragon Chair in the December Design sale. He\'s been looking for an example for over 3 years. Estimate of $3-5M is within his range. He wants to inspect the piece in person and may bring a conservator to assess the lacquer condition. Very serious buyer for this lot.',
    createdBy: 'Emma Laurent'
  },

  // Emily Washington notes
  {
    id: 'note-11',
    clientId: 'client-8',
    timestamp: '2025-11-18T11:00:00Z',
    source: 'manual',
    text: 'Met Emily at Art Basel. She represents the Washington Contemporary Museum and is exploring acquisition possibilities. They have a limited budget but are interested in socially-engaged contemporary art. Good long-term relationship to develop - they often loan works to exhibitions.',
    createdBy: 'Sarah Chen'
  }
]

// ============================================
// CLIENT HISTORIES
// ============================================

export const clientHistories: ClientHistory[] = [
  // Jennifer Park history
  {
    clientId: 'client-1',
    buying: [
      {
        id: 'hist-1',
        date: '2025-10-15',
        type: 'buying',
        description: 'Successfully purchased Richard Serra sculpture',
        objectId: 'obj-past-1',
        objectTitle: 'Torqued Ellipse IV',
        artist: 'Richard Serra',
        amount: 2800000,
        currency: 'USD',
        outcome: 'Won - Below estimate',
        specialistId: 'spec-1'
      },
      {
        id: 'hist-2',
        date: '2024-05-20',
        type: 'buying',
        description: 'Purchased Olafur Eliasson light installation',
        objectId: 'obj-past-2',
        objectTitle: 'Your uncertain shadow (colour)',
        artist: 'Olafur Eliasson',
        amount: 1200000,
        currency: 'USD',
        outcome: 'Won - At estimate',
        specialistId: 'spec-1'
      }
    ],
    bidding: [
      {
        id: 'hist-3',
        date: '2025-06-10',
        type: 'bidding',
        description: 'Underbidder on Anish Kapoor concave mirror',
        objectId: 'obj-past-3',
        objectTitle: 'Non-Object (Mirror)',
        artist: 'Anish Kapoor',
        amount: 950000,
        currency: 'USD',
        outcome: 'Lost - Underbidder',
        specialistId: 'spec-1'
      }
    ],
    consignment: [],
    digital: [
      {
        id: 'hist-4',
        date: '2025-11-28',
        type: 'digital',
        description: 'Attended Contemporary Evening Sale preview',
        outcome: 'Viewed lot 12 (Kapoor)',
        specialistId: 'spec-1'
      }
    ]
  },

  // Marcus Chen history
  {
    clientId: 'client-2',
    buying: [
      {
        id: 'hist-5',
        date: '2025-09-22',
        type: 'buying',
        description: 'Purchased Gerhard Richter abstraction',
        objectId: 'obj-past-4',
        objectTitle: 'Abstraktes Bild (889-1)',
        artist: 'Gerhard Richter',
        amount: 6200000,
        currency: 'USD',
        outcome: 'Won - Within estimate',
        specialistId: 'spec-2'
      },
      {
        id: 'hist-6',
        date: '2024-11-15',
        type: 'buying',
        description: 'Acquired Warhol Mao silkscreen',
        objectId: 'obj-past-5',
        objectTitle: 'Mao',
        artist: 'Andy Warhol',
        amount: 4800000,
        currency: 'USD',
        outcome: 'Won - Above estimate',
        specialistId: 'spec-2'
      },
      {
        id: 'hist-7',
        date: '2023-05-20',
        type: 'buying',
        description: 'Purchased Cy Twombly blackboard painting',
        objectId: 'obj-past-6',
        objectTitle: 'Untitled (New York City)',
        artist: 'Cy Twombly',
        amount: 3500000,
        currency: 'USD',
        outcome: 'Won - At estimate',
        specialistId: 'spec-2'
      }
    ],
    bidding: [
      {
        id: 'hist-8',
        date: '2025-03-12',
        type: 'bidding',
        description: 'Bid on Basquiat skull painting',
        objectId: 'obj-8',
        objectTitle: 'Untitled (Skull)',
        artist: 'Jean-Michel Basquiat',
        amount: 8000000,
        currency: 'USD',
        outcome: 'Lost - Price exceeded budget',
        specialistId: 'spec-2'
      }
    ],
    consignment: [],
    digital: [
      {
        id: 'hist-9',
        date: '2025-12-01',
        type: 'digital',
        description: 'Requested condition report for Warhol Silver Car Crash',
        outcome: 'Serious interest',
        specialistId: 'spec-2'
      }
    ]
  },

  // Sophie Dubois history
  {
    clientId: 'client-3',
    buying: [
      {
        id: 'hist-10',
        date: '2025-08-30',
        type: 'buying',
        description: 'Purchased Yayoi Kusama pumpkin sculpture',
        objectId: 'obj-past-7',
        objectTitle: 'Pumpkin (Yellow)',
        artist: 'Yayoi Kusama',
        amount: 2100000,
        currency: 'USD',
        outcome: 'Won - Above estimate',
        specialistId: 'spec-1'
      },
      {
        id: 'hist-11',
        date: '2024-03-15',
        type: 'buying',
        description: 'Acquired Kara Walker silhouette installation',
        objectId: 'obj-past-8',
        objectTitle: 'A Subtlety',
        artist: 'Kara Walker',
        amount: 850000,
        currency: 'USD',
        outcome: 'Won - At estimate',
        specialistId: 'spec-1'
      }
    ],
    bidding: [],
    consignment: [],
    digital: [
      {
        id: 'hist-12',
        date: '2025-11-20',
        type: 'digital',
        description: 'Inquired about Kusama Infinity Net painting',
        outcome: 'Planning to view in person',
        specialistId: 'spec-1'
      }
    ]
  },

  // David Goldstein history
  {
    clientId: 'client-4',
    buying: [
      {
        id: 'hist-13',
        date: '2024-12-10',
        type: 'buying',
        description: 'Purchased Barnett Newman lithograph',
        objectId: 'obj-past-9',
        objectTitle: 'Canto V',
        artist: 'Barnett Newman',
        amount: 780000,
        currency: 'USD',
        outcome: 'Won - Below estimate',
        specialistId: 'spec-2'
      }
    ],
    bidding: [
      {
        id: 'hist-14',
        date: '2025-05-08',
        type: 'bidding',
        description: 'Bid on Clyfford Still painting',
        objectId: 'obj-past-10',
        objectTitle: 'PH-950',
        artist: 'Clyfford Still',
        amount: 1800000,
        currency: 'USD',
        outcome: 'Lost - Underbidder',
        specialistId: 'spec-2'
      }
    ],
    consignment: [],
    digital: [
      {
        id: 'hist-15',
        date: '2025-10-15',
        type: 'digital',
        description: 'Attended Rothko retrospective viewing',
        outcome: 'General interest, no specific lots',
        specialistId: 'spec-2'
      }
    ]
  },

  // Priya Sharma history
  {
    clientId: 'client-5',
    buying: [
      {
        id: 'hist-16',
        date: '2025-11-01',
        type: 'buying',
        description: 'Purchased two Dayanita Singh photographs',
        objectId: 'obj-past-11',
        objectTitle: 'File Room series',
        artist: 'Dayanita Singh',
        amount: 320000,
        currency: 'USD',
        outcome: 'Won - Combined purchase',
        specialistId: 'spec-4'
      },
      {
        id: 'hist-17',
        date: '2025-06-20',
        type: 'buying',
        description: 'Acquired Rinko Kawauchi photo series',
        objectId: 'obj-past-12',
        objectTitle: 'Illuminance',
        artist: 'Rinko Kawauchi',
        amount: 180000,
        currency: 'USD',
        outcome: 'Won - At estimate',
        specialistId: 'spec-4'
      }
    ],
    bidding: [],
    consignment: [],
    digital: [
      {
        id: 'hist-18',
        date: '2025-11-30',
        type: 'digital',
        description: 'Inquired about Andreas Gursky photograph',
        outcome: 'Interested but concerned about estimate',
        specialistId: 'spec-4'
      }
    ]
  },

  // Isabella Moretti history
  {
    clientId: 'client-6',
    buying: [
      {
        id: 'hist-19',
        date: '2025-07-20',
        type: 'buying',
        description: 'Purchased Giorgio de Chirico metaphysical painting',
        objectId: 'obj-past-13',
        objectTitle: 'Le Muse Inquietanti',
        artist: 'Giorgio de Chirico',
        amount: 5200000,
        currency: 'USD',
        outcome: 'Won - Private sale',
        specialistId: 'spec-3'
      },
      {
        id: 'hist-20',
        date: '2023-11-10',
        type: 'buying',
        description: 'Acquired Modigliani portrait drawing',
        objectId: 'obj-past-14',
        objectTitle: 'Tête de femme',
        artist: 'Amedeo Modigliani',
        amount: 3800000,
        currency: 'USD',
        outcome: 'Won - Above estimate',
        specialistId: 'spec-3'
      }
    ],
    bidding: [],
    consignment: [
      {
        id: 'hist-21',
        date: '2024-05-15',
        type: 'consignment',
        description: 'Consigned Umberto Boccioni futurist sculpture',
        objectId: 'obj-past-15',
        objectTitle: 'Unique Forms of Continuity in Space (cast)',
        artist: 'Umberto Boccioni',
        amount: 2100000,
        currency: 'USD',
        outcome: 'Sold - Above reserve',
        specialistId: 'spec-3'
      }
    ],
    digital: [
      {
        id: 'hist-22',
        date: '2025-12-02',
        type: 'digital',
        description: 'Inquired about Picasso availability',
        outcome: 'Interested in major works',
        specialistId: 'spec-3'
      }
    ]
  },

  // Thomas Müller history
  {
    clientId: 'client-7',
    buying: [
      {
        id: 'hist-23',
        date: '2025-10-08',
        type: 'buying',
        description: 'Purchased Jean Prouvé desk and chair set',
        objectId: 'obj-past-16',
        objectTitle: 'Bureau Direction and Fauteuil Direction',
        artist: 'Jean Prouvé',
        amount: 1200000,
        currency: 'USD',
        outcome: 'Won - At estimate',
        specialistId: 'spec-5'
      },
      {
        id: 'hist-24',
        date: '2024-06-15',
        type: 'buying',
        description: 'Acquired Charlotte Perriand bookshelf',
        objectId: 'obj-past-17',
        objectTitle: 'Bibliothèque',
        artist: 'Charlotte Perriand',
        amount: 680000,
        currency: 'USD',
        outcome: 'Won - Below estimate',
        specialistId: 'spec-5'
      }
    ],
    bidding: [],
    consignment: [],
    digital: [
      {
        id: 'hist-25',
        date: '2025-11-25',
        type: 'digital',
        description: 'Viewed Eileen Gray Dragon Chair',
        outcome: 'Very serious interest, planning in-person inspection',
        specialistId: 'spec-5'
      }
    ]
  },

  // Emily Washington history
  {
    clientId: 'client-8',
    buying: [],
    bidding: [],
    consignment: [],
    digital: [
      {
        id: 'hist-26',
        date: '2025-11-18',
        type: 'digital',
        description: 'Initial meeting at Art Basel',
        outcome: 'Prospect - Museum representative',
        specialistId: 'spec-1'
      },
      {
        id: 'hist-27',
        date: '2024-09-20',
        type: 'digital',
        description: 'Attended contemporary art panel discussion',
        outcome: 'Building relationship',
        specialistId: 'spec-1'
      }
    ]
  }
]

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getSpecialistById(id: string): Specialist | undefined {
  return specialists.find(s => s.id === id)
}

export function getObjectById(id: string): ObjectWork | undefined {
  return objects.find(o => o.id === id)
}

export function getClientById(id: string): AuctionClient | undefined {
  return auctionClients.find(c => c.id === id)
}

export function getClientHistory(clientId: string): ClientHistory | undefined {
  return clientHistories.find(h => h.clientId === clientId)
}

export function getClientNotes(clientId: string): ClientNote[] {
  return clientNotes.filter(n => n.clientId === clientId).sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
}

export function getObjectsBySpecialist(specialistId: string, onSaleOnly: boolean = false): ObjectWork[] {
  return objects.filter(o =>
    o.primarySpecialistId === specialistId &&
    (!onSaleOnly || o.isBeingSoldNow)
  )
}

export function getClientsBySpecialist(specialistId: string): AuctionClient[] {
  return auctionClients.filter(c => c.primarySpecialistId === specialistId)
}
