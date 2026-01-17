package com.juan.sisgi.sisgi_backend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class EventoDTO {
    private Long id;
    private String titulo;
    private String descripcion;
    private LocalDate fecha;
    private String horaInicio;
    private String horaFin;
    private String tipo;
    private String color;
    private String textColor;
}
