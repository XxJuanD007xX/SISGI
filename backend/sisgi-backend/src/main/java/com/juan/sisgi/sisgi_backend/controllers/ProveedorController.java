package com.juan.sisgi.sisgi_backend.controllers;

import com.juan.sisgi.sisgi_backend.models.Proveedor;
import com.juan.sisgi.sisgi_backend.repositories.ProveedorRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST para gestionar las operaciones CRUD de los proveedores.
 * Define los endpoints de la API que el frontend consumirá.
 */
@RestController
@RequestMapping("/api/proveedores")
@CrossOrigin(origins = "http://localhost:3000")
public class ProveedorController {

    // Inyección de dependencias: Spring se encarga de crear e "inyectar"
    // una instancia de ProveedorRepository para que podamos usarla.
    @Autowired
    private ProveedorRepository proveedorRepository;

    /**
     * Endpoint para OBTENER todos los proveedores.
     * Método HTTP: GET
     * URL: http://localhost:8080/api/proveedores
     */
    @GetMapping
    public List<Proveedor> getAllProveedores() {
        // Usa el método findAll() que nos regaló JpaRepository.
        return proveedorRepository.findAll();
    }

    /**
     * Endpoint para CREAR un nuevo proveedor.
     * Método HTTP: POST
     * URL: http://localhost:8080/api/proveedores
     * @param proveedor El objeto Proveedor enviado en el cuerpo de la petición (en formato JSON).
     * @return El proveedor guardado, incluyendo el ID generado por la base de datos.
     */
    @PostMapping
    public Proveedor createProveedor(@RequestBody Proveedor proveedor) {
        // @RequestBody convierte el JSON de la petición en un objeto Proveedor.
        // El método save() crea el registro en la base de datos.
        return proveedorRepository.save(proveedor);
    }

    /**
     * Endpoint para ACTUALIZAR un proveedor existente.
     * Método HTTP: PUT
     * URL: http://localhost:8080/api/proveedores/{id}
     * @param id El ID del proveedor a actualizar.
     * @param proveedorDetails Los nuevos datos del proveedor en el cuerpo de la petición.
     * @return Una respuesta HTTP con el proveedor actualizado o un error 404 si no se encuentra.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Proveedor> updateProveedor(@PathVariable Long id, @RequestBody Proveedor proveedorDetails) {
        return proveedorRepository.findById(id)
                .map(proveedor -> { 
                    // --- ACTUALIZADO A MÉTODOS CAMELCASE ---
                    proveedor.setNombreEmpresa(proveedorDetails.getNombreEmpresa());
                    proveedor.setNitRuc(proveedorDetails.getNitRuc());
                    proveedor.setTipoProveedor(proveedorDetails.getTipoProveedor());
                    proveedor.setSitioWeb(proveedorDetails.getSitioWeb());
                    proveedor.setPersonaContacto(proveedorDetails.getPersonaContacto());
                    proveedor.setTelefono(proveedorDetails.getTelefono());
                    proveedor.setEmail(proveedorDetails.getEmail());
                    proveedor.setDireccion(proveedorDetails.getDireccion());
                    proveedor.setCiudad(proveedorDetails.getCiudad());
                    proveedor.setPais(proveedorDetails.getPais());
                    proveedor.setCodigoPostal(proveedorDetails.getCodigoPostal());
                    proveedor.setCondicionesPago(proveedorDetails.getCondicionesPago());
                    proveedor.setDiasCredito(proveedorDetails.getDiasCredito());
                    proveedor.setDescuentoGeneral(proveedorDetails.getDescuentoGeneral());
                    proveedor.setNotasObservaciones(proveedorDetails.getNotasObservaciones());
                    proveedor.setEstado(proveedorDetails.getEstado());
                    
                    Proveedor updatedProveedor = proveedorRepository.save(proveedor);
                    return ResponseEntity.ok(updatedProveedor);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Endpoint para ELIMINAR un proveedor.
     * Método HTTP: DELETE
     * URL: http://localhost:8080/api/proveedores/{id}
     * @param id El ID del proveedor a eliminar.
     * @return Una respuesta HTTP 204 No Content si fue exitoso, o 404 Not Found si no existía.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProveedor(@PathVariable Long id) {
        if (proveedorRepository.existsById(id)) {
            proveedorRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}