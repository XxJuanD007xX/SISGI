package com.juan.sisgi.sisgi_backend.controllers;

import com.juan.sisgi.sisgi_backend.models.OrdenCompra;
import com.juan.sisgi.sisgi_backend.models.Product;
import com.juan.sisgi.sisgi_backend.repositories.OrdenCompraRepository;
import com.juan.sisgi.sisgi_backend.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.juan.sisgi.sisgi_backend.services.PdfService;
import com.juan.sisgi.sisgi_backend.services.EmailService;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Optional;
import java.util.Map;

class EmailRequest {
    public String destinatario;
    public String asunto;
    public String cuerpo;
}

@RestController
@RequestMapping("/api/ordenes")
@CrossOrigin(origins = "http://localhost:3000")
public class OrdenCompraController {

    @Autowired
    private OrdenCompraRepository ordenCompraRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PdfService pdfService;
    
    @Autowired
    private EmailService emailService;
    
    @GetMapping
    public List<OrdenCompra> getAllOrdenes() {
        return ordenCompraRepository.findAll();
    }

    @PostMapping
    @Transactional
    public OrdenCompra createOrden(@RequestBody OrdenCompra orden) {
        orden.getDetalles().forEach(detalle -> detalle.setOrdenCompra(orden));
        return ordenCompraRepository.save(orden);
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<OrdenCompra> updateOrden(@PathVariable Long id, @RequestBody OrdenCompra ordenDetails) {
        return ordenCompraRepository.findById(id)
                .map(orden -> {
                    String estadoAnterior = orden.getEstado();
                    orden.setProveedor(ordenDetails.getProveedor());
                    orden.setFechaOrden(ordenDetails.getFechaOrden());
                    orden.setEstado(ordenDetails.getEstado());
                    orden.setTotal(ordenDetails.getTotal());
                    orden.setObservaciones(ordenDetails.getObservaciones());
                    
                    if (!"Recibido".equalsIgnoreCase(estadoAnterior) && "Recibido".equalsIgnoreCase(orden.getEstado())) {
                        orden.getDetalles().forEach(detalle -> {
                            Product producto = detalle.getProducto();
                            if (producto != null) {
                                int nuevoStock = producto.getStock() + detalle.getCantidad();
                                producto.setStock(nuevoStock);
                                productRepository.save(producto);
                            }
                        });
                    }
                    
                    OrdenCompra updatedOrden = ordenCompraRepository.save(orden);
                    return ResponseEntity.ok(updatedOrden);
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrden(@PathVariable Long id) {
        if (!ordenCompraRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        ordenCompraRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping(value = "/{id}/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<InputStreamResource> exportarOrdenAPdf(@PathVariable Long id) {
        // 1. Buscamos la orden de compra primero
        Optional<OrdenCompra> ordenOptional = ordenCompraRepository.findById(id);

        // 2. Verificamos si la orden existe
        if (ordenOptional.isEmpty()) {
            // Si no existe, devolvemos un error 404 (Not Found)
            return ResponseEntity.notFound().build();
        }

        // 3. Si existe, procedemos a generar el PDF
        OrdenCompra orden = ordenOptional.get();
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
            // Si hay un error al crear el PDF, devolvemos un error 500
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PostMapping("/{id}/enviar-email")
    public ResponseEntity<Map<String, String>> enviarOrdenPorEmail(@PathVariable Long id, @RequestBody EmailRequest emailRequest) {
        // 1. Busca la orden de compra
        Optional<OrdenCompra> ordenOptional = ordenCompraRepository.findById(id);
        if (ordenOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        OrdenCompra orden = ordenOptional.get();

        try {
            // 2. Genera el PDF en memoria
            ByteArrayInputStream bis = pdfService.generarPdfDeOrden(orden);
            byte[] pdfBytes = bis.readAllBytes();
            
            String nombreArchivo = "orden_compra_" + orden.getId() + ".pdf";

            // 3. Llama al servicio de correo para enviar el email
            emailService.enviarCorreoConAdjunto(
                emailRequest.destinatario,
                emailRequest.asunto,
                emailRequest.cuerpo,
                pdfBytes,
                nombreArchivo
            );

            // 4. Devuelve una respuesta exitosa
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