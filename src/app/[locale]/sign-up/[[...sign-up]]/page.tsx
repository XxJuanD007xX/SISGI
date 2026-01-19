import { SignUp } from '@clerk/nextjs'
import { clerkAppearance } from '@/lib/clerk-theme'
import { useLocale } from "next-intl";

export default function Page() {
  const locale = useLocale();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <SignUp
        appearance={clerkAppearance}
        path={`/${locale}/sign-up`}
        routing="path"
        afterSignInUrl={`/${locale}/dashboard`}
      />
    </div>
  )
}