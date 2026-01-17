package com.juan.sisgi.sisgi_backend.controllers;

import com.juan.sisgi.sisgi_backend.dto.EntityMapper;
import com.juan.sisgi.sisgi_backend.dto.ProveedorDTO;
import com.juan.sisgi.sisgi_backend.exception.ResourceNotFoundException;
import com.juan.sisgi.sisgi_backend.models.Proveedor;
import com.juan.sisgi.sisgi_backend.repositories.ProveedorRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/proveedores")
public class ProveedorController {

    @Autowired
    private ProveedorRepository proveedorRepository;

    @Autowired
    private EntityMapper entityMapper;

    @GetMapping
    public List<ProveedorDTO> getAllProveedores() {
        return proveedorRepository.findAll().stream()
                .map(entityMapper::toDTO)
                .collect(Collectors.toList());
    }

    @PostMapping
    public ProveedorDTO createProveedor(@RequestBody ProveedorDTO proveedorDTO) {
        Proveedor proveedor = entityMapper.toEntity(proveedorDTO);
        return entityMapper.toDTO(proveedorRepository.save(proveedor));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProveedorDTO> updateProveedor(@PathVariable Long id, @RequestBody ProveedorDTO proveedorDTO) {
        return proveedorRepository.findById(id)
                .map(proveedor -> { 
                    proveedor.setNombreEmpresa(proveedorDTO.getNombreEmpresa());
                    proveedor.setNitRuc(proveedorDTO.getNitRuc());
                    proveedor.setTipoProveedor(proveedorDTO.getTipoProveedor());
                    proveedor.setSitioWeb(proveedorDTO.getSitioWeb());
                    proveedor.setPersonaContacto(proveedorDTO.getPersonaContacto());
                    proveedor.setTelefono(proveedorDTO.getTelefono());
                    proveedor.setEmail(proveedorDTO.getEmail());
                    proveedor.setDireccion(proveedorDTO.getDireccion());
                    proveedor.setCiudad(proveedorDTO.getCiudad());
                    proveedor.setPais(proveedorDTO.getPais());
                    proveedor.setCodigoPostal(proveedorDTO.getCodigoPostal());
                    proveedor.setCondicionesPago(proveedorDTO.getCondicionesPago());
                    proveedor.setDiasCredito(proveedorDTO.getDiasCredito());
                    proveedor.setDescuentoGeneral(proveedorDTO.getDescuentoGeneral());
                    proveedor.setNotasObservaciones(proveedorDTO.getNotasObservaciones());
                    proveedor.setEstado(proveedorDTO.getEstado());
                    
                    Proveedor updatedProveedor = proveedorRepository.save(proveedor);
                    return ResponseEntity.ok(entityMapper.toDTO(updatedProveedor));
                })
                .orElseThrow(() -> new ResourceNotFoundException("Proveedor no encontrado con id: " + id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProveedor(@PathVariable Long id) {
        Proveedor proveedor = proveedorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proveedor no encontrado con id: " + id));
        proveedorRepository.delete(proveedor);
        return ResponseEntity.noContent().build();
    }
}
