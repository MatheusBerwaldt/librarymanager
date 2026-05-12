package com.librarymanager.config;

import com.librarymanager.model.Emprestimo;
import com.librarymanager.model.Livro;
import com.librarymanager.model.Socio;
import com.librarymanager.repository.EmprestimoRepository;
import com.librarymanager.repository.LivroRepository;
import com.librarymanager.repository.SocioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seed(LivroRepository livros, SocioRepository socios, EmprestimoRepository emprestimos) {
        return args -> {
            if (livros.count() > 0) return;

            // ── Livros ────────────────────────────────────────────────────────
            Livro l1 = livro("Dom Casmurro",                   "Machado de Assis",  "1899-01-01", "Garnier",       "9788535910902", 32.90);
            Livro l2 = livro("O Cortiço",                      "Aluísio Azevedo",   "1890-01-01", "Ática",         "9788508013746", 28.50);
            Livro l3 = livro("Vidas Secas",                    "Graciliano Ramos",  "1938-01-01", "Record",        "9788501049100", 35.00);
            Livro l4 = livro("Grande Sertão: Veredas",         "João Guimarães Rosa","1956-01-01","Nova Fronteira","9788520900492", 59.90);
            Livro l5 = livro("A Moreninha",                    "Joaquim Macedo",    "1844-01-01", "Ediouro",       "9788500000000", 24.00);
            Livro l6 = livro("Capitães da Areia",              "Jorge Amado",       "1937-01-01", "Companhia das Letras","9788535908756", 44.90);
            Livro l7 = livro("O Guarani",                      "José de Alencar",   "1857-01-01", "Saraiva",       "9788502000001", 29.90);
            Livro l8 = livro("Iracema",                        "José de Alencar",   "1865-01-01", "Saraiva",       "9788502000002", 22.00);
            Livro l9 = livro("Memórias Póstumas de Brás Cubas","Machado de Assis",  "1881-01-01", "Garnier",       "9788535902600", 38.00);
            Livro l10= livro("Quincas Borba",                  "Machado de Assis",  "1891-01-01", "Garnier",       "9788535902601", 36.00);
            Livro l11= livro("O Alienista",                    "Machado de Assis",  "1882-01-01", "Companhia das Letras","9788535911510", 19.90);
            Livro l12= livro("Triste Fim de Policarpo Quaresma","Lima Barreto",     "1915-01-01", "Penguin",       "9788563560452", 41.00);

            List<Livro> todos = livros.saveAll(List.of(l1,l2,l3,l4,l5,l6,l7,l8,l9,l10,l11,l12));
            l1=todos.get(0); l2=todos.get(1); l3=todos.get(2);  l4=todos.get(3);
            l5=todos.get(4); l6=todos.get(5); l7=todos.get(6);  l8=todos.get(7);
            l9=todos.get(8); l10=todos.get(9); l11=todos.get(10); l12=todos.get(11);

            // ── Sócios ────────────────────────────────────────────────────────
            Socio s1 = socio("Ana Paula Ferreira",  "2022-03-10", "1990-07-15", "Professora",    "(11) 98765-4321");
            Socio s2 = socio("Bruno Carvalho",      "2021-08-22", "1985-11-30", "Engenheiro",    "(21) 97654-3210");
            Socio s3 = socio("Carla Mendonça",      "2023-01-05", "1995-04-20", "Estudante",     "(31) 96543-2109");
            Socio s4 = socio("Diego Oliveira",      "2020-06-18", "1978-09-03", "Médico",        "(41) 95432-1098");
            Socio s5 = socio("Elisa Santos",        "2023-11-12", "2000-02-28", "Estudante",     "(51) 94321-0987");

            List<Socio> todosSocios = socios.saveAll(List.of(s1,s2,s3,s4,s5));
            s1=todosSocios.get(0); s2=todosSocios.get(1); s3=todosSocios.get(2);
            s4=todosSocios.get(3); s5=todosSocios.get(4);

            // ── Empréstimos ───────────────────────────────────────────────────

            // Empréstimo ativo (dentro do prazo)
            emprestar(l1, l2, s1, LocalDate.now().minusDays(5), LocalDate.now().plusDays(9), null, livros, emprestimos);

            // Empréstimo ativo atrasado
            emprestar(l3, l4, s2, LocalDate.now().minusDays(20), LocalDate.now().minusDays(6), null, livros, emprestimos);

            // Empréstimo devolvido
            emprestar(l5, l6, s3, LocalDate.now().minusDays(30), LocalDate.now().minusDays(16), LocalDate.now().minusDays(18), livros, emprestimos);

            // Empréstimo ativo (único livro)
            emprestar(l7, null, s4, LocalDate.now().minusDays(3), LocalDate.now().plusDays(11), null, livros, emprestimos);

            // Empréstimo devolvido
            emprestar(l8, l9, s5, LocalDate.now().minusDays(45), LocalDate.now().minusDays(31), LocalDate.now().minusDays(29), livros, emprestimos);
        };
    }

    private Livro livro(String nome, String autor, String data, String editora, String cod, double preco) {
        Livro l = new Livro();
        l.setNomeLivro(nome);
        l.setAutorLivro(autor);
        l.setDataLancamento(LocalDate.parse(data));
        l.setEditora(editora);
        l.setCodBarras(cod);
        l.setPrecoLivro(preco);
        l.setDisponivel(true);
        return l;
    }

    private Socio socio(String nome, String ingresso, String nascimento, String profissao, String tel) {
        Socio s = new Socio();
        s.setNome(nome);
        s.setDataIngresso(LocalDate.parse(ingresso));
        s.setDataNascimento(LocalDate.parse(nascimento));
        s.setProfissao(profissao);
        s.setTelefone(tel);
        return s;
    }

    private void emprestar(Livro l1, Livro l2, Socio socio,
                           LocalDate dataEmprestimo, LocalDate dataPrevista, LocalDate dataReal,
                           LivroRepository livroRepo, EmprestimoRepository emprestimoRepo) {
        List<Livro> livrosEmprestimo = l2 != null ? List.of(l1, l2) : List.of(l1);
        boolean devolvido = dataReal != null;

        for (Livro l : livrosEmprestimo) {
            l.setDisponivel(devolvido);
            l.setSocioEmprestado(devolvido ? null : socio);
            livroRepo.save(l);
        }

        Emprestimo e = new Emprestimo();
        e.setSocio(socio);
        e.setLivros(livrosEmprestimo);
        e.setDataEmprestimo(dataEmprestimo);
        e.setDataDevolucaoPrevista(dataPrevista);
        e.setDataDevolucaoReal(dataReal);
        emprestimoRepo.save(e);
    }
}
