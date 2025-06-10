import * as React from "react"

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "destructive" | "outline"
}

export function Badge({ className = "", variant = "default", ...props }: BadgeProps) {
  let variantClass = ""
  switch (variant) {
    case "secondary":
      variantClass = "bg-muted text-foreground"
      break
    case "destructive":
      variantClass = "bg-destructive text-destructive-foreground"
      break
    case "outline":
      variantClass = "border border-input"
      break
    default:
      variantClass = "bg-primary text-primary-foreground"
  }
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${variantClass} ${className}`}
      {...props}
    />
  )
}