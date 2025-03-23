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

    public Optional<Livro> buscarPorId(Long id) { // Alterado para Long
        return livroRepository.findById(id);
    }

    public Livro salvarLivro(Livro livro) {
        return livroRepository.save(livro);
    }

    public Livro atualizarLivro(Long id, Livro livroAtualizado) { // Alterado para Long
        return livroRepository.findById(id)
                .map(livro -> {
                    livro.setNomeLivro(livroAtualizado.getNomeLivro());
                    livro.setAutorLivro(livroAtualizado.getAutorLivro());
                    livro.setDataLancamento(livroAtualizado.getDataLancamento());
                    livro.setEditora(livroAtualizado.getEditora());
                    livro.setCodBarras(livroAtualizado.getCodBarras());
                    livro.setDisponivel(livroAtualizado.isDisponivel());
                    livro.setPrecoLivro(livroAtualizado.getPrecoLivro());
                    return livroRepository.save(livro);
                }).orElseThrow(() -> new RuntimeException("Livro não encontrado com ID: " + id));
    }

    public void deletarLivro(Long id) { // Alterado para Long
        Livro livro = livroRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado com ID: " + id)); 
        livroRepository.delete(livro); 
    }
}
