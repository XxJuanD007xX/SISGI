"use client"

import React, { useState, useEffect } from "react"
import { Bell, Megaphone } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function NotificationBell() {
    const [unreadCount, setUnreadCount] = useState(0)
    const [recentAnnouncements, setRecentAnnouncements] = useState<any[]>([])

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const res = await fetch("http://localhost:8080/api/anuncios")
                if (res.ok) {
                    const data = await res.json()
                    setRecentAnnouncements(data.slice(0, 5))

                    const lastRead = localStorage.getItem("last_announcement_read") || "0"
                    const unread = data.filter((a: any) => new Date(a.fechaCreacion).getTime() > parseInt(lastRead)).length
                    setUnreadCount(unread)
                }
            } catch (error) {
                console.error(error)
            }
        }
        fetchAnnouncements()
    }, [])

    const handleMarkAsRead = () => {
        setUnreadCount(0)
        localStorage.setItem("last_announcement_read", Date.now().toString())
    }

    return (
        <DropdownMenu onOpenChange={(open) => open && handleMarkAsRead()}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-[10px]" variant="default">
                            {unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                    Notificaciones
                    {unreadCount > 0 && <span className="text-[10px] text-primary font-normal">Nuevos anuncios</span>}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {recentAnnouncements.length > 0 ? (
                    recentAnnouncements.map((anuncio) => (
                        <DropdownMenuItem key={anuncio.id} className="flex flex-col items-start gap-1 p-3 cursor-pointer hover:bg-muted/50" asChild>
                            <a href="/dashboard/anuncios">
                                <div className="flex items-center gap-2 w-full">
                                    <Megaphone className="h-3 w-3 text-primary" />
                                    <span className="font-semibold text-xs">{anuncio.autorNombre}</span>
                                    <span className="text-[10px] text-muted-foreground ml-auto">
                                        {new Date(anuncio.fechaCreacion).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                    {anuncio.contenido}
                                </p>
                            </a>
                        </DropdownMenuItem>
                    ))
                ) : (
                    <div className="p-4 text-center text-xs text-muted-foreground">
                        No hay anuncios recientes
                    </div>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center text-xs font-medium text-primary hover:text-primary/80" asChild>
                    <a href="/dashboard/anuncios text-center w-full">Ver todos los anuncios</a>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
