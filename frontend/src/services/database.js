const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

// Garantir que o diretório do banco de dados existe
const dbPath = path.join(
  __dirname,
  "/home/matheus-berwaldt/projects/librarymanager/librarymanager.db"
);
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Criação da conexão com o banco de dados
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
  } else {
    console.log("Conectado ao banco de dados SQLite");
    criarTabelas();
  }
});

// Função para criar as tabelas necessárias
function criarTabelas() {
  db.serialize(() => {
    // Tabela de Membros
    db.run(`CREATE TABLE IF NOT EXISTS membros (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT,
            telefone TEXT
        )`);

    // Tabela de Livros
    db.run(`CREATE TABLE IF NOT EXISTS livros (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            autor TEXT,
            isbn TEXT,
            disponivel INTEGER DEFAULT 1
        )`);

    // Tabela de Empréstimos
    db.run(`CREATE TABLE IF NOT EXISTS emprestimos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            membro_id INTEGER,
            livro_id INTEGER,
            data_emprestimo TEXT,
            data_devolucao TEXT,
            FOREIGN KEY (membro_id) REFERENCES membros (id),
            FOREIGN KEY (livro_id) REFERENCES livros (id)
        )`);
  });
}

// Funções para Membros
function adicionarMembro(nome, email, telefone) {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO membros (nome, email, telefone) VALUES (?, ?, ?)",
      [nome, email, telefone],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, nome, email, telefone });
      }
    );
  });
}

function buscarMembros() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM membros", [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function atualizarMembro(id, nome, email, telefone) {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE membros SET nome = ?, email = ?, telefone = ? WHERE id = ?",
      [nome, email, telefone, id],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

function removerMembro(id) {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM membros WHERE id = ?", [id], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

// Funções para Livros
function adicionarLivro(titulo, autor, isbn) {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO livros (titulo, autor, isbn) VALUES (?, ?, ?)",
      [titulo, autor, isbn],
      function (err) {
        if (err) reject(err);
        else
          resolve({ id: this.lastID, titulo, autor, isbn, disponivel: true });
      }
    );
  });
}

function buscarLivros() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM livros", [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function atualizarLivro(id, titulo, autor, isbn, disponivel) {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE livros SET titulo = ?, autor = ?, isbn = ?, disponivel = ? WHERE id = ?",
      [titulo, autor, isbn, disponivel ? 1 : 0, id],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

function removerLivro(id) {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM livros WHERE id = ?", [id], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

// Funções para Empréstimos
function realizarEmprestimo(membroId, livroId) {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO emprestimos (membro_id, livro_id, data_emprestimo) VALUES (?, ?, ?)",
      [membroId, livroId, new Date().toISOString()],
      function (err) {
        if (err) reject(err);
        else {
          db.run(
            "UPDATE livros SET disponivel = 0 WHERE id = ?",
            [livroId],
            (err) => {
              if (err) reject(err);
              else
                resolve({
                  id: this.lastID,
                  membroId,
                  livroId,
                  dataEmprestimo: new Date(),
                });
            }
          );
        }
      }
    );
  });
}

function buscarEmprestimos() {
  return new Promise((resolve, reject) => {
    db.all(
      `
            SELECT e.*, m.nome as membro_nome, l.titulo as livro_titulo 
            FROM emprestimos e
            JOIN membros m ON e.membro_id = m.id
            JOIN livros l ON e.livro_id = l.id
        `,
      [],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
}

function devolverLivro(emprestimoId) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT livro_id FROM emprestimos WHERE id = ?",
      [emprestimoId],
      (err, row) => {
        if (err) reject(err);
        else if (!row) reject(new Error("Empréstimo não encontrado"));
        else {
          db.run(
            "UPDATE emprestimos SET data_devolucao = ? WHERE id = ?",
            [new Date().toISOString(), emprestimoId],
            (err) => {
              if (err) reject(err);
              else {
                db.run(
                  "UPDATE livros SET disponivel = 1 WHERE id = ?",
                  [row.livro_id],
                  (err) => {
                    if (err) reject(err);
                    else resolve();
                  }
                );
              }
            }
          );
        }
      }
    );
  });
}

// Função para fechar a conexão com o banco de dados
function close() {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

module.exports = {
  adicionarMembro,
  buscarMembros,
  atualizarMembro,
  removerMembro,
  adicionarLivro,
  buscarLivros,
  atualizarLivro,
  removerLivro,
  realizarEmprestimo,
  buscarEmprestimos,
  devolverLivro,
  close,
};
