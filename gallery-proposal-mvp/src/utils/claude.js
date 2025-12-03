import { artworks, client, galleryInfo } from '../data/mockData'
import { formatPriceFull } from './formatters'

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY

// Build dynamic system prompt with current state
function buildSystemPrompt(selectedArtworkIds, screenMode) {
  const selectedWorks = artworks.filter(a => selectedArtworkIds.includes(a.id))
  const selectedNames = selectedWorks
    .map(a => `${a.artist} - "${a.title}"`)
    .join(', ') || 'None'

  const totalValue = selectedWorks.reduce((sum, a) => sum + a.price, 0)

  return `You are a professional gallery assistant at ${galleryInfo.name} helping to create an artwork proposal for ${client.name}.

CLIENT INFORMATION:
Name: ${client.name}
Email: ${client.email}
Location: ${client.location}
Collection Interests: ${client.interests.join(', ')}
Budget Range: ${formatPriceFull(client.budgetMin)} - ${formatPriceFull(client.budgetMax)}
Occasion: ${client.occasion}
Notes: ${client.notes}

AVAILABLE ARTWORKS (8 total):
${artworks.map(a => `- ${a.artist} - "${a.title}" (${a.year}) - ${formatPriceFull(a.price)} (${a.market}, ${a.medium})`).join('\n')}

CURRENT SELECTION:
Selected artworks: ${selectedNames}
Total proposal value: ${formatPriceFull(totalValue)}
Screen mode: ${screenMode}

YOUR CAPABILITIES:
- Recommend artworks based on ${client.name}'s interests, budget, and space
- Add/remove artworks when user requests
- Provide context about artists, movements, and market positioning
- Answer questions about specific artworks
- Suggest complementary pairings

CONVERSATION GUIDELINES:
1. Be concise (2-3 sentences per response, maximum)
2. Always mention the price when adding artworks
3. Show running total after changes
4. Note when selections exceed budget (but don't discourage high-value works)
5. Highlight connections to client interests
6. Use natural, professional language
7. Don't make up information not provided above

COMMANDS YOU UNDERSTAND:
- "add [artist name]" or specific requests → Add to proposal
- "remove [artist name]" → Remove from proposal
- "preview" or "show me" or "let's review" → Acknowledge the preview mode
- "export" or "download" or "generate PDF" → Acknowledge export is available
- Questions about artworks, prices, artists → Provide informative answers

Remember: You're facilitating a professional proposal creation process. Be helpful, knowledgeable, and efficient.`
}

// Parse Claude response to detect artwork selections/removals
export function parseArtworkCommands(response, currentSelectedIds) {
  const commands = {
    add: [],
    remove: [],
    export: false
  }

  const lowerResponse = response.toLowerCase()

  // Check for export command
  if (lowerResponse.includes('export') || lowerResponse.includes('download') || lowerResponse.includes('pdf')) {
    commands.export = true
  }

  // Look for artist names in response (case-insensitive)
  for (const artwork of artworks) {
    const artistLower = artwork.artist.toLowerCase()
    const titleLower = artwork.title.toLowerCase()

    // Check if this artwork should be added
    if ((lowerResponse.includes(`add`) || lowerResponse.includes(`adding`)) &&
        (lowerResponse.includes(artistLower) || lowerResponse.includes(titleLower))) {
      if (!currentSelectedIds.includes(artwork.id)) {
        commands.add.push(artwork.id)
      }
    }

    // Check if this artwork should be removed
    if ((lowerResponse.includes(`remov`) || lowerResponse.includes(`without`)) &&
        (lowerResponse.includes(artistLower) || lowerResponse.includes(titleLower))) {
      if (currentSelectedIds.includes(artwork.id)) {
        commands.remove.push(artwork.id)
      }
    }
  }

  return commands
}

// Main function to call Claude API via local proxy server
export async function callClaudeAPI(userMessage, selectedArtworkIds, screenMode) {
  const systemPrompt = buildSystemPrompt(selectedArtworkIds, screenMode)

  try {
    const response = await fetch('http://localhost:3001/api/claude', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: userMessage,
        selectedIds: selectedArtworkIds,
        screenMode: screenMode,
        systemPrompt: systemPrompt
      })
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Claude API error:', error)
      throw new Error(error.error?.message || 'Failed to get response from Claude')
    }

    const data = await response.json()
    const aiResponse = data.content[0].text

    return {
      text: aiResponse,
      commands: parseArtworkCommands(aiResponse, selectedArtworkIds)
    }
  } catch (error) {
    console.error('Error calling Claude API:', error)
    throw error
  }
}
