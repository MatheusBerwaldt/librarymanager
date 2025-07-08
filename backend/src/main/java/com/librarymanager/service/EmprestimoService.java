package com.librarymanager.service;

import com.librarymanager.model.Emprestimo;
import com.librarymanager.model.Livro;
import com.librarymanager.model.Socio;
import com.librarymanager.repository.EmprestimoRepository;
import com.librarymanager.repository.LivroRepository;
import com.librarymanager.repository.SocioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class EmprestimoService {

    @Autowired
    private EmprestimoRepository emprestimoRepository;

    @Autowired
    private LivroRepository livroRepository;

    @Autowired
    private SocioRepository socioRepository;

    // Registrar um empréstimo
    public Emprestimo registrarEmprestimo(Emprestimo emprestimo) {
        // Verifica se o sócio existe
        Socio socio = socioRepository.findById(emprestimo.getSocio().getIdSocio())
                .orElseThrow(() -> new NoSuchElementException("Sócio não encontrado!"));

        // Verifica se os livros estão disponíveis
        for (Livro livro : emprestimo.getLivros()) {
            Livro livroAtualizado = livroRepository.findById(livro.getIdLivro())
                    .orElseThrow(() -> new NoSuchElementException("Livro não encontrado!"));
            
            if (!livroAtualizado.isDisponivel()) {
                throw new RuntimeException("Livro " + livroAtualizado.getCodBarras() + " não está disponível!");
            }
            
            // Marca o livro como não disponível e associa ao sócio
            livroAtualizado.setDisponivel(false);
            livroAtualizado.setSocioEmprestado(socio);
            livroRepository.save(livroAtualizado);
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
            Livro livroAtualizado = livroRepository.findById(livro.getIdLivro())
                    .orElseThrow(() -> new NoSuchElementException("Livro não encontrado!"));
            
            livroAtualizado.setDisponivel(true);
            livroAtualizado.setSocioEmprestado(null);
            livroRepository.save(livroAtualizado);
        }
    
        return emprestimoRepository.save(emprestimo);  // Salva o empréstimo após a devolução
    }

    // Listar todos os empréstimos
    public List<Emprestimo> listarTodos() {
        return emprestimoRepository.findAll();
    }

    // Buscar empréstimo por ID
    public Emprestimo buscarPorId(Long id) {
        return emprestimoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Empréstimo não encontrado!"));
    }

    // Listar empréstimos ativos (não devolvidos)
    public List<Emprestimo> listarEmprestimosAtivos() {
        return emprestimoRepository.findByDataDevolucaoRealIsNull();
    }

    // Listar empréstimos por sócio
    public List<Emprestimo> listarEmprestimosPorSocio(Long socioId) {
        Socio socio = socioRepository.findById(socioId)
                .orElseThrow(() -> new NoSuchElementException("Sócio não encontrado!"));
        return emprestimoRepository.findBySocio(socio);
    }
}
