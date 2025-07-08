package com.librarymanager.repository;

import com.librarymanager.model.Socio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SocioRepository extends JpaRepository<Socio, Long> {
    // Se precisar de consultas customizadas, pode adicionar aqui.
}

