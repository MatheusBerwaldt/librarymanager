package com.librarymanager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.librarymanager.model.Livro;

@Repository
public interface LivroRepository extends JpaRepository<Livro, Long> { // Alterado para Long
}
