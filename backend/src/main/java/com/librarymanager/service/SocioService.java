package com.librarymanager.service;

import com.librarymanager.model.Socio;
import com.librarymanager.repository.SocioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class SocioService {

    @Autowired
    private SocioRepository socioRepository;

    public List<Socio> listarTodos() {
        return socioRepository.findAll();
    }

    public List<Socio> buscar(String nome) {
        return socioRepository.findByNomeContainingIgnoreCase(nome);
    }

    public Optional<Socio> buscarPorId(Long id) {
        return socioRepository.findById(id);
    }

    public Socio salvar(Socio socio) {
        return socioRepository.save(socio);
    }

    public Socio atualizar(Long id, Socio atualizado) {
        return socioRepository.findById(id)
                .map(socio -> {
                    socio.setNome(atualizado.getNome());
                    socio.setDataIngresso(atualizado.getDataIngresso());
                    socio.setDataNascimento(atualizado.getDataNascimento());
                    socio.setProfissao(atualizado.getProfissao());
                    socio.setTelefone(atualizado.getTelefone());
                    return socioRepository.save(socio);
                })
                .orElseThrow(() -> new NoSuchElementException("Sócio não encontrado com ID: " + id));
    }

    public void deletar(Long id) {
        Socio socio = socioRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Sócio não encontrado com ID: " + id));
        socioRepository.delete(socio);
    }
}
