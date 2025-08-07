import * as React from "react"

export function Avatar({ className, ...props }: React.ComponentProps<"span">) {
    return (
        <span
            className={`relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted ${className ?? ""}`}
            {...props}
        />
    )
}

export function AvatarImage({ className, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            className={`absolute aspect-square h-full w-full object-cover ${className ?? ""}`}
            {...props}
        />
    )
}

export function AvatarFallback({ className, ...props }: React.ComponentProps<"span">) {
    return (
        <span
            className={`flex h-full w-full items-center justify-center rounded-full bg-muted ${className ?? ""}`}
            {...props}
        />
    )
}