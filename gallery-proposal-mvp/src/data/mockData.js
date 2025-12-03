export const client = {
  name: "Jane Chen",
  email: "jane.chen@example.com",
  region: "New York, NY",
  interests: ["Postwar Abstraction", "Color Field Painting", "Minimalism"],
  budget: "$250,000 - $1,000,000",
  notes: "Building collection focused on women abstract expressionists. Recently acquired Helen Frankenthaler work. New downtown office with 20ft ceilings and abundant natural light.",
  occasion: "New office space at 125 Greenwich Street, focusing on the reception area and main conference room"
};

export const artworks = [
  {
    id: 1,
    artist: "Helen Frankenthaler",
    title: "Mountains and Sea",
    year: 1952,
    medium: "Oil and charcoal on canvas",
    dimensions: "220 × 298 cm (86 5/8 × 117 3/8 in)",
    price: 1850000,
    priceFormatted: "$1,850,000",
    market: "Secondary",
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
    significance: "Fresh to market after 56 years in the same collection. Comparable works in MoMA and Guggenheim permanent collections."
  },
  {
    id: 2,
    artist: "Anselm Kiefer",
    title: "Ash Flower",
    year: 2015,
    medium: "Mixed media on canvas",
    dimensions: "280 × 380 cm (110 × 150 in)",
    price: 420000,
    priceFormatted: "$420,000",
    market: "Primary",
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
    significance: "Monumental scale ideal for corporate installation. Recent solo exhibition at Pompidou Center."
  },
  {
    id: 3,
    artist: "Mark Rothko",
    title: "No. 14",
    year: 1960,
    medium: "Oil on canvas",
    dimensions: "290 × 268 cm (114 × 105 in)",
    price: 2500000,
    priceFormatted: "$2,500,000",
    market: "Secondary",
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
    significance: "Museum-quality example from peak creative period. Works from this year held by National Gallery and Tate."
  },
  {
    id: 4,
    artist: "Joan Mitchell",
    title: "Ladybug",
    year: 1957,
    medium: "Oil on canvas",
    dimensions: "197 × 269 cm (77 5/8 × 106 in)",
    price: 1200000,
    priceFormatted: "$1,200,000",
    market: "Secondary",
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
    significance: "Key woman artist of Abstract Expressionism. Growing institutional recognition and market strength."
  },
  {
    id: 5,
    artist: "Cy Twombly",
    title: "Untitled (Bacchus)",
    year: 2005,
    medium: "Acrylic on canvas",
    dimensions: "220 × 300 cm (86 5/8 × 118 in)",
    price: 980000,
    priceFormatted: "$980,000",
    market: "Secondary",
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
    significance: "Late masterwork from final creative period. Recent record prices for Bacchus series at auction."
  },
  {
    id: 6,
    artist: "Robert Motherwell",
    title: "Elegy to the Spanish Republic No. 126",
    year: 1965,
    medium: "Acrylic on canvas",
    dimensions: "206 × 351 cm (81 × 138 in)",
    price: 750000,
    priceFormatted: "$750,000",
    market: "Secondary",
    imageUrl: "/images/06-motherwell.jpg",
    provenance: [
      "Knoedler Gallery, New York, 1965",
      "Private Collection, California, 1970-2015"
    ],
    exhibition: [
      "Museum of Modern Art, New York, 1965",
      "Guggenheim Museum, 'Motherwell Retrospective', 1983"
    ],
    description: "Monumental work from Motherwell's iconic Elegy series, a meditation on loss and memory. Powerful scale and emotional depth.",
    significance: "From the artist's most celebrated body of work. Horizontal format ideal for installation above reception desk."
  },
  {
    id: 7,
    artist: "Agnes Martin",
    title: "The Tree",
    year: 1964,
    medium: "Oil and graphite on canvas",
    dimensions: "182 × 182 cm (72 × 72 in)",
    price: 1100000,
    priceFormatted: "$1,100,000",
    market: "Secondary",
    imageUrl: "/images/07-martin.jpg",
    provenance: [
      "Betty Parsons Gallery, New York, 1964",
      "Private Collection, New Mexico, 1970-2018"
    ],
    exhibition: [
      "Institute of Contemporary Art, Philadelphia, 1973",
      "Guggenheim Museum, 'Agnes Martin Retrospective', 2016"
    ],
    description: "Subtle grid painting exemplifying Martin's meditative minimalist practice. Quiet contemplation and refined execution.",
    significance: "Key woman artist bridging Abstract Expressionism and Minimalism. Strong institutional support and market."
  },
  {
    id: 8,
    artist: "Ellsworth Kelly",
    title: "Red Blue Green",
    year: 1963,
    medium: "Oil on canvas (three joined panels)",
    dimensions: "213 × 518 cm overall (84 × 204 in)",
    price: 890000,
    priceFormatted: "$890,000",
    market: "Secondary",
    imageUrl: "/images/08-kelly.jpg",
    provenance: [
      "Sidney Janis Gallery, New York, 1963",
      "Private Collection, Texas, 1968-present"
    ],
    exhibition: [
      "Sidney Janis Gallery, New York, 1963",
      "Museum of Modern Art, 'Ellsworth Kelly Retrospective', 1973",
      "Guggenheim Museum, 'Hard-Edge Painting', 1990"
    ],
    description: "Iconic multi-panel Color Field work demonstrating Kelly's mastery of pure color and form. Architectural scale and presence.",
    significance: "Triptych format creates dynamic visual rhythm. Ideal for long wall in conference room."
  }
];

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
};

export const proposalIntro = {
  greeting: "Dear Jane,",
  body: `Thank you for the opportunity to present this curated selection for your new office space at 125 Greenwich Street.

Based on our conversations about your interest in Postwar Abstraction and your focus on women artists, we've assembled a collection that balances historical significance with visual impact. These works are specifically chosen to complement your space's 20-foot ceilings and abundant natural light.

This proposal focuses on museum-quality examples from the Color Field and Abstract Expressionist movements, with particular attention to female pioneers and works suitable for corporate installation.`,
  timing: "All works are subject to prior sale and current availability. We recommend moving quickly on works of particular interest."
};

export const defaultTerms = `TERMS & CONDITIONS

PRICING & VALIDITY
All prices are in US Dollars and valid for 14 days from the date of this proposal. Prices are subject to change without notice and do not include applicable sales tax.

PAYMENT TERMS
• 50% deposit due upon acceptance to reserve works
• Balance due prior to shipping
• Payment accepted via wire transfer or certified check
• Credit card payments subject to 3% processing fee

SHIPPING & INSURANCE
• Shipping, handling, and insurance calculated separately
• All artworks shipped fully insured at replacement value
• White-glove delivery and installation available (additional fee)
• Client responsible for all customs duties and import taxes if applicable

FRAMING & INSTALLATION
• Works sold unframed unless otherwise specified
• Professional framing services available
• Installation coordination available through our preferred partners

AVAILABILITY & HOLD POLICY
• All artworks subject to prior sale
• 48-hour courtesy hold available upon request
• Formal reservation requires 50% deposit

CONDITION & AUTHENTICITY
• All works sold in current condition
• Detailed condition reports available upon request
• Certificate of authenticity provided with each purchase
• Full provenance documentation included

RETURN POLICY
• Works may be returned within 7 days of delivery
• Must be in original condition with all original packaging
• Return shipping costs borne by client
• Restocking fee of 10% applies

This proposal is prepared exclusively for Jane Chen and is private and confidential.`;
