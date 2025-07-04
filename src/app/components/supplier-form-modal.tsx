"use client"

import type React from "react"

import { useState } from "react"
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
import { Badge } from "@/components/ui/badge"
import { Plus, Building, Phone, Mail, MapPin, CreditCard, FileText } from "lucide-react"

interface SupplierFormData {
  nombre: string
  contacto: string
  telefono: string
  email: string
  direccion: string
  ciudad: string
  pais: string
  codigoPostal: string
  tipoProveedor: string
  condicionesPago: string
  diasCredito: string
  descuentos: string
  notas: string
  sitioWeb: string
  nit: string
}

export function SupplierFormModal() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<SupplierFormData>({
    nombre: "",
    contacto: "",
    telefono: "",
    email: "",
    direccion: "",
    ciudad: "",
    pais: "",
    codigoPostal: "",
    tipoProveedor: "",
    condicionesPago: "",
    diasCredito: "",
    descuentos: "",
    notas: "",
    sitioWeb: "",
    nit: "",
  })

  const tiposProveedor = [
    "Distribuidor Mayorista",
    "Fabricante",
    "Importador",
    "Distribuidor Local",
    "Proveedor de Servicios",
    "Otro",
  ]

  const condicionesPago = [
    "Contado",
    "Crédito 15 días",
    "Crédito 30 días",
    "Crédito 45 días",
    "Crédito 60 días",
    "Crédito 90 días",
  ]

  const paises = [
    "Colombia",
    "México",
    "Argentina",
    "Chile",
    "Perú",
    "Ecuador",
    "Venezuela",
    "Brasil",
    "Estados Unidos",
    "España",
    "Otro",
  ]

  const handleInputChange = (field: keyof SupplierFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simular llamada a API
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Datos del proveedor:", formData)

    // Resetear formulario
    setFormData({
      nombre: "",
      contacto: "",
      telefono: "",
      email: "",
      direccion: "",
      ciudad: "",
      pais: "",
      codigoPostal: "",
      tipoProveedor: "",
      condicionesPago: "",
      diasCredito: "",
      descuentos: "",
      notas: "",
      sitioWeb: "",
      nit: "",
    })

    setIsLoading(false)
    setOpen(false)
  }

  const isFormValid = formData.nombre && formData.contacto && formData.telefono && formData.email

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-fit">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Proveedor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/40 scrollbar-track-muted/10">
        <DialogHeader className="relative mb-2">
          <div className="flex items-center gap-4 p-4 rounded-t-lg bg-gradient-to-r from-primary/10 via-background to-background border-b">
            <div className="flex items-center justify-center rounded-full bg-primary/20 h-12 w-12 shadow-inner">
              {/* Cambia el icono según el formulario */}
              <Building className="h-7 w-7" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-extrabold tracking-tight">
                Agregar Nuevo Proveedor
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mt-1 text-base">
                Registra un nuevo proveedor en el sistema.<br />
                <span className="text-destructive font-semibold">*</span> Campos obligatorios.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información de la Empresa */}
          <div className="rounded-lg border bg-muted/50 p-4 mb-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Building className="h-4 w-4" />
              <h3 className="font-semibold text-lg">Información de la Empresa</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre de la Empresa *</Label>
                <Input
                  id="nombre"
                  placeholder="Ej: Distribuidora Tech S.A.S"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange("nombre", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nit">NIT / RUC</Label>
                <Input
                  id="nit"
                  placeholder="Ej: 900123456-7"
                  value={formData.nit}
                  onChange={(e) => handleInputChange("nit", e.target.value)}
                />
              </div>
            </div><br />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipoProveedor">Tipo de Proveedor</Label>
                <Select
                  value={formData.tipoProveedor}
                  onValueChange={(value) => handleInputChange("tipoProveedor", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposProveedor.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sitioWeb">Sitio Web</Label>
                <Input
                  id="sitioWeb"
                  placeholder="https://www.ejemplo.com"
                  value={formData.sitioWeb}
                  onChange={(e) => handleInputChange("sitioWeb", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="rounded-lg border bg-muted/50 p-4 mb-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Phone className="h-4 w-4" />
              <h3 className="font-semibold text-lg">Información de Contacto</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="space-y-2">
                <Label htmlFor="contacto">
                  <div className="flex items-center gap-1">
                    Persona de Contacto *
                  </div>
                </Label>
                <Input
                  id="contacto"
                  placeholder="Ej: Carlos Mendez"
                  value={formData.contacto}
                  onChange={(e) => handleInputChange("contacto", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono">
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    Teléfono *
                  </div>
                </Label>
                <Input
                  id="telefono"
                  placeholder="+57 300 123 4567"
                  value={formData.telefono}
                  onChange={(e) => handleInputChange("telefono", e.target.value)}
                  required
                />
              </div>
              
            </div><br />

            <div className="space-y-2">
              <Label htmlFor="email">
                <div className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  Email *
                </div>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="contacto@empresa.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Dirección */}
          <div className="rounded-lg border bg-muted/50 p-4 mb-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4" />
              <h3 className="font-semibold text-lg">Dirección</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección Completa</Label>
              <Textarea
                id="direccion"
                placeholder="Calle, número, barrio, referencias..."
                value={formData.direccion}
                onChange={(e) => handleInputChange("direccion", e.target.value)}
                rows={2}
              />
            </div><br />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ciudad">Ciudad</Label>
                <Input
                  id="ciudad"
                  placeholder="Ej: Bogotá"
                  value={formData.ciudad}
                  onChange={(e) => handleInputChange("ciudad", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pais">País</Label>
                <Select value={formData.pais} onValueChange={(value) => handleInputChange("pais", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona país" />
                  </SelectTrigger>
                  <SelectContent>
                    {paises.map((pais) => (
                      <SelectItem key={pais} value={pais}>
                        {pais}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="codigoPostal">Código Postal</Label>
                <Input
                  id="codigoPostal"
                  placeholder="110111"
                  value={formData.codigoPostal}
                  onChange={(e) => handleInputChange("codigoPostal", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Condiciones Comerciales */}
          <div className="rounded-lg border bg-muted/50 p-4 mb-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="h-4 w-4" />
              <h3 className="font-semibold text-lg">Condiciones Comerciales</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="condicionesPago">Condiciones de Pago</Label>
                <Select
                  value={formData.condicionesPago}
                  onValueChange={(value) => handleInputChange("condicionesPago", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona condición" />
                  </SelectTrigger>
                  <SelectContent>
                    {condicionesPago.map((condicion) => (
                      <SelectItem key={condicion} value={condicion}>
                        {condicion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="diasCredito">Días de Crédito</Label>
                <Input
                  id="diasCredito"
                  type="number"
                  placeholder="30"
                  value={formData.diasCredito}
                  onChange={(e) => handleInputChange("diasCredito", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descuentos">Descuentos (%)</Label>
                <Input
                  id="descuentos"
                  type="number"
                  step="0.1"
                  placeholder="5.0"
                  value={formData.descuentos}
                  onChange={(e) => handleInputChange("descuentos", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Notas Adicionales */}
          <div className="rounded-lg border bg-muted/50 p-4 mb-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4" />
              <h3 className="font-semibold text-lg">Información Adicional</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notas">Notas y Observaciones</Label>
              <Textarea
                id="notas"
                placeholder="Información adicional sobre el proveedor, productos que maneja, horarios de atención, etc."
                value={formData.notas}
                onChange={(e) => handleInputChange("notas", e.target.value)}
                rows={3}
              />
            </div>
          </div><hr />

          {/* Preview */}
          {isFormValid && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Vista Previa</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{formData.nombre}</Badge>
                <Badge variant="secondary">{formData.contacto}</Badge>
                {formData.tipoProveedor && <Badge variant="outline">{formData.tipoProveedor}</Badge>}
                {formData.ciudad && <Badge variant="outline">{formData.ciudad}</Badge>}
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
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
