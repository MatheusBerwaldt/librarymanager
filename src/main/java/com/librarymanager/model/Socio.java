package com.librarymanager.model;

import java.time.LocalDate;

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
    private int idSocio;

    private String nome;
    private LocalDate dataIngresso;
    private LocalDate dataNascimento;
    private String profissao;
    private String telefone;
}
