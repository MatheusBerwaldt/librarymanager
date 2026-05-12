package com.librarymanager.repository;

import com.librarymanager.model.Emprestimo;
import com.librarymanager.model.Socio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EmprestimoRepository extends JpaRepository<Emprestimo, Long> {

    List<Emprestimo> findByDataDevolucaoRealIsNull();

    List<Emprestimo> findBySocio(Socio socio);

    @Query("SELECT e FROM Emprestimo e WHERE e.dataDevolucaoReal IS NULL AND e.dataDevolucaoPrevista < :hoje")
    List<Emprestimo> findAtrasados(@Param("hoje") LocalDate hoje);
}
