import { SignUpForm } from '@/components/sign-up-form'
import { AuthLayout } from '@/components/auth/AuthLayout'

export default function Page() {
  return (
    <AuthLayout>
      <SignUpForm />
    </AuthLayout>
  )
}
