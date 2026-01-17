package com.juan.sisgi.sisgi_backend.controllers;

import com.juan.sisgi.sisgi_backend.models.Product;
import com.juan.sisgi.sisgi_backend.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;

@RestController
@RequestMapping("/api/products")
// Ya no necesitas @CrossOrigin aquí si usaste la clase WebConfig global
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    // Endpoint para OBTENER todos los productos (GET /api/products)
    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Endpoint para CREAR un nuevo producto (POST /api/products)
    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }
    
    // Endpoint para ELIMINAR un producto (DELETE /api/products/{id})
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return ResponseEntity.noContent().build(); // 204 No Content
        } else {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
    }
    
    // Endpoint para ACTUALIZAR un producto (PUT /api/products/{id})
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product updatedProduct) {
        return productRepository.findById(id)
                .map(product -> {
                    product.setNombre(updatedProduct.getNombre());
                    product.setDescripcion(updatedProduct.getDescripcion());
                    product.setCategoria(updatedProduct.getCategoria());
                    product.setPrecio(updatedProduct.getPrecio()); // <-- REVERTIDO AL CAMPO ORIGINAL
                    product.setStock(updatedProduct.getStock());
                    product.setStockMinimo(updatedProduct.getStockMinimo());
                    product.setMarca(updatedProduct.getMarca());
                    product.setCodigoBarras(updatedProduct.getCodigoBarras());
                    product.setProveedor(updatedProduct.getProveedor());
                    product.setUbicacion(updatedProduct.getUbicacion());

                    productRepository.save(product);
                    return ResponseEntity.ok(product);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Endpoint para OBTENER productos con bajo stock (GET /api/products/stock-bajo)
    @GetMapping("/stock-bajo")
    public List<Product> getLowStockProducts() {
        return productRepository.findLowStockProducts();
    }
}