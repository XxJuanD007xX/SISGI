package com.juan.sisgi.sisgi_backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DocumentoDTO {
    private Long id;
    private String nombre;
    private String extension;
    private String tipo;
    private String url;
    private String size;
    private String autor;
    private LocalDateTime fechaCreacion;
    private Long carpetaId;
}
