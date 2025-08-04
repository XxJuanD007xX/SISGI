"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, ShoppingCart, DollarSign, Calendar, FileText } from "lucide-react"
import { toast } from "sonner"
import { OrdenCompra, Proveedor } from "./types"

interface OrdenFormModalProps {
  orden?: OrdenCompra
  modoEdicion?: boolean
  onSuccess?: () => void
  children: React.ReactNode
}

export function OrdenCompraFormModal({ orden, modoEdicion = false, onSuccess, children }: OrdenFormModalProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [listaProveedores, setListaProveedores] = useState<Proveedor[]>([])

  const initialState: Partial<OrdenCompra> = {
    proveedor: undefined,
    fechaOrden: new Date().toISOString().split('T')[0], // Fecha de hoy por defecto
    estado: "Pendiente",
    total: 0,
    observaciones: "",
  }

  const [formData, setFormData] = useState(initialState)

  // Cargar proveedores y datos de la orden si está en modo edición
  useEffect(() => {
    if (open) {
      const fetchProveedores = async () => {
        try {
          const response = await fetch("http://localhost:8080/api/proveedores")
          if (response.ok) setListaProveedores(await response.json())
        } catch (error) {
          toast.error("No se pudo cargar la lista de proveedores.")
        }
      }
      fetchProveedores()

      if (modoEdicion && orden) {
        setFormData(orden)
      } else {
        setFormData(initialState)
      }
    }
  }, [open, modoEdicion, orden])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: id === 'total' ? Number(value) : value }));
  };

  const handleSelectChange = (field: keyof OrdenCompra, value: string) => {
      if (field === 'proveedor') {
          const proveedorSeleccionado = listaProveedores.find(p => p.id === Number(value));
          setFormData(prev => ({ ...prev, proveedor: proveedorSeleccionado }));
      } else {
          setFormData(prev => ({ ...prev, [field]: value }));
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const url = modoEdicion ? `http://localhost:8080/api/ordenes/${orden?.id}` : "http://localhost:8080/api/ordenes"
    const method = modoEdicion ? "PUT" : "POST"

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error(`Error al ${modoEdicion ? "actualizar" : "crear"} la orden`)
      
      toast.success(`Orden ${modoEdicion ? "actualizada" : "creada"} con éxito`)
      setOpen(false)
      if (onSuccess) onSuccess()
    } catch (error) {
      toast.error(`Error al ${modoEdicion ? "actualizar" : "crear"} la orden`)
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = formData.proveedor && formData.fechaOrden && formData.total! > 0

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">

        <DialogHeader className="relative mb-2">
            <div className="flex items-center gap-4 p-4 rounded-t-lg bg-gradient-to-r from-primary/10 via-background to-background border-b">
                <div className="flex items-center justify-center rounded-full bg-primary/20 h-12 w-12 shadow-inner">
                    <ShoppingCart className="h-7 w-7" />
                </div>
                <div>
                    <DialogTitle className="text-2xl font-extrabold tracking-tight">{modoEdicion ? "Editar Orden de Compra" : "Nueva Orden de Compra"}</DialogTitle>
                    <DialogDescription className="text-muted-foreground mt-1 text-base">Completa los detalles del pedido al proveedor.</DialogDescription>
                </div>
            </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-lg border bg-muted/50 p-4 shadow-sm">
            <div className="space-y-2">
                <Label htmlFor="proveedor">Proveedor *</Label>
                <Select value={formData.proveedor?.id?.toString()} onValueChange={(value) => handleSelectChange("proveedor", value)}>
                    <SelectTrigger><SelectValue placeholder="Selecciona un proveedor" /></SelectTrigger>
                    <SelectContent>
                        {listaProveedores.map((p) => <SelectItem key={p.id} value={p.id!.toString()}>{p.nombreEmpresa}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div><br />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="fechaOrden">Fecha de la Orden *</Label>
                    <Input id="fechaOrden" type="date" value={formData.fechaOrden} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="estado">Estado *</Label>
                     <Select value={formData.estado} onValueChange={(value) => handleSelectChange("estado", value)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Pendiente">Pendiente</SelectItem>
                            <SelectItem value="Recibido">Recibido</SelectItem>
                            <SelectItem value="Cancelado">Cancelado</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div><br />
             <div className="space-y-2">
                <Label htmlFor="total">Monto Total *</Label>
                <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="total" type="number" step="0.01" placeholder="0.00" className="pl-8" value={formData.total} onChange={handleInputChange} required />
                </div>
            </div><br />
            <div className="space-y-2">
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea id="observaciones" placeholder="Añade notas o detalles importantes sobre el pedido..." value={formData.observaciones || ''} onChange={handleInputChange} />
            </div> 
          </div><hr />
          <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>Cancelar</Button>
              <Button type="submit" disabled={!isFormValid || isLoading}>{isLoading ? "Guardando..." : "Guardar Orden"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}