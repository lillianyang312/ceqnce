import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create Gallery
  const gallery = await prisma.gallery.upsert({
    where: { id: 'gal_aurora' },
    update: {},
    create: {
      id: 'gal_aurora',
      name: 'Aurora Contemporary',
      contactEmail: 'info@auroracontemporary.com',
    },
  })
  console.log('✅ Created gallery:', gallery.name)

  // Create Users
  const passwordHash = await bcrypt.hash('password123', 10)

  const jane = await prisma.user.upsert({
    where: { email: 'jane@auroracontemporary.com' },
    update: {},
    create: {
      id: 'user_jane',
      galleryId: gallery.id,
      name: 'Jane Alvarez',
      email: 'jane@auroracontemporary.com',
      role: 'GALLERY_ADMIN',
      passwordHash,
    },
  })

  const marc = await prisma.user.upsert({
    where: { email: 'marc@auroracontemporary.com' },
    update: {},
    create: {
      id: 'user_marc',
      galleryId: gallery.id,
      name: 'Marc Liu',
      email: 'marc@auroracontemporary.com',
      role: 'SPECIALIST',
      passwordHash,
    },
  })
  console.log('✅ Created users:', jane.name, marc.name)

  // Create Objects
  const blueComp = await prisma.object.create({
    data: {
      id: 'obj_blue_composition',
      galleryId: gallery.id,
      title: 'Blue Composition',
      artist: 'Lea Richter',
      year: 2019,
      medium: 'Acrylic on canvas',
      dimensions: '120 x 90 cm',
      location: 'Main Gallery',
      price: 8500000, // $85,000 in cents
      status: 'AVAILABLE',
      imageUrl: '/images/blue-composition.jpg',
      metadataJson: {
        style: 'Abstract',
        palette: ['blue', 'white', 'black'],
        notes: "Part of the 'Tidal Forms' series.",
      },
    },
  })

  const cityDreams = await prisma.object.create({
    data: {
      id: 'obj_city_dreams',
      galleryId: gallery.id,
      title: 'City Dreams',
      artist: 'Rafael Ortega',
      year: 2015,
      medium: 'Oil on canvas',
      dimensions: '100 x 80 cm',
      location: 'Viewing Room',
      price: 12000000,
      status: 'AVAILABLE',
      imageUrl: '/images/city-dreams.jpg',
      metadataJson: { style: 'Figurative', theme: 'Urban landscape' },
    },
  })

  const neonGrid = await prisma.object.create({
    data: {
      id: 'obj_neon_grid',
      galleryId: gallery.id,
      title: 'Neon Grid',
      artist: 'Aya Nakamoto',
      year: 2022,
      medium: 'LED, plexiglass',
      dimensions: '180 x 180 cm',
      location: 'Storage',
      price: 6000000,
      status: 'ON_HOLD',
      imageUrl: '/images/neon-grid.jpg',
      metadataJson: { style: 'Light sculpture', series: 'Electric Fields' },
    },
  })

  const morningStudy = await prisma.object.create({
    data: {
      id: 'obj_morning_study',
      galleryId: gallery.id,
      title: 'Morning Study',
      artist: 'Clara Jensen',
      year: 1973,
      medium: 'Watercolor on paper',
      dimensions: '40 x 30 cm',
      location: 'Secondary Market Room',
      price: 4500000,
      status: 'CONSIGNED',
      imageUrl: '/images/morning-study.jpg',
      metadataJson: { style: 'Modern', provenance: 'Private collection, Zurich' },
    },
  })
  console.log('✅ Created objects')

  // Create Clients
  const robin = await prisma.client.create({
    data: {
      id: 'client_robin',
      galleryId: gallery.id,
      name: 'Robin Patel',
      email: 'robin.patel@example.com',
      phone: '+1 212 555 0198',
      typeTags: 'BUYER',
      knownInterests: 'Post-2000 abstract painting; blue palettes; large-scale wall works.',
      digitalEngagementJson: {
        websiteVisitsLast90Days: 7,
        lastVisitedArtists: ['Lea Richter', 'Aya Nakamoto'],
        emailOpensLast30Days: 5,
        lastCampaignsOpened: ['Spring Abstracts', 'New Light Works'],
      },
      pastBuyingEngagementJson: {
        totalSpend: 210000,
        currency: 'USD',
        lastPurchase: { title: 'Tidal Form #3', artist: 'Lea Richter', year: 2018, price: 90000 },
        budgetRange: { min: 50000, max: 150000 },
      },
    },
  })

  const sophia = await prisma.client.create({
    data: {
      id: 'client_sophia',
      galleryId: gallery.id,
      name: 'Sophia Klein',
      email: 'sophia.klein@example.com',
      phone: '+44 20 5550 1111',
      typeTags: 'BUYER,CONSIGNER',
      knownInterests: 'Modern European works on paper; 1960s–1980s; works with strong provenance.',
      digitalEngagementJson: {
        websiteVisitsLast90Days: 3,
        lastVisitedArtists: ['Clara Jensen'],
        emailOpensLast30Days: 2,
      },
      pastBuyingEngagementJson: {
        totalSpend: 95000,
        currency: 'USD',
        lastPurchase: { title: 'Winter Garden', artist: 'Clara Jensen', year: 1970, price: 35000 },
        budgetRange: { min: 30000, max: 80000 },
      },
    },
  })

  const marcus = await prisma.client.create({
    data: {
      id: 'client_marcus',
      galleryId: gallery.id,
      name: 'Marcus de la Cruz',
      email: 'marcus.dlc@example.com',
      phone: '+34 91 555 2222',
      typeTags: 'BUYER',
      knownInterests: 'Latin American figurative painting; urban scenes; 50–120k.',
      digitalEngagementJson: {
        websiteVisitsLast90Days: 5,
        lastVisitedArtists: ['Rafael Ortega'],
        emailOpensLast30Days: 4,
      },
      pastBuyingEngagementJson: {
        totalSpend: 150000,
        currency: 'USD',
        budgetRange: { min: 50000, max: 120000 },
      },
    },
  })

  const anna = await prisma.client.create({
    data: {
      id: 'client_anna',
      galleryId: gallery.id,
      name: 'Anna Weiss',
      email: 'anna.weiss@example.com',
      phone: '+41 44 555 3333',
      typeTags: 'CONSIGNER',
      knownInterests: 'Previously collected modern Scandinavian works; now selectively selling.',
      digitalEngagementJson: {
        websiteVisitsLast90Days: 1,
        emailOpensLast30Days: 1,
      },
      pastBuyingEngagementJson: {
        totalSpend: 0,
        currency: 'USD',
      },
    },
  })
  console.log('✅ Created clients')

  // Create ConsignerInfos
  await prisma.consignerInfo.create({
    data: {
      clientId: sophia.id,
      knownOwnedObjectsJson: [
        {
          artist: 'Clara Jensen',
          title: 'Morning Study',
          year: 1973,
          medium: 'Watercolor on paper',
          notes: 'Currently consigned to Aurora Contemporary.',
        },
      ],
      notes: 'Sophia is exploring sale options for selected Jensen works.',
    },
  })

  await prisma.consignerInfo.create({
    data: {
      clientId: anna.id,
      knownOwnedObjectsJson: [
        {
          artist: 'Clara Jensen',
          title: 'Harbor Lights',
          year: 1969,
          medium: 'Gouache on paper',
          notes: 'Discussed in December 2023; no images yet.',
        },
      ],
      notes: 'Anna might consign 1–2 key works in the next 12 months.',
    },
  })
  console.log('✅ Created consigner info')

  // Create Client Notes
  await prisma.clientNote.create({
    data: {
      clientId: robin.id,
      specialistId: jane.id,
      type: 'TEXT',
      text: 'Very responsive to email; prefers works that feel calm and atmospheric. Likes blue/green palettes.',
      tags: 'preferences,tone',
      linkedObjectId: blueComp.id,
    },
  })

  await prisma.clientNote.create({
    data: {
      clientId: sophia.id,
      specialistId: marc.id,
      type: 'TEXT',
      text: "Considering selling 'Morning Study' and one other Jensen work. Wants valuation by March.",
      tags: 'consignment,valuation',
      linkedObjectId: morningStudy.id,
    },
  })
  console.log('✅ Created client notes')

  // Create External Inventory Items
  await prisma.externalInventoryItem.create({
    data: {
      id: 'extitem_latin_auction',
      sourceType: 'AUCTION_HOUSE',
      sourceName: 'Casa del Arte Auctions',
      contactName: 'Lucia Romero',
      contactEmail: 'lucia.romero@casadelarte.com',
      contactPhone: '+34 93 555 7777',
      objectTitle: 'Nocturne in Red',
      artist: 'Rafael Ortega',
      year: 2014,
      medium: 'Oil on canvas',
      priceInfo: 'Estimate 80,000–110,000 USD',
      metadataJson: { style: 'Figurative', theme: 'Urban night scene', saleDate: '2024-03-15' },
    },
  })

  await prisma.externalInventoryItem.create({
    data: {
      id: 'extitem_jensen_drawing',
      sourceType: 'GALLERY',
      sourceName: 'Nordic Lines',
      contactName: 'Erik Lund',
      contactEmail: 'erik@nordiclines.com',
      contactPhone: '+46 8 555 9999',
      objectTitle: 'Summer Sketch',
      artist: 'Clara Jensen',
      year: 1971,
      medium: 'Pencil and watercolor on paper',
      priceInfo: 'Asking 38,000 USD',
      metadataJson: { provenance: 'Private collection, Stockholm' },
    },
  })
  console.log('✅ Created external inventory')

  // Create Deal Flows
  await prisma.dealFlow.create({
    data: {
      id: 'deal_object_sale_blue_comp',
      galleryId: gallery.id,
      type: 'OBJECT_SALE',
      status: 'QUALIFYING',
      title: 'Blue Composition – Priority Buyer Outreach',
      description: "Identify and prioritize likely buyers for Lea Richter's 'Blue Composition' and coordinate outreach.",
      objectId: blueComp.id,
      metadataJson: { priority: 'high', targetCloseDate: '2024-03-31' },
    },
  })

  await prisma.dealFlow.create({
    data: {
      id: 'deal_client_request_marcus',
      galleryId: gallery.id,
      type: 'CLIENT_REQUEST',
      status: 'IN_PROGRESS',
      title: 'Marcus – Latin American urban figurative work',
      description: 'Marcus is looking for a Latin American figurative painting with urban subject matter between 50–120k.',
      clientId: marcus.id,
      metadataJson: { budgetMin: 50000, budgetMax: 120000, preferredArtists: ['Rafael Ortega'] },
    },
  })

  await prisma.dealFlow.create({
    data: {
      id: 'deal_consignment_sophia_jensen',
      galleryId: gallery.id,
      type: 'CONSIGNMENT',
      status: 'INFO_GATHERING',
      title: 'Sophia – Jensen watercolor consignment',
      description: "Evaluate and potentially consign 'Morning Study' by Clara Jensen for sale in 2024.",
      objectId: morningStudy.id,
      clientId: sophia.id,
      metadataJson: {
        targetValuationDate: '2024-02-15',
        possibleSaleChannels: ['Private sale', 'Fair'],
      },
    },
  })
  console.log('✅ Created deal flows')

  console.log('🎉 Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
