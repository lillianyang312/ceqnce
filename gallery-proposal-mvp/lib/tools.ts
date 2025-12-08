import { db } from './db'

export async function searchClients(criteria: {
  galleryId: string
  interests?: string
  artist?: string
  budgetMin?: number
  budgetMax?: number
  typeTags?: string
}) {
  let results = db.clients.filter((c) => c.galleryId === criteria.galleryId)

  if (criteria.typeTags) {
    results = results.filter((c) => c.typeTags.includes(criteria.typeTags!))
  }

  if (criteria.interests) {
    results = results.filter((c) =>
      c.knownInterests.toLowerCase().includes(criteria.interests!.toLowerCase())
    )
  }

  if (criteria.artist) {
    results = results.filter((c) =>
      c.knownInterests.toLowerCase().includes(criteria.artist!.toLowerCase())
    )
  }

  if (criteria.budgetMin || criteria.budgetMax) {
    results = results.filter((c) => {
      const budget = (c.pastBuyingEngagementJson as any)?.budgetRange
      if (!budget) return false
      if (criteria.budgetMin && budget.max < criteria.budgetMin) return false
      if (criteria.budgetMax && budget.min > criteria.budgetMax) return false
      return true
    })
  }

  return results.slice(0, 10)
}

export async function searchObjects(criteria: {
  galleryId: string
  artist?: string
  title?: string
  priceMin?: number
  priceMax?: number
  status?: string
}) {
  let results = db.objects.filter((o) => o.galleryId === criteria.galleryId)

  if (criteria.artist) {
    results = results.filter((o) =>
      o.artist.toLowerCase().includes(criteria.artist!.toLowerCase())
    )
  }

  if (criteria.title) {
    results = results.filter((o) =>
      o.title.toLowerCase().includes(criteria.title!.toLowerCase())
    )
  }

  if (criteria.priceMin) {
    results = results.filter((o) => o.price >= criteria.priceMin! * 100)
  }

  if (criteria.priceMax) {
    results = results.filter((o) => o.price <= criteria.priceMax! * 100)
  }

  if (criteria.status) {
    results = results.filter((o) => o.status === criteria.status)
  }

  return results.slice(0, 10)
}

export async function searchExternalInventory(criteria: {
  artist?: string
  objectTitle?: string
}) {
  let results = [...db.externalInventory]

  if (criteria.artist) {
    results = results.filter((i) =>
      i.artist.toLowerCase().includes(criteria.artist!.toLowerCase())
    )
  }

  if (criteria.objectTitle) {
    results = results.filter((i) =>
      i.objectTitle.toLowerCase().includes(criteria.objectTitle!.toLowerCase())
    )
  }

  return results.slice(0, 10)
}

export async function createOrUpdateDealFlow(payload: {
  galleryId: string
  id?: string
  type: string
  title: string
  description?: string
  clientId?: string
  objectId?: string
  status?: string
}) {
  if (payload.id) {
    // Update existing deal flow
    const index = db.dealFlows.findIndex((d) => d.id === payload.id)
    if (index !== -1) {
      db.dealFlows[index] = {
        ...db.dealFlows[index],
        title: payload.title,
        description: payload.description || db.dealFlows[index].description,
        clientId: payload.clientId || db.dealFlows[index].clientId,
        objectId: payload.objectId || db.dealFlows[index].objectId,
        status: payload.status || db.dealFlows[index].status,
        updatedAt: new Date(),
      }
      return db.dealFlows[index]
    }
  } else {
    // Create new deal flow
    const newDealFlow = {
      id: `deal_${Date.now()}`,
      galleryId: payload.galleryId,
      type: payload.type,
      title: payload.title,
      description: payload.description || '',
      clientId: payload.clientId || null,
      objectId: payload.objectId || null,
      status: payload.status || 'NEW',
      metadataJson: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    db.dealFlows.push(newDealFlow)
    return newDealFlow
  }
}

export async function updateDealFlowStage(dealFlowId: string, status: string) {
  const index = db.dealFlows.findIndex((d) => d.id === dealFlowId)
  if (index !== -1) {
    db.dealFlows[index].status = status
    db.dealFlows[index].updatedAt = new Date()
    return db.dealFlows[index]
  }
  return null
}

export async function createClientNote(
  clientId: string,
  specialistId: string,
  noteText: string,
  tags?: string,
  linkedObjectId?: string,
  linkedDealFlowId?: string
) {
  const newNote = {
    id: `note_${Date.now()}`,
    clientId,
    specialistId,
    type: 'TEXT' as const,
    text: noteText,
    tags: tags || null,
    linkedObjectId: linkedObjectId || null,
    linkedDealFlowId: linkedDealFlowId || null,
    createdAt: new Date(),
  }
  db.clientNotes.push(newNote)
  return newNote
}
