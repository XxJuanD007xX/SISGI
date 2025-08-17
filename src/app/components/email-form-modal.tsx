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
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import { toast } from "sonner"
import { OrdenCompra } from "./types"

interface EmailFormModalProps {
  orden: OrdenCompra
  children: React.ReactNode
}

export function EmailFormModal({ orden, children }: EmailFormModalProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [emailData, setEmailData] = useState({
    destinatario: "",
    asunto: "",
    cuerpo: "",
  })

  useEffect(() => {
    if (open && orden.proveedor) {
      setEmailData({
        destinatario: orden.proveedor.email || "",
        asunto: `Orden de Compra #${orden.id} - Variedades Dipal`,
        cuerpo: `Hola ${orden.proveedor.nombreEmpresa},\n\nAdjuntamos la orden de compra #${orden.id} para su gestión.\n\nGracias,\nEquipo de Variedades Dipal.`,
      })
    }
  }, [open, orden])

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch(`http://localhost:8080/api/ordenes/${orden.id}/enviar-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailData),
      })

      if (!response.ok) {
        throw new Error("El servidor no pudo enviar el correo.")
      }

      toast.success("Correo enviado exitosamente!")
      setOpen(false)
    } catch (error) {
      toast.error(`Error al enviar el correo: ${error instanceof Error ? error.message : "Error desconocido"}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        
        <DialogHeader className="relative mb-2">

          <div className="flex items-center gap-4 p-4 rounded-t-lg bg-gradient-to-r from-primary/10 via-background to-background border-b">
              <div className="flex items-center justify-center rounded-full bg-primary/20 h-12 w-12 shadow-inner">
                  <Send className="h-7 w-7" />
              </div>
              <div>
                <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
                  Enviar Orden de Compra por Correo
                </DialogTitle>
                <DialogDescription>
                  Revisa y confirma los detalles antes de enviar el correo al proveedor.
                </DialogDescription>
              </div>
          </div>

        </DialogHeader>

        <form onSubmit={handleSendEmail} className="space-y-4 pt-4">

          <div className="rounded-lg border bg-muted/50 p-4 mb-6 shadow-sm">

            <div className="space-y-2">
              <Label htmlFor="destinatario">Destinatario</Label>
              <Input
                id="destinatario"
                type="email"
                value={emailData.destinatario}
                onChange={(e) => setEmailData({ ...emailData, destinatario: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="asunto">Asunto</Label>
              <Input
                id="asunto"
                value={emailData.asunto}
                onChange={(e) => setEmailData({ ...emailData, asunto: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="rounded-lg border bg-muted/50 p-4 mb-6 shadow-sm">
            <div className="space-y-2">
              <Label htmlFor="cuerpo">Cuerpo del Mensaje</Label>
              <Textarea
                id="cuerpo"
                value={emailData.cuerpo}
                onChange={(e) => setEmailData({ ...emailData, cuerpo: e.target.value })}
                rows={6}
                required
              />
            </div><br />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Enviando..." : "Enviar Correo"}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}