package com.juan.sisgi.sisgi_backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ProveedorDTO {
    private Long id;
    private String nombreEmpresa;
    private String nitRuc;
    private String tipoProveedor;
    private String sitioWeb;
    private String personaContacto;
    private String telefono;
    private String email;
    private String direccion;
    private String ciudad;
    private String pais;
    private String codigoPostal;
    private String condicionesPago;
    private int diasCredito;
    private double descuentoGeneral;
    private String notasObservaciones;
    private String estado;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
}
