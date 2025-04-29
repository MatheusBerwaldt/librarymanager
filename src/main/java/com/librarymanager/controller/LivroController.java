package com.librarymanager.controller;

import com.librarymanager.model.Livro;
import com.librarymanager.service.LivroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("livros")
public class LivroController {

    @Autowired
    private LivroService livroService;

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public Livro criarLivro(@RequestBody Livro livro) {
        return livroService.salvarLivro(livro);
    }

    @GetMapping
    public List<Livro> listarTodos() {
        return livroService.listarTodos();
    }

    @GetMapping("/disponiveis")
    public List<Livro> listarLivrosDisponiveis() {
        return livroService.listarLivrosDisponiveis();
    }

    @GetMapping("/emprestados")
    public List<Livro> listarLivrosEmprestados() {
        return livroService.listarLivrosEmprestados();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Livro> buscarPorId(@PathVariable Long id) {
        Optional<Livro> livro = livroService.buscarPorId(id);
        return livro.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Livro> atualizarLivroPorId(@PathVariable Long id, @RequestBody Livro livroAtualizado) {
        try {
            Livro livro = livroService.atualizarLivro(id, livroAtualizado);
            return ResponseEntity.ok(livro);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarLivro(@PathVariable Long id) {
        try {
            livroService.deletarLivro(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();  // Caso o livro não seja encontrado para excluir
        }
    }

    @PutMapping("/{id}/emprestar")
    public ResponseEntity<Livro> emprestarLivro(@PathVariable Long id, @RequestParam Long idSocio) {
        try {
            Livro livro = livroService.marcarComoEmprestado(id, idSocio);
            return ResponseEntity.ok(livro);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/devolver")
    public ResponseEntity<Livro> devolverLivro(@PathVariable Long id) {
        try {
            Livro livro = livroService.marcarComoDevolvido(id);
            return ResponseEntity.ok(livro);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
