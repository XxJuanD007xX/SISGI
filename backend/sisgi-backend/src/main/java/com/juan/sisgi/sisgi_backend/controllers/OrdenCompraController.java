package com.juan.sisgi.sisgi_backend.controllers;

import com.juan.sisgi.sisgi_backend.dto.EntityMapper;
import com.juan.sisgi.sisgi_backend.dto.OrdenCompraDTO;
import com.juan.sisgi.sisgi_backend.exception.ResourceNotFoundException;
import com.juan.sisgi.sisgi_backend.models.OrdenCompra;
import com.juan.sisgi.sisgi_backend.models.Product;
import com.juan.sisgi.sisgi_backend.repositories.OrdenCompraRepository;
import com.juan.sisgi.sisgi_backend.repositories.ProductRepository;
import com.juan.sisgi.sisgi_backend.services.EmailService;
import com.juan.sisgi.sisgi_backend.services.PdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

class EmailRequest {
    public String destinatario;
    public String asunto;
    public String cuerpo;
}

@RestController
@RequestMapping("/api/ordenes")
public class OrdenCompraController {

    @Autowired
    private OrdenCompraRepository ordenCompraRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PdfService pdfService;
    
    @Autowired
    private EmailService emailService;

    @Autowired
    private EntityMapper entityMapper;
    
    @GetMapping
    public List<OrdenCompraDTO> getAllOrdenes() {
        return ordenCompraRepository.findAll().stream()
                .map(entityMapper::toDTO)
                .collect(Collectors.toList());
    }

    @PostMapping
    @Transactional
    public OrdenCompraDTO createOrden(@RequestBody OrdenCompraDTO ordenDTO) {
        OrdenCompra orden = entityMapper.toEntity(ordenDTO);
        if (orden.getDetalles() != null) {
            orden.getDetalles().forEach(detalle -> detalle.setOrdenCompra(orden));
        }
        return entityMapper.toDTO(ordenCompraRepository.save(orden));
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<OrdenCompraDTO> updateOrden(@PathVariable Long id, @RequestBody OrdenCompraDTO ordenDetailsDTO) {
        return ordenCompraRepository.findById(id)
                .map(orden -> {
                    String estadoAnterior = orden.getEstado();
                    
                    OrdenCompra updatedData = entityMapper.toEntity(ordenDetailsDTO);

                    orden.setProveedor(updatedData.getProveedor());
                    orden.setFechaOrden(updatedData.getFechaOrden());
                    orden.setEstado(updatedData.getEstado());
                    orden.setTotal(updatedData.getTotal());
                    orden.setObservaciones(updatedData.getObservaciones());

                    // Manejo de stock si pasa a "Recibido"
                    if (!"Recibido".equalsIgnoreCase(estadoAnterior) && "Recibido".equalsIgnoreCase(orden.getEstado())) {
                        orden.getDetalles().forEach(detalle -> {
                            Product producto = productRepository.findById(detalle.getProducto().getId())
                                    .orElse(null);
                            if (producto != null) {
                                producto.setStock(producto.getStock() + detalle.getCantidad());
                                productRepository.save(producto);
                            }
                        });
                    }
                    
                    OrdenCompra savedOrden = ordenCompraRepository.save(orden);
                    return ResponseEntity.ok(entityMapper.toDTO(savedOrden));
                }).orElseThrow(() -> new ResourceNotFoundException("Orden de compra no encontrada con id: " + id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrden(@PathVariable Long id) {
        OrdenCompra orden = ordenCompraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Orden de compra no encontrada con id: " + id));
        ordenCompraRepository.delete(orden);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping(value = "/{id}/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<InputStreamResource> exportarOrdenAPdf(@PathVariable Long id) {
        OrdenCompra orden = ordenCompraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Orden de compra no encontrada con id: " + id));

        try {
            ByteArrayInputStream bis = pdfService.generarPdfDeOrden(orden);
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "inline; filename=orden_compra_" + orden.getId() + ".pdf");

            return ResponseEntity
                    .ok()
                    .headers(headers)
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(new InputStreamResource(bis));

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PostMapping("/{id}/enviar-email")
    public ResponseEntity<Map<String, String>> enviarOrdenPorEmail(@PathVariable Long id, @RequestBody EmailRequest emailRequest) {
        OrdenCompra orden = ordenCompraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Orden de compra no encontrada con id: " + id));

        try {
            ByteArrayInputStream bis = pdfService.generarPdfDeOrden(orden);
            byte[] pdfBytes = bis.readAllBytes();
            String nombreArchivo = "orden_compra_" + orden.getId() + ".pdf";

            emailService.enviarCorreoConAdjunto(
                emailRequest.destinatario,
                emailRequest.asunto,
                emailRequest.cuerpo,
                pdfBytes,
                nombreArchivo
            );

            return ResponseEntity.ok(Map.of("message", "Correo enviado exitosamente a " + emailRequest.destinatario));

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "Error al generar el PDF."));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "Error al enviar el correo."));
        }
    }
}
