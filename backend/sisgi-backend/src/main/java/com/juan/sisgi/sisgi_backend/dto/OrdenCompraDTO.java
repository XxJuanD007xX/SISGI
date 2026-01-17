package com.juan.sisgi.sisgi_backend.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class OrdenCompraDTO {
    private Long id;
    private ProveedorDTO proveedor;
    private LocalDate fechaOrden;
    private String estado;
    private double total;
    private String observaciones;
    private List<DetalleOrdenCompraDTO> detalles;
}
