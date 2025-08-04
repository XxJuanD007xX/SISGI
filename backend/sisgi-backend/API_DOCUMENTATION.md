# Documentación de la API - SISGI

Esta documentación describe los servicios web disponibles para el proyecto SISGI.

## Módulo: Autenticación (Ejemplo de la evidencia anterior)
- **POST /api/auth/register**: Registra un nuevo usuario.
- **POST /api/auth/login**: Autentica un usuario existente.

## Módulo: Productos
- **GET /api/products**: Obtiene una lista de todos los productos.
- **POST /api/products**: Crea un nuevo producto.
- **PUT /api/products/{id}**: Actualiza un producto existente.
- **DELETE /api/products/{id}**: Elimina un producto.

## Módulo: Proveedores
- **GET /api/proveedores**: Obtiene una lista de todos los proveedores.
- **POST /api/proveedores**: Crea un nuevo proveedor.
- **PUT /api/proveedores/{id}**: Actualiza un proveedor existente.
- **DELETE /api/proveedores/{id}**: Elimina un proveedor.

## Módulo: Órdenes de Compra (Nuevo)

### 1. Obtener todas las órdenes de compra
- **Método**: `GET`
- **URL**: `/api/ordenes`
- **Respuesta Exitosa (200 OK)**:
  ```json
  [
    {
      "id": 1,
      "proveedor": { /* ...datos del proveedor... */ },
      "fechaOrden": "2024-08-01",
      "estado": "Recibido",
      "total": 1500.00,
      "observaciones": "Pedido urgente."
    }
  ]