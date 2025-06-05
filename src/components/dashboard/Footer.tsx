'use client'

import Container from '@/components/global/container'

export function DashboardFooter() {
  return (
    <footer className="w-full bg-background border-t-2 border-white mt-auto">
      <Container className="flex h-14 items-center justify-between">
        {/* Empty footer content - maintaining exact same height as header (h-14 = 56px) */}
        <div className="flex items-center space-x-4">
          {/* Left side content removed but maintaining structure */}
        </div>
        <div className="flex items-center space-x-4">
          {/* Right side content removed but maintaining structure */}
        </div>
      </Container>
    </footer>
  )
}
