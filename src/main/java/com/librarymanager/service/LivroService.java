package com.librarymanager.service;

import com.librarymanager.model.Livro;
import com.librarymanager.repository.LivroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LivroService {

    @Autowired
    private LivroRepository livroRepository;

    public List<Livro> listarTodos() {
        return livroRepository.findAll();
    }

    public Optional<Livro> buscarPorId(int id) {
        return livroRepository.findById(id);
    }

    public Livro salvarLivro(Livro livro) {
        return livroRepository.save(livro);
    }

    public Livro atualizarLivro(int id, Livro livroAtualizado) {
        return livroRepository.findById(id)
                .map(livro -> {
                    livro.setAutorLivro(livroAtualizado.getAutorLivro());
                    livro.setDataLancamento(livroAtualizado.getDataLancamento());
                    livro.setEditora(livroAtualizado.getEditora());
                    livro.setCodBarras(livroAtualizado.getCodBarras());
                    livro.setEmprestado(livroAtualizado.isEmprestado());
                    livro.setPrecoLivro(livroAtualizado.getPrecoLivro());
                    return livroRepository.save(livro);
                }).orElseThrow(() -> new RuntimeException("Livro não encontrado com ID: " + id));
    }

    public void deletarLivro(int id) {
        livroRepository.deleteById(id);
    }
}
