"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/app/components/app-sidebar"
import { DashboardHeader } from "@/app/components/dashboard-header";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
    Megaphone,
    Send,
    Pin,
    CheckCircle2,
    MoreHorizontal,
    Trash2,
    ShieldCheck,
    SmilePlus,
    TrendingUp,
    Users,
    Sparkles
} from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// --- TIPOS ---
interface Reaccion {
    userId: string
    emoji: string
}

interface Anuncio {
    id: number
    contenido: string
    autorNombre: string
    autorId: string
    autorRol: "Administrador" | "Agente" | "Usuario"
    fechaCreacion: string
    fijado: boolean
    reacciones: Reaccion[]
}

// --- LISTA DE EMOJIS DISPONIBLES ---
const AVAILABLE_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "😡", "🎉", "🚀"];

export default function AnunciosPage() {
    const { user } = useUser()
    const [anuncios, setAnuncios] = useState<Anuncio[]>([])
    const [nuevoContenido, setNuevoContenido] = useState("")
    const [isPosting, setIsPosting] = useState(false)

    const userRole = (user?.publicMetadata?.role as string) || "Agente"

    // --- FETCH DATA (Con parseo del formato "userId:emoji") ---
    const fetchAnuncios = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/anuncios")
            if (res.ok) {
                const rawData = await res.json();

                // Transformamos los datos crudos del backend al formato que usa la UI
                const adaptedData = rawData.map((a: any) => {
                    const reaccionesProcesadas = (a.reacciones || []).map((rStr: string) => {
                        // El backend ahora manda "userId:emoji"
                        if (rStr.includes(":")) {
                            const [uid, em] = rStr.split(":");
                            return { userId: uid, emoji: em };
                        }
                        // Compatibilidad con datos viejos (solo ID)
                        return { userId: rStr, emoji: "❤️" };
                    });

                    return {
                        ...a,
                        reacciones: reaccionesProcesadas
                    };
                });

                setAnuncios(adaptedData)
            }
        } catch (error) {
            console.error("Error cargando anuncios:", error)
        }
    }

    useEffect(() => {
        fetchAnuncios()
    }, [])

    const handlePublicar = async () => {
        if (!nuevoContenido.trim()) return

        setIsPosting(true)
        const nuevoAnuncio = {
            contenido: nuevoContenido,
            autorNombre: user?.fullName || user?.username || "Usuario",
            autorId: user?.id,
            autorRol: userRole,
            fijado: false,
            reacciones: []
        }

        try {
            const res = await fetch("http://localhost:8080/api/anuncios", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoAnuncio)
            })

            if (res.ok) {
                setNuevoContenido("")
                fetchAnuncios()
                toast.success("Anuncio publicado")
            }
        } catch (error) {
            toast.error("Error al publicar")
        } finally {
            setIsPosting(false)
        }
    }

    const handleReaction = async (anuncioId: number, emoji: string) => {
        if (!user) return;

        // 1. Actualización Optimista (UI instantánea)
        setAnuncios(prev => prev.map(a => {
            if (a.id === anuncioId) {
                const existingIndex = a.reacciones.findIndex(r => r.userId === user.id);
                let newReactions = [...a.reacciones];

                if (existingIndex >= 0) {
                    // Si ya existe
                    if (newReactions[existingIndex].emoji === emoji) {
                        // Mismo emoji -> Quitar
                        newReactions.splice(existingIndex, 1);
                    } else {
                        // Diferente emoji -> Cambiar
                        newReactions[existingIndex].emoji = emoji;
                    }
                } else {
                    // Nueva reacción -> Agregar
                    newReactions.push({ userId: user.id, emoji });
                }
                return { ...a, reacciones: newReactions };
            }
            return a;
        }));

        // 2. Llamada al Backend
        try {
            await fetch(`http://localhost:8080/api/anuncios/${anuncioId}/react`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id, emoji: emoji })
            })
        } catch (error) {
            console.error("Error al reaccionar", error);
            fetchAnuncios(); // Revertir si falla
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await fetch(`http://localhost:8080/api/anuncios/${id}`, { method: "DELETE" })
            setAnuncios(prev => prev.filter(a => a.id !== id))
            toast.success("Anuncio eliminado")
        } catch (error) {
            toast.error("Error al eliminar")
        }
    }

    const handleTogglePin = async (id: number) => {
        try {
            await fetch(`http://localhost:8080/api/anuncios/${id}/fijar`, { method: "PUT" })
            fetchAnuncios()
            toast.success("Estado actualizado")
        } catch (error) {
            toast.error("Error al actualizar")
        }
    }

    const AnuncioCard = ({ anuncio }: { anuncio: Anuncio }) => {
        const isAdmin = userRole === "Administrador";
        const isAuthor = user?.id === anuncio.autorId;

        const reactionCounts = anuncio.reacciones.reduce((acc, curr) => {
            acc[curr.emoji] = (acc[curr.emoji] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const myReaction = anuncio.reacciones.find(r => r.userId === user?.id)?.emoji;

        return (
            <div className={`group relative p-5 rounded-xl border transition-all hover:shadow-md ${anuncio.fijado ? "border-primary/40 bg-primary/5" : "border-border bg-card"}`}>

                {anuncio.fijado && (
                    <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground p-1.5 rounded-full shadow-sm rotate-12">
                        <Pin className="h-3 w-3 fill-current" />
                    </div>
                )}

                <div className="flex gap-4">
                    <div className="flex-shrink-0">
                        <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${anuncio.autorNombre}`} />
                            <AvatarFallback>{anuncio.autorNombre[0]}</AvatarFallback>
                        </Avatar>
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-[15px] text-foreground hover:underline cursor-pointer">
                                        {anuncio.autorNombre}
                                    </span>
                                    {anuncio.autorRol === "Administrador" && (
                                        <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-primary text-primary-foreground hover:bg-primary/90 rounded-full transition-all border-0 gap-1">
                                            <ShieldCheck className="h-3 w-3" /> Admin
                                        </Badge>
                                    )}
                                    {anuncio.autorRol === "Agente" && (
                                        <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-0 gap-1">
                                            <CheckCircle2 className="h-3 w-3" /> Staff
                                        </Badge>
                                    )}
                                    <span className="text-xs text-muted-foreground">· {new Date(anuncio.fechaCreacion).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {(isAdmin || isAuthor) && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground -mr-2">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {isAdmin && (
                                            <DropdownMenuItem onClick={() => handleTogglePin(anuncio.id)}>
                                                <Pin className="mr-2 h-4 w-4" /> {anuncio.fijado ? "Desfijar" : "Fijar"}
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(anuncio.id)}>
                                            <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>

                        <div className="mt-2 text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                            {anuncio.contenido}
                        </div>

                        {/* REACCIONES ANIMADAS TIPO DISCORD */}
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="h-8 w-8 rounded-full p-0 bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all hover:scale-110 active:scale-95"
                                    >
                                        <SmilePlus className="h-4 w-4" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto p-2 flex gap-1 bg-card/95 backdrop-blur-sm border shadow-xl animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 duration-200"
                                    align="start"
                                    sideOffset={8}
                                >
                                    {AVAILABLE_REACTIONS.map((emoji, index) => (
                                        <button
                                            key={emoji}
                                            onClick={() => handleReaction(anuncio.id, emoji)}
                                            className="group relative h-10 w-10 flex items-center justify-center text-xl rounded-lg transition-all duration-200 hover:scale-125 hover:-translate-y-1 active:scale-95 hover:bg-accent/50"
                                        >
                                            <span className="group-hover:animate-bounce">{emoji}</span>
                                            <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-primary/0 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                        </button>
                                    ))}
                                </PopoverContent>
                            </Popover>

                            {Object.entries(reactionCounts).map(([emoji, count]) => {
                                const isMyReaction = myReaction === emoji;
                                return (
                                    <button
                                        key={emoji}
                                        onClick={() => handleReaction(anuncio.id, emoji)}
                                        className={`
                                            group relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold 
                                            transition-all duration-200 border
                                            hover:scale-110 active:scale-95
                                            ${isMyReaction
                                                ? "bg-primary/15 border-primary/40 text-primary shadow-sm"
                                                : "bg-muted/30 border-border/50 hover:bg-muted hover:border-border text-muted-foreground hover:text-foreground"
                                            }
                                        `}
                                    >
                                        <span className="text-base group-hover:scale-125 transition-transform duration-200">{emoji}</span>
                                        <span className={`${isMyReaction ? 'font-bold' : 'font-medium'}`}>{count}</span>

                                        {isMyReaction && (
                                            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-75" style={{ animationDuration: '2s' }} />
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="dark min-h-screen bg-background">
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
          <DashboardHeader pageTitle="Comunidad" />

                    <div className="flex flex-col lg:flex-row flex-1 max-w-6xl mx-auto w-full p-4 md:p-6 gap-8">
                        <div className="flex-1 space-y-6 min-w-0">
                            <div className="rounded-2xl bg-gradient-to-r from-primary/90 to-purple-600 p-6 text-white shadow-lg relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <Megaphone className="h-32 w-32 -rotate-12" />
                                </div>
                                <div className="relative z-10">
                                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3 mb-2">
                                        <Megaphone className="h-8 w-8" /> Novedades SISGI
                                    </h1>
                                    <p className="text-primary-foreground/90 max-w-md text-sm md:text-base">
                                        Mantente al día con las últimas noticias, actualizaciones y anuncios importantes del equipo.
                                    </p>
                                </div>
                            </div>

                            <Card className="border shadow-sm overflow-hidden">
                                <CardContent className="pt-4 pb-3 px-4">
                                    <div className="flex gap-3">
                                        <Avatar className="h-10 w-10 hidden sm:block border">
                                            <AvatarImage src={user?.imageUrl} />
                                            <AvatarFallback>YO</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <Textarea
                                                placeholder="Comparte una actualización con el equipo..."
                                                className="min-h-[60px] resize-none border-0 focus-visible:ring-0 p-0 text-base bg-transparent placeholder:text-muted-foreground/70"
                                                value={nuevoContenido}
                                                onChange={(e) => setNuevoContenido(e.target.value)}
                                            />
                                            <div className="flex justify-between items-center mt-3 pt-3 border-t border-border/50">
                                                <div className="flex gap-2">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary"><Sparkles className="h-4 w-4" /></Button>
                                                </div>
                                                <Button
                                                    onClick={handlePublicar}
                                                    disabled={!nuevoContenido.trim() || isPosting}
                                                    size="sm"
                                                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 transition-all"
                                                >
                                                    {isPosting ? "Enviando..." : "Publicar"} <Send className="ml-2 h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="space-y-4 pb-10">
                                {anuncios.length === 0 ? (
                                    <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed">
                                        <p className="text-muted-foreground">No hay novedades aún. ¡Sé el primero en publicar!</p>
                                    </div>
                                ) : (
                                    anuncios.map(anuncio => (
                                        <AnuncioCard key={anuncio.id} anuncio={anuncio} />
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="hidden lg:block w-80 shrink-0 space-y-6">
                            <Card className="bg-card/50 backdrop-blur-sm border shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-primary" /> Tendencias
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Anuncios esta semana</span>
                                            <span className="text-lg font-bold">{anuncios.length}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Interacciones</span>
                                            <span className="text-lg font-bold text-primary">
                                                {anuncios.reduce((acc, curr) => acc + curr.reacciones.length, 0)}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-card/50 backdrop-blur-sm border shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Users className="h-4 w-4 text-blue-500" /> Miembros Activos
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex -space-x-2 overflow-hidden p-1">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <Avatar key={i} className="inline-block border-2 border-background h-8 w-8">
                                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} />
                                                <AvatarFallback>U{i}</AvatarFallback>
                                            </Avatar>
                                        ))}
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-medium">
                                            +12
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="text-xs text-muted-foreground text-center px-4">
                                <p>© 2025 SISGI - Variedades Dipal</p>
                                <p>Política de Privacidad · Normas de la Comunidad</p>
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    )
}