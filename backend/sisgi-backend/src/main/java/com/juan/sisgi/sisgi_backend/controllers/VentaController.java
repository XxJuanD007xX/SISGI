package com.juan.sisgi.sisgi_backend.controllers;

import com.juan.sisgi.sisgi_backend.models.Product;
import com.juan.sisgi.sisgi_backend.models.Venta;
import com.juan.sisgi.sisgi_backend.repositories.ProductRepository;
import com.juan.sisgi.sisgi_backend.repositories.VentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/ventas")
@CrossOrigin(origins = "http://localhost:3000")
public class VentaController {

    @Autowired
    private VentaRepository ventaRepository;

    @Autowired
    private ProductRepository productRepository;

    // Endpoint para OBTENER todas las ventas
    @GetMapping
    public List<Venta> getAllVentas() {
        return ventaRepository.findAll();
    }

    // Endpoint para CREAR una nueva venta y ACTUALIZAR el stock
    @PostMapping
    @Transactional
    public ResponseEntity<Venta> createVenta(@RequestBody Venta venta) {
        venta.getDetalles().forEach(detalle -> detalle.setVenta(venta));

        for (var detalle : venta.getDetalles()) {
            Product producto = productRepository.findById(detalle.getProducto().getId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + detalle.getProducto().getId()));

            if (producto.getStock() < detalle.getCantidad()) {
                return ResponseEntity.badRequest().header("X-Error-Message", "Stock insuficiente para el producto: " + producto.getNombre()).build();
            }

            producto.setStock(producto.getStock() - detalle.getCantidad());
            productRepository.save(producto);
        }

        Venta savedVenta = ventaRepository.save(venta);
        return ResponseEntity.ok(savedVenta);
    }

    // --- MÉTODO CORREGIDO ---
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> deleteVenta(@PathVariable Long id) {
        // 1. Buscamos la venta por su ID
        Optional<Venta> ventaOptional = ventaRepository.findById(id);

        // 2. Verificamos si la venta existe
        if (ventaOptional.isEmpty()) {
            return ResponseEntity.notFound().build(); // Si no existe, devolvemos 404
        }

        // 3. Si existe, procedemos a anularla
        Venta venta = ventaOptional.get();

        // 4. Devolvemos el stock al inventario
        for (var detalle : venta.getDetalles()) {
            Product producto = detalle.getProducto();
            if (producto != null) {
                producto.setStock(producto.getStock() + detalle.getCantidad());
                productRepository.save(producto);
            }
        }

        // 5. Finalmente, eliminamos la venta
        ventaRepository.delete(venta);

        return ResponseEntity.noContent().build();
    }
}