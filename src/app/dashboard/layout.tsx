"use client"

import type React from "react"

import { ThemeProvider } from "@/app/components/theme-provider"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider defaultTheme="default">
      <div className="dark">{children}</div>
    </ThemeProvider>
  )
}
