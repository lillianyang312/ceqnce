// Mock database for running without PostgreSQL
import {
  mockGallery,
  mockUsers,
  mockObjects,
  mockClients,
  mockDealFlows,
  mockClientNotes,
  mockExternalInventory,
} from './mockData'

// Export mock data as a simple in-memory database
export const db = {
  gallery: mockGallery,
  users: mockUsers,
  objects: mockObjects,
  clients: mockClients,
  dealFlows: mockDealFlows,
  clientNotes: mockClientNotes,
  externalInventory: mockExternalInventory,
}

// Keep prisma export commented out for future database integration
// import { PrismaClient } from '@prisma/client'
// const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }
// export const prisma = globalForPrisma.prisma ?? new PrismaClient({ log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'] })
// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
