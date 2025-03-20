package com.librarymanager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.librarymanager.model.Socio;

@Repository
public interface SocioRepository extends JpaRepository<Socio, Integer> {
}

