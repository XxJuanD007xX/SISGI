"use client"

import React, { useState } from "react"
import { PlayCircle, SkipBack, SkipForward, Maximize2, ListVideo, X } from "lucide-react"
import { Documento } from "./types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface CinemaModeProps {
    playlist: Documento[]
    onClose: () => void
}

export function CinemaMode({ playlist, onClose }: CinemaModeProps) {
    const [currentVideo, setCurrentVideo] = useState<Documento | null>(playlist[0] || null)

    if (!currentVideo) return null

    const currentIndex = playlist.findIndex(v => v.id === currentVideo.id)

    const nextVideo = () => {
        const nextIdx = (currentIndex + 1) % playlist.length
        setCurrentVideo(playlist[nextIdx])
    }

    const prevVideo = () => {
        const prevIdx = (currentIndex - 1 + playlist.length) % playlist.length
        setCurrentVideo(playlist[prevIdx])
    }

    return (
        <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in zoom-in duration-300">
            {/* Player Section */}
            <div className="flex-1 space-y-4">
                <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl group">
                    <video
                        key={currentVideo.id}
                        controls
                        autoPlay
                        className="w-full h-full object-contain"
                        src={`http://localhost:8080/api/documentos/download/${currentVideo.id}`}
                    />
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="secondary" size="icon" onClick={onClose} className="rounded-full">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="flex items-center justify-between p-2">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">{currentVideo.nombre}</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            {currentVideo.autor} • {currentVideo.size}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={prevVideo} disabled={playlist.length <= 1}>
                            <SkipBack className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={nextVideo} disabled={playlist.length <= 1}>
                            <SkipForward className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Playlist Sidebar */}
            <div className="w-full lg:w-80 space-y-4">
                <div className="flex items-center gap-2 font-semibold text-primary">
                    <ListVideo className="h-5 w-5" />
                    <h3>Playlist Corporativa</h3>
                    <Badge className="ml-auto">{playlist.length}</Badge>
                </div>

                <Card className="border-none bg-muted/30 shadow-inner overflow-hidden">
                    <ScrollArea className="h-[400px] lg:h-[500px]">
                        <div className="p-2 space-y-1">
                            {playlist.map((video, index) => (
                                <div
                                    key={video.id}
                                    className={cn(
                                        "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all hover:bg-primary/5 group",
                                        currentVideo.id === video.id ? "bg-primary/10 border border-primary/20 ring-1 ring-primary/10" : "border border-transparent"
                                    )}
                                    onClick={() => setCurrentVideo(video)}
                                >
                                    <div className="relative h-12 w-20 bg-black rounded-lg overflow-hidden flex-shrink-0">
                                        <div className="absolute inset-0 flex items-center justify-center opacity-60">
                                            <PlayCircle className="h-6 w-6 text-white" />
                                        </div>
                                    </div>
                                    <div className="min-w-0">
                                        <p className={cn(
                                            "text-xs font-semibold truncate",
                                            currentVideo.id === video.id ? "text-primary" : "text-foreground"
                                        )}>
                                            {index + 1}. {video.nombre}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground mt-0.5">{video.autor}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </Card>
            </div>
        </div>
    )
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
    return <span className={cn("px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold", className)}>{children}</span>
}
