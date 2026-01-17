package com.juan.sisgi.sisgi_backend.controllers;

import com.juan.sisgi.sisgi_backend.models.Configuracion;
import com.juan.sisgi.sisgi_backend.repositories.ConfiguracionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/configuracion")
public class ConfiguracionController {

    @Autowired
    private ConfiguracionRepository configuracionRepository;

    @GetMapping
    public ResponseEntity<Configuracion> getConfiguracion() {
        Configuracion config = configuracionRepository.findFirstByOrderByIdAsc()
                .orElse(new Configuracion()); // Devuelve una vacía si no existe
        return ResponseEntity.ok(config);
    }

    @PostMapping
    public ResponseEntity<Configuracion> saveConfiguracion(@RequestBody Configuracion config) {
        Configuracion existing = configuracionRepository.findFirstByOrderByIdAsc().orElse(null);
        if (existing != null) {
            config.setId(existing.getId());
        }
        return ResponseEntity.ok(configuracionRepository.save(config));
    }
}
