import type { Metadata } from "next"
import { AuthShell } from "@/components/auth/auth-shell"
import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = {
  title: "Create Account — FurniCraft",
}

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Join FurniCraft and start furnishing your space."
      image="/sofa-chesterfield.png"
    >
      <RegisterForm />
    </AuthShell>
  )
}
