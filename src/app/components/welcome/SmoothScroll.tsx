"use client"

import { ReactLenis } from 'lenis/react'
import { useEffect, ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
  }, [])

  return (
    <ReactLenis root>
      {children}
    </ReactLenis>
  )
}
