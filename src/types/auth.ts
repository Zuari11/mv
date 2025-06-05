import { User } from '@supabase/supabase-js'
import { Profile } from './database'

export interface AuthUser extends User {
  profile?: Profile
}

export interface AuthState {
  user: AuthUser | null
  profile: Profile | null
  loading: boolean
  error: string | null
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName?: string) => Promise<void>
  signInWithProvider: (provider: 'github' | 'google') => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<void>
  refreshUser: () => Promise<void>
}

export type AuthProvider = 'email' | 'github' | 'google'

export interface SignInFormData {
  email: string
  password: string
}

export interface SignUpFormData {
  email: string
  password: string
  confirmPassword: string
  fullName?: string
}

export interface AuthError {
  message: string
  code?: string
}
