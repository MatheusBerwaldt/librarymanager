package com.librarymanager.controller;

import com.librarymanager.model.Livro;
import com.librarymanager.service.LivroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/livros")
public class LivroController {

    @Autowired
    private LivroService livroService;

    @GetMapping
    public List<Livro> listarTodos() {
        return livroService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Livro> buscarPorId(@PathVariable Long id) { // Alterado para Long
        Optional<Livro> livro = livroService.buscarPorId(id);
        return livro.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Livro criarLivro(@RequestBody Livro livro) {
        return livroService.salvarLivro(livro);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Livro> atualizarLivroPorId(@PathVariable Long id, @RequestBody Livro livroAtualizado) { // Alterado para Long
        try {
            Livro livro = livroService.atualizarLivro(id, livroAtualizado);
            return ResponseEntity.ok(livro);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarLivro(@PathVariable Long id) { // Alterado para Long
        try {
            livroService.deletarLivro(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();  // Caso o livro não seja encontrado para excluir
        }
    }
}
