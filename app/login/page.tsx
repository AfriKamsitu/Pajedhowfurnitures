import type { Metadata } from "next"
import { AuthShell } from "@/components/auth/auth-shell"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Sign In — FurniCraft",
}

export default function LoginPage() {
  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your FurniCraft account to continue." image="/hero-living-room.png">
      <LoginForm />
    </AuthShell>
  )
}
