/**
 * Client Notes Parser
 *
 * This module parses free-text notes about clients into structured profile attributes.
 * In production, this would use an LLM for sophisticated parsing.
 * For this MVP, we use keyword-based rules with clear extension points for LLM integration.
 */

import type { Client, ParsedProfileUpdate, StructuredProfile } from '../types'

// ============================================================================
// KEYWORD MAPPINGS FOR RULE-BASED PARSING
// ============================================================================

const RISK_TOLERANCE_KEYWORDS = {
  high: ['adventurous', 'risk-taking', 'emerging artists', 'speculative', 'unproven', 'experimental'],
  medium: ['balanced', 'mid-career', 'established but not blue-chip', 'some risk'],
  low: ['conservative', 'blue-chip', 'safe', 'museum-quality', 'proven', 'established only']
}

const NEGOTIATION_STYLE_KEYWORDS = {
  hard: ['always negotiates', 'asks for discount', 'price-sensitive', 'tough negotiator', 'never pays asking'],
  flexible: ['reasonable', 'fair', 'open to discussion', 'willing to negotiate', 'flexible on terms'],
  discreet: ['private', 'confidential', 'discreet', 'quiet', 'under the radar'],
  institutional: ['committee', 'board approval', 'formal process', 'institutional', 'protocol']
}

const DECISION_SPEED_KEYWORDS = {
  fast: ['quick', 'immediate', 'decisive', 'within 48 hours', 'impulsive', 'moves fast', 'doesn\'t hesitate'],
  slow: ['methodical', 'takes time', 'deliberate', 'careful', 'researches extensively', 'slow to decide'],
  committee: ['committee', 'board', 'group decision', 'multiple stakeholders', 'consensus']
}

const PRICE_SENSITIVITY_KEYWORDS = {
  high: ['price-sensitive', 'budget-conscious', 'asks for discounts', 'value-focused', 'concerned about price'],
  medium: ['reasonable about pricing', 'considers value', 'balanced approach to price'],
  low: ['price not an issue', 'doesn\'t negotiate', 'willing to pay premium', 'unconcerned about price']
}

const RELATIONSHIP_STATUS_KEYWORDS = {
  prospect: ['new lead', 'potential client', 'first contact', 'prospect'],
  active: ['active', 'regular buyer', 'current client', 'engaged'],
  dormant: ['inactive', 'dormant', 'haven\'t heard from', 'lapsed', 'quiet recently'],
  institution: ['museum', 'foundation', 'institutional', 'non-profit'],
  VIP: ['VIP', 'major collector', 'high-value', 'top tier', 'platinum']
}

const INTEREST_KEYWORDS = [
  'abstract expressionism',
  'color field',
  'minimalism',
  'contemporary',
  'postwar',
  'european art',
  'american art',
  'women artists',
  'female artists',
  'geometric abstraction',
  'gestural painting',
  'museum quality',
  'emerging artists',
  'blue chip',
  'monumental scale',
  'works on paper',
  'photography',
  'sculpture'
]

const FAIR_KEYWORDS = [
  'Art Basel Miami Beach',
  'Art Basel Basel',
  'Art Basel Hong Kong',
  'Frieze New York',
  'Frieze London',
  'Frieze LA',
  'TEFAF Maastricht',
  'ADAA Art Show',
  'Armory Show',
  'FIAC'
]

// ============================================================================
// PARSING FUNCTIONS
// ============================================================================

/**
 * Parse free-text notes into structured profile updates
 * In production: This would call an LLM with a structured output schema
 */
export function parseClientNotesToProfile(noteText: string): ParsedProfileUpdate {
  const lowerText = noteText.toLowerCase()
  const update: ParsedProfileUpdate = {}

  // Parse risk tolerance
  for (const [level, keywords] of Object.entries(RISK_TOLERANCE_KEYWORDS)) {
    if (keywords.some(kw => lowerText.includes(kw.toLowerCase()))) {
      update.riskTolerance = level as any
      break
    }
  }

  // Parse negotiation style
  for (const [style, keywords] of Object.entries(NEGOTIATION_STYLE_KEYWORDS)) {
    if (keywords.some(kw => lowerText.includes(kw.toLowerCase()))) {
      update.negotiationStyle = style as any
      break
    }
  }

  // Parse decision speed
  for (const [speed, keywords] of Object.entries(DECISION_SPEED_KEYWORDS)) {
    if (keywords.some(kw => lowerText.includes(kw.toLowerCase()))) {
      update.decisionSpeed = speed as any
      break
    }
  }

  // Parse price sensitivity
  for (const [sensitivity, keywords] of Object.entries(PRICE_SENSITIVITY_KEYWORDS)) {
    if (keywords.some(kw => lowerText.includes(kw.toLowerCase()))) {
      update.priceSensitivity = sensitivity as any
      break
    }
  }

  // Parse relationship status
  for (const [status, keywords] of Object.entries(RELATIONSHIP_STATUS_KEYWORDS)) {
    if (keywords.some(kw => lowerText.includes(kw.toLowerCase()))) {
      update.relationshipStatus = status as any
      break
    }
  }

  // Parse interests (accumulate all matches)
  update.interests = INTEREST_KEYWORDS.filter(interest =>
    lowerText.includes(interest.toLowerCase())
  )

  // Parse preferred fairs
  update.preferredFairs = FAIR_KEYWORDS.filter(fair =>
    lowerText.includes(fair.toLowerCase())
  )

  // Parse tags
  const tags: string[] = []
  if (lowerText.includes('vip') || lowerText.includes('major collector')) {
    tags.push('VIP')
  }
  if (lowerText.includes('new collector') || lowerText.includes('first purchase')) {
    tags.push('new collector')
  }
  if (lowerText.includes('institution') || lowerText.includes('museum')) {
    tags.push('institution')
  }
  if (lowerText.includes('detail-oriented') || lowerText.includes('asks many questions')) {
    tags.push('detail-oriented')
  }
  if (lowerText.includes('impulsive') || lowerText.includes('spontaneous')) {
    tags.push('impulsive')
  }
  if (lowerText.includes('corporate') || lowerText.includes('office')) {
    tags.push('corporate')
  }
  update.tags = tags

  return update
}

/**
 * Apply parsed profile update to existing client profile
 * Merges new data with existing, accumulating arrays and updating single values
 */
export function applyParsedProfileUpdate(
  client: Client,
  update: ParsedProfileUpdate
): Client {
  const updatedClient = { ...client }
  const updatedProfile: StructuredProfile = { ...client.structuredProfile }

  // Update single-value fields (override)
  if (update.riskTolerance) {
    updatedProfile.riskTolerance = update.riskTolerance
  }
  if (update.negotiationStyle) {
    updatedProfile.negotiationStyle = update.negotiationStyle
  }
  if (update.decisionSpeed) {
    updatedProfile.decisionSpeed = update.decisionSpeed
  }
  if (update.priceSensitivity) {
    updatedProfile.priceSensitivity = update.priceSensitivity
  }
  if (update.relationshipStatus) {
    updatedProfile.relationshipStatus = update.relationshipStatus
  }
  if (update.communicationPreference) {
    updatedProfile.communicationPreference = update.communicationPreference
  }

  // Update array fields (accumulate unique values)
  if (update.interests && update.interests.length > 0) {
    updatedProfile.interests = Array.from(new Set([
      ...updatedProfile.interests,
      ...update.interests
    ]))
  }

  if (update.preferredFairs && update.preferredFairs.length > 0) {
    updatedProfile.preferredFairs = Array.from(new Set([
      ...updatedProfile.preferredFairs,
      ...update.preferredFairs
    ]))
  }

  // Update tags (accumulate unique values)
  if (update.tags && update.tags.length > 0) {
    updatedClient.tags = Array.from(new Set([
      ...updatedClient.tags,
      ...update.tags
    ]))
  }

  // Set last updated timestamp
  updatedProfile.lastUpdated = new Date().toISOString()

  updatedClient.structuredProfile = updatedProfile
  return updatedClient
}

/**
 * Main function to update client from free-text note
 * This is what the API would call
 */
export function updateClientFromFreeTextNote(
  client: Client,
  newNote: string
): Client {
  // Append note to existing notes
  const updatedNotes = client.notes
    ? `${client.notes}\n\n[${new Date().toISOString().split('T')[0]}] ${newNote}`
    : newNote

  // Parse the new note
  const profileUpdate = parseClientNotesToProfile(newNote)

  // Apply updates
  let updatedClient = { ...client, notes: updatedNotes }
  updatedClient = applyParsedProfileUpdate(updatedClient, profileUpdate)

  // Update last contact date
  updatedClient.lastContactDate = new Date().toISOString()

  return updatedClient
}

// ============================================================================
// LLM-BASED PARSING (Production Implementation)
// ============================================================================

/**
 * PRODUCTION VERSION: Use LLM for sophisticated parsing
 *
 * This function would replace parseClientNotesToProfile in production.
 * Example implementation using Claude with structured output:
 */
export async function parseClientNotesToProfileWithLLM(
  noteText: string
): Promise<ParsedProfileUpdate> {
  // PSEUDO-CODE for production implementation
  /*
  const response = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemPrompt: `You are a gallery CRM assistant. Parse the following note about a client
into structured profile attributes. Extract:
- Risk tolerance (low/medium/high)
- Negotiation style (hard/flexible/discreet/institutional)
- Decision speed (fast/slow/committee)
- Interests (array of art-related keywords)
- Preferred fairs (array of art fair names)
- Relationship status (prospect/active/dormant/institution/VIP)
- Price sensitivity (high/medium/low)
- Relevant tags

Return as JSON matching the ParsedProfileUpdate interface.`,
      message: noteText,
      response_format: { type: "json_object" }
    })
  })

  const data = await response.json()
  return JSON.parse(data.content[0].text) as ParsedProfileUpdate
  */

  // For now, fall back to keyword-based parsing
  return parseClientNotesToProfile(noteText)
}

/**
 * Extract artist mentions from notes
 */
export function extractArtistMentions(noteText: string): string[] {
  const artists: string[] = []
  const lowerText = noteText.toLowerCase()

  // Common artist name patterns
  // In production, would use entity recognition via LLM
  const artistPatterns = [
    /\b([A-Z][a-z]+ [A-Z][a-z]+)\b/g, // "Joan Mitchell" pattern
  ]

  for (const pattern of artistPatterns) {
    const matches = noteText.match(pattern)
    if (matches) {
      artists.push(...matches)
    }
  }

  return Array.from(new Set(artists))
}

/**
 * Extract price mentions from notes
 */
export function extractPriceMentions(noteText: string): number[] {
  const prices: number[] = []

  // Match currency amounts like $500,000 or $1.5M
  const pricePattern = /\$(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(k|K|m|M)?/g

  let match
  while ((match = pricePattern.exec(noteText)) !== null) {
    let amount = parseFloat(match[1].replace(/,/g, ''))
    const multiplier = match[2]?.toLowerCase()

    if (multiplier === 'k') amount *= 1000
    if (multiplier === 'm') amount *= 1000000

    prices.push(amount)
  }

  return prices
}

/**
 * Generate summary of parsed updates (for display to user)
 */
export function summarizeParsedUpdates(update: ParsedProfileUpdate): string {
  const changes: string[] = []

  if (update.riskTolerance) {
    changes.push(`Risk tolerance: ${update.riskTolerance}`)
  }
  if (update.negotiationStyle) {
    changes.push(`Negotiation style: ${update.negotiationStyle}`)
  }
  if (update.decisionSpeed) {
    changes.push(`Decision speed: ${update.decisionSpeed}`)
  }
  if (update.priceSensitivity) {
    changes.push(`Price sensitivity: ${update.priceSensitivity}`)
  }
  if (update.relationshipStatus) {
    changes.push(`Relationship status: ${update.relationshipStatus}`)
  }
  if (update.interests && update.interests.length > 0) {
    changes.push(`Interests: ${update.interests.join(', ')}`)
  }
  if (update.preferredFairs && update.preferredFairs.length > 0) {
    changes.push(`Preferred fairs: ${update.preferredFairs.join(', ')}`)
  }
  if (update.tags && update.tags.length > 0) {
    changes.push(`Tags: ${update.tags.join(', ')}`)
  }

  if (changes.length === 0) {
    return 'No structured attributes detected in note.'
  }

  return `Detected attributes:\n- ${changes.join('\n- ')}`
}
