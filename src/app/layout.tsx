import { type Metadata } from 'next'
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata = {
  title: 'SISGI - Sistema de Gestión de Inventarios',
  description: 'Sistema de software para la Gestión de Inventarios de Variedades Dipal.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (

    <ClerkProvider>
      
      <html lang="es" className="dark">

        <head>

          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;600&display=swap" rel="stylesheet" />

        </head>

        <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-body`}>
          
            <SignedOut>
              {/* 
              <SignInButton />
              <SignUpButton />
              */}
            </SignedOut>
            <SignedIn>
              {/* <UserButton /> */}
            </SignedIn>

          {children}
          <Toaster />

        </body>

      </html>
      
    </ClerkProvider>

  )

}