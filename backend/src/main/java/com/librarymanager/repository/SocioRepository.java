package com.librarymanager.repository;

import com.librarymanager.model.Socio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SocioRepository extends JpaRepository<Socio, Long> {

    List<Socio> findByNomeContainingIgnoreCase(String nome);
}
