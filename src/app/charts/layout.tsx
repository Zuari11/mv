'use client'

import { useAuth } from '@/hooks/useAuth'
import { DashboardHeader } from '@/components/dashboard/Header'
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar'
import { DashboardFooter } from '@/components/dashboard/Footer'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ChartsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        {/* Main content area - adjusted width to accommodate sidebar */}
        <main className="flex-1 pr-16 flex flex-col">
          <div className="flex-1">
            {children}
          </div>
          <DashboardFooter />
        </main>
        {/* Right sidebar */}
        <DashboardSidebar />
      </div>
    </div>
  )
}
