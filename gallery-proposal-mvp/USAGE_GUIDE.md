## Gallery CRM System - Usage Guide

This guide shows you how to use the key features of the expanded gallery CRM system.

## Quick Start

```bash
cd gallery-proposal-mvp
npm install
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
npm run dev
```

Open http://localhost:5173 in your browser.

## Using the API Functions

### Example 1: Get Client with Full History

```typescript
import { getClientHistory } from './src/api/crmApi'

const history = getClientHistory('client-2') // Michael Rostov

console.log(history)
// {
//   client: { name: "Michael Rostov", ... },
//   engagements: [...],
//   purchases: [...],
//   consignments: [...],
//   summary: {
//     totalPurchases: 0,
//     totalSpent: 0,
//     totalEngagements: 2,
//     totalConsignments: 2,
//     successfulConsignments: 0,
//     failedConsignments: 2  // ← Note: withdrew Richter, Kiefer expired
//   }
// }
```

### Example 2: Find Best Clients for an Artwork

```typescript
import { getLikelyClientsForArtwork } from './src/api/recommendationEngine'

const artwork = getArtworkById('artwork-4') // Joan Mitchell painting
const recommendations = getLikelyClientsForArtwork('artwork-4', 5)

recommendations.forEach(rec => {
  console.log(`${rec.client.name}: ${rec.score.toFixed(1)}% match`)
  console.log(`  → ${rec.explanation}`)
  console.log(`  Factors:`, rec.matchFactors)
})

// Output:
// Jane Chen: 87.5% match
//   → Strong interest in Joan Mitchell (preferred artist) • Collects painting •
//     Price ($1.2M) fits budget range perfectly • Highly engaged recently •
//     Has purchased similar works before
//   Factors: {
//     artistAlignment: 100,
//     categoryAlignment: 100,
//     priceFit: 95,
//     engagementScore: 80,
//     purchaseHistory: 60,
//     consignmentSignals: 0
//   }
```

### Example 3: Update Client Notes with Auto-Parsing

```typescript
import { updateClientNotes } from './src/api/crmApi'

const note = `Met with Sarah at Art Basel. She's very price-sensitive and always
asks for discounts. Loves contemporary female artists, especially Julie Mehretu.
She's a fast decision maker when she likes something. She backed out of consigning
a work last year because she got nervous about market timing.`

const updatedClient = updateClientNotes('client-3', note)

console.log('Updated profile:', updatedClient.structuredProfile)
// {
//   priceSensitivity: "high",           // ← Parsed from "price-sensitive"
//   negotiationStyle: "hard",           // ← Parsed from "asks for discounts"
//   decisionSpeed: "fast",              // ← Parsed from "fast decision maker"
//   interests: [
//     "contemporary art",
//     "female artists",
//     ...
//   ]
// }

console.log('New tags:', updatedClient.tags)
// ["young collector", "contemporary focus", "hesitant on consignment"]
```

### Example 4: Analyze Consignment Behavior

```typescript
import { analyzeClientConsignmentBehavior } from './src/api/crmApi'

const analysis = analyzeClientConsignmentBehavior('client-2') // Michael Rostov

console.log(analysis)
// {
//   totalConsignments: 2,
//   successful: 0,
//   failed: 2,
//   active: 0,
//   reliability: "low",              // ← Low reliability due to failures
//   hasWithdrawals: true,             // ← Withdrew Richter
//   hasExpired: true,                 // ← Kiefer consignment expired
//   hasSaleFailed: false
// }

// This affects recommendations:
const recs = getLikelyClientsForArtwork('artwork-6') // Another Richter
// Michael Rostov will have negative consignmentSignals score
```

### Example 5: Search Clients with Filters

```typescript
import { searchClients } from './src/api/crmApi'

// Find all VIP clients who like Joan Mitchell
const vipMitchellCollectors = searchClients({
  tags: ['VIP'],
  preferredArtist: 'Joan Mitchell'
})

// Find active clients in New York with budget over $500k
const highValueNY = searchClients({
  location: 'New York',
  relationshipStatus: 'active',
  priceBandMin: 500000
})

// Find institutions
const institutions = searchClients({
  relationshipStatus: 'institution'
})
```

### Example 6: Get Recommended Artworks for a Client

```typescript
import { getLikelyArtworksForClient } from './src/api/recommendationEngine'

const recommendations = getLikelyArtworksForClient('client-1', 10) // Jane Chen

recommendations.forEach(rec => {
  const artwork = rec.artwork
  console.log(`
${artwork.artistName} - "${artwork.title}" (${artwork.year})
Price: ${formatPrice(artwork.currentAskingPrice)}
Match Score: ${rec.score.toFixed(1)}%

Explanation: ${rec.explanation}

Match Factors:
  - Artist alignment: ${rec.matchFactors.artistAlignment}
  - Category alignment: ${rec.matchFactors.categoryAlignment}
  - Price fit: ${rec.matchFactors.priceFit}
  - Similar purchases: ${rec.matchFactors.similarPurchases}
  - Recent engagement: ${rec.matchFactors.recentEngagement}
  - Profile alignment: ${rec.matchFactors.profileAlignment}
  `)
})
```

## UI Component Usage

### Using ClientList

```tsx
import ClientList from './src/components/ClientList'
import { getAllClients } from './src/api/crmApi'

function App() {
  const [selectedClientId, setSelectedClientId] = useState<string>()
  const clients = getAllClients()

  return (
    <ClientList
      clients={clients}
      onSelectClient={setSelectedClientId}
      selectedClientId={selectedClientId}
    />
  )
}
```

### Using ClientDetail

```tsx
import ClientDetail from './src/components/ClientDetail'
import { getClientById, updateClientNotes } from './src/api/crmApi'
import { getLikelyArtworksForClient } from './src/api/recommendationEngine'

function App() {
  const [clientId, setClientId] = useState('client-1')

  const client = getClientById(clientId)
  const recommendations = getLikelyArtworksForClient(clientId, 10)

  const handleUpdateNotes = (newNote: string) => {
    const updated = updateClientNotes(clientId, newNote)
    // Re-render with updated client
  }

  const handleSelectArtwork = (artworkId: string) => {
    // Navigate to artwork detail
  }

  return (
    <ClientDetail
      client={client}
      recommendations={recommendations}
      onUpdateNotes={handleUpdateNotes}
      onSelectArtwork={handleSelectArtwork}
    />
  )
}
```

## Chat Interface Examples

### Example Chat Flows

#### Flow 1: Client Analysis
```
Context: Client Detail view for Sarah Kim (client-3)

User: "Summarize this client's collecting and consignment history"

AI: [Calls getClientHistory('client-3')]
    "Sarah Kim is an emerging collector who:

    Collecting History:
    - No purchases yet through our gallery
    - Recently engaged with Julie Mehretu and Cecily Brown works
    - Budget range: $100K - $800K
    - Focuses on contemporary female artists

    Consignment History:
    - 2 consignment attempts, both incomplete:
      1. Withdrew Julie Mehretu work before Art Basel (Nov 2023)
         Reason: Got nervous about pricing and market timing
      2. Currently on hold with Joan Mitchell work (Sept 2024)
         Status: Deciding if she really wants to sell

    Profile Insights:
    - Price sensitivity: MEDIUM
    - Decision speed: SLOW (needs time to think)
    - Negotiation style: FLEXIBLE
    - Risk tolerance: MEDIUM

    Recommendation: Sarah shows genuine interest but needs confidence building.
    Suggest starting with viewing works rather than purchasing. Her consignment
    hesitancy indicates she may need more education about market conditions."
```

#### Flow 2: Adding Notes with Auto-Parsing
```
Context: Client Detail view for Marcus Webb (client-5)

User: "Add a note that he's very impulsive, always wants to negotiate 10% off,
       and is interested in monumental works for his new Seattle office building"

AI: [Calls updateClientNotes('client-5', note)]
    "I've added your note to Marcus Webb's profile. Based on this note, I've also
     updated his structured profile:

     Profile Updates:
     ✓ Negotiation style: HARD (from 'wants to negotiate')
     ✓ Decision speed: FAST (from 'impulsive')
     ✓ Interests added: 'monumental scale', 'corporate collection'
     ✓ Tags added: 'impulsive', 'corporate'

     Current Profile:
     - Risk tolerance: HIGH
     - Price sensitivity: HIGH
     - Budget: $200K - $1.2M
     - Prefers: Large-scale contemporary works

     Next Steps:
     Given his interest in monumental works and corporate setting, I recommend
     showing him:
     1. Anselm Kiefer 'Ash Flower' (280×380cm, $420K)
     2. Julie Mehretu 'Conjured Parts' (213×274cm, $850K)

     Note: Expect him to negotiate on price - build that into your initial offer."
```

#### Flow 3: Finding Clients for an Artwork
```
Context: Artwork Detail view for Gerhard Richter abstract (artwork-6)

User: "Who should I propose this Richter to? And has anyone consigned similar works?"

AI: [Calls getLikelyClientsForArtwork('artwork-6') + analyzes consignments]
    "Top 5 clients for this Gerhard Richter 'Abstraktes Bild' ($3.2M):

    1. Michael Rostov (78% match) - CAUTION
       ✓ Institution with focus on German art
       ✓ Budget fits ($500K - $5M range)
       ✓ Committee approval required (2-3 weeks)
       ⚠️ Previously consigned a Richter but WITHDREW due to reserve not met
       → Recommendation: Approach carefully. He may be interested but was
         burned on pricing before. Provide strong comparables.

    2. Morrison Museum (72% match)
       ✓ Institutional buyer, museum quality focus
       ✓ High budget capacity
       ⚠️ Board approval required (3-6 months)
       → Recommendation: Good fit but long timeline.

    3. Robert & Diana Hartwell (68% match)
       ✓ Established collectors, blue-chip focus
       ✓ Previously SUCCESSFULLY consigned works
       ✓ Budget: $400K - $2.5M (this is slightly above)
       → Recommendation: Slightly over their typical range but worth proposing
         given their appreciation for museum-quality works.

    Consignment History Note:
    Michael Rostov previously tried to consign a different Richter abstract
    (June 2024) but withdrew after the reserve ($3.2M) wasn't met at auction.
    This experience may make him more cautious about pricing. Suggest
    positioning this work with very strong comparables and conservative
    pricing strategy."
```

#### Flow 4: Failed Consignment Analysis
```
Context: General view

User: "Show me all clients who backed out of consignments and why"

AI: [Searches consignments with status = withdrawn/expired/sale_failed]
    "Here are all clients with incomplete consignments:

    1. Michael Rostov (Institution) - 2 failed consignments

       a) Gerhard Richter abstract - WITHDRAWN (June-Aug 2024)
          Target: $3.5M, Reserve: $3.2M
          Outcome: Reserve not met at Christie's evening sale
          Notes: Market for Richter abstracts softened in H2 2024
          Client Status: Understanding but disappointed

       b) Anselm Kiefer - EXPIRED (Mar 2023 - Mar 2024)
          Target: $480K, Reserve: $420K
          Outcome: 12-month consignment expired without finding buyer
          Notes: Limited market for Kiefer at this level during that period
          Client Status: Patient throughout, decided to keep work

       Profile: Low risk tolerance, price-sensitive, committee decisions
       Recommendation: Future consignments should have very conservative
                      reserves and strong pre-marketing

    2. Sarah Kim (Young Collector) - 2 incomplete consignments

       a) Julie Mehretu - WITHDRAWN (Nov-Dec 2023)
          Target: $450K
          Outcome: Got nervous about market timing, withdrew before Basel
          Notes: First-time consignor anxiety
          Client Status: Need to rebuild confidence

       b) Joan Mitchell - ON HOLD (Sept 2024 - present)
          Target: $550K, Reserve: $480K
          Outcome: Active but client asked to pause while deciding
          Notes: Second attempt, more confident but still hesitant
          Client Status: Being patient with her process

       Profile: Medium risk tolerance, emerging collector
       Recommendation: Needs education and confidence building

    3. Marcus Webb (Tech Entrepreneur) - 1 failed consignment

       a) Anselm Kiefer - SALE FAILED (Oct 2023 - Jan 2024)
          Target: $480K, Reserve: $420K
          Outcome: Work too fresh to market (bought only 6 months prior)
          Notes: Client wanted quick flip, market doesn't support this
          Client Status: Relationship strained

       Profile: High risk taker, impulsive
       Recommendation: Set clear expectations about timing on future purchases

    Pattern Analysis:
    - Institutions (Rostov): Realistic about process but need conservative pricing
    - Emerging collectors (Kim): Need confidence and education
    - Flippers (Webb): Need education about market norms

    Overall consignment success rate: 30% (3 successful / 10 total)"
```

## Real-World Workflow Examples

### Workflow 1: Preparing for Art Basel

```typescript
// 1. Find all VIP and active clients
const baselClients = searchClients({
  relationshipStatus: ['VIP', 'active']
})

// 2. For each client, get top artwork recommendations
const proposals = baselClients.map(client => {
  const artworks = getLikelyArtworksForClient(client.id, 5)
  return {
    client,
    recommendedArtworks: artworks,
    // Generate personalized email
    emailSubject: `Exclusive Basel Preview for ${client.name}`,
    emailBody: generateProposalEmail(client, artworks)
  }
})

// 3. Identify clients who previously backed out of consignments
const cautionClients = proposals.filter(p => {
  const behavior = analyzeClientConsignmentBehavior(p.client.id)
  return behavior.hasWithdrawals || behavior.hasSaleFailed
})

// 4. Flag these for extra care
cautionClients.forEach(p => {
  console.log(`⚠️ ${p.client.name}: Handle with care due to previous consignment issues`)
})
```

### Workflow 2: Quarterly Client Review

```typescript
// Get all clients with recent activity
const recentlyActive = getAllClients().filter(client => {
  const score = getClientEngagementScore(client.id)
  return score > 50
})

// Analyze each client
recentlyActive.forEach(client => {
  const history = getClientHistory(client.id)
  const ltv = getClientLifetimeValue(client.id)
  const recommendations = getLikelyArtworksForClient(client.id, 3)

  console.log(`
${client.name}
  Status: ${client.structuredProfile.relationshipStatus}
  LTV: ${formatPrice(ltv)}
  Engagement Score: ${getClientEngagementScore(client.id)}
  Purchases this year: ${history.summary.totalPurchases}
  Top recommendations: ${recommendations.map(r => r.artwork.artistName).join(', ')}
  `)
})
```

### Workflow 3: New Artwork Acquisition - Find Buyers

```typescript
// New artwork just acquired
const newArtwork = {
  id: 'artwork-new',
  artistName: 'Julie Mehretu',
  title: 'New Work',
  currentAskingPrice: 950000,
  category: 'painting',
  // ... other fields
}

// Find best matches
const matches = getLikelyClientsForArtwork(newArtwork.id, 10)

// Segment by likelihood
const hotLeads = matches.filter(m => m.score > 75)
const warmLeads = matches.filter(m => m.score >= 50 && m.score <= 75)
const coldLeads = matches.filter(m => m.score < 50)

console.log(`
Hot Leads (${hotLeads.length}): ${hotLeads.map(m => m.client.name).join(', ')}
  → Send immediate personalized proposals

Warm Leads (${warmLeads.length}): ${warmLeads.map(m => m.client.name).join(', ')}
  → Include in next newsletter with feature

Cold Leads (${coldLeads.length}):
  → Add to general availability list
`)

// Check for any clients who might be hesitant based on history
matches.forEach(match => {
  const consignmentBehavior = analyzeClientConsignmentBehavior(match.client.id)
  if (consignmentBehavior.hasWithdrawals) {
    console.log(`⚠️ ${match.client.name}: Previously withdrew from consignment - approach thoughtfully`)
  }
})
```

## Testing the System

Run these tests to verify the system works:

```typescript
// Test 1: Verify data loaded
console.assert(getAllClients().length === 8, 'Should have 8 clients')
console.assert(getAllArtworks().length === 8, 'Should have 8 artworks')
console.assert(getAllConsignments().length === 10, 'Should have 10 consignments')

// Test 2: Verify notes parsing
const testNote = "Very price-sensitive, fast decision maker, loves abstract expressionism"
const parsed = parseClientNotesToProfile(testNote)
console.assert(parsed.priceSensitivity === 'high', 'Should detect high price sensitivity')
console.assert(parsed.decisionSpeed === 'fast', 'Should detect fast decision speed')
console.assert(parsed.interests.includes('abstract expressionism'), 'Should detect interest')

// Test 3: Verify recommendations
const recs = getLikelyClientsForArtwork('artwork-1') // Frankenthaler
console.assert(recs.length > 0, 'Should return recommendations')
console.assert(recs[0].score > 0, 'Should have positive scores')
console.assert(recs[0].explanation.length > 0, 'Should have explanations')

// Test 4: Verify consignment tracking
const failedConsignments = getFailedConsignments()
console.assert(failedConsignments.length === 4, 'Should have 4 failed consignments')

// Test 5: Verify client history
const history = getClientHistory('client-4') // Hartwells
console.assert(history.summary.successfulConsignments > 0, 'Should have successful consignments')
```

## Next Steps

1. **Integrate with Database**: Replace mock data with PostgreSQL/MongoDB
2. **Add Authentication**: Implement user roles (advisor, admin, etc.)
3. **Email Integration**: Connect to email service for automated outreach
4. **Advanced Analytics**: Build dashboard with charts and trends
5. **ML Models**: Train models on historical sales data
6. **Mobile App**: Create mobile interface for gallery staff

## Support

For questions or issues:
- Check ARCHITECTURE.md for technical details
- Review type definitions in src/types/index.ts
- Examine mock data in src/data/crmMockData.ts
