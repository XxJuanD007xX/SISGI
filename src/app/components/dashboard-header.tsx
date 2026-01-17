"use client"

import React, { useState, useEffect } from "react"
import { Calendar } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ThemeSwitcher } from "@/app/components/theme-switcher"
import { NotificationBell } from "@/app/components/notification-bell"

interface HeaderProps {
    pageTitle: string
    breadcrumbParent?: { label: string, href: string }
}

export function DashboardHeader({ pageTitle, breadcrumbParent }: HeaderProps) {
    const [currentDate, setCurrentDate] = useState("")

    useEffect(() => {
        setCurrentDate(new Date().toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        }))
    }, [])

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-0 bg-background/80 backdrop-blur-md z-50 transition-all w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink href="/dashboard">SISGI</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    {breadcrumbParent && (
                        <>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href={breadcrumbParent.href}>{breadcrumbParent.label}</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                        </>
                    )}
                    <BreadcrumbItem>
                        <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="ml-auto flex items-center gap-3">
                <ThemeSwitcher />
                <NotificationBell />

                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50 text-xs font-medium">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    <span className="capitalize">{currentDate}</span>
                </div>
            </div>
        </header>
    )
}
