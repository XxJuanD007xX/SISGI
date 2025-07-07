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
import { Plus, Package, DollarSign, Hash, Tag, FileText } from "lucide-react"
import { toast } from "sonner"
import { Product } from "./types"

interface ProductFormModalProps {
  producto?: Product // opcional, para edición
  modoEdicion?: boolean
  onSuccess?: () => void
}

export function ProductFormModal({ producto, modoEdicion, onSuccess }: ProductFormModalProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState(
    producto
      ? { ...producto }
      : {
          nombre: "",
          descripcion: "",
          categoria: "",
          precio: "",
          stock: "",
          stockMinimo: "",
          codigoBarras: "",
          marca: "",
          proveedor: "",
          ubicacion: "",
        }
  )

  const categorias = [
    "Electrónicos",
    "Ropa y Accesorios",
    "Hogar y Decoración",
    "Deportes y Recreación",
    "Salud y Belleza",
    "Libros y Medios",
    "Juguetes",
    "Automotriz",
    "Herramientas",
    "Otros",
  ]

  const proveedores = [
    "Distribuidora Tech",
    "Textiles del Norte",
    "Hogar y Decoración",
    "Deportes Extremos",
    "Belleza Total",
    "Librería Central",
  ]

  interface ProductFormData {
    nombre: string
    descripcion: string
    categoria: string
    precio: string
    stock: string
    stockMinimo: string
    codigoBarras: string
    marca: string
    proveedor: string
    ubicacion: string
  }

  const handleInputChange = (field: keyof ProductFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // =============================================================================================================
  // ------------------------------------------- FETCH AL BACKEND -------------------------------------------
  // =============================================================================================================

  // Esta función se encarga de enviar los datos del formulario al backend

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    setIsLoading(true);

    try {
        // La URL de tu API de Java que creamos
        const response = await fetch(
          modoEdicion
            ? `http://localhost:8080/api/products/${producto?.id}`
            : 'http://localhost:8080/api/products',
          {
            method: modoEdicion ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          }
        )


        if (!response.ok) {
            // Si el backend devuelve un error, lo lanzamos para que lo capture el 'catch'
            throw new Error('Error al guardar el producto');
        }

        // Si todo sale bien, leemos la respuesta del backend
        const nuevoProductoGuardado = await response.json();
        console.log('¡Producto guardado en la BD!:', nuevoProductoGuardado);
        toast.success("Producto guardado con éxito")

        setOpen(false); // Cierra el modal

        if (onSuccess) onSuccess() // ✅ LLAMA LA FUNCIÓN QUE RECARGA LA LISTA

    } catch (error) {
        console.error("Hubo un error en la petición fetch:", error);
        toast.error("Error al guardar el producto")

    } finally {
        setIsLoading(false); // Detiene el indicador de carga, tanto en éxito como en error

        // Opcional: Resetear el formulario después de enviar
        setFormData({
            nombre: "",
            descripcion: "",
            categoria: "",
            precio: "",
            stock: "",
            stockMinimo: "",
            codigoBarras: "",
            marca: "",
            proveedor: "",
            ubicacion: "",
        });
        
    }
    
  };

  const isFormValid = formData.nombre && formData.categoria && formData.precio && formData.stock

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-fit">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Producto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">

        <DialogHeader className="relative mb-2">
          <div className="flex items-center gap-4 p-4 rounded-t-lg bg-gradient-to-r from-primary/10 via-background to-background border-b">
            <div className="flex items-center justify-center rounded-full bg-primary/20 h-12 w-12 shadow-inner">
              <Package className="h-7 w-7" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-extrabold tracking-tight">
                {modoEdicion ? "Editar Producto" : "Agregar Nuevo Producto"}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mt-1 text-base">
                {modoEdicion
                  ? "Modifica la información del producto y guarda los cambios."
                  : (
                    <>
                      Completa la información del producto.<br />
                      <span className="text-destructive font-semibold">*</span>Campos obligatorios.
                    </>
                  )
                }
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="rounded-lg border bg-muted/50 p-4 mb-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="h-4 w-4 text-primary" />
              <h3 className="font-medium text-lg">Información Básica</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del Producto *</Label>
                <Input
                  id="nombre"
                  placeholder="Ej: Smartphone XYZ-123"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange("nombre", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="marca">Marca</Label>
                <Input
                  id="marca"
                  placeholder="Ej: Samsung, Apple, Nike"
                  value={formData.marca}
                  onChange={(e) => handleInputChange("marca", e.target.value)}
                />
              </div>
            </div><br />

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                placeholder="Describe las características principales del producto..."
                value={formData.descripcion}
                onChange={(e) => handleInputChange("descripcion", e.target.value)}
                rows={3}
              />
            </div><br />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoría *</Label>
                <Select value={formData.categoria} onValueChange={(value) => handleInputChange("categoria", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((categoria) => (
                      <SelectItem key={categoria} value={categoria}>
                        {categoria}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="codigoBarras">Código de Barras</Label>
                <Input
                  id="codigoBarras"
                  placeholder="Ej: 1234567890123"
                  value={formData.codigoBarras}
                  onChange={(e) => handleInputChange("codigoBarras", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Información de Inventario */}
          <div className="rounded-lg border bg-muted/50 p-4 mb-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Hash className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-lg">Inventario y Precios</h3>
            </div><br />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="precio">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    Precio *
                  </div>
                </Label>
                <Input
                  id="precio"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.precio}
                  onChange={(e) => handleInputChange("precio", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">
                  <div className="flex items-center gap-1">
                    Stock Actual *
                  </div>
                </Label>
                <Input
                  id="stock"
                  type="number"
                  placeholder="0"
                  value={formData.stock}
                  onChange={(e) => handleInputChange("stock", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stockMinimo">
                  <div className="flex items-center gap-1">
                    Stock Mínimo
                  </div>
                </Label>
                <Input
                  id="stockMinimo"
                  type="number"
                  placeholder="5"
                  value={formData.stockMinimo}
                  onChange={(e) => handleInputChange("stockMinimo", e.target.value)}
                />
              </div>

            </div>
            
          </div>

          {/* Información Adicional */}
          <div className="rounded-lg border bg-muted/50 p-4 mb-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-lg">Información Adicional</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="proveedor">Proveedor</Label>
                <Select value={formData.proveedor} onValueChange={(value) => handleInputChange("proveedor", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un proveedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {proveedores.map((proveedor) => (
                      <SelectItem key={proveedor} value={proveedor}>
                        {proveedor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ubicacion">Ubicación en Almacén</Label>
                <Input
                  id="ubicacion"
                  placeholder="Ej: A-1-3, Estante B, Zona 2"
                  value={formData.ubicacion}
                  onChange={(e) => handleInputChange("ubicacion", e.target.value)}
                />
              </div>
            </div>
          </div><hr />

          {/* Preview */}
          {isFormValid && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Vista Previa</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{formData.nombre}</Badge>
                <Badge variant="secondary">{formData.categoria}</Badge>
                {formData.precio && <Badge variant="outline">${formData.precio}</Badge>}
                {formData.stock && <Badge variant="outline">Stock: {formData.stock}</Badge>}
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!isFormValid || isLoading}>
              {isLoading ? "Guardando..." : "Guardar Producto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
