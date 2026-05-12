package com.librarymanager.model;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "socios")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Socio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idSocio;

    @NotBlank(message = "Nome é obrigatório")
    private String nome;

    @NotNull(message = "Data de ingresso é obrigatória")
    private LocalDate dataIngresso;

    private LocalDate dataNascimento;
    private String profissao;
    private String telefone;

    @OneToMany(mappedBy = "socioEmprestado")
    @JsonIgnore
    private List<Livro> livrosEmprestados;

    @OneToMany(mappedBy = "socio")
    @JsonIgnore
    private List<Emprestimo> emprestimos;
}
