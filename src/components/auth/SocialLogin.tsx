'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { Github } from 'lucide-react'
import { FcGoogle } from 'react-icons/fc'

interface SocialLoginProps {
  className?: string
}

export function SocialLogin({ className }: SocialLoginProps) {
  const { signInWithProvider } = useAuth()
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)

  const handleSocialLogin = async (provider: 'github' | 'google') => {
    try {
      setLoadingProvider(provider)
      await signInWithProvider(provider)
    } catch (error) {
      console.error(`${provider} login error:`, error)
    } finally {
      setLoadingProvider(null)
    }
  }

  return (
    <div className={`grid grid-cols-2 gap-4 ${className}`}>
      <Button
        variant="outline"
        onClick={() => handleSocialLogin('github')}
        disabled={loadingProvider !== null}
        className="w-full"
      >
        {loadingProvider === 'github' ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <Github className="h-4 w-4" />
        )}
        <span className="ml-2">GitHub</span>
      </Button>
      
      <Button
        variant="outline"
        onClick={() => handleSocialLogin('google')}
        disabled={loadingProvider !== null}
        className="w-full"
      >
        {loadingProvider === 'google' ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <FcGoogle className="h-4 w-4" />
        )}
        <span className="ml-2">Google</span>
      </Button>
    </div>
  )
}
