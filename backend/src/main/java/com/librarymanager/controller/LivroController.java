package com.librarymanager.controller;

import com.librarymanager.model.Livro;
import com.librarymanager.service.LivroService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/livros")
public class LivroController {

    @Autowired
    private LivroService livroService;

    @GetMapping
    public List<Livro> listar(@RequestParam(required = false) String search) {
        if (search != null && !search.isBlank()) return livroService.buscar(search);
        return livroService.listarTodos();
    }

    @GetMapping("/disponiveis")
    public List<Livro> disponiveis() {
        return livroService.listarDisponiveis();
    }

    @GetMapping("/emprestados")
    public List<Livro> emprestados() {
        return livroService.listarEmprestados();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Livro> buscarPorId(@PathVariable Long id) {
        return livroService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Livro criar(@Valid @RequestBody Livro livro) {
        return livroService.salvar(livro);
    }

    @PutMapping("/{id}")
    public Livro atualizar(@PathVariable Long id, @Valid @RequestBody Livro livro) {
        return livroService.atualizar(id, livro);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@PathVariable Long id) {
        livroService.deletar(id);
    }
}
