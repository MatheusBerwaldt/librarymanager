package com.librarymanager.model;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "livros")
public class Livro {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idLivro; // Alterado para Long

    @Column(nullable = false)
    private String autorLivro;

    @Column(nullable = false)
    private LocalDate dataLancamento;

    private String editora;

    private String codBarras;

    private boolean disponivel;

    private double precoLivro;

    @ManyToMany(mappedBy = "livros")
    private List<Emprestimo> emprestimos;

    // Construtor padrão
    public Livro() {
    }

    // Construtor com parâmetros
    public Livro(Long idLivro, String autorLivro, LocalDate dataLancamento, String editora, String codBarras, boolean disponivel, double precoLivro) {
        this.idLivro = idLivro;
        this.autorLivro = autorLivro;
        this.dataLancamento = dataLancamento;
        this.editora = editora;
        this.codBarras = codBarras;
        this.disponivel = disponivel;
        this.precoLivro = precoLivro;
    }

    // Getters e Setters
    public Long getIdLivro() {
        return idLivro;
    }

    public void setIdLivro(Long idLivro) {
        this.idLivro = idLivro;
    }

    public String getAutorLivro() {
        return autorLivro;
    }

    public void setAutorLivro(String autorLivro) {
        this.autorLivro = autorLivro;
    }

    public LocalDate getDataLancamento() {
        return dataLancamento;
    }

    public void setDataLancamento(LocalDate dataLancamento) {
        this.dataLancamento = dataLancamento;
    }

    public String getEditora() {
        return editora;
    }

    public void setEditora(String editora) {
        this.editora = editora;
    }

    public String getCodBarras() {
        return codBarras;
    }

    public void setCodBarras(String codBarras) {
        this.codBarras = codBarras;
    }

    public boolean isDisponivel() {
        return disponivel;
    }

    public void setDisponivel(boolean disponivel) {
        this.disponivel = disponivel;
    }

    public double getPrecoLivro() {
        return precoLivro;
    }

    public void setPrecoLivro(double precoLivro) {
        this.precoLivro = precoLivro;
    }

    public List<Emprestimo> getEmprestimos() {
        return emprestimos;
    }

    public void setEmprestimos(List<Emprestimo> emprestimos) {
        this.emprestimos = emprestimos;
    }

    // Método adicional para verificar se o livro está emprestado
    public boolean isEmprestado() {
        return !disponivel;
    }
}
