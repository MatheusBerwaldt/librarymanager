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

    public List<Emprestimo> listarTodos() {
        return emprestimoRepository.findAll();
    }

    public List<Emprestimo> listarAtivos() {
        return emprestimoRepository.findByDataDevolucaoRealIsNull();
    }

    public List<Emprestimo> listarAtrasados() {
        return emprestimoRepository.findAtrasados(LocalDate.now());
    }

    public List<Emprestimo> listarPorSocio(Long socioId) {
        Socio socio = socioRepository.findById(socioId)
                .orElseThrow(() -> new NoSuchElementException("Sócio não encontrado!"));
        return emprestimoRepository.findBySocio(socio);
    }

    public Emprestimo buscarPorId(Long id) {
        return emprestimoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Empréstimo não encontrado!"));
    }

    public Emprestimo registrar(Emprestimo emprestimo) {
        Socio socio = socioRepository.findById(emprestimo.getSocio().getIdSocio())
                .orElseThrow(() -> new NoSuchElementException("Sócio não encontrado!"));

        List<Livro> livros = emprestimo.getLivros().stream()
                .map(l -> {
                    Livro livro = livroRepository.findById(l.getIdLivro())
                            .orElseThrow(() -> new NoSuchElementException("Livro não encontrado: " + l.getIdLivro()));
                    if (!livro.isDisponivel()) {
                        throw new RuntimeException("Livro '" + livro.getNomeLivro() + "' não está disponível");
                    }
                    livro.setDisponivel(false);
                    livro.setSocioEmprestado(socio);
                    return livroRepository.save(livro);
                })
                .toList();

        emprestimo.setSocio(socio);
        emprestimo.setLivros(livros);
        emprestimo.setDataEmprestimo(LocalDate.now());
        return emprestimoRepository.save(emprestimo);
    }

    public Emprestimo registrarDevolucao(Long emprestimoId) {
        Emprestimo emprestimo = emprestimoRepository.findById(emprestimoId)
                .orElseThrow(() -> new NoSuchElementException("Empréstimo não encontrado!"));

        if (emprestimo.getDataDevolucaoReal() != null) {
            throw new IllegalStateException("Este empréstimo já foi devolvido!");
        }

        emprestimo.setDataDevolucaoReal(LocalDate.now());

        emprestimo.getLivros().forEach(livro -> {
            Livro l = livroRepository.findById(livro.getIdLivro())
                    .orElseThrow(() -> new NoSuchElementException("Livro não encontrado!"));
            l.setDisponivel(true);
            l.setSocioEmprestado(null);
            livroRepository.save(l);
        });

        return emprestimoRepository.save(emprestimo);
    }
}
