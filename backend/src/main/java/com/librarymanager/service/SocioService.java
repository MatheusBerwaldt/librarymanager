package com.librarymanager.service;

import com.librarymanager.model.Socio;
import com.librarymanager.repository.SocioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class SocioService {

    @Autowired
    private SocioRepository socioRepository;

    public List<Socio> getAllSocios() {
        return socioRepository.findAll();
    }

    public Optional<Socio> getSocioById(Long id) {
        return socioRepository.findById(id);
    }

    public Socio saveSocio(Socio socio) {
        return socioRepository.save(socio);
    }

    public Socio atualizarSocio(Long id, Socio socioAtualizado) {
        return socioRepository.findById(id)
                .map(socio -> {
                    socio.setNome(socioAtualizado.getNome());
                    socio.setDataIngresso(socioAtualizado.getDataIngresso());
                    socio.setDataNascimento(socioAtualizado.getDataNascimento());
                    socio.setProfissao(socioAtualizado.getProfissao());
                    socio.setTelefone(socioAtualizado.getTelefone());
                    return socioRepository.save(socio);
                }).orElseThrow(() -> new RuntimeException("Sócio não encontrado com ID: " + id));
    }

    public void deleteSocio(Long id) {
        Socio socio = socioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sócio não encontrado com ID: " + id));
        socioRepository.delete(socio);
    }
}
