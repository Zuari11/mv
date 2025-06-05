import { LoginForm } from '@/components/login-form'
import { AuthLayout } from '@/components/auth/AuthLayout'

export default function Page() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  )
}
