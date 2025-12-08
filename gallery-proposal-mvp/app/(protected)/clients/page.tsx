import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ClientsClient from '@/components/ClientsClient'

export default async function ClientsPage() {
  const user = await requireAuth()
  if (!user) redirect('/login')

  // Get clients from mock database with counts
  const clients = db.clients
    .filter((client) => client.galleryId === user.galleryId)
    .map((client) => ({
      ...client,
      _count: {
        notes: db.clientNotes.filter((note) => note.clientId === client.id).length,
        dealFlows: db.dealFlows.filter((flow) => flow.clientId === client.id).length,
      },
    }))

  return <ClientsClient clients={clients} />
}
