"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Plus, DollarSign, PackageSearch, Trash2, User } from "lucide-react"
import { toast } from "sonner"
import { Product, Venta, DetalleVenta } from "./types"

interface VentaFormModalProps {
  onSuccess?: () => void
  children: React.ReactNode
}

export function VentaFormModal({ onSuccess, children }: VentaFormModalProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [listaProductos, setListaProductos] = useState<Product[]>([])
  const [productoSeleccionado, setProductoSeleccionado] = useState<Product | null>(null);
  const [cantidadProducto, setCantidadProducto] = useState(1);

  const initialState: Partial<Venta> = {
    fechaVenta: new Date().toISOString().split('T')[0],
    cliente: "",
    total: 0,
    detalles: [],
  }

  const [formData, setFormData] = useState(initialState)

  useEffect(() => {
    if (open) {
      const fetchProducts = async () => {
        try {
          const res = await fetch("http://localhost:8080/api/products");
          if (res.ok) setListaProductos(await res.json());
        } catch (error) {
          toast.error("No se pudo cargar la lista de productos.");
        }
      }
      fetchProducts();
      setFormData(initialState); // Resetea el formulario cada vez que se abre
    }
  }, [open])

  useEffect(() => {
    const nuevoTotal = formData.detalles?.reduce((acc, detalle) => acc + (detalle.precioUnitario * detalle.cantidad), 0) ?? 0;
    setFormData(prev => ({ ...prev, total: nuevoTotal }));
  }, [formData.detalles]);

  const handleAddProducto = () => {
    if (!productoSeleccionado || cantidadProducto <= 0) {
      toast.warning("Selecciona un producto y una cantidad válida.");
      return;
    }
     if (productoSeleccionado.stock < cantidadProducto) {
      toast.error(`Stock insuficiente para ${productoSeleccionado.nombre}. Disponible: ${productoSeleccionado.stock}`);
      return;
    }

    const nuevoDetalle: DetalleVenta = {
      producto: productoSeleccionado,
      cantidad: cantidadProducto,
      precioUnitario: productoSeleccionado.precio,
    };

    setFormData(prev => ({ ...prev, detalles: [...(prev.detalles || []), nuevoDetalle] }));
    setProductoSeleccionado(null);
    setCantidadProducto(1);
  };

  const handleRemoveProducto = (index: number) => {
    setFormData(prev => ({ ...prev, detalles: prev.detalles?.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const bodyPayload = {
      ...formData,
      detalles: formData.detalles?.map(d => ({
        producto: { id: d.producto.id },
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario
      }))
    };

    try {
      const response = await fetch("http://localhost:8080/api/ventas", {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
      });

      if (!response.ok) {
        const errorData = await response.headers.get("X-Error-Message");
        throw new Error(errorData || "Error al registrar la venta");
      }

      toast.success("Venta registrada con éxito");
      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(`${error instanceof Error ? error.message : "Error desconocido"}`);
    } finally {
      setIsLoading(false);
    }
  }

  const isFormValid = formData.detalles && formData.detalles.length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">

        <DialogHeader className="relative mb-2">
          <div className="flex items-center gap-4 p-4 rounded-t-lg bg-gradient-to-r from-primary/10 via-background to-background border-b">
            <div className="flex items-center justify-center rounded-full bg-primary/20 h-12 w-12 shadow-inner">
              <ShoppingCart className="h-7 w-7" />
            </div>
            <DialogTitle className="text-2xl font-extrabold tracking-tight">Nueva Venta</DialogTitle>
            <DialogDescription className="text-muted-foreground mt-1 text-base">Registra los productos vendidos y actualiza el inventario.</DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cliente">Nombre del Cliente</Label>
              <Input id="cliente" value={formData.cliente} onChange={(e) => setFormData(prev => ({...prev, cliente: e.target.value}))} placeholder="Ej: Consumidor Final"/>
            </div>
            <div>
              <Label htmlFor="fechaVenta">Fecha de la Venta</Label>
              <Input id="fechaVenta" type="date" value={formData.fechaVenta} onChange={(e) => setFormData(prev => ({...prev, fechaVenta: e.target.value}))} required/>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4 space-y-4">
              <h3 className="font-medium flex items-center gap-2"><PackageSearch className="h-4 w-4 text-primary" /> Agregar Productos</h3>
              <div className="flex gap-2 items-end">
                  <div className="flex-1">
                      <Label>Producto (Stock disponible)</Label>
                       <Select onValueChange={(value) => setProductoSeleccionado(listaProductos.find(p => p.id === Number(value)) || null)}>
                          <SelectTrigger><SelectValue placeholder="Busca un producto..." /></SelectTrigger>
                          <SelectContent>
                              {listaProductos.map(p => <SelectItem key={p.id} value={p.id.toString()} disabled={p.stock === 0}>{p.nombre} ({p.stock})</SelectItem>)}
                          </SelectContent>
                      </Select>
                  </div>
                  <div className="w-24">
                      <Label>Cantidad</Label>
                      <Input type="number" value={cantidadProducto} onChange={(e) => setCantidadProducto(Number(e.target.value))} min="1" />
                  </div>
                  <Button type="button" onClick={handleAddProducto}><Plus className="h-4 w-4" /></Button>
              </div>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="font-medium mb-2">Detalle de la Venta ({formData.detalles?.length || 0})</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {formData.detalles?.map((detalle, index) => (
                    <div key={index} className="flex justify-between items-center text-sm p-2 bg-background rounded">
                        <div>
                            <p className="font-medium">{detalle.producto.nombre}</p>
                            <p className="text-muted-foreground">{detalle.cantidad} x ${detalle.precioUnitario.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">${(detalle.cantidad * detalle.precioUnitario).toLocaleString()}</span>
                            <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveProducto(index)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
            <Separator className="my-3" />
            <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${formData.total?.toLocaleString()}</span>
            </div>
          </div>

          <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>Cancelar</Button>
              <Button type="submit" disabled={!isFormValid || isLoading}>{isLoading ? "Registrando..." : "Registrar Venta"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}