// Importação do módulo ipcRenderer do Electron e do módulo de banco de dados
const { ipcRenderer } = require("electron");
const db = require("./src/database");

// Configuração da API
const API_URL = "http://localhost:8080/api";

// Classes de modelo
class Membro {
  constructor(id, nome, email, telefone) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.telefone = telefone;
  }
}

class Livro {
  constructor(id, titulo, autor, isbn, disponivel = true) {
    this.id = id;
    this.titulo = titulo;
    this.autor = autor;
    this.isbn = isbn;
    this.disponivel = disponivel;
  }
}

class Emprestimo {
  constructor(id, membroId, livroId, dataEmprestimo, dataDevolucao = null) {
    this.id = id;
    this.membroId = membroId;
    this.livroId = livroId;
    this.dataEmprestimo = dataEmprestimo;
    this.dataDevolucao = dataDevolucao;
  }
}

// Gerenciador de Biblioteca
class GerenciadorBiblioteca {
  constructor() {
    this.carregarDados();
  }

  async carregarDados() {
    try {
      this.membros = await db.buscarMembros();
      this.livros = await db.buscarLivros();
      this.emprestimos = await db.buscarEmprestimos();
      this.atualizarDashboard();
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  }

  // Métodos para Membros
  async adicionarMembro(nome, email, telefone) {
    try {
      const membro = await db.adicionarMembro(nome, email, telefone);
      await this.carregarDados();
      return membro;
    } catch (error) {
      console.error("Erro ao adicionar membro:", error);
      throw error;
    }
  }

  async removerMembro(id) {
    try {
      await db.removerMembro(id);
      await this.carregarDados();
    } catch (error) {
      console.error("Erro ao remover membro:", error);
      throw error;
    }
  }

  // Métodos para Livros
  async adicionarLivro(titulo, autor, isbn) {
    try {
      const livro = await db.adicionarLivro(titulo, autor, isbn);
      await this.carregarDados();
      return livro;
    } catch (error) {
      console.error("Erro ao adicionar livro:", error);
      throw error;
    }
  }

  async removerLivro(id) {
    try {
      await db.removerLivro(id);
      await this.carregarDados();
    } catch (error) {
      console.error("Erro ao remover livro:", error);
      throw error;
    }
  }

  async atualizarDisponibilidadeLivro(id, disponivel) {
    try {
      const livro = this.livros.find((l) => l.id === id);
      if (livro) {
        await db.atualizarLivro(
          livro.titulo,
          livro.autor,
          livro.isbn,
          disponivel,
          id
        );
        await this.carregarDados();
      }
    } catch (error) {
      console.error("Erro ao atualizar disponibilidade do livro:", error);
      throw error;
    }
  }

  // Métodos para Empréstimos
  async realizarEmprestimo(membroId, livroId) {
    try {
      const emprestimo = await db.realizarEmprestimo(membroId, livroId);
      await this.carregarDados();
      return emprestimo;
    } catch (error) {
      console.error("Erro ao realizar empréstimo:", error);
      throw error;
    }
  }

  async devolverLivro(emprestimoId) {
    try {
      await db.devolverLivro(emprestimoId);
      await this.carregarDados();
    } catch (error) {
      console.error("Erro ao devolver livro:", error);
      throw error;
    }
  }

  // Métodos auxiliares
  salvarDados() {
    localStorage.setItem("membros", JSON.stringify(this.membros));
    localStorage.setItem("livros", JSON.stringify(this.livros));
    localStorage.setItem("emprestimos", JSON.stringify(this.emprestimos));
    localStorage.setItem("proximoIdMembro", this.proximoIdMembro);
    localStorage.setItem("proximoIdLivro", this.proximoIdLivro);
    localStorage.setItem("proximoIdEmprestimo", this.proximoIdEmprestimo);
    this.atualizarDashboard();
  }

  // Métodos para atualização da interface
  atualizarDashboard() {
    // Atualizar contadores
    document.getElementById("total-membros").textContent = this.membros.length;
    document.getElementById("total-livros").textContent = this.livros.length;
    document.getElementById("emprestimos-ativos").textContent =
      this.emprestimos.filter((e) => !e.dataDevolucao).length;
    document.getElementById("livros-disponiveis").textContent =
      this.livros.filter((l) => l.disponivel).length;

    // Atualizar tabelas
    this.atualizarTabelaMembros();
    this.atualizarTabelaLivros();
    this.atualizarTabelaEmprestimos();
  }

  atualizarTabelaMembros() {
    const tbody = document.querySelector("#tabela-membros tbody");
    tbody.innerHTML = "";

    this.membros.forEach((membro) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${membro.id}</td>
        <td>${membro.nome}</td>
        <td>${membro.email}</td>
        <td>${membro.telefone}</td>
        <td>
          <button class="btn-secondary" onclick="biblioteca.removerMembro(${membro.id})">
            <i class="fas fa-trash"></i> Remover
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  atualizarTabelaLivros() {
    const tbody = document.querySelector("#tabela-livros tbody");
    tbody.innerHTML = "";

    this.livros.forEach((livro) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${livro.id}</td>
        <td>${livro.titulo}</td>
        <td>${livro.autor}</td>
        <td>${livro.isbn}</td>
        <td>
          <span class="status ${
            livro.disponivel ? "status-disponivel" : "status-emprestado"
          }">
            ${livro.disponivel ? "Disponível" : "Emprestado"}
          </span>
        </td>
        <td>
          <button class="btn-secondary" onclick="biblioteca.removerLivro(${
            livro.id
          })">
            <i class="fas fa-trash"></i> Remover
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  atualizarTabelaEmprestimos() {
    const tbody = document.querySelector("#tabela-emprestimos tbody");
    tbody.innerHTML = "";

    this.emprestimos.forEach((emprestimo) => {
      const membro = this.membros.find((m) => m.id === emprestimo.membroId);
      const livro = this.livros.find((l) => l.id === emprestimo.livroId);

      if (membro && livro) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${emprestimo.id}</td>
          <td>${membro.nome}</td>
          <td>${livro.titulo}</td>
          <td>${new Date(emprestimo.dataEmprestimo).toLocaleDateString()}</td>
          <td>${
            emprestimo.dataDevolucao
              ? new Date(emprestimo.dataDevolucao).toLocaleDateString()
              : '<span class="status status-emprestado">Em andamento</span>'
          }</td>
          <td>
            ${
              !emprestimo.dataDevolucao
                ? `
              <button class="btn-primary" onclick="biblioteca.devolverLivro(${emprestimo.id})">
                <i class="fas fa-undo"></i> Devolver
              </button>
            `
                : ""
            }
          </td>
        `;
        tbody.appendChild(tr);
      }
    });
  }
}

// Inicialização
const biblioteca = new GerenciadorBiblioteca();

// Funções de navegação
function mostrarTela(telaId) {
  document
    .querySelectorAll(".tela")
    .forEach((tela) => tela.classList.remove("active"));
  document.getElementById(telaId).classList.add("active");

  document
    .querySelectorAll("nav button")
    .forEach((btn) => btn.classList.remove("active"));
  document
    .querySelector(`nav button[data-tela="${telaId}"]`)
    .classList.add("active");
}

// Funções de API
async function fetchAPI(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro na API:", error);
    throw error;
  }
}

// Funções de Sócios
async function carregarSocios() {
  try {
    socios = await fetchAPI("/socios");
    atualizarTabelaSocios();
  } catch (error) {
    alert("Erro ao carregar sócios");
  }
}

async function cadastrarSocio(event) {
  event.preventDefault();
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const telefone = document.getElementById("telefone").value;

  try {
    await db.adicionarMembro(nome, email, telefone);
    document.getElementById("formSocio").reset();
    mostrarTela("dashboard");
    alert("Sócio cadastrado com sucesso!");
    await biblioteca.carregarDados();
  } catch (error) {
    console.error("Erro ao cadastrar sócio:", error);
    alert("Erro ao cadastrar sócio: " + error.message);
  }
}

async function atualizarSocio(event) {
  event.preventDefault();
  const id = document.getElementById("socioId").value;
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const telefone = document.getElementById("telefone").value;

  try {
    await db.atualizarMembro(id, nome, email, telefone);
    document.getElementById("formSocio").reset();
    mostrarTela("dashboard");
    alert("Sócio atualizado com sucesso!");
    await biblioteca.carregarDados();
  } catch (error) {
    console.error("Erro ao atualizar sócio:", error);
    alert("Erro ao atualizar sócio: " + error.message);
  }
}

async function excluirSocio(id) {
  if (confirm("Tem certeza que deseja excluir este sócio?")) {
    try {
      await db.removerMembro(id);
      alert("Sócio excluído com sucesso!");
      await biblioteca.carregarDados();
    } catch (error) {
      console.error("Erro ao excluir sócio:", error);
      alert("Erro ao excluir sócio: " + error.message);
    }
  }
}

function editarSocio(socio) {
  document.getElementById("socioId").value = socio.id;
  document.getElementById("nome").value = socio.nome;
  document.getElementById("email").value = socio.email;
  document.getElementById("telefone").value = socio.telefone;
}

function atualizarTabelaSocios() {
  const tbody = document.querySelector("#tabelaSocios tbody");
  tbody.innerHTML = "";

  socios.forEach((socio) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>${socio.nome}</td>
            <td>${socio.email}</td>
            <td>${socio.telefone}</td>
            <td>
                <button class="btn-warning" onclick="editarSocio(${JSON.stringify(
                  socio
                )})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-danger" onclick="excluirSocio(${socio.id})">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </td>
        `;
    tbody.appendChild(tr);
  });
}

// Funções de Livros
async function carregarLivros() {
  try {
    livros = await fetchAPI("/livros");
    atualizarTabelaLivros();
  } catch (error) {
    alert("Erro ao carregar livros");
  }
}

async function cadastrarLivro(event) {
  event.preventDefault();
  const titulo = document.getElementById("titulo").value;
  const autor = document.getElementById("autor").value;
  const isbn = document.getElementById("isbn").value;

  try {
    await db.adicionarLivro(titulo, autor, isbn);
    document.getElementById("formLivro").reset();
    mostrarTela("dashboard");
    alert("Livro cadastrado com sucesso!");
    await biblioteca.carregarDados();
  } catch (error) {
    console.error("Erro ao cadastrar livro:", error);
    alert("Erro ao cadastrar livro: " + error.message);
  }
}

async function atualizarLivro(event) {
  event.preventDefault();
  const id = document.getElementById("livroId").value;
  const titulo = document.getElementById("titulo").value;
  const autor = document.getElementById("autor").value;
  const isbn = document.getElementById("isbn").value;
  const disponivel = document.getElementById("disponivel").checked;

  try {
    await db.atualizarLivro(id, titulo, autor, isbn, disponivel);
    document.getElementById("formLivro").reset();
    mostrarTela("dashboard");
    alert("Livro atualizado com sucesso!");
    await biblioteca.carregarDados();
  } catch (error) {
    console.error("Erro ao atualizar livro:", error);
    alert("Erro ao atualizar livro: " + error.message);
  }
}

async function excluirLivro(id) {
  if (confirm("Tem certeza que deseja excluir este livro?")) {
    try {
      await db.removerLivro(id);
      alert("Livro excluído com sucesso!");
      await biblioteca.carregarDados();
    } catch (error) {
      console.error("Erro ao excluir livro:", error);
      alert("Erro ao excluir livro: " + error.message);
    }
  }
}

function editarLivro(livro) {
  document.getElementById("livroId").value = livro.id;
  document.getElementById("titulo").value = livro.titulo;
  document.getElementById("autor").value = livro.autor;
  document.getElementById("isbn").value = livro.isbn;
  document.getElementById("disponivel").checked = livro.disponivel;
}

function atualizarTabelaLivros() {
  const tbody = document.querySelector("#tabelaLivros tbody");
  tbody.innerHTML = "";

  livros.forEach((livro) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>${livro.titulo}</td>
            <td>${livro.autor}</td>
            <td>${livro.isbn}</td>
            <td>
                <span class="badge ${
                  livro.disponivel ? "badge-success" : "badge-danger"
                }">
                    ${livro.disponivel ? "Disponível" : "Emprestado"}
                </span>
            </td>
            <td>
                <button class="btn-warning" onclick="editarLivro(${JSON.stringify(
                  livro
                )})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-danger" onclick="excluirLivro(${livro.id})">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </td>
        `;
    tbody.appendChild(tr);
  });
}

// Funções de Empréstimos
async function carregarEmprestimos() {
  try {
    emprestimos = await fetchAPI("/emprestimos");
    atualizarTabelaEmprestimos();
  } catch (error) {
    alert("Erro ao carregar empréstimos");
  }
}

async function cadastrarEmprestimo(event) {
  event.preventDefault();
  const membroId = document.getElementById("membroId").value;
  const livroId = document.getElementById("livroId").value;

  try {
    await db.realizarEmprestimo(membroId, livroId);
    document.getElementById("formEmprestimo").reset();
    mostrarTela("dashboard");
    alert("Empréstimo realizado com sucesso!");
    await biblioteca.carregarDados();
  } catch (error) {
    console.error("Erro ao realizar empréstimo:", error);
    alert("Erro ao realizar empréstimo: " + error.message);
  }
}

async function devolverLivro(id) {
  if (confirm("Confirmar devolução do livro?")) {
    try {
      await db.devolverLivro(id);
      alert("Livro devolvido com sucesso!");
      await biblioteca.carregarDados();
    } catch (error) {
      console.error("Erro ao devolver livro:", error);
      alert("Erro ao devolver livro: " + error.message);
    }
  }
}

function atualizarTabelaEmprestimos() {
  const tbody = document.querySelector("#tabelaEmprestimos tbody");
  tbody.innerHTML = "";

  emprestimos.forEach((emprestimo) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>${emprestimo.livro.titulo}</td>
            <td>${emprestimo.socio.nome}</td>
            <td>${new Date(emprestimo.dataEmprestimo).toLocaleDateString()}</td>
            <td>${
              emprestimo.dataDevolucao
                ? new Date(emprestimo.dataDevolucao).toLocaleDateString()
                : "-"
            }</td>
            <td>
                <span class="badge ${
                  emprestimo.status === "DEVOLVIDO"
                    ? "badge-success"
                    : "badge-warning"
                }">
                    ${emprestimo.status}
                </span>
            </td>
            <td>
                ${
                  emprestimo.status === "EMPRESTADO"
                    ? `
                    <button class="btn-primary" onclick="devolverLivro(${emprestimo.idEmprestimo})">
                        <i class="fas fa-undo"></i> Devolver
                    </button>
                `
                    : ""
                }
            </td>
        `;
    tbody.appendChild(tr);
  });
}

// Funções do Dashboard
async function atualizarDashboard() {
  try {
    const [totalSocios, totalLivros, emprestimosAtivos, livrosDisponiveis] =
      await Promise.all([
        fetchAPI("/socios/count"),
        fetchAPI("/livros/count"),
        fetchAPI("/emprestimos/ativos/count"),
        fetchAPI("/livros/disponiveis/count"),
      ]);

    document.getElementById("totalSocios").textContent = totalSocios;
    document.getElementById("totalLivros").textContent = totalLivros;
    document.getElementById("emprestimosAtivos").textContent =
      emprestimosAtivos;
    document.getElementById("livrosDisponiveis").textContent =
      livrosDisponiveis;
  } catch (error) {
    console.error("Erro ao atualizar dashboard:", error);
  }
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  // Carregar dados iniciais
  carregarSocios();
  carregarLivros();
  carregarEmprestimos();
  atualizarDashboard();

  // Configurar event listeners
  document
    .getElementById("formSocio")
    .addEventListener("submit", cadastrarSocio);
  document
    .getElementById("formLivro")
    .addEventListener("submit", cadastrarLivro);
  document
    .getElementById("formEmprestimo")
    .addEventListener("submit", cadastrarEmprestimo);

  // Configurar navegação
  document.querySelectorAll("nav button").forEach((button) => {
    button.addEventListener("click", () => {
      mostrarTela(button.dataset.tela);
    });
  });

  // Mostrar dashboard inicial
  mostrarTela("dashboard");
});
