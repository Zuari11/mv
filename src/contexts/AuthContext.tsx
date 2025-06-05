'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AuthContextType, AuthState, AuthUser } from '@/types/auth'
import { Profile } from '@/types/database'
import { toast } from 'sonner'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    error: null,
  })
  
  const router = useRouter()
  const supabase = createClient()

  // Fetch user profile
  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        // If profile doesn't exist, that's okay - user can still sign in
        if (error.code === 'PGRST116') {
          console.log('Profile not found for user:', userId)
        }
        return null
      }

      return data
    } catch (error) {
      console.error('Error fetching profile:', error)
      return null
    }
  }

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          const profile = await fetchProfile(session.user.id)
          setState({
            user: { ...session.user, profile } as AuthUser,
            profile,
            loading: false,
            error: null,
          })
        } else {
          setState({
            user: null,
            profile: null,
            loading: false,
            error: null,
          })
        }
      } catch (error) {
        setState({
          user: null,
          profile: null,
          loading: false,
          error: error instanceof Error ? error.message : 'Authentication error',
        })
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id)

        if (session?.user) {
          // Only update state if we don't already have this user
          // This prevents unnecessary re-renders and profile fetches
          setState(prev => {
            if (prev.user?.id === session.user.id) {
              return prev
            }
            return prev
          })

          // Fetch profile only if we don't have it or it's a different user
          const shouldFetchProfile = !state.user || state.user.id !== session.user.id
          if (shouldFetchProfile) {
            const profile = await fetchProfile(session.user.id)
            setState({
              user: { ...session.user, profile } as AuthUser,
              profile,
              loading: false,
              error: null,
            })
          }

          // Handle OAuth redirects - only redirect if we're on auth page and it's a sign-in event
          if (event === 'SIGNED_IN' && window.location.pathname === '/auth') {
            // Small delay to ensure the auth state is fully updated
            setTimeout(() => {
              router.push('/charts')
            }, 150)
          }
        } else {
          setState({
            user: null,
            profile: null,
            loading: false,
            error: null,
          })
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const signIn = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // If we have a user, fetch their profile and update state immediately
      if (data.user) {
        const profile = await fetchProfile(data.user.id)
        setState({
          user: { ...data.user, profile } as AuthUser,
          profile,
          loading: false,
          error: null,
        })

        toast.success('Successfully signed in!')

        // Redirect to charts page
        router.push('/charts')
      } else {
        setState(prev => ({ ...prev, loading: false }))
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign in failed'
      setState(prev => ({ ...prev, error: message, loading: false }))
      toast.error(message)
      throw error
    }
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          fullName,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Sign up failed')
      }

      setState(prev => ({ ...prev, loading: false }))
      toast.success('Check your email to confirm your account!')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign up failed'
      setState(prev => ({ ...prev, error: message, loading: false }))
      toast.error(message)
      throw error
    }
  }

  const signInWithProvider = async (provider: 'github' | 'google') => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/charts`,
        },
      })

      if (error) throw error
    } catch (error) {
      const message = error instanceof Error ? error.message : 'OAuth sign in failed'
      setState(prev => ({ ...prev, error: message, loading: false }))
      toast.error(message)
      throw error
    }
  }

  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const { error } = await supabase.auth.signOut()
      
      if (error) throw error
      
      toast.success('Successfully signed out!')
      router.push('/')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign out failed'
      setState(prev => ({ ...prev, error: message, loading: false }))
      toast.error(message)
      throw error
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      if (!state.user) throw new Error('No user logged in')
      
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', state.user.id)

      if (error) throw error
      
      // Refresh profile data
      const updatedProfile = await fetchProfile(state.user.id)
      setState(prev => ({
        ...prev,
        profile: updatedProfile,
        user: prev.user ? { ...prev.user, profile: updatedProfile || undefined } as AuthUser : null,
        loading: false,
      }))
      
      toast.success('Profile updated successfully!')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Profile update failed'
      setState(prev => ({ ...prev, error: message, loading: false }))
      toast.error(message)
      throw error
    }
  }

  const refreshUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const profile = await fetchProfile(user.id)
        setState(prev => ({
          ...prev,
          user: { ...user, profile } as AuthUser,
          profile,
        }))
      }
    } catch (error) {
      console.error('Error refreshing user:', error)
    }
  }

  const value: AuthContextType = {
    ...state,
    signIn,
    signUp,
    signInWithProvider,
    signOut,
    updateProfile,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
