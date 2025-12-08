import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ObjectsClient from '@/components/ObjectsClient'

export default async function ObjectsPage() {
  const user = await requireAuth()
  if (!user) redirect('/login')

  // Get objects from mock database
  const objects = db.objects.filter((obj) => obj.galleryId === user.galleryId)

  return <ObjectsClient objects={objects} />
}
