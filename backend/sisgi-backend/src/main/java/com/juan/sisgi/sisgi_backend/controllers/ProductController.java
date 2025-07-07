/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.juan.sisgi.sisgi_backend.controllers;

import com.juan.sisgi.sisgi_backend.models.Product; // CORRECTO
import com.juan.sisgi.sisgi_backend.repositories.ProductRepository; // CORRECTO
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;

@RestController // Indica que esta clase manejará endpoints REST
@RequestMapping("/api/products") // Todas las rutas de esta clase empezarán con /api/products
@CrossOrigin(origins = "http://localhost:3000")

public class ProductController {

    @Autowired // Spring inyectará automáticamente una instancia del repositorio
    private ProductRepository productRepository;

    // Endpoint para OBTENER todos los productos (GET /api/products)
    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Endpoint para CREAR un nuevo producto (POST /api/products)
    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        // @RequestBody convierte el JSON de la petición en un objeto Product
        return productRepository.save(product);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return ResponseEntity.noContent().build(); // 204 No Content
        } else {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product updatedProduct) {
        return productRepository.findById(id)
                .map(product -> {
                    product.setNombre(updatedProduct.getNombre());
                    product.setDescripcion(updatedProduct.getDescripcion());
                    product.setCategoria(updatedProduct.getCategoria());
                    product.setPrecio(updatedProduct.getPrecio());
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

}