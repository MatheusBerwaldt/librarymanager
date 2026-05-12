package com.librarymanager.service;

import com.librarymanager.model.Livro;
import com.librarymanager.repository.LivroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class LivroService {

    @Autowired
    private LivroRepository livroRepository;

    public List<Livro> listarTodos() {
        return livroRepository.findAll();
    }

    public List<Livro> listarDisponiveis() {
        return livroRepository.findByDisponivelTrue();
    }

    public List<Livro> listarEmprestados() {
        return livroRepository.findByDisponivelFalse();
    }

    public List<Livro> buscar(String query) {
        return livroRepository.search(query);
    }

    public Optional<Livro> buscarPorId(Long id) {
        return livroRepository.findById(id);
    }

    public Livro salvar(Livro livro) {
        return livroRepository.save(livro);
    }

    public Livro atualizar(Long id, Livro atualizado) {
        return livroRepository.findById(id)
                .map(livro -> {
                    livro.setNomeLivro(atualizado.getNomeLivro());
                    livro.setAutorLivro(atualizado.getAutorLivro());
                    livro.setDataLancamento(atualizado.getDataLancamento());
                    livro.setEditora(atualizado.getEditora());
                    livro.setCodBarras(atualizado.getCodBarras());
                    livro.setDisponivel(atualizado.isDisponivel());
                    livro.setPrecoLivro(atualizado.getPrecoLivro());
                    return livroRepository.save(livro);
                })
                .orElseThrow(() -> new NoSuchElementException("Livro não encontrado com ID: " + id));
    }

    public void deletar(Long id) {
        Livro livro = livroRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Livro não encontrado com ID: " + id));
        livroRepository.delete(livro);
    }
}
