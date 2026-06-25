import type { Metadata } from "next"
import { AuthShell } from "@/components/auth/auth-shell"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Sign In — pajedhowfurnitures",
}

export default function LoginPage() {
  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your pajedhowfurnitures account to continue." image="/hero-living-room.png">
      <LoginForm />
    </AuthShell>
  )
}
