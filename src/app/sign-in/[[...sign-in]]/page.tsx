"use client"
import { SignIn } from '@clerk/nextjs'
import { clerkAppearance } from '@/lib/clerk-theme' // Importamos nuestro tema

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <SignIn
        appearance={clerkAppearance} // Y lo aplicamos aquí
        afterSignInUrl="/dashboard" 
      />
    </div>
  )
}