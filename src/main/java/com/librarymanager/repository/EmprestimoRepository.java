package com.librarymanager.repository;

import com.librarymanager.model.Emprestimo;
import com.librarymanager.model.Socio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmprestimoRepository extends JpaRepository<Emprestimo, Long> {
    List<Emprestimo> findByDataDevolucaoRealIsNull();
    List<Emprestimo> findBySocio(Socio socio);
}
