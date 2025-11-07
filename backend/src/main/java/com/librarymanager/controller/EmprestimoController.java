package com.librarymanager.controller;

import com.librarymanager.model.Emprestimo;
import com.librarymanager.service.EmprestimoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/emprestimos")
public class EmprestimoController {

    @Autowired
    private EmprestimoService emprestimoService;

    // Listar todos os empréstimos
    @GetMapping
    public List<Emprestimo> listarTodos() {
        return emprestimoService.listarTodos();
    }

    // Listar empréstimos ativos (não devolvidos)
    @GetMapping("/ativos")
    public List<Emprestimo> listarEmprestimosAtivos() {
        return emprestimoService.listarEmprestimosAtivos();
    }

    // Listar empréstimos por sócio
    @GetMapping("/socio/{socioId}")
    public List<Emprestimo> listarEmprestimosPorSocio(@PathVariable Long socioId) {
        return emprestimoService.listarEmprestimosPorSocio(socioId);
    }

    // Buscar empréstimo por ID
    @GetMapping("/{id}")
    public ResponseEntity<Emprestimo> buscarPorId(@PathVariable Long id) {
        try {
            Emprestimo emprestimo = emprestimoService.buscarPorId(id);
            return ResponseEntity.ok(emprestimo);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Criar um empréstimo
    @PostMapping
    public ResponseEntity<?> criarEmprestimo(@RequestBody Emprestimo emprestimo) {
        try {
            Emprestimo novoEmprestimo = emprestimoService.registrarEmprestimo(emprestimo);
            return ResponseEntity.ok(novoEmprestimo);  // Retorna o empréstimo criado
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));  // Retorna a mensagem de erro
        }
    }
    
    // Classe para resposta de erro
    public static class ErrorResponse {
        private String message;
        
        public ErrorResponse(String message) {
            this.message = message;
        }
        
        public String getMessage() {
            return message;
        }
        
        public void setMessage(String message) {
            this.message = message;
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
