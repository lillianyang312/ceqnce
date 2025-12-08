import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { requireAuth } from '@/lib/auth'
import { GALLERY_SYSTEM_PROMPT } from '@/lib/llm/systemPrompt'
import {
  searchClients,
  searchObjects,
  searchExternalInventory,
  createOrUpdateDealFlow,
  updateDealFlowStage,
  createClientNote,
} from '@/lib/tools'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

const tools: Anthropic.Tool[] = [
  {
    name: 'searchClients',
    description: 'Search for clients based on interests, artists, budget, or type (BUYER/CONSIGNER)',
    input_schema: {
      type: 'object',
      properties: {
        interests: { type: 'string', description: 'Client interests or collecting focus' },
        artist: { type: 'string', description: 'Artist name' },
        budgetMin: { type: 'number', description: 'Minimum budget in USD' },
        budgetMax: { type: 'number', description: 'Maximum budget in USD' },
        typeTags: { type: 'string', description: 'BUYER or CONSIGNER' },
      },
    },
  },
  {
    name: 'searchObjects',
    description: 'Search gallery inventory for artworks',
    input_schema: {
      type: 'object',
      properties: {
        artist: { type: 'string', description: 'Artist name' },
        title: { type: 'string', description: 'Artwork title' },
        priceMin: { type: 'number', description: 'Minimum price in USD' },
        priceMax: { type: 'number', description: 'Maximum price in USD' },
        status: { type: 'string', description: 'AVAILABLE, ON_HOLD, SOLD, CONSIGNED' },
      },
    },
  },
  {
    name: 'searchExternalInventory',
    description: 'Search external inventory from other galleries and auction houses',
    input_schema: {
      type: 'object',
      properties: {
        artist: { type: 'string', description: 'Artist name' },
        objectTitle: { type: 'string', description: 'Artwork title' },
      },
    },
  },
  {
    name: 'createOrUpdateDealFlow',
    description: 'Create or update a deal flow (OBJECT_SALE, CLIENT_REQUEST, or CONSIGNMENT)',
    input_schema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Deal flow ID (for updates)' },
        type: { type: 'string', description: 'OBJECT_SALE, CLIENT_REQUEST, or CONSIGNMENT' },
        title: { type: 'string', description: 'Deal flow title' },
        description: { type: 'string', description: 'Description' },
        clientId: { type: 'string', description: 'Client ID' },
        objectId: { type: 'string', description: 'Object ID' },
        status: { type: 'string', description: 'Status' },
      },
      required: ['type', 'title'],
    },
  },
]

export async function POST(request: NextRequest) {
  const user = await requireAuth()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { messages, context } = await request.json()

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      system: GALLERY_SYSTEM_PROMPT,
      messages,
      tools,
    })

    // Handle tool calls
    if (response.stop_reason === 'tool_use') {
      const toolResults: Anthropic.MessageParam[] = []

      for (const block of response.content) {
        if (block.type === 'tool_use') {
          let result: any

          switch (block.name) {
            case 'searchClients':
              result = await searchClients({ ...block.input, galleryId: user.galleryId })
              break
            case 'searchObjects':
              result = await searchObjects({ ...block.input, galleryId: user.galleryId })
              break
            case 'searchExternalInventory':
              result = await searchExternalInventory(block.input)
              break
            case 'createOrUpdateDealFlow':
              result = await createOrUpdateDealFlow({ ...block.input, galleryId: user.galleryId })
              break
            case 'updateDealFlowStage':
              result = await updateDealFlowStage(block.input.dealFlowId, block.input.status)
              break
            case 'createClientNote':
              result = await createClientNote(
                block.input.clientId,
                user.userId,
                block.input.noteText,
                block.input.tags,
                block.input.linkedObjectId,
                block.input.linkedDealFlowId
              )
              break
            default:
              result = { error: 'Unknown tool' }
          }

          toolResults.push({
            role: 'user',
            content: [
              {
                type: 'tool_result',
                tool_use_id: block.id,
                content: JSON.stringify(result),
              },
            ],
          })
        }
      }

      // Get final response after tool calls
      const finalResponse = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        system: GALLERY_SYSTEM_PROMPT,
        messages: [...messages, { role: 'assistant', content: response.content }, ...toolResults],
        tools,
      })

      const textContent = finalResponse.content.find((block) => block.type === 'text')
      return NextResponse.json({
        content: textContent?.type === 'text' ? textContent.text : 'No response',
      })
    }

    const textContent = response.content.find((block) => block.type === 'text')
    return NextResponse.json({
      content: textContent?.type === 'text' ? textContent.text : 'No response',
    })
  } catch (error: any) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
