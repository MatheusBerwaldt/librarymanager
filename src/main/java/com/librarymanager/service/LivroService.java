package com.librarymanager.service;

import com.librarymanager.model.Livro;
import com.librarymanager.model.Socio;
import com.librarymanager.repository.LivroRepository;
import com.librarymanager.repository.SocioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LivroService {

    @Autowired
    private LivroRepository livroRepository;
    
    @Autowired
    private SocioRepository socioRepository;

    public List<Livro> listarTodos() {
        return livroRepository.findAll();
    }

    public List<Livro> listarLivrosDisponiveis() {
        return livroRepository.findByDisponivelTrue();
    }

    public List<Livro> listarLivrosEmprestados() {
        return livroRepository.findByDisponivelFalse();
    }

    public Optional<Livro> buscarPorId(Long id) {
        return livroRepository.findById(id);
    }

    public Livro salvarLivro(Livro livro) {
        return livroRepository.save(livro);
    }

    public Livro atualizarLivro(Long id, Livro livroAtualizado) {
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

    public void deletarLivro(Long id) {
        Livro livro = livroRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado com ID: " + id)); 
        livroRepository.delete(livro); 
    }

    public Livro marcarComoEmprestado(Long idLivro, Long idSocio) {
        Livro livro = livroRepository.findById(idLivro)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado com ID: " + idLivro));
        
        Socio socio = socioRepository.findById(idSocio)
                .orElseThrow(() -> new RuntimeException("Sócio não encontrado com ID: " + idSocio));
        
        if (!livro.isDisponivel()) {
            throw new RuntimeException("Livro já está emprestado");
        }
        
        livro.setDisponivel(false);
        livro.setSocioEmprestado(socio);
        return livroRepository.save(livro);
    }

    public Livro marcarComoDevolvido(Long idLivro) {
        Livro livro = livroRepository.findById(idLivro)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado com ID: " + idLivro));
        
        if (livro.isDisponivel()) {
            throw new RuntimeException("Livro já está disponível");
        }
        
        livro.setDisponivel(true);
        livro.setSocioEmprestado(null);
        return livroRepository.save(livro);
    }
}
