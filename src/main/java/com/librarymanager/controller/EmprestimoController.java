package com.librarymanager.controller;

import com.librarymanager.model.Emprestimo;
import com.librarymanager.service.EmprestimoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/emprestimos")
public class EmprestimoController {

    @Autowired
    private EmprestimoService emprestimoService;

    // Criar um empréstimo
    @PostMapping
    public ResponseEntity<Emprestimo> criarEmprestimo(@RequestBody Emprestimo emprestimo) {
        try {
            Emprestimo novoEmprestimo = emprestimoService.registrarEmprestimo(emprestimo);
            return ResponseEntity.ok(novoEmprestimo);  // Retorna o empréstimo criado
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);  // Se houver erro no empréstimo (livro não disponível)
        }
    }

    // Registrar a devolução de um empréstimo
    @PutMapping("/{emprestimoId}/devolver")
    public ResponseEntity<Emprestimo> registrarDevolucao(@PathVariable Long emprestimoId) {
        try {
            Emprestimo emprestimo = emprestimoService.registrarDevolucao(emprestimoId);
            return ResponseEntity.ok(emprestimo);  // Retorna o empréstimo após a devolução
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();  // Caso o empréstimo não seja encontrado
        }
    }
}
