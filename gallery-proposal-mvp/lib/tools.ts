import { prisma } from './db'

export async function searchClients(criteria: {
  galleryId: string
  interests?: string
  artist?: string
  budgetMin?: number
  budgetMax?: number
  typeTags?: string
}) {
  const where: any = { galleryId: criteria.galleryId }

  if (criteria.typeTags) {
    where.typeTags = { contains: criteria.typeTags }
  }

  if (criteria.interests || criteria.artist) {
    where.OR = []
    if (criteria.interests) {
      where.OR.push({ knownInterests: { contains: criteria.interests, mode: 'insensitive' } })
    }
    if (criteria.artist) {
      where.OR.push({ knownInterests: { contains: criteria.artist, mode: 'insensitive' } })
    }
  }

  const clients = await prisma.client.findMany({
    where,
    include: {
      _count: { select: { dealFlows: true, notes: true } },
    },
    take: 10,
  })

  return clients
}

export async function searchObjects(criteria: {
  galleryId: string
  artist?: string
  title?: string
  priceMin?: number
  priceMax?: number
  status?: string
}) {
  const where: any = { galleryId: criteria.galleryId }

  if (criteria.artist) {
    where.artist = { contains: criteria.artist, mode: 'insensitive' }
  }

  if (criteria.title) {
    where.title = { contains: criteria.title, mode: 'insensitive' }
  }

  if (criteria.priceMin || criteria.priceMax) {
    where.price = {}
    if (criteria.priceMin) where.price.gte = criteria.priceMin * 100
    if (criteria.priceMax) where.price.lte = criteria.priceMax * 100
  }

  if (criteria.status) {
    where.status = criteria.status
  }

  const objects = await prisma.object.findMany({
    where,
    take: 10,
  })

  return objects
}

export async function searchExternalInventory(criteria: {
  artist?: string
  objectTitle?: string
}) {
  const where: any = {}

  if (criteria.artist) {
    where.artist = { contains: criteria.artist, mode: 'insensitive' }
  }

  if (criteria.objectTitle) {
    where.objectTitle = { contains: criteria.objectTitle, mode: 'insensitive' }
  }

  const items = await prisma.externalInventoryItem.findMany({
    where,
    take: 10,
  })

  return items
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
    return await prisma.dealFlow.update({
      where: { id: payload.id },
      data: {
        title: payload.title,
        description: payload.description,
        clientId: payload.clientId,
        objectId: payload.objectId,
        status: payload.status,
      },
    })
  } else {
    return await prisma.dealFlow.create({
      data: {
        galleryId: payload.galleryId,
        type: payload.type,
        title: payload.title,
        description: payload.description,
        clientId: payload.clientId,
        objectId: payload.objectId,
        status: payload.status || 'NEW',
      },
    })
  }
}

export async function updateDealFlowStage(dealFlowId: string, status: string) {
  return await prisma.dealFlow.update({
    where: { id: dealFlowId },
    data: { status },
  })
}

export async function createClientNote(
  clientId: string,
  specialistId: string,
  noteText: string,
  tags?: string,
  linkedObjectId?: string,
  linkedDealFlowId?: string
) {
  return await prisma.clientNote.create({
    data: {
      clientId,
      specialistId,
      type: 'TEXT',
      text: noteText,
      tags,
      linkedObjectId,
      linkedDealFlowId,
    },
  })
}
