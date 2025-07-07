export interface Product {
  id: number
  nombre: string
  descripcion?: string
  categoria: string
  precio: number
  stock: number
  stockMinimo?: number
  marca?: string
  codigoBarras?: string
  proveedor?: string
  ubicacion?: string
}
