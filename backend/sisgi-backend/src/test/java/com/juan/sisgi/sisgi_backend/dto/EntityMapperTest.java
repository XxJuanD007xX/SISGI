package com.juan.sisgi.sisgi_backend.dto;

import com.juan.sisgi.sisgi_backend.models.Product;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class EntityMapperTest {

    private final EntityMapper mapper = new EntityMapper();

    @Test
    void testProductToDTO() {
        Product p = new Product();
        p.setId(1L);
        p.setNombre("Test Product");
        p.setPrecio(100.0);
        p.setStock(10);

        ProductDTO dto = mapper.toDTO(p);

        assertNotNull(dto);
        assertEquals(p.getId(), dto.getId());
        assertEquals(p.getNombre(), dto.getNombre());
        assertEquals(p.getPrecio(), dto.getPrecio());
    }
}
