"use client"

import React from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ExternalLink, Download, FileText, ImageIcon, X } from "lucide-react"
import { Documento } from "./types"

interface FilePreviewProps {
    doc: Documento
    children: React.ReactNode
}

export function FilePreviewModal({ doc, children }: FilePreviewProps) {
    const isImage = doc.tipo === "image"
    const isPdf = doc.extension?.toLowerCase() === "pdf"

    const fileUrl = `http://localhost:8080/api/documentos/download/${doc.id}`

    if (!isImage && !isPdf) return <>{children}</>

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-[95vw] h-[90vh] flex flex-col p-0 overflow-hidden">
                <DialogHeader className="p-4 border-b flex flex-row items-center justify-between">
                    <div className="flex items-center gap-3">
                        {isImage ? <ImageIcon className="h-5 w-5 text-purple-500" /> : <FileText className="h-5 w-5 text-red-500" />}
                        <DialogTitle className="text-base truncate max-w-[300px] md:max-w-md">{doc.nombre}</DialogTitle>
                    </div>
                    <div className="flex items-center gap-2 pr-8">
                        <Button variant="outline" size="sm" asChild>
                            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-2" /> Abrir en pestaña
                            </a>
                        </Button>
                        <Button variant="default" size="sm" asChild>
                            <a href={fileUrl} download={doc.nombre}>
                                <Download className="h-4 w-4 mr-2" /> Descargar
                            </a>
                        </Button>
                    </div>
                </DialogHeader>

                <div className="flex-1 bg-muted/20 flex items-center justify-center overflow-auto p-4">
                    {isImage ? (
                        <img
                            src={fileUrl}
                            alt={doc.nombre}
                            className="max-w-full max-h-full object-contain shadow-lg rounded-lg"
                        />
                    ) : (
                        <iframe
                            src={fileUrl}
                            className="w-full h-full border-none rounded-lg shadow-inner bg-white"
                            title={doc.nombre}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
