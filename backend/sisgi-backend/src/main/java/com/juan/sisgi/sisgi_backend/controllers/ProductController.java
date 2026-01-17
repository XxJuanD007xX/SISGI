package com.juan.sisgi.sisgi_backend.controllers;

import com.juan.sisgi.sisgi_backend.dto.EntityMapper;
import com.juan.sisgi.sisgi_backend.dto.ProductDTO;
import com.juan.sisgi.sisgi_backend.exception.ResourceNotFoundException;
import com.juan.sisgi.sisgi_backend.models.Product;
import com.juan.sisgi.sisgi_backend.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private EntityMapper entityMapper;

    @GetMapping
    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(entityMapper::toDTO)
                .collect(Collectors.toList());
    }

    @PostMapping
    public ProductDTO createProduct(@RequestBody ProductDTO productDTO) {
        Product product = entityMapper.toEntity(productDTO);
        return entityMapper.toDTO(productRepository.save(product));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con id: " + id));
        productRepository.delete(product);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id, @RequestBody ProductDTO updatedProductDTO) {
        return productRepository.findById(id)
                .map(product -> {
                    product.setNombre(updatedProductDTO.getNombre());
                    product.setDescripcion(updatedProductDTO.getDescripcion());
                    product.setCategoria(updatedProductDTO.getCategoria());
                    product.setPrecio(updatedProductDTO.getPrecio());
                    product.setStock(updatedProductDTO.getStock());
                    product.setStockMinimo(updatedProductDTO.getStockMinimo());
                    product.setMarca(updatedProductDTO.getMarca());
                    product.setCodigoBarras(updatedProductDTO.getCodigoBarras());
                    product.setProveedor(entityMapper.toEntity(updatedProductDTO.getProveedor()));
                    product.setUbicacion(updatedProductDTO.getUbicacion());

                    Product savedProduct = productRepository.save(product);
                    return ResponseEntity.ok(entityMapper.toDTO(savedProduct));
                })
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con id: " + id));
    }

    @GetMapping("/stock-bajo")
    public List<ProductDTO> getLowStockProducts() {
        return productRepository.findLowStockProducts().stream()
                .map(entityMapper::toDTO)
                .collect(Collectors.toList());
    }
}
