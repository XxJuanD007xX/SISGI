/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.juan.sisgi.sisgi_backend.controllers;

import com.juan.sisgi.sisgi_backend.models.Anuncio;
import com.juan.sisgi.sisgi_backend.repositories.AnuncioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/anuncios")
@CrossOrigin(origins = "http://localhost:3000")
public class AnuncioController {

    @Autowired
    private AnuncioRepository anuncioRepository;

    @GetMapping
    public List<Anuncio> getAllAnuncios() {
        return anuncioRepository.findAllByOrderByFijadoDescFechaCreacionDesc();
    }

    @PostMapping
    public Anuncio createAnuncio(@RequestBody Anuncio anuncio) {
        if (!"Administrador".equals(anuncio.getAutorRol())) {
            anuncio.setFijado(false);
        }
        // Aseguramos que la lista no sea null
        if (anuncio.getReacciones() == null) {
            anuncio.setReacciones(new ArrayList<>());
        }
        return anuncioRepository.save(anuncio);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnuncio(@PathVariable Long id) {
        if (anuncioRepository.existsById(id)) {
            anuncioRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/fijar")
    public ResponseEntity<Anuncio> toggleFijar(@PathVariable Long id) {
        return anuncioRepository.findById(id).map(anuncio -> {
            anuncio.setFijado(!anuncio.isFijado());
            return ResponseEntity.ok(anuncioRepository.save(anuncio));
        }).orElse(ResponseEntity.notFound().build());
    }

    // --- LÓGICA DE REACCIONES CORREGIDA ---
    @PostMapping("/{id}/react")
    public ResponseEntity<Anuncio> toggleReaction(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String userId = body.get("userId");
        String emoji = body.get("emoji"); // Recibimos el emoji

        return anuncioRepository.findById(id).map(anuncio -> {
            List<String> reacciones = anuncio.getReacciones();
            if (reacciones == null) reacciones = new ArrayList<>();

            // Buscamos si este usuario ya tiene alguna reacción
            int indexFound = -1;
            for (int i = 0; i < reacciones.size(); i++) {
                // El formato almacenado es "userId:emoji"
                if (reacciones.get(i).startsWith(userId + ":")) {
                    indexFound = i;
                    break;
                }
            }

            if (indexFound != -1) {
                // El usuario ya había reaccionado antes
                String currentReaction = reacciones.get(indexFound);
                String currentEmoji = currentReaction.split(":")[1]; // Extraemos el emoji actual

                if (currentEmoji.equals(emoji)) {
                    // Si toca el mismo emoji, quitamos la reacción (Toggle OFF)
                    reacciones.remove(indexFound);
                } else {
                    // Si es un emoji diferente, actualizamos a la nueva (Cambio de reacción)
                    reacciones.set(indexFound, userId + ":" + emoji);
                }
            } else {
                // Es una reacción nueva
                reacciones.add(userId + ":" + emoji);
            }
            
            anuncio.setReacciones(reacciones);
            return ResponseEntity.ok(anuncioRepository.save(anuncio));
        }).orElse(ResponseEntity.notFound().build());
    }
}