package com.juan.sisgi.sisgi_backend.controllers;

import com.juan.sisgi.sisgi_backend.dto.CarpetaDTO;
import com.juan.sisgi.sisgi_backend.dto.DocumentoDTO;
import com.juan.sisgi.sisgi_backend.dto.EntityMapper;
import com.juan.sisgi.sisgi_backend.exception.ResourceNotFoundException;
import com.juan.sisgi.sisgi_backend.models.Carpeta;
import com.juan.sisgi.sisgi_backend.models.Documento;
import com.juan.sisgi.sisgi_backend.repositories.CarpetaRepository;
import com.juan.sisgi.sisgi_backend.repositories.DocumentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/documentos")
public class DocumentoController {

    @Autowired
    private DocumentoRepository documentoRepository;

    @Autowired
    private CarpetaRepository carpetaRepository;

    @Autowired
    private EntityMapper entityMapper;

    private final String UPLOAD_DIR = "uploads/";

    // --- CARPETAS ---
    @GetMapping("/carpetas")
    public List<CarpetaDTO> getCarpetas(@RequestParam(required = false) Long parentId) {
        List<Carpeta> carpetas = (parentId == null)
            ? carpetaRepository.findByParentIsNull()
            : carpetaRepository.findByParentId(parentId);
        return carpetas.stream().map(entityMapper::toDTO).collect(Collectors.toList());
    }

    @PostMapping("/carpetas")
    public CarpetaDTO createCarpeta(@RequestBody CarpetaDTO dto) {
        Carpeta carpeta = entityMapper.toEntity(dto);
        if (dto.getParentId() != null) {
            Carpeta parent = carpetaRepository.findById(dto.getParentId())
                .orElseThrow(() -> new ResourceNotFoundException("Carpeta padre no encontrada"));
            carpeta.setParent(parent);
        }
        return entityMapper.toDTO(carpetaRepository.save(carpeta));
    }

    @DeleteMapping("/carpetas/{id}")
    public ResponseEntity<Void> deleteCarpeta(@PathVariable Long id) {
        Carpeta carpeta = carpetaRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Carpeta no encontrada"));
        carpetaRepository.delete(carpeta);
        return ResponseEntity.noContent().build();
    }

    // --- DOCUMENTOS ---
    @GetMapping
    public List<DocumentoDTO> getDocumentos(@RequestParam(required = false) Long carpetaId) {
        List<Documento> documentos = (carpetaId == null)
            ? documentoRepository.findByCarpetaIsNull()
            : documentoRepository.findByCarpetaId(carpetaId);
        return documentos.stream().map(entityMapper::toDTO).collect(Collectors.toList());
    }

    @PostMapping("/upload")
    public ResponseEntity<DocumentoDTO> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "carpetaId", required = false) Long carpetaId,
            @RequestParam("autor") String autor) throws IOException {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // Crear directorio si no existe
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);

        Documento doc = new Documento();
        doc.setNombre(file.getOriginalFilename());
        doc.setExtension(getFileExtension(file.getOriginalFilename()));
        doc.setTipo(determineType(doc.getExtension()));
        doc.setUrl(filePath.toString());
        doc.setSize(formatSize(file.getSize()));
        doc.setAutor(autor);

        if (carpetaId != null) {
            Carpeta carpeta = carpetaRepository.findById(carpetaId)
                .orElseThrow(() -> new ResourceNotFoundException("Carpeta no encontrada"));
            doc.setCarpeta(carpeta);
        }

        return ResponseEntity.ok(entityMapper.toDTO(documentoRepository.save(doc)));
    }

    @GetMapping("/playlist")
    public List<DocumentoDTO> getVideoPlaylist() {
        return documentoRepository.findByTipo("video").stream()
            .map(entityMapper::toDTO)
            .collect(Collectors.toList());
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<org.springframework.core.io.Resource> downloadFile(@PathVariable Long id) throws IOException {
        Documento doc = documentoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Documento no encontrado"));

        Path filePath = Paths.get(doc.getUrl());
        org.springframework.core.io.Resource resource = new org.springframework.core.io.UrlResource(filePath.toUri());

        return ResponseEntity.ok()
            .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + doc.getNombre() + "\"")
            .body(resource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocumento(@PathVariable Long id) {
        Documento doc = documentoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Documento no encontrado"));

        // Opcional: eliminar archivo físico
        try {
            Files.deleteIfExists(Paths.get(doc.getUrl()));
        } catch (IOException e) {
            e.printStackTrace();
        }

        documentoRepository.delete(doc);
        return ResponseEntity.noContent().build();
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) return "";
        return fileName.substring(fileName.lastIndexOf(".") + 1);
    }

    private String determineType(String extension) {
        if (List.of("mp4", "webm", "ogg", "avi", "mov").contains(extension.toLowerCase())) {
            return "video";
        }
        if (List.of("jpg", "jpeg", "png", "gif", "svg").contains(extension.toLowerCase())) {
            return "image";
        }
        return "file";
    }

    private String formatSize(long bytes) {
        if (bytes < 1024) return bytes + " B";
        int exp = (int) (Math.log(bytes) / Math.log(1024));
        char pre = "KMGTPE".charAt(exp - 1);
        return String.format("%.1f %cB", bytes / Math.pow(1024, exp), pre);
    }
}
