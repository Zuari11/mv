'use client'

import { AuthTestimonials } from './AuthTestimonials'

interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="auth-layout-container flex-col lg:flex-row">
      {/* Left side - Testimonials (50%) */}
      <div className="hidden lg:block auth-layout-left">
        <AuthTestimonials />
      </div>

      {/* Mobile testimonials preview */}
      <div className="lg:hidden bg-gradient-to-r from-gray-900 to-black p-6 text-center">
        <h3 className="text-lg font-semibold text-white mb-2">
          Join thousands of satisfied users
        </h3>
        <p className="text-sm text-gray-300">
          Secure, reliable, and easy to use
        </p>
      </div>

      {/* Right side - Auth Form (50%) */}
      <div className="w-full auth-layout-right flex items-center justify-center p-6 md:p-10 bg-background">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}
