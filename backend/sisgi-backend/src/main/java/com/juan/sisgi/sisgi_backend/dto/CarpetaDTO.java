package com.juan.sisgi.sisgi_backend.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class CarpetaDTO {
    private Long id;
    private String nombre;
    private String color;
    private String autor;
    private LocalDateTime fechaCreacion;
    private Long parentId;
    private List<CarpetaDTO> subcarpetas;
}
