package com.librarymanager.service;

import com.librarymanager.model.Emprestimo;
import com.librarymanager.model.Livro;
import com.librarymanager.repository.EmprestimoRepository;
import com.librarymanager.repository.LivroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.NoSuchElementException;

@Service
public class EmprestimoService {

    @Autowired
    private EmprestimoRepository emprestimoRepository;

    @Autowired
    private LivroRepository livroRepository;

    // Registrar um empréstimo
    public Emprestimo registrarEmprestimo(Emprestimo emprestimo) {
        // Verifica se os livros estão disponíveis
        for (Livro livro : emprestimo.getLivros()) {
            if (!livro.isDisponivel()) {
                throw new RuntimeException("Livro " + livro.getCodBarras() + " não está disponível!");
            }
            livro.setDisponivel(false);  // Marca o livro como não disponível
            livroRepository.save(livro);
        }
        emprestimo.setDataEmprestimo(LocalDate.now());
        return emprestimoRepository.save(emprestimo);  // Salva o empréstimo
    }

    // Registrar devolução de empréstimo
    public Emprestimo registrarDevolucao(Long emprestimoId) {
        Emprestimo emprestimo = emprestimoRepository.findById(emprestimoId)
                .orElseThrow(() -> new NoSuchElementException("Empréstimo não encontrado!"));
    
        if (emprestimo.getDataDevolucaoReal() != null) {
            throw new IllegalStateException("Este empréstimo já foi devolvido!");
        }
    
        emprestimo.setDataDevolucaoReal(LocalDate.now());  // Define a data de devolução real
    
        // Marca os livros como disponíveis novamente
        for (Livro livro : emprestimo.getLivros()) {
            livro.setDisponivel(true);
            livroRepository.save(livro);
        }
    
        return emprestimoRepository.save(emprestimo);  // Salva o empréstimo após a devolução
    }
}
