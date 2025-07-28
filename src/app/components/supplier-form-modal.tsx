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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Building, Phone, Mail, MapPin, CreditCard, FileText } from "lucide-react"
import { toast } from "sonner"
import { Proveedor } from "./types"

// Props del componente
interface SupplierFormModalProps {
  proveedor?: Proveedor
  modoEdicion?: boolean
  onSuccess?: () => void
  children: React.ReactNode
}

export function SupplierFormModal({
  proveedor,
  modoEdicion = false,
  onSuccess,
  children,
}: SupplierFormModalProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Estado inicial con todos los campos
  const initialState: Proveedor = {
    nombreEmpresa: "",
    personaContacto: "",
    telefono: "",
    email: "",
    nitRuc: "",
    tipoProveedor: "",
    sitioWeb: "",
    direccion: "",
    ciudad: "",
    pais: "",
    codigoPostal: "",
    condicionesPago: "",
    diasCredito: 0,
    descuentoGeneral: 0,
    notasObservaciones: "",
    estado: "Activo"
  }

  const [formData, setFormData] = useState<Proveedor>(initialState)
  
  // Opciones para los menús desplegables
  const tiposProveedor = ["Distribuidor Mayorista", "Fabricante", "Importador", "Otro"]
  const condicionesPago = ["Contado", "Crédito 15 días", "Crédito 30 días", "Crédito 60 días"]
  const paises = ["Colombia", "México", "Argentina", "Perú", "Otro"]

  // Carga los datos del proveedor si estamos en modo de edición
  useEffect(() => {
    if (modoEdicion && proveedor) {
      setFormData({ ...initialState, ...proveedor });
    }
  }, [modoEdicion, proveedor, open]);


  // Maneja cambios en Inputs y Textareas
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const finalValue = id === 'diasCredito' || id === 'descuentoGeneral' ? Number(value) : value;
    setFormData((prev) => ({ ...prev, [id]: finalValue }));
  };

  // Maneja cambios en los Selects
  const handleSelectChange = (field: keyof Proveedor, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Lógica para enviar el formulario al backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const url = modoEdicion
      ? `http://localhost:8080/api/proveedores/${proveedor?.id}`
      : "http://localhost:8080/api/proveedores"
    const method = modoEdicion ? "PUT" : "POST"

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(`Error al ${modoEdicion ? "actualizar" : "guardar"} el proveedor`)
      }

      toast.success(`Proveedor ${modoEdicion ? "actualizado" : "guardado"} con éxito`)
      setOpen(false)
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error("Error en la petición fetch:", error)
      toast.error(`Error al ${modoEdicion ? "actualizar" : "guardar"} el proveedor`)
    } finally {
      setIsLoading(false)
      if (!modoEdicion) {
        setFormData(initialState)
      }
    }
  }

  const isFormValid = formData.nombreEmpresa && formData.personaContacto && formData.telefono && formData.email && formData.nitRuc;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">

        <DialogHeader className="relative mb-2">
          <div className="flex items-center gap-4 p-4 rounded-t-lg bg-gradient-to-r from-primary/10 via-background to-background border-b">
            <div className="flex items-center justify-center rounded-full bg-primary/20 h-12 w-12 shadow-inner">
              <Building className="h-7 w-7" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-extrabold tracking-tight">
                {modoEdicion ? "Editar Proveedor" : "Agregar Nuevo Proveedor"}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mt-1 text-base">
                {modoEdicion
                  ? "Modifica la información del Proveedor y guarda los cambios."
                  : (
                    <>
                      Completa la información del Proveedor.<br />
                      <span className="text-destructive font-semibold">*</span>Campos obligatorios.
                    </>
                  )
                }
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información de la Empresa */}
          <div className="rounded-lg border bg-muted/50 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Building className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-lg">Información de la Empresa</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre_empresa">Nombre de la Empresa *</Label>
                <Input id="nombreEmpresa" value={formData.nombreEmpresa} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nit_ruc">NIT / RUC *</Label>
                <Input id="nitRuc" value={formData.nitRuc || ''} onChange={handleInputChange} required/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo_proveedor">Tipo de Proveedor</Label>
                <Select value={formData.tipoProveedor || ''} onValueChange={(value) => handleSelectChange("tipoProveedor", value)}>
                  <SelectTrigger><SelectValue placeholder="Selecciona el tipo" /></SelectTrigger>
                  <SelectContent>
                    {tiposProveedor.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sitio_web">Sitio Web</Label>
                <Input id="sitioWeb" value={formData.sitioWeb || ''} onChange={handleInputChange} />
              </div>
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="rounded-lg border bg-muted/50 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Phone className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-lg">Información de Contacto</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="persona_contacto">Persona de Contacto *</Label>
                    <Input id="personaContacto" value={formData.personaContacto} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono *</Label>
                    <Input id="telefono" value={formData.telefono} onChange={handleInputChange} required />
                </div>
            </div>
            <div className="mt-4 space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" value={formData.email} onChange={handleInputChange} required />
            </div>
          </div>
          
          {/* Dirección */}
          <div className="rounded-lg border bg-muted/50 p-4 shadow-sm">
             <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-lg">Dirección</h3>
            </div>
            <div className="space-y-2 mb-4">
                <Label htmlFor="direccion">Dirección Completa</Label>
                <Textarea id="direccion" value={formData.direccion || ''} onChange={handleInputChange} rows={2} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="ciudad">Ciudad</Label>
                    <Input id="ciudad" value={formData.ciudad || ''} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="pais">País</Label>
                     <Select value={formData.pais || ''} onValueChange={(value) => handleSelectChange("pais", value)}>
                        <SelectTrigger><SelectValue placeholder="Selecciona país" /></SelectTrigger>
                        <SelectContent>
                            {paises.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="codigo_postal">Código Postal</Label>
                    <Input id="codigoPostal" value={formData.codigoPostal || ''} onChange={handleInputChange} />
                </div>
            </div>
          </div>

          {/* Condiciones Comerciales */}
            <div className="rounded-lg border bg-muted/50 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-lg">Condiciones Comerciales</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="condiciones_pago">Condiciones de Pago</Label>
                        <Select value={formData.condicionesPago || ''} onValueChange={(value) => handleSelectChange("condicionesPago", value)}>
                           <SelectTrigger><SelectValue placeholder="Selecciona condición" /></SelectTrigger>
                           <SelectContent>
                               {condicionesPago.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                           </SelectContent>
                       </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="dias_credito">Días de Crédito</Label>
                        <Input id="diasCredito" type="number" value={formData.diasCredito || 0} onChange={handleInputChange} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="descuento_general">Descuentos (%)</Label>
                        <Input id="descuentoGeneral" type="number" step="0.1" value={formData.descuentoGeneral || 0} onChange={handleInputChange} />
                    </div>
                </div>
            </div>

            {/* Información Adicional */}
             <div className="rounded-lg border bg-muted/50 p-4 shadow-sm">
                 <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-lg">Información Adicional</h3>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="notas_observaciones">Notas y Observaciones</Label>
                    <Textarea id="notasObservaciones" value={formData.notasObservaciones || ''} onChange={handleInputChange} rows={3}/>
                </div>
            </div><hr />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!isFormValid || isLoading}>
              {isLoading ? "Guardando..." : "Guardar Proveedor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}