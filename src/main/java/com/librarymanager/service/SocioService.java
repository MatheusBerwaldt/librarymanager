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

    public Optional<Socio> getSocioById(int id) {
        return socioRepository.findById(id);
    }

    public Socio saveSocio(Socio socio) {
        return socioRepository.save(socio);
    }

    public void deleteSocio(int id) {
        socioRepository.deleteById(id);
    }
}
