package com.librarymanager.model;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "\"Livro\"")
public class Livro {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
    private Long idLivro;

    @Column(nullable = false)
    private String nomeLivro;
    
    @Column(nullable = false)
    private String autorLivro;

    @Column(nullable = false)
    private LocalDate dataLancamento;

    private String editora;

    private String codBarras;

    private boolean disponivel;

    private double precoLivro;

    @ManyToOne
    @JoinColumn(name = "socio_emprestado_id")
    @JsonBackReference("socio-livros")
    private Socio socioEmprestado;

    @ManyToMany(mappedBy = "livros")
    @JsonIgnore
    private List<Emprestimo> emprestimos;

    // Método adicional para verificar se o livro está emprestado
    public boolean isEmprestado() {
        return !disponivel;
    }
}
