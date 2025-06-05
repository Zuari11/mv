'use client'

import { useState } from 'react'
import { SignInCard } from '@/components/auth/SignInCard'
import { SignUpCard } from '@/components/auth/SignUpCard'
import { AuthLayout } from '@/components/auth/AuthLayout'

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)

  const toggleMode = () => {
    setIsSignUp(!isSignUp)
  }

  return (
    <AuthLayout>
      {isSignUp ? (
        <SignUpCard onToggleMode={toggleMode} />
      ) : (
        <SignInCard onToggleMode={toggleMode} />
      )}
    </AuthLayout>
  )
}
