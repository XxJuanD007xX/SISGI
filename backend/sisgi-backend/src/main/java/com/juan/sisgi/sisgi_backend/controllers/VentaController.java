package com.juan.sisgi.sisgi_backend.controllers;

import com.juan.sisgi.sisgi_backend.dto.EntityMapper;
import com.juan.sisgi.sisgi_backend.dto.VentaDTO;
import com.juan.sisgi.sisgi_backend.exception.ResourceNotFoundException;
import com.juan.sisgi.sisgi_backend.models.Product;
import com.juan.sisgi.sisgi_backend.models.Venta;
import com.juan.sisgi.sisgi_backend.repositories.ProductRepository;
import com.juan.sisgi.sisgi_backend.repositories.VentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ventas")
public class VentaController {

    @Autowired
    private VentaRepository ventaRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private EntityMapper entityMapper;

    @GetMapping
    public List<VentaDTO> getAllVentas() {
        return ventaRepository.findAll().stream()
                .map(entityMapper::toDTO)
                .collect(Collectors.toList());
    }

    @PostMapping
    @Transactional
    public ResponseEntity<VentaDTO> createVenta(@RequestBody VentaDTO ventaDTO) {
        Venta venta = entityMapper.toEntity(ventaDTO);

        // El mapper ya debería haber vinculado los detalles a la venta,
        // pero por si acaso o si se quiere asegurar la consistencia:
        if (venta.getDetalles() != null) {
            venta.getDetalles().forEach(detalle -> detalle.setVenta(venta));
        }

        for (var detalle : venta.getDetalles()) {
            Product producto = productRepository.findById(detalle.getProducto().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado: " + detalle.getProducto().getId()));

            if (producto.getStock() < detalle.getCantidad()) {
                // Podríamos lanzar una excepción personalizada aquí, pero por ahora mantenemos el Header de error
                // para compatibilidad con el frontend si este lo lee.
                return ResponseEntity.badRequest()
                        .header("X-Error-Message", "Stock insuficiente para el producto: " + producto.getNombre())
                        .build();
            }

            producto.setStock(producto.getStock() - detalle.getCantidad());
            productRepository.save(producto);
        }

        Venta savedVenta = ventaRepository.save(venta);
        return ResponseEntity.ok(entityMapper.toDTO(savedVenta));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> deleteVenta(@PathVariable Long id) {
        Venta venta = ventaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venta no encontrada con id: " + id));

        // Si la venta no estaba anulada, devolvemos el stock antes de borrar (opcional, depende de la política)
        if (!"ANULADA".equals(venta.getEstado())) {
            for (var detalle : venta.getDetalles()) {
                Product producto = productRepository.findById(detalle.getProducto().getId()).orElse(null);
                if (producto != null) {
                    producto.setStock(producto.getStock() + detalle.getCantidad());
                    productRepository.save(producto);
                }
            }
        }

        ventaRepository.delete(venta);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/anular")
    @Transactional
    public ResponseEntity<VentaDTO> anularVenta(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        Venta venta = ventaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venta no encontrada con id: " + id));

        if ("ANULADA".equals(venta.getEstado())) {
            throw new RuntimeException("La venta ya se encuentra anulada.");
        }

        venta.setEstado("ANULADA");
        venta.setMotivoAnulacion(body.getOrDefault("motivo", "Anulación de venta"));

        for (var detalle : venta.getDetalles()) {
            Product producto = productRepository.findById(detalle.getProducto().getId()).orElse(null);
            if (producto != null) {
                producto.setStock(producto.getStock() + detalle.getCantidad());
                productRepository.save(producto);
            }
        }

        Venta savedVenta = ventaRepository.save(venta);
        return ResponseEntity.ok(entityMapper.toDTO(savedVenta));
    }
}
