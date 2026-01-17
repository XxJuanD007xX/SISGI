"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Youtube, FolderPlus, FilePlus, Link as LinkIcon, Check, FileText } from "lucide-react"
import { toast } from "sonner"
import { useUser } from "@clerk/nextjs"

interface DocumentUploadModalProps {
    currentFolderId: number | null
    onSuccess: () => void
    children: React.ReactNode
}

const folderColors = [
    { name: "blue", value: "text-blue-500", bg: "bg-blue-500", label: "Azul" },
    { name: "red", value: "text-red-500", bg: "bg-red-500", label: "Rojo" },
    { name: "green", value: "text-emerald-500", bg: "bg-emerald-500", label: "Verde" },
    { name: "amber", value: "text-amber-500", bg: "bg-amber-500", label: "Ámbar" },
    { name: "purple", value: "text-purple-500", bg: "bg-purple-500", label: "Púrpura" },
    { name: "pink", value: "text-pink-500", bg: "bg-pink-500", label: "Rosa" },
]

export function DocumentUploadModal({ currentFolderId, onSuccess, children }: DocumentUploadModalProps) {
    const { user } = useUser()
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState<'file' | 'video' | 'folder'>('file')
    const [selectedColor, setSelectedColor] = useState("blue")

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "general",
        url: "",
        file: null as File | null
    })

    useEffect(() => {
        if (open) {
            setFormData({ name: "", description: "", category: "general", url: "", file: null })
            setSelectedColor("blue")
        }
    }, [open, activeTab])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData({
                ...formData,
                file: file,
                name: formData.name || file.name
            })
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (activeTab === 'file' && !formData.file) return toast.error("Selecciona un archivo.");
        if (activeTab === 'video' && !formData.url) return toast.error("Ingresa la URL del video.");
        if (!formData.name) return toast.error("El nombre es obligatorio.");

        setIsLoading(true)
        const author = user?.fullName || user?.username || "Usuario"

        try {
            if (activeTab === 'folder') {
                const res = await fetch("http://localhost:8080/api/documentos/carpetas", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        nombre: formData.name,
                        color: folderColors.find(c => c.name === selectedColor)?.value,
                        autor: author,
                        parentId: currentFolderId
                    })
                })
                if (!res.ok) throw new Error()
                toast.success("Carpeta creada correctamente")
            } else {
                // Upload file or video (for now we handle videos as documents with URL)
                // If it's a video file, it's a file. If it's a Youtube link, we might need another approach.
                // In this implementation, let's assume 'video' tab is for links.

                if (activeTab === 'file') {
                    const data = new FormData()
                    data.append("file", formData.file!)
                    data.append("autor", author)
                    if (currentFolderId) data.append("carpetaId", currentFolderId.toString())

                    const res = await fetch("http://localhost:8080/api/documentos/upload", {
                        method: "POST",
                        body: data
                    })
                    if (!res.ok) throw new Error()
                    toast.success("Archivo subido correctamente")
                } else {
                    // Manual entry for video link? Let's keep it simple for now or extend backend
                    // For now, let's just do file upload.
                    toast.info("Funcionalidad de enlaces de video en desarrollo")
                }
            }
            onSuccess()
            setOpen(false)
        } catch (error) {
            toast.error("Error al procesar la solicitud")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">

                <DialogHeader className="relative mb-2">
                    <div className="flex items-center gap-4 p-4 rounded-t-lg bg-gradient-to-r from-primary/10 via-background to-background border-b">
                        <div className="flex items-center justify-center rounded-full bg-primary/20 h-12 w-12 shadow-inner">
                            <FilePlus className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-extrabold tracking-tight">
                                {activeTab === 'folder' ? "Nueva Carpeta" : "Agregar Elemento"}
                            </DialogTitle>
                            <DialogDescription className="text-muted-foreground mt-1 text-base">
                                Gestiona el contenido de tu repositorio digital.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Pestañas Visuales */}
                <div className="flex gap-1 p-1 bg-muted rounded-lg mb-2">
                    {[
                        { id: 'file', label: 'Archivo', icon: Upload },
                        { id: 'video', label: 'Video', icon: Youtube },
                        { id: 'folder', label: 'Carpeta', icon: FolderPlus }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${activeTab === tab.id ? 'bg-background text-foreground shadow-sm ring-1 ring-black/5 dark:ring-white/10' : 'text-muted-foreground hover:text-foreground hover:bg-background/50'}`}
                        >
                            <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? 'text-primary' : ''}`} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 mt-2">

                    {/* --- SECCIÓN ARCHIVO --- */}
                    {activeTab === 'file' && (
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:bg-muted/50 transition-all relative group">
                            <Input
                                id="archivo"
                                type="file"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="flex flex-col items-center gap-3 transition-transform group-hover:scale-105 duration-200">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Upload className="h-6 w-6 text-primary" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">
                                        {formData.file ? <span className="text-primary">{formData.file.name}</span> : "Haz clic para subir o arrastra aquí"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">Soporta PDF, DOCX, Excel, Imágenes, etc.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- SECCIÓN URL --- */}
                    {activeTab === 'video' && (
                        <div className="space-y-2">
                            <Label htmlFor="url">Enlace de Video</Label>
                            <div className="relative">
                                <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="url"
                                    placeholder="https://youtube.com/watch?v=..."
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                    className="pl-9"
                                />
                            </div>
                        </div>
                    )}

                    {/* --- CAMPOS COMUNES --- */}
                    <div className="space-y-2">
                        <Label htmlFor="nombre">
                            {activeTab === 'folder' ? "Nombre de la Carpeta" : "Título"}
                        </Label>
                        <Input
                            id="nombre"
                            placeholder={activeTab === 'folder' ? "Ej: Finanzas 2025" : "Ej: Manual de Procedimientos"}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    {/* --- SELECTOR DE COLOR (Solo Carpetas) --- */}
                    {activeTab === 'folder' && (
                        <div className="space-y-3">
                            <Label>Color de Carpeta</Label>
                            <div className="flex gap-3">
                                {folderColors.map((color) => (
                                    <button
                                        key={color.name}
                                        type="button"
                                        onClick={() => setSelectedColor(color.name)}
                                        className={`h-8 w-8 rounded-full ${color.bg} flex items-center justify-center transition-transform hover:scale-110 ring-offset-background ${selectedColor === color.name ? 'ring-2 ring-foreground ring-offset-2' : ''}`}
                                        title={color.label}
                                    >
                                        {selectedColor === color.name && <Check className="h-4 w-4 text-white drop-shadow-md" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- CATEGORÍA Y DESCRIPCIÓN (No para carpetas) --- */}
                    {activeTab !== 'folder' && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="categoria">Categoría</Label>
                                    <Select onValueChange={(val) => setFormData({ ...formData, category: val })} defaultValue="general">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="general">General</SelectItem>
                                            <SelectItem value="manuales">Manuales</SelectItem>
                                            <SelectItem value="tecnica">Técnica</SelectItem>
                                            <SelectItem value="legal">Legal</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="descripcion">Descripción (Opcional)</Label>
                                <Textarea
                                    id="descripcion"
                                    placeholder="Detalles adicionales..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={2}
                                />
                            </div>
                        </>
                    )}

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                        <Button type="submit" disabled={isLoading} className="bg-primary text-primary-foreground hover:bg-primary/90">
                            {isLoading ? "Guardando..." : "Guardar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
