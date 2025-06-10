import * as React from "react"

export function Breadcrumb({ children, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav className="flex" aria-label="Breadcrumb" {...props}>
      <ol className="flex items-center space-x-1">{children}</ol>
    </nav>
  )
}

export function BreadcrumbList({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function BreadcrumbItem({ children, className = "", ...props }: React.HTMLAttributes<HTMLLIElement>) {
  return <li className={`inline-flex items-center ${className}`} {...props}>{children}</li>
}

export function BreadcrumbLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
      {children}
    </a>
  )
}

export function BreadcrumbPage({ children }: { children: React.ReactNode }) {
  return <span className="text-sm font-semibold text-foreground">{children}</span>
}

export function BreadcrumbSeparator({ className = "", ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={`mx-2 text-muted-foreground ${className}`} {...props}>/</span>
}