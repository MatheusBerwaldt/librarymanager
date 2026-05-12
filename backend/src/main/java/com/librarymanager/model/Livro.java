package com.librarymanager.model;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "livros")
public class Livro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
    private Long idLivro;

    @NotBlank(message = "Nome do livro é obrigatório")
    @Column(nullable = false)
    private String nomeLivro;

    @NotBlank(message = "Autor é obrigatório")
    @Column(nullable = false)
    private String autorLivro;

    @NotNull(message = "Data de lançamento é obrigatória")
    @Column(nullable = false)
    private LocalDate dataLancamento;

    private String editora;

    private String codBarras;

    @Builder.Default
    private boolean disponivel = true;

    @PositiveOrZero(message = "Preço não pode ser negativo")
    private double precoLivro;

    @ManyToOne
    @JoinColumn(name = "socio_emprestado_id")
    @JsonBackReference("socio-livros")
    private Socio socioEmprestado;

    @ManyToMany(mappedBy = "livros")
    @JsonIgnore
    private List<Emprestimo> emprestimos;

    public boolean isEmprestado() {
        return !disponivel;
    }
}
