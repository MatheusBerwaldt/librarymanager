// Importação do módulo ipcRenderer do Electron
const { ipcRenderer } = require("electron");

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
    this.membros = JSON.parse(localStorage.getItem("membros")) || [];
    this.livros = JSON.parse(localStorage.getItem("livros")) || [];
    this.emprestimos = JSON.parse(localStorage.getItem("emprestimos")) || [];
    this.proximoIdMembro =
      parseInt(localStorage.getItem("proximoIdMembro")) || 1;
    this.proximoIdLivro = parseInt(localStorage.getItem("proximoIdLivro")) || 1;
    this.proximoIdEmprestimo =
      parseInt(localStorage.getItem("proximoIdEmprestimo")) || 1;
  }

  // Métodos para Membros
  adicionarMembro(nome, email, telefone) {
    const membro = new Membro(this.proximoIdMembro++, nome, email, telefone);
    this.membros.push(membro);
    this.salvarDados();
    return membro;
  }

  removerMembro(id) {
    this.membros = this.membros.filter((m) => m.id !== id);
    this.salvarDados();
  }

  // Métodos para Livros
  adicionarLivro(titulo, autor, isbn) {
    const livro = new Livro(this.proximoIdLivro++, titulo, autor, isbn);
    this.livros.push(livro);
    this.salvarDados();
    return livro;
  }

  removerLivro(id) {
    this.livros = this.livros.filter((l) => l.id !== id);
    this.salvarDados();
  }

  atualizarDisponibilidadeLivro(id, disponivel) {
    const livro = this.livros.find((l) => l.id === id);
    if (livro) {
      livro.disponivel = disponivel;
      this.salvarDados();
    }
  }

  // Métodos para Empréstimos
  realizarEmprestimo(membroId, livroId) {
    const livro = this.livros.find((l) => l.id === livroId);
    if (!livro || !livro.disponivel) {
      throw new Error("Livro não está disponível para empréstimo");
    }

    const emprestimo = new Emprestimo(
      this.proximoIdEmprestimo++,
      membroId,
      livroId,
      new Date()
    );

    livro.disponivel = false;
    this.emprestimos.push(emprestimo);
    this.salvarDados();
    return emprestimo;
  }

  devolverLivro(emprestimoId) {
    const emprestimo = this.emprestimos.find((e) => e.id === emprestimoId);
    if (emprestimo && !emprestimo.dataDevolucao) {
      emprestimo.dataDevolucao = new Date();
      const livro = this.livros.find((l) => l.id === emprestimo.livroId);
      if (livro) {
        livro.disponivel = true;
      }
      this.salvarDados();
      return true;
    }
    return false;
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

  const socio = {
    nome: document.getElementById("nomeSocio").value,
    email: document.getElementById("emailSocio").value,
    telefone: document.getElementById("telefoneSocio").value,
  };

  try {
    await fetchAPI("/socios", {
      method: "POST",
      body: JSON.stringify(socio),
    });

    alert("Sócio cadastrado com sucesso!");
    document.getElementById("formSocio").reset();
    await carregarSocios();
  } catch (error) {
    alert("Erro ao cadastrar sócio");
  }
}

async function atualizarSocio(event) {
  event.preventDefault();

  const id = document.getElementById("idSocio").value;
  const socio = {
    nome: document.getElementById("nomeSocio").value,
    email: document.getElementById("emailSocio").value,
    telefone: document.getElementById("telefoneSocio").value,
  };

  try {
    await fetchAPI(`/socios/${id}`, {
      method: "PUT",
      body: JSON.stringify(socio),
    });

    alert("Sócio atualizado com sucesso!");
    document.getElementById("formSocio").reset();
    await carregarSocios();
  } catch (error) {
    alert("Erro ao atualizar sócio");
  }
}

async function excluirSocio(id) {
  if (!confirm("Tem certeza que deseja excluir este sócio?")) return;

  try {
    await fetchAPI(`/socios/${id}`, {
      method: "DELETE",
    });

    alert("Sócio excluído com sucesso!");
    await carregarSocios();
  } catch (error) {
    alert("Erro ao excluir sócio");
  }
}

function editarSocio(socio) {
  document.getElementById("idSocio").value = socio.idSocio;
  document.getElementById("nomeSocio").value = socio.nome;
  document.getElementById("emailSocio").value = socio.email;
  document.getElementById("telefoneSocio").value = socio.telefone;
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
                <button class="btn-danger" onclick="excluirSocio(${
                  socio.idSocio
                })">
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

  const livro = {
    titulo: document.getElementById("tituloLivro").value,
    autor: document.getElementById("autorLivro").value,
    isbn: document.getElementById("isbnLivro").value,
    disponivel: true,
  };

  try {
    await fetchAPI("/livros", {
      method: "POST",
      body: JSON.stringify(livro),
    });

    alert("Livro cadastrado com sucesso!");
    document.getElementById("formLivro").reset();
    await carregarLivros();
  } catch (error) {
    alert("Erro ao cadastrar livro");
  }
}

async function atualizarLivro(event) {
  event.preventDefault();

  const id = document.getElementById("idLivro").value;
  const livro = {
    titulo: document.getElementById("tituloLivro").value,
    autor: document.getElementById("autorLivro").value,
    isbn: document.getElementById("isbnLivro").value,
    disponivel: document.getElementById("disponivelLivro").checked,
  };

  try {
    await fetchAPI(`/livros/${id}`, {
      method: "PUT",
      body: JSON.stringify(livro),
    });

    alert("Livro atualizado com sucesso!");
    document.getElementById("formLivro").reset();
    await carregarLivros();
  } catch (error) {
    alert("Erro ao atualizar livro");
  }
}

async function excluirLivro(id) {
  if (!confirm("Tem certeza que deseja excluir este livro?")) return;

  try {
    await fetchAPI(`/livros/${id}`, {
      method: "DELETE",
    });

    alert("Livro excluído com sucesso!");
    await carregarLivros();
  } catch (error) {
    alert("Erro ao excluir livro");
  }
}

function editarLivro(livro) {
  document.getElementById("idLivro").value = livro.idLivro;
  document.getElementById("tituloLivro").value = livro.titulo;
  document.getElementById("autorLivro").value = livro.autor;
  document.getElementById("isbnLivro").value = livro.isbn;
  document.getElementById("disponivelLivro").checked = livro.disponivel;
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
                <button class="btn-danger" onclick="excluirLivro(${
                  livro.idLivro
                })">
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

  const emprestimo = {
    livro: {
      idLivro: document.getElementById("livroEmprestimo").value,
    },
    socio: {
      idSocio: document.getElementById("socioEmprestimo").value,
    },
    dataEmprestimo: new Date().toISOString().split("T")[0],
    status: "EMPRESTADO",
  };

  try {
    await fetchAPI("/emprestimos", {
      method: "POST",
      body: JSON.stringify(emprestimo),
    });

    alert("Empréstimo registrado com sucesso!");
    document.getElementById("formEmprestimo").reset();
    await carregarEmprestimos();
    await carregarLivros();
  } catch (error) {
    alert("Erro ao registrar empréstimo");
  }
}

async function devolverLivro(id) {
  if (!confirm("Confirmar devolução do livro?")) return;

  try {
    await fetchAPI(`/emprestimos/${id}/devolver`, {
      method: "PUT",
    });

    alert("Livro devolvido com sucesso!");
    await carregarEmprestimos();
    await carregarLivros();
  } catch (error) {
    alert("Erro ao devolver livro");
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
