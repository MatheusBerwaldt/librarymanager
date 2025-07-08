package com.librarymanager.controller;

import com.librarymanager.model.Socio;
import com.librarymanager.service.SocioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/socios")
public class SocioController {

    @Autowired
    private SocioService socioService;

    @GetMapping
    public List<Socio> getAllSocios() {
        return socioService.getAllSocios();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Socio> getSocioById(@PathVariable Long id) {
        Optional<Socio> socio = socioService.getSocioById(id);
        return socio.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Socio createSocio(@RequestBody Socio socio) {
        return socioService.saveSocio(socio);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Socio> atualizarSocio(@PathVariable Long id, @RequestBody Socio socioAtualizado) {
        try {
            Socio socio = socioService.atualizarSocio(id, socioAtualizado);
            return ResponseEntity.ok(socio);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSocio(@PathVariable Long id) {
        try {
            socioService.deleteSocio(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
