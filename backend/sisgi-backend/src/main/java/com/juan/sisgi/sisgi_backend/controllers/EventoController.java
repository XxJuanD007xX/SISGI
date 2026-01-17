package com.juan.sisgi.sisgi_backend.controllers;

import com.juan.sisgi.sisgi_backend.dto.EntityMapper;
import com.juan.sisgi.sisgi_backend.dto.EventoDTO;
import com.juan.sisgi.sisgi_backend.exception.ResourceNotFoundException;
import com.juan.sisgi.sisgi_backend.models.Evento;
import com.juan.sisgi.sisgi_backend.repositories.EventoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/eventos")
public class EventoController {

    @Autowired
    private EventoRepository eventoRepository;

    @Autowired
    private EntityMapper entityMapper;

    @GetMapping
    public List<EventoDTO> getAllEventos() {
        return eventoRepository.findAll().stream()
                .map(entityMapper::toDTO)
                .collect(Collectors.toList());
    }

    @PostMapping
    public EventoDTO createEvento(@RequestBody EventoDTO dto) {
        Evento evento = entityMapper.toEntity(dto);
        return entityMapper.toDTO(eventoRepository.save(evento));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvento(@PathVariable Long id) {
        if (!eventoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Evento no encontrado");
        }
        eventoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
