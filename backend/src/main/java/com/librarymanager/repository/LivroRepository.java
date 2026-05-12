package com.librarymanager.repository;

import com.librarymanager.model.Livro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LivroRepository extends JpaRepository<Livro, Long> {

    List<Livro> findByDisponivelTrue();
    List<Livro> findByDisponivelFalse();

    @Query("SELECT l FROM Livro l WHERE l.nomeLivro LIKE %:q% OR l.autorLivro LIKE %:q% OR l.codBarras LIKE %:q%")
    List<Livro> search(@Param("q") String query);
}
