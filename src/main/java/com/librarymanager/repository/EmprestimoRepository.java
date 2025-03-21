package com.librarymanager.repository;

import com.librarymanager.model.Emprestimo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmprestimoRepository extends JpaRepository<Emprestimo, Long> {
    // Se precisar de consultas customizadas, pode adicionar aqui.
}
