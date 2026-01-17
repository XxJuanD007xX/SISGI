package com.juan.sisgi.sisgi_backend.dto;

import com.juan.sisgi.sisgi_backend.models.*;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class EntityMapper {

    // --- PRODUCT ---
    public ProductDTO toDTO(Product product) {
        if (product == null) return null;
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setNombre(product.getNombre());
        dto.setDescripcion(product.getDescripcion());
        dto.setCategoria(product.getCategoria());
        dto.setPrecio(product.getPrecio());
        dto.setStock(product.getStock());
        dto.setStockMinimo(product.getStockMinimo());
        dto.setMarca(product.getMarca());
        dto.setCodigoBarras(product.getCodigoBarras());
        dto.setUbicacion(product.getUbicacion());
        dto.setProveedor(toDTO(product.getProveedor()));
        return dto;
    }

    public Product toEntity(ProductDTO dto) {
        if (dto == null) return null;
        Product product = new Product();
        product.setId(dto.getId());
        product.setNombre(dto.getNombre());
        product.setDescripcion(dto.getDescripcion());
        product.setCategoria(dto.getCategoria());
        product.setPrecio(dto.getPrecio());
        product.setStock(dto.getStock());
        product.setStockMinimo(dto.getStockMinimo());
        product.setMarca(dto.getMarca());
        product.setCodigoBarras(dto.getCodigoBarras());
        product.setUbicacion(dto.getUbicacion());
        product.setProveedor(toEntity(dto.getProveedor()));
        return product;
    }

    // --- PROVEEDOR ---
    public ProveedorDTO toDTO(Proveedor proveedor) {
        if (proveedor == null) return null;
        ProveedorDTO dto = new ProveedorDTO();
        dto.setId(proveedor.getId());
        dto.setNombreEmpresa(proveedor.getNombreEmpresa());
        dto.setNitRuc(proveedor.getNitRuc());
        dto.setTipoProveedor(proveedor.getTipoProveedor());
        dto.setSitioWeb(proveedor.getSitioWeb());
        dto.setPersonaContacto(proveedor.getPersonaContacto());
        dto.setTelefono(proveedor.getTelefono());
        dto.setEmail(proveedor.getEmail());
        dto.setDireccion(proveedor.getDireccion());
        dto.setCiudad(proveedor.getCiudad());
        dto.setPais(proveedor.getPais());
        dto.setCodigoPostal(proveedor.getCodigoPostal());
        dto.setCondicionesPago(proveedor.getCondicionesPago());
        dto.setDiasCredito(proveedor.getDiasCredito());
        dto.setDescuentoGeneral(proveedor.getDescuentoGeneral());
        dto.setNotasObservaciones(proveedor.getNotasObservaciones());
        dto.setEstado(proveedor.getEstado());
        dto.setFechaCreacion(proveedor.getFechaCreacion());
        dto.setFechaActualizacion(proveedor.getFechaActualizacion());
        return dto;
    }

    public Proveedor toEntity(ProveedorDTO dto) {
        if (dto == null) return null;
        Proveedor p = new Proveedor();
        p.setId(dto.getId());
        p.setNombreEmpresa(dto.getNombreEmpresa());
        p.setNitRuc(dto.getNitRuc());
        p.setTipoProveedor(dto.getTipoProveedor());
        p.setSitioWeb(dto.getSitioWeb());
        p.setPersonaContacto(dto.getPersonaContacto());
        p.setTelefono(dto.getTelefono());
        p.setEmail(dto.getEmail());
        p.setDireccion(dto.getDireccion());
        p.setCiudad(dto.getCiudad());
        p.setPais(dto.getPais());
        p.setCodigoPostal(dto.getCodigoPostal());
        p.setCondicionesPago(dto.getCondicionesPago());
        p.setDiasCredito(dto.getDiasCredito());
        p.setDescuentoGeneral(dto.getDescuentoGeneral());
        p.setNotasObservaciones(dto.getNotasObservaciones());
        p.setEstado(dto.getEstado());
        return p;
    }

    // --- VENTA ---
    public VentaDTO toDTO(Venta venta) {
        if (venta == null) return null;
        VentaDTO dto = new VentaDTO();
        dto.setId(venta.getId());
        dto.setFechaVenta(venta.getFechaVenta());
        dto.setCliente(venta.getCliente());
        dto.setTotal(venta.getTotal());
        dto.setEstado(venta.getEstado());
        dto.setMotivoAnulacion(venta.getMotivoAnulacion());
        if (venta.getDetalles() != null) {
            dto.setDetalles(venta.getDetalles().stream()
                    .map(this::toDTO)
                    .collect(Collectors.toList()));
        }
        return dto;
    }

    public DetalleVentaDTO toDTO(DetalleVenta detalle) {
        if (detalle == null) return null;
        DetalleVentaDTO dto = new DetalleVentaDTO();
        dto.setId(detalle.getId());
        dto.setCantidad(detalle.getCantidad());
        dto.setPrecioUnitario(detalle.getPrecioUnitario());
        dto.setProducto(toDTO(detalle.getProducto()));
        return dto;
    }

    public Venta toEntity(VentaDTO dto) {
        if (dto == null) return null;
        Venta venta = new Venta();
        venta.setId(dto.getId());
        venta.setFechaVenta(dto.getFechaVenta());
        venta.setCliente(dto.getCliente());
        venta.setTotal(dto.getTotal());
        venta.setEstado(dto.getEstado());
        venta.setMotivoAnulacion(dto.getMotivoAnulacion());
        if (dto.getDetalles() != null) {
            venta.setDetalles(dto.getDetalles().stream()
                    .map(d -> {
                        DetalleVenta dv = toEntity(d);
                        dv.setVenta(venta);
                        return dv;
                    })
                    .collect(Collectors.toList()));
        }
        return venta;
    }

    public DetalleVenta toEntity(DetalleVentaDTO dto) {
        if (dto == null) return null;
        DetalleVenta dv = new DetalleVenta();
        dv.setId(dto.getId());
        dv.setCantidad(dto.getCantidad());
        dv.setPrecioUnitario(dto.getPrecioUnitario());
        dv.setProducto(toEntity(dto.getProducto()));
        return dv;
    }

    // --- ORDEN COMPRA ---
    public OrdenCompraDTO toDTO(OrdenCompra orden) {
        if (orden == null) return null;
        OrdenCompraDTO dto = new OrdenCompraDTO();
        dto.setId(orden.getId());
        dto.setProveedor(toDTO(orden.getProveedor()));
        dto.setFechaOrden(orden.getFechaOrden());
        dto.setEstado(orden.getEstado());
        dto.setTotal(orden.getTotal());
        dto.setObservaciones(orden.getObservaciones());
        if (orden.getDetalles() != null) {
            dto.setDetalles(orden.getDetalles().stream()
                    .map(this::toDTO)
                    .collect(Collectors.toList()));
        }
        return dto;
    }

    public DetalleOrdenCompraDTO toDTO(DetalleOrdenCompra detalle) {
        if (detalle == null) return null;
        DetalleOrdenCompraDTO dto = new DetalleOrdenCompraDTO();
        dto.setId(detalle.getId());
        dto.setCantidad(detalle.getCantidad());
        dto.setPrecioUnitario(detalle.getPrecioUnitario());
        dto.setProducto(toDTO(detalle.getProducto()));
        return dto;
    }

    public OrdenCompra toEntity(OrdenCompraDTO dto) {
        if (dto == null) return null;
        OrdenCompra oc = new OrdenCompra();
        oc.setId(dto.getId());
        oc.setProveedor(toEntity(dto.getProveedor()));
        oc.setFechaOrden(dto.getFechaOrden());
        oc.setEstado(dto.getEstado());
        oc.setTotal(dto.getTotal());
        oc.setObservaciones(dto.getObservaciones());
        if (dto.getDetalles() != null) {
            oc.setDetalles(dto.getDetalles().stream()
                    .map(d -> {
                        DetalleOrdenCompra doc = toEntity(d);
                        doc.setOrdenCompra(oc);
                        return doc;
                    })
                    .collect(Collectors.toList()));
        }
        return oc;
    }

    public DetalleOrdenCompra toEntity(DetalleOrdenCompraDTO dto) {
        if (dto == null) return null;
        DetalleOrdenCompra doc = new DetalleOrdenCompra();
        doc.setId(dto.getId());
        doc.setCantidad(dto.getCantidad());
        doc.setPrecioUnitario(dto.getPrecioUnitario());
        doc.setProducto(toEntity(dto.getProducto()));
        return doc;
    }
}
