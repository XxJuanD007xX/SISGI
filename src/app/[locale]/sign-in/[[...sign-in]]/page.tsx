"use client"
import { SignIn } from '@clerk/nextjs'
import { clerkAppearance } from '@/lib/clerk-theme'
import { useLocale } from "next-intl";

export default function Page() {
  const locale = useLocale();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <SignIn
        appearance={clerkAppearance}
        path={`/${locale}/sign-in`}
        routing="path"
        signUpUrl={`/${locale}/sign-up`}
        afterSignInUrl={`/${locale}/dashboard`}
      />
    </div>
  )
}