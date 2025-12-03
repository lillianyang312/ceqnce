# Gallery CRM + Recommendation Engine - Architecture Documentation

## Executive Summary

This is a comprehensive AI copilot for art galleries that combines proposal generation, CRM functionality, and intelligent recommendation capabilities. The system tracks clients, artworks, purchases, consignments (including incomplete/failed attempts), and digital engagement, then uses this data to provide smart recommendations and insights.

**Key Features:**
- Full client database with structured profiles auto-parsed from notes
- Artwork inventory with price history tracking
- Consignment tracking (including withdrawn, expired, and failed sales)
- Digital engagement monitoring
- AI-powered recommendation engine
- Integrated chat interface with context awareness
- Proposal generation with PDF export

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Client   │  │ Artwork  │  │  Chat    │  │ Proposal │   │
│  │ Views    │  │ Views    │  │  Panel   │  │ Preview  │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │              │             │          │
└───────┼─────────────┼──────────────┼─────────────┼──────────┘
        │             │              │             │
        ▼             ▼              ▼             ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Layer (TypeScript)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  CRM     │  │  Notes   │  │  Recom-  │  │  Chat    │   │
│  │  API     │  │  Parser  │  │  mender  │  │  Tools   │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │              │             │          │
└───────┼─────────────┼──────────────┼─────────────┼──────────┘
        │             │              │             │
        ▼             ▼              ▼             ▼
┌─────────────────────────────────────────────────────────────┐
│                   Data Layer (Mock Data)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Clients  │  │ Artworks │  │ Consign- │  │ Purchases│   │
│  │          │  │          │  │  ments   │  │          │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## File Structure

```
gallery-proposal-mvp/
├── src/
│   ├── types/
│   │   └── index.ts                 # All TypeScript interfaces
│   ├── data/
│   │   ├── mockData.js              # Original proposal data
│   │   └── crmMockData.ts           # Comprehensive CRM data
│   ├── api/
│   │   ├── crmApi.ts                # Client/artwork query functions
│   │   └── recommendationEngine.ts  # Matching algorithms
│   ├── utils/
│   │   ├── notesParser.ts           # Text → structured profile parsing
│   │   ├── claude.js                # Claude API integration
│   │   ├── exportPDF.js             # PDF generation
│   │   └── formatters.js            # Utility functions
│   ├── components/
│   │   ├── ClientList.tsx           # Client list view
│   │   ├── ClientDetail.tsx         # Client detail view
│   │   ├── ArtworkGrid.jsx          # Artwork grid (original)
│   │   ├── ChatPanel.jsx            # Chat interface
│   │   ├── MessageBubble.jsx        # Chat message component
│   │   ├── ProposalPreview.jsx      # Proposal preview
│   │   └── ScreenPanel.jsx          # Screen container
│   ├── App.jsx                      # Main app component
│   └── main.jsx                     # Entry point
├── server.js                        # Express server for Claude API proxy
├── package.json
└── README.md
```

## Data Model

### Core Entities

#### 1. Client
```typescript
interface Client {
  id: string
  name: string
  email: string
  location: string
  preferredArtists: string[]
  preferredMedia: string[]
  typicalPriceBand: { min: number, max: number, currency: string }
  notes: string // Free-text notes
  structuredProfile: StructuredProfile // Auto-parsed
  tags: string[]
  digitalEngagements: DigitalEngagement[]
  purchaseHistory: Purchase[]
  consignmentHistory: Consignment[]
  createdAt: string
  lastContactDate: string
}
```

#### 2. StructuredProfile (Auto-parsed from notes)
```typescript
interface StructuredProfile {
  riskTolerance: "low" | "medium" | "high"
  negotiationStyle: "hard" | "flexible" | "discreet" | "institutional"
  decisionSpeed: "fast" | "slow" | "committee"
  interests: string[]
  preferredFairs: string[]
  relationshipStatus: "prospect" | "active" | "dormant" | "institution" | "VIP"
  priceSensitivity: "high" | "medium" | "low"
  communicationPreference: "email" | "phone" | "in-person"
  lastUpdated: string
}
```

#### 3. Consignment (Critical for tracking incomplete sales)
```typescript
interface Consignment {
  id: string
  clientId: string
  artworkId: string
  startDate: string
  endDate?: string
  status: "enquiry" | "offered" | "consigned" | "on_approval" |
          "on_hold" | "withdrawn" | "expired" | "sale_failed" |
          "sold_here" | "sold_elsewhere"
  intendedSaleChannel: "gallery" | "fair" | "auction" | "online_viewing_room"
  targetPrice: number
  reservePrice?: number
  currency: string
  outcomeDetails: string
  notes: string
}
```

**Key insight:** The `status` field captures all outcomes including failures:
- `withdrawn`: Client changed mind
- `expired`: Consignment period ended without sale
- `sale_failed`: Attempted sale didn't complete

#### 4. DigitalEngagement
```typescript
interface DigitalEngagement {
  id: string
  clientId: string
  type: "email_open" | "viewing_room_view" | "fair_visit" |
        "click_artwork_detail" | "proposal_view" | "website_visit"
  artworkId?: string
  timestamp: string
  metadata: Record<string, any>
}
```

#### 5. Purchase
```typescript
interface Purchase {
  id: string
  clientId: string
  artworkId: string
  date: string
  pricePaid: number
  currency: string
  channel: "fair" | "gallery" | "online_viewing_room" | "auction" | "private_sale"
  paymentTerms: string
  notes?: string
}
```

#### 6. Artwork
```typescript
interface Artwork {
  id: string
  artistName: string
  artistId?: string
  title: string
  year: number
  medium: string
  dimensions: string
  category: string
  primaryOrSecondary: "primary" | "secondary"
  currentStatus: "available" | "reserved" | "sold" | "not_for_sale" | "on_consignment"
  currentAskingPrice?: number
  currency: string
  priceHistory: PriceHistory[]
  tags: string[]
  imageUrl: string
  provenance?: string[]
  exhibition?: string[]
  description: string
  significance?: string
}
```

## Core Systems

### 1. Client Notes Parsing (`src/utils/notesParser.ts`)

Automatically extracts structured attributes from free-text notes.

**How it works:**
```typescript
// Input: Free text note
const note = "Very price-sensitive, always asks for discounts, loves geometric abstraction.
              Fast decision maker, usually decides within 48 hours."

// Output: Structured profile update
const parsed = parseClientNotesToProfile(note)
// {
//   priceSensitivity: "high",
//   negotiationStyle: "hard",
//   decisionSpeed: "fast",
//   interests: ["geometric abstraction"]
// }
```

**Production Extension Point:**
Replace `parseClientNotesToProfile()` with `parseClientNotesToProfileWithLLM()` to use Claude for sophisticated parsing.

### 2. CRM API (`src/api/crmApi.ts`)

All data access functions:

**Client Queries:**
- `getClientById(id)` - Get single client
- `getAllClients()` - Get all clients
- `searchClients(filters)` - Filter by tags, price band, artist, location, status
- `getClientHistory(id)` - Full history including summary stats
- `getClientConsignments(id)` - Consignment history
- `updateClientNotes(id, note)` - Add note + auto-parse

**Artwork Queries:**
- `getArtworkById(id)`
- `getAllArtworks()`
- `searchArtworks(filters)` - Filter by artist, category, price, tags, status
- `getArtworkPriceHistory(id)` - Price analysis with trends
- `getArtworkConsignments(id)`

**Analytics:**
- `getClientEngagementScore(id)` - 0-100 score based on recent activity
- `getClientLifetimeValue(id)` - Total spend
- `analyzeClientConsignmentBehavior(id)` - Reliability analysis
- `getDashboardStats()` - Overall metrics

### 3. Recommendation Engine (`src/api/recommendationEngine.ts`)

Sophisticated rule-based matching system.

#### Recommending Clients for Artwork

```typescript
const recommendations = getLikelyClientsForArtwork("artwork-1", limit: 10)
// Returns: ClientRecommendation[]
```

**Scoring Factors (weighted):**
1. **Artist Alignment (30%)** - Matches preferred artists
2. **Category Alignment (20%)** - Matches preferred media
3. **Price Fit (20%)** - Within client's typical price band
4. **Engagement Score (15%)** - Recent digital activity
5. **Purchase History (10%)** - Similar past purchases
6. **Consignment Signals (5%)** - Track record (can be negative)

**Special Handling for Consignment Behavior:**
- High reliability (+50 points): Successfully completed consignments
- Has withdrawals (-10 points): Warning flag but doesn't disqualify
- Failed sales (-25 points): Indicates hesitancy or pricing issues

**Example Recommendation Output:**
```typescript
{
  client: Client,
  score: 85.5,
  explanation: "Strong interest in Joan Mitchell (preferred artist) • Price ($1.2M) fits budget range perfectly • Has purchased similar works before • ⚠️ Previous consignment didn't complete (may indicate hesitancy)",
  matchFactors: {
    artistAlignment: 100,
    categoryAlignment: 100,
    priceFit: 95,
    engagementScore: 70,
    purchaseHistory: 60,
    consignmentSignals: -10
  }
}
```

#### Recommending Artworks for Client

```typescript
const recommendations = getLikelyArtworksForClient("client-1", limit: 10)
// Returns: ArtworkRecommendation[]
```

**Scoring Factors (weighted):**
1. **Artist Alignment (30%)** - Artist preference match
2. **Category Alignment (20%)** - Category preference match
3. **Price Fit (20%)** - Price within range (adjusted for price sensitivity)
4. **Similar Purchases (15%)** - Similarity to past acquisitions
5. **Recent Engagement (10%)** - Recent views of similar works
6. **Profile Alignment (5%)** - Risk tolerance, institutional quality, etc.

### 4. UI Components

#### ClientList (`src/components/ClientList.tsx`)
- Filterable list of all clients
- Search by name, email, location
- Filter by relationship status
- Shows key stats (purchases, last contact)

#### ClientDetail (`src/components/ClientDetail.tsx`)
- Comprehensive client view with tabs:
  - **Overview**: Structured profile + recommended artworks + notes
  - **Purchases**: Full purchase history
  - **Consignments**: All consignments with special attention to failed/incomplete
  - **Engagements**: Digital activity timeline
- Add notes feature (auto-parsed into structured profile)
- Inline artwork recommendations with explanations

## Chat System Integration

### Context-Aware Chat

The chat system understands the current context:

```typescript
interface ChatContext {
  type: "client" | "artwork" | "general"
  clientId?: string
  artworkId?: string
}
```

**Example User Interactions:**

1. **Client Context:**
   ```
   User: "Add a note that they backed out of consignment last Basel because
          they were nervous about pricing"

   AI: [Calls updateClientNotes()]
       "I've added that note. I've also updated their profile to reflect:
        - Price sensitivity: HIGH
        - Negotiation style: FLEXIBLE
        - Added tag: 'hesitant on consignment'"
   ```

2. **Artwork Context:**
   ```
   User: "Who are the top 5 clients likely to buy this work?"

   AI: [Calls getLikelyClientsForArtwork()]
       "Based on this Joan Mitchell painting, here are the top matches:
        1. Jane Chen (87% match) - Loves Mitchell, recently viewed similar...
        2. Robert Hartwell (82% match) - Established collector, budget fits...
        ..."
   ```

3. **General Context:**
   ```
   User: "Show me all clients who previously consigned but withdrew"

   AI: [Calls searchClients() + filters consignments]
       "I found 3 clients:
        - Michael Rostov: Withdrew Richter (reserve not met)
        - Sarah Kim: Withdrew at Basel (pricing nerves)
        - Marcus Webb: Sale failed (too fresh to market)"
   ```

### Chat Tools/Functions

The AI chat has access to these tools:

```typescript
const chatTools = [
  {
    name: "getClientById",
    description: "Get full client details",
    parameters: { clientId: "string" }
  },
  {
    name: "searchClients",
    description: "Search clients with filters",
    parameters: { filters: ClientFilters }
  },
  {
    name: "updateClientNotes",
    description: "Add note and parse into structured profile",
    parameters: { clientId: "string", note: "string" }
  },
  {
    name: "getClientHistory",
    description: "Get complete client history with analytics",
    parameters: { clientId: "string" }
  },
  {
    name: "getLikelyClientsForArtwork",
    description: "Recommend clients for an artwork",
    parameters: { artworkId: "string", limit: "number" }
  },
  {
    name: "getLikelyArtworksForClient",
    description: "Recommend artworks for a client",
    parameters: { clientId: "string", limit: "number" }
  },
  {
    name: "analyzeClientConsignmentBehavior",
    description: "Analyze client's consignment track record",
    parameters: { clientId: "string" }
  }
]
```

## Mock Data Highlights

The system includes rich simulated data (`src/data/crmMockData.ts`):

### Clients (8 total)

1. **Jane Chen** - Active VIP, fast decision maker, loves women artists
2. **Michael Rostov** - Institution, withdrew Richter consignment (reserve not met)
3. **Sarah Kim** - Young collector, backed out of Basel consignment (nervous)
4. **Robert & Diana Hartwell** - Established, successful consignment history
5. **Marcus Webb** - Tech entrepreneur, failed consignment attempt (flipping)
6. **Patricia Gould** - Detail-oriented lawyer, reliable consignor
7. **Morrison Museum** - Institutional buyer, committee approval required
8. **Alexander Petrov** - New collector, inquiry about consignment but never followed through

### Consignments (10 total)

Includes various statuses:
- **Successful** (sold_here): 3 consignments
- **Withdrawn**: 2 consignments (Rostov's Richter, Kim's Mehretu)
- **Sale Failed**: 1 consignment (Webb tried to flip too early)
- **Expired**: 1 consignment (Rostov's Kiefer, no buyer found)
- **On Hold**: 1 consignment (Kim, still deciding)
- **Enquiry**: 1 consignment (Petrov, never followed up)

### Artworks (8 total)

Mix of primary and secondary market works from blue-chip to established artists, ranging from $420K to $3.2M.

### Engagements (15 total)

Various types: email opens, viewing room views, fair visits, artwork detail clicks, Instagram interactions.

## Running the System

### Setup

```bash
cd gallery-proposal-mvp
npm install

# Set up environment
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env

# Run development server
npm run dev
```

This starts:
- Vite dev server on `http://localhost:5173`
- Express proxy server on `http://localhost:3001`

### Using the System

1. **View Clients**: Navigate to client list, filter/search
2. **View Client Detail**: Click a client to see full profile
3. **See Recommendations**: View recommended artworks for each client
4. **Add Notes**: Add free-text notes, see them parsed into structured profile
5. **Track Consignments**: Review consignment history including failures
6. **Chat Interface**: Ask questions about clients, get recommendations

## Extension Points for Production

### 1. Replace Mock Data with Database

```typescript
// Current: In-memory arrays
let clientsData = [...clients]

// Production: Replace with database queries
import { db } from './database'

export async function getClientById(id: string): Promise<Client | undefined> {
  return await db.clients.findUnique({ where: { id } })
}
```

### 2. Upgrade Notes Parsing to LLM

```typescript
// Current: Keyword-based
export function parseClientNotesToProfile(text: string): ParsedProfileUpdate {
  // Keyword matching logic
}

// Production: Use LLM
export async function parseClientNotesToProfileWithLLM(
  text: string
): Promise<ParsedProfileUpdate> {
  const response = await callClaudeAPI({
    systemPrompt: "Extract structured profile attributes from this note...",
    message: text,
    response_format: { type: "json_object" }
  })
  return JSON.parse(response.content[0].text)
}
```

### 3. Add Real-Time Engagement Tracking

```typescript
// Track when clients view artworks
export function trackEngagement(
  clientId: string,
  type: EngagementType,
  metadata: any
) {
  const engagement = {
    id: generateId(),
    clientId,
    type,
    timestamp: new Date().toISOString(),
    metadata
  }

  // In production: Send to analytics service
  await analytics.track(engagement)

  // Update client engagement score in real-time
  updateClientEngagementScore(clientId)
}
```

### 4. ML-Enhanced Recommendations

```typescript
// Current: Rule-based scoring
function scoreClientForArtwork(client: Client, artwork: Artwork) {
  // Manual weighting and scoring
}

// Production: Hybrid approach
async function scoreClientForArtwork(
  client: Client,
  artwork: Artwork
) {
  // Get rule-based score
  const ruleScore = calculateRuleBasedScore(client, artwork)

  // Get ML model prediction
  const mlScore = await mlModel.predict({
    clientFeatures: extractClientFeatures(client),
    artworkFeatures: extractArtworkFeatures(artwork),
    historicalData: getRelevantHistory(client, artwork)
  })

  // Combine scores (e.g., weighted average)
  return {
    total: ruleScore * 0.4 + mlScore * 0.6,
    explainability: generateExplanation(ruleScore, mlScore)
  }
}
```

### 5. Email Integration

```typescript
// Auto-generate personalized emails
export async function generateProposalEmail(
  clientId: string,
  artworkIds: string[]
) {
  const client = await getClientById(clientId)
  const artworks = await Promise.all(artworkIds.map(getArtworkById))
  const recommendations = await getLikelyArtworksForClient(clientId)

  const emailContent = await callClaudeAPI({
    systemPrompt: `Generate a personalized email proposing these artworks to ${client.name}.
                   Consider their profile: ${JSON.stringify(client.structuredProfile)}`,
    message: `Artworks: ${artworks.map(a => `${a.artistName} - ${a.title}`).join(', ')}`
  })

  return {
    to: client.email,
    subject: `Artwork Recommendation for ${client.name}`,
    body: emailContent,
    attachments: [await generateProposalPDF(artworkIds)]
  }
}
```

## Key Design Principles

1. **Consignment Tracking is First-Class**
   - Not all consignments succeed - the system tracks this explicitly
   - Failure reasons are captured for learning and relationship management
   - Consignment behavior factors into recommendations

2. **Structured Profiles from Unstructured Notes**
   - Gallery staff write natural notes
   - System automatically extracts structured data
   - Clear path to LLM upgrade for sophisticated extraction

3. **Multi-Signal Recommendations**
   - Combines preferences, behavior, history, and profile
   - Explainable scoring with factor breakdown
   - Accounts for negative signals (withdrawals, failures)

4. **Context-Aware Chat**
   - Understands what client/artwork is being discussed
   - Can call backend functions as tools
   - Provides intelligent, data-backed responses

5. **Production-Ready Architecture**
   - Clean separation of concerns
   - Type-safe throughout
   - Clear extension points for scaling

## Summary

This system provides a complete foundation for an AI-powered gallery CRM with:
- ✅ Comprehensive client management with auto-parsed profiles
- ✅ Full consignment tracking including incomplete/failed attempts
- ✅ Sophisticated recommendation engine
- ✅ Digital engagement monitoring
- ✅ Context-aware chat interface
- ✅ Rich mock data for realistic demo
- ✅ Clear path to production with real database, LLM, and ML

All code is executable, well-typed, and designed for easy extension.
