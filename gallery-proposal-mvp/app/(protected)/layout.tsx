import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import Link from 'next/link'
import Chat from '@/components/Chat'
import LogoutButton from '@/components/LogoutButton'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireAuth()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Top Nav */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-gray-900">Gallery CRM</h1>
            <div className="flex gap-4">
              <Link
                href="/"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Deal Flow
              </Link>
              <Link
                href="/objects"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Objects
              </Link>
              <Link
                href="/clients"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Clients
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user.userName}</span>
            <LogoutButton />
          </div>
        </div>
      </nav>

      {/* Main Layout: Chat (40%) + Content (60%) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Panel - Left 40% */}
        <div className="w-2/5">
          <Chat />
        </div>

        {/* Content Area - Right 60% */}
        <div className="flex-1 overflow-auto bg-gray-50">{children}</div>
      </div>
    </div>
  )
}
