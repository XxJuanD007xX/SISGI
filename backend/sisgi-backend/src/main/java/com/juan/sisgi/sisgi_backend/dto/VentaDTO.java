package com.juan.sisgi.sisgi_backend.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class VentaDTO {
    private Long id;
    private LocalDate fechaVenta;
    private String cliente;
    private double total;
    private String estado;
    private String motivoAnulacion;
    private List<DetalleVentaDTO> detalles;
}
