package com.librarymanager.model;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "socios")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Socio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idSocio;

    private String nome;
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
