import { SignUp } from '@clerk/nextjs'
import { clerkAppearance } from '@/lib/clerk-theme' // Importamos nuestro tema

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <SignUp 
        appearance={clerkAppearance} // Y lo aplicamos también aquí
        afterSignInUrl="/dashboard" 
      />
    </div>
  )
}