const axios = require("axios");

const API_URL = "http://localhost:8080";

// Dados em memória
let livros = [];
let socios = [];
let emprestimos = [];
let livroEditando = null;
let socioEditando = null;
let emprestimoEditando = null;

// Função para mostrar diferentes abas
function showTab(tab) {
  // Atualiza as classes das abas
  document.querySelectorAll(".tab").forEach((t) => {
    t.classList.remove("active");
  });
  document.getElementById("tab-" + tab).classList.add("active");

  const content = document.getElementById("mainContent");

  switch (tab) {
    case "livros":
      content.innerHTML = `
                <h2>Gerenciar Livros</h2>
                <button class="btn" onclick="showForm('livro')">Adicionar Livro</button>
                <div id="livrosList"></div>
            `;
      renderLivros();
      break;

    case "socios":
      content.innerHTML = `
                <h2>Gerenciar Sócios</h2>
                <button class="btn" onclick="showForm('socio')">Adicionar Sócio</button>
                <div id="sociosList"></div>
            `;
      renderSocios();
      break;

    case "emprestimos":
      content.innerHTML = `
                <h2>Gerenciar Empréstimos</h2>
                <button class="btn" onclick="showForm('emprestimo')">Novo Empréstimo</button>
                <div id="emprestimosList"></div>
            `;
      renderEmprestimos();
      break;
  }
}

// LIVROS
function renderLivros() {
  const content = document.getElementById("livrosList");
  let html = `<table><thead><tr><th>Título</th><th>Autor</th><th>ISBN</th><th>Status</th><th class='actions'>Ações</th></tr></thead><tbody>`;
  for (const livro of livros) {
    html += `<tr>
            <td>${livro.titulo}</td>
            <td>${livro.autor}</td>
            <td>${livro.isbn}</td>
            <td>${livro.disponivel ? "Disponível" : "Emprestado"}</td>
            <td class='actions'>
                <button class='btn' onclick='editLivro(${
                  livro.id
                })'>Editar</button>
                <button class='btn delete' onclick='deleteLivro(${
                  livro.id
                })'>Excluir</button>
            </td>
        </tr>`;
  }
  html += "</tbody></table>";
  content.innerHTML = html;
}

function showLivroForm(id = null) {
  const content = document.getElementById("mainContent");
  let livro = { titulo: "", autor: "", isbn: "" };
  let editando = false;
  if (id !== null) {
    livro = livros.find((l) => l.id === id);
    editando = true;
    livroEditando = id;
  } else {
    livroEditando = null;
  }
  content.innerHTML = `
        <h2>${editando ? "Editar" : "Cadastrar"} Livro</h2>
        <form onsubmit="salvarLivro(event)">
            <div class="form-group"><label>Título</label><input name="titulo" value="${
              livro.titulo
            }" required></div>
            <div class="form-group"><label>Autor</label><input name="autor" value="${
              livro.autor
            }" required></div>
            <div class="form-group"><label>ISBN</label><input name="isbn" value="${
              livro.isbn
            }" required></div>
            <button class="btn" type="submit">Salvar</button>
            <button class="btn cancel" type="button" onclick="renderLivros()">Cancelar</button>
        </form>
    `;
}

function salvarLivro(e) {
  e.preventDefault();
  const form = e.target;
  const novo = {
    titulo: form.titulo.value,
    autor: form.autor.value,
    isbn: form.isbn.value,
  };
  if (livroEditando !== null) {
    const idx = livros.findIndex((l) => l.id === livroEditando);
    livros[idx] = { ...livros[idx], ...novo };
  } else {
    livros.push({ id: Date.now(), ...novo, disponivel: true });
  }
  livroEditando = null;
  renderLivros();
}

function editLivro(id) {
  showLivroForm(id);
}
function deleteLivro(id) {
  if (emprestimos.some((e) => e.livroId === id && !e.devolvido)) {
    alert("Não é possível excluir: livro emprestado!");
    return;
  }
  livros = livros.filter((l) => l.id !== id);
  renderLivros();
}

// SOCIOS
function renderSocios() {
  const content = document.getElementById("sociosList");
  let html = `<table><thead><tr><th>Nome</th><th>Email</th><th>Telefone</th><th class='actions'>Ações</th></tr></thead><tbody>`;
  for (const socio of socios) {
    html += `<tr>
            <td>${socio.nome}</td>
            <td>${socio.email}</td>
            <td>${socio.telefone}</td>
            <td class='actions'>
                <button class='btn' onclick='editSocio(${socio.id})'>Editar</button>
                <button class='btn delete' onclick='deleteSocio(${socio.id})'>Excluir</button>
            </td>
        </tr>`;
  }
  html += "</tbody></table>";
  content.innerHTML = html;
}

function showSocioForm(id = null) {
  const content = document.getElementById("mainContent");
  let socio = { nome: "", email: "", telefone: "" };
  let editando = false;
  if (id !== null) {
    socio = socios.find((s) => s.id === id);
    editando = true;
    socioEditando = id;
  } else {
    socioEditando = null;
  }
  content.innerHTML = `
        <h2>${editando ? "Editar" : "Cadastrar"} Sócio</h2>
        <form onsubmit="salvarSocio(event)">
            <div class="form-group"><label>Nome</label><input name="nome" value="${
              socio.nome
            }" required></div>
            <div class="form-group"><label>Email</label><input name="email" value="${
              socio.email
            }" required></div>
            <div class="form-group"><label>Telefone</label><input name="telefone" value="${
              socio.telefone
            }" required></div>
            <button class="btn" type="submit">Salvar</button>
            <button class="btn cancel" type="button" onclick="renderSocios()">Cancelar</button>
        </form>
    `;
}

function salvarSocio(e) {
  e.preventDefault();
  const form = e.target;
  const novo = {
    nome: form.nome.value,
    email: form.email.value,
    telefone: form.telefone.value,
  };
  if (socioEditando !== null) {
    const idx = socios.findIndex((s) => s.id === socioEditando);
    socios[idx] = { ...socios[idx], ...novo };
  } else {
    socios.push({ id: Date.now(), ...novo });
  }
  socioEditando = null;
  renderSocios();
}

function editSocio(id) {
  showSocioForm(id);
}
function deleteSocio(id) {
  if (emprestimos.some((e) => e.socioId === id && !e.devolvido)) {
    alert("Não é possível excluir: sócio com empréstimo ativo!");
    return;
  }
  socios = socios.filter((s) => s.id !== id);
  renderSocios();
}

// EMPRESTIMOS
function renderEmprestimos() {
  const content = document.getElementById("emprestimosList");
  let html = `<table><thead><tr><th>Livro</th><th>Sócio</th><th>Data Empréstimo</th><th>Data Devolução</th><th>Status</th><th class='actions'>Ações</th></tr></thead><tbody>`;
  for (const emp of emprestimos) {
    const livro = livros.find((l) => l.id === emp.livroId);
    const socio = socios.find((s) => s.id === emp.socioId);
    html += `<tr>
            <td>${livro ? livro.titulo : "-"}</td>
            <td>${socio ? socio.nome : "-"}</td>
            <td>${emp.dataEmprestimo}</td>
            <td>${emp.devolvido ? emp.dataDevolucao : "-"}</td>
            <td>${emp.devolvido ? "Devolvido" : "Em andamento"}</td>
            <td class='actions'>
                ${
                  emp.devolvido
                    ? ""
                    : `<button class='btn devolver' onclick='devolverEmprestimo(${emp.id})'>Devolver</button>`
                }
                <button class='btn delete' onclick='deleteEmprestimo(${
                  emp.id
                })'>Excluir</button>
            </td>
        </tr>`;
  }
  html += "</tbody></table>";
  content.innerHTML = html;
}

function showEmprestimoForm(id = null) {
  const content = document.getElementById("mainContent");
  let emp = { livroId: "", socioId: "" };
  let editando = false;
  if (id !== null) {
    emp = emprestimos.find((e) => e.id === id);
    editando = true;
    emprestimoEditando = id;
  } else {
    emprestimoEditando = null;
  }
  let livrosDisponiveis = livros.filter(
    (l) => l.disponivel || (editando && l.id === emp.livroId)
  );
  let sociosDisponiveis = socios;
  content.innerHTML = `
        <h2>${editando ? "Editar" : "Novo"} Empréstimo</h2>
        <form onsubmit="salvarEmprestimo(event)">
            <div class="form-group"><label>Livro</label>
                <select name="livroId" required>
                    <option value="">Selecione</option>
                    ${livrosDisponiveis
                      .map(
                        (l) =>
                          `<option value="${l.id}" ${
                            l.id === emp.livroId ? "selected" : ""
                          }>${l.titulo}</option>`
                      )
                      .join("")}
                </select>
            </div>
            <div class="form-group"><label>Sócio</label>
                <select name="socioId" required>
                    <option value="">Selecione</option>
                    ${sociosDisponiveis
                      .map(
                        (s) =>
                          `<option value="${s.id}" ${
                            s.id === emp.socioId ? "selected" : ""
                          }>${s.nome}</option>`
                      )
                      .join("")}
                </select>
            </div>
            <button class="btn" type="submit">Salvar</button>
            <button class="btn cancel" type="button" onclick="renderEmprestimos()">Cancelar</button>
        </form>
    `;
}

function salvarEmprestimo(e) {
  e.preventDefault();
  const form = e.target;
  const livroId = Number(form.livroId.value);
  const socioId = Number(form.socioId.value);
  if (!livroId || !socioId) return;
  if (emprestimoEditando !== null) {
    // Não implementado edição de empréstimo
  } else {
    const livro = livros.find((l) => l.id === livroId);
    if (!livro.disponivel) {
      alert("Livro não disponível!");
      return;
    }
    livro.disponivel = false;
    emprestimos.push({
      id: Date.now(),
      livroId,
      socioId,
      dataEmprestimo: new Date().toLocaleDateString(),
      devolvido: false,
      dataDevolucao: null,
    });
  }
  emprestimoEditando = null;
  renderEmprestimos();
}

function devolverEmprestimo(id) {
  const emp = emprestimos.find((e) => e.id === id);
  if (!emp || emp.devolvido) return;
  emp.devolvido = true;
  emp.dataDevolucao = new Date().toLocaleDateString();
  const livro = livros.find((l) => l.id === emp.livroId);
  if (livro) livro.disponivel = true;
  renderEmprestimos();
}

function deleteEmprestimo(id) {
  const emp = emprestimos.find((e) => e.id === id);
  if (emp && !emp.devolvido) {
    const livro = livros.find((l) => l.id === emp.livroId);
    if (livro) livro.disponivel = true;
  }
  emprestimos = emprestimos.filter((e) => e.id !== id);
  renderEmprestimos();
}

// Função para mostrar formulários
function showForm(type) {
  const content = document.getElementById("mainContent");
  let formHTML = "";

  switch (type) {
    case "socio":
      formHTML = `
                <div class="form-container">
                    <h3>Adicionar Sócio</h3>
                    <form onsubmit="saveSocio(event)">
                        <div class="form-group">
                            <label>Nome:</label>
                            <input type="text" name="nome" required>
                        </div>
                        <div class="form-group">
                            <label>Email:</label>
                            <input type="email" name="email" required>
                        </div>
                        <button type="submit" class="btn">Salvar</button>
                        <button type="button" class="btn" onclick="showTab('socios')">Cancelar</button>
                    </form>
                </div>
            `;
      break;

    case "livro":
      formHTML = `
                <div class="form-container">
                    <h3>Adicionar Livro</h3>
                    <form onsubmit="saveLivro(event)">
                        <div class="form-group">
                            <label>Título:</label>
                            <input type="text" name="titulo" required>
                        </div>
                        <div class="form-group">
                            <label>Autor:</label>
                            <input type="text" name="autor" required>
                        </div>
                        <button type="submit" class="btn">Salvar</button>
                        <button type="button" class="btn" onclick="showTab('livros')">Cancelar</button>
                    </form>
                </div>
            `;
      break;

    case "emprestimo":
      formHTML = `
                <div class="form-container">
                    <h3>Novo Empréstimo</h3>
                    <form onsubmit="saveEmprestimo(event)">
                        <div class="form-group">
                            <label>Livro:</label>
                            <select name="livroId" required></select>
                        </div>
                        <div class="form-group">
                            <label>Sócio:</label>
                            <select name="socioId" required></select>
                        </div>
                        <button type="submit" class="btn">Salvar</button>
                        <button type="button" class="btn" onclick="showTab('emprestimos')">Cancelar</button>
                    </form>
                </div>
            `;
      break;
  }

  content.innerHTML = formHTML;

  if (type === "emprestimo") {
    loadSelectOptions();
  }
}

// Funções para salvar dados
async function saveSocio(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  try {
    await axios.post(`${API_URL}/socios`, {
      nome: formData.get("nome"),
      email: formData.get("email"),
    });
    showTab("socios");
  } catch (error) {
    console.error("Erro ao salvar sócio:", error);
    alert("Erro ao salvar sócio. Verifique se o servidor está rodando.");
  }
}

async function saveLivro(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  try {
    await axios.post(`${API_URL}/livros`, {
      titulo: formData.get("titulo"),
      autor: formData.get("autor"),
    });
    showTab("livros");
  } catch (error) {
    console.error("Erro ao salvar livro:", error);
    alert("Erro ao salvar livro. Verifique se o servidor está rodando.");
  }
}

async function saveEmprestimo(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  try {
    await axios.post(`${API_URL}/emprestimos`, {
      livroId: formData.get("livroId"),
      socioId: formData.get("socioId"),
    });
    showTab("emprestimos");
  } catch (error) {
    console.error("Erro ao salvar empréstimo:", error);
    alert("Erro ao salvar empréstimo. Verifique se o servidor está rodando.");
  }
}

// Função para carregar opções dos selects
async function loadSelectOptions() {
  try {
    const [livrosResponse, sociosResponse] = await Promise.all([
      axios.get(`${API_URL}/livros`),
      axios.get(`${API_URL}/socios`),
    ]);

    const livroSelect = document.querySelector('select[name="livroId"]');
    const socioSelect = document.querySelector('select[name="socioId"]');

    livroSelect.innerHTML = `
            <option value="">Selecione um livro</option>
            ${livrosResponse.data
              .filter((livro) => livro.disponivel)
              .map(
                (livro) =>
                  `<option value="${livro.id}">${livro.titulo}</option>`
              )
              .join("")}
        `;

    socioSelect.innerHTML = `
            <option value="">Selecione um sócio</option>
            ${sociosResponse.data
              .map(
                (socio) => `<option value="${socio.id}">${socio.nome}</option>`
              )
              .join("")}
        `;
  } catch (error) {
    console.error("Erro ao carregar opções:", error);
    alert("Erro ao carregar opções. Verifique se o servidor está rodando.");
  }
}

// Inicializa a primeira aba
document.addEventListener("DOMContentLoaded", () => {
  showTab("livros");
});

// Expondo funções para o escopo global
globalThis.showTab = showTab;
globalThis.showLivroForm = showLivroForm;
globalThis.salvarLivro = salvarLivro;
globalThis.editLivro = editLivro;
globalThis.deleteLivro = deleteLivro;
globalThis.showSocioForm = showSocioForm;
globalThis.salvarSocio = salvarSocio;
globalThis.editSocio = editSocio;
globalThis.deleteSocio = deleteSocio;
globalThis.showEmprestimoForm = showEmprestimoForm;
globalThis.salvarEmprestimo = salvarEmprestimo;
globalThis.devolverEmprestimo = devolverEmprestimo;
globalThis.deleteEmprestimo = deleteEmprestimo;
