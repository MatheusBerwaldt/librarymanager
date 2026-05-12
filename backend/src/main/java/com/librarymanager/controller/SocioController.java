package com.librarymanager.controller;

import com.librarymanager.model.Socio;
import com.librarymanager.service.SocioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/socios")
public class SocioController {

    @Autowired
    private SocioService socioService;

    @GetMapping
    public List<Socio> listar(@RequestParam(required = false) String search) {
        if (search != null && !search.isBlank()) return socioService.buscar(search);
        return socioService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Socio> buscarPorId(@PathVariable Long id) {
        return socioService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Socio criar(@Valid @RequestBody Socio socio) {
        return socioService.salvar(socio);
    }

    @PutMapping("/{id}")
    public Socio atualizar(@PathVariable Long id, @Valid @RequestBody Socio socio) {
        return socioService.atualizar(id, socio);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@PathVariable Long id) {
        socioService.deletar(id);
    }
}
