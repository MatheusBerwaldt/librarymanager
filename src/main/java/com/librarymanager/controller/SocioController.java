package com.librarymanager.controller;

import com.librarymanager.model.Socio;
import com.librarymanager.service.SocioService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public Optional<Socio> getSocioById(@PathVariable int id) {
        return socioService.getSocioById(id);
    }

    @PostMapping
    public Socio createSocio(@RequestBody Socio socio) {
        return socioService.saveSocio(socio);
    }

    @DeleteMapping("/{id}")
    public String deleteSocio(@PathVariable int id) {
        socioService.deleteSocio(id);
        return "Sócio removido com sucesso!";
    }
}
