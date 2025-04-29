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
  let html = `<table><thead><tr><th>Nome</th><th>Autor</th><th>Data Lançamento</th><th>Editora</th><th>Cód. Barras</th><th>Preço</th><th>Disponível</th><th>Sócio Emprestado</th><th class='actions'>Ações</th></tr></thead><tbody>`;
  for (const livro of livros) {
    html += `<tr>
            <td>${livro.nomeLivro}</td>
            <td>${livro.autorLivro}</td>
            <td>${livro.dataLancamento || ""}</td>
            <td>${livro.editora || ""}</td>
            <td>${livro.codBarras || ""}</td>
            <td>${
              livro.precoLivro != null ? livro.precoLivro.toFixed(2) : ""
            }</td>
            <td>${livro.disponivel ? "Sim" : "Não"}</td>
            <td>${livro.socioEmprestado ? livro.socioEmprestado.nome : ""}</td>
            <td class='actions'>
                <button class='btn' onclick='editLivro(${
                  livro.idLivro
                })'>Editar</button>
                <button class='btn delete' onclick='deleteLivro(${
                  livro.idLivro
                })'>Excluir</button>
            </td>
        </tr>`;
  }
  html += "</tbody></table>";
  content.innerHTML = html;
}

function showLivroForm(id = null) {
  const content = document.getElementById("mainContent");
  let livro = {
    nomeLivro: "",
    autorLivro: "",
    dataLancamento: "",
    editora: "",
    codBarras: "",
    precoLivro: "",
    disponivel: true,
  };
  let editando = false;
  if (id !== null) {
    livro = livros.find((l) => l.idLivro === id);
    editando = true;
    livroEditando = id;
  } else {
    livroEditando = null;
  }
  content.innerHTML = `
        <h2>${editando ? "Editar" : "Cadastrar"} Livro</h2>
        <form onsubmit="saveLivro(event)">
            <div class="form-group"><label>Nome do Livro</label><input name="nomeLivro" value="${
              livro.nomeLivro || ""
            }" required></div>
            <div class="form-group"><label>Autor</label><input name="autorLivro" value="${
              livro.autorLivro || ""
            }" required></div>
            <div class="form-group"><label>Data de Lançamento</label><input type="date" name="dataLancamento" value="${
              livro.dataLancamento ? livro.dataLancamento : ""
            }" required></div>
            <div class="form-group"><label>Editora</label><input name="editora" value="${
              livro.editora || ""
            }"></div>
            <div class="form-group"><label>Código de Barras</label><input name="codBarras" value="${
              livro.codBarras || ""
            }"></div>
            <div class="form-group"><label>Preço</label><input type="number" name="precoLivro" step="0.01" value="${
              livro.precoLivro || ""
            }" required></div>
            <div class="form-group"><label>Disponível</label><input type="checkbox" name="disponivel" ${
              livro.disponivel ? "checked" : ""
            }></div>
            <button class="btn" type="submit">Salvar</button>
            <button class="btn cancel" type="button" onclick="renderLivros()">Cancelar</button>
        </form>
    `;
}

async function saveLivro(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const livroData = {
    nomeLivro: formData.get("nomeLivro"),
    autorLivro: formData.get("autorLivro"),
    dataLancamento: formData.get("dataLancamento"),
    editora: formData.get("editora"),
    codBarras: formData.get("codBarras"),
    precoLivro: parseFloat(formData.get("precoLivro")),
    disponivel: formData.get("disponivel") === "on",
  };
  try {
    if (livroEditando) {
      await axios.put(`${API_URL}/livros/${livroEditando}`, livroData);
    } else {
      await axios.post(`${API_URL}/livros`, livroData);
    }
    showTab("livros");
    await fetchAllData();
  } catch (error) {
    alert("Erro ao salvar livro. Verifique se o servidor está rodando.");
  }
}

function editLivro(id) {
  showLivroForm(id);
}

async function deleteLivro(id) {
  if (!confirm("Tem certeza que deseja excluir este livro?")) return;
  try {
    await axios.delete(`${API_URL}/livros/${id}`);
    await fetchAllData();
  } catch (error) {
    alert("Erro ao excluir livro. Verifique se o servidor está rodando.");
  }
}

// SOCIOS
function renderSocios() {
  const content = document.getElementById("sociosList");
  let html = `<table><thead><tr><th>Nome</th><th>Data Ingresso</th><th>Data Nascimento</th><th>Profissão</th><th>Telefone</th><th class='actions'>Ações</th></tr></thead><tbody>`;
  for (const socio of socios) {
    html += `<tr>
            <td>${socio.nome}</td>
            <td>${socio.dataIngresso || ""}</td>
            <td>${socio.dataNascimento || ""}</td>
            <td>${socio.profissao || ""}</td>
            <td>${socio.telefone || ""}</td>
            <td class='actions'>
                <button class='btn' onclick='editSocio(${
                  socio.idSocio
                })'>Editar</button>
                <button class='btn delete' onclick='deleteSocio(${
                  socio.idSocio
                })'>Excluir</button>
            </td>
        </tr>`;
  }
  html += "</tbody></table>";
  content.innerHTML = html;
}

function showSocioForm(id = null) {
  const content = document.getElementById("mainContent");
  let socio = {
    nome: "",
    dataIngresso: "",
    dataNascimento: "",
    profissao: "",
    telefone: "",
  };
  let editando = false;
  if (id !== null) {
    socio = socios.find((s) => s.idSocio === id);
    editando = true;
    socioEditando = id;
  } else {
    socioEditando = null;
  }
  content.innerHTML = `
        <h2>${editando ? "Editar" : "Cadastrar"} Sócio</h2>
        <form onsubmit="saveSocio(event)">
            <div class="form-group"><label>Nome</label><input name="nome" value="${
              socio.nome || ""
            }" required></div>
            <div class="form-group"><label>Data de Ingresso</label><input type="date" name="dataIngresso" value="${
              socio.dataIngresso || ""
            }"></div>
            <div class="form-group"><label>Data de Nascimento</label><input type="date" name="dataNascimento" value="${
              socio.dataNascimento || ""
            }"></div>
            <div class="form-group"><label>Profissão</label><input name="profissao" value="${
              socio.profissao || ""
            }"></div>
            <div class="form-group"><label>Telefone</label><input name="telefone" value="${
              socio.telefone || ""
            }"></div>
            <button class="btn" type="submit">Salvar</button>
            <button class="btn cancel" type="button" onclick="renderSocios()">Cancelar</button>
        </form>
    `;
}

async function saveSocio(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const socioData = {
    nome: formData.get("nome"),
    dataIngresso: formData.get("dataIngresso"),
    dataNascimento: formData.get("dataNascimento"),
    profissao: formData.get("profissao"),
    telefone: formData.get("telefone"),
  };
  try {
    if (socioEditando) {
      await axios.put(`${API_URL}/socios/${socioEditando}`, socioData);
    } else {
      await axios.post(`${API_URL}/socios`, socioData);
    }
    showTab("socios");
    await fetchAllData();
  } catch (error) {
    alert("Erro ao salvar sócio. Verifique se o servidor está rodando.");
  }
}

function editSocio(id) {
  showSocioForm(id);
}

async function deleteSocio(id) {
  if (!confirm("Tem certeza que deseja excluir este sócio?")) return;
  try {
    await axios.delete(`${API_URL}/socios/${id}`);
    await fetchAllData();
  } catch (error) {
    alert("Erro ao excluir sócio. Verifique se o servidor está rodando.");
  }
}

// EMPRESTIMOS
function renderEmprestimos() {
  const content = document.getElementById("emprestimosList");
  let html = `<table><thead><tr><th>Sócio</th><th>Livros</th><th>Data Empréstimo</th><th>Data Devolução Prevista</th><th>Data Devolução Real</th><th class='actions'>Ações</th></tr></thead><tbody>`;
  for (const emp of emprestimos) {
    html += `<tr>
            <td>${emp.socio ? emp.socio.nome : ""}</td>
            <td>${
              emp.livros && emp.livros.length > 0
                ? emp.livros.map((l) => l.nomeLivro).join(", ")
                : ""
            }</td>
            <td>${emp.dataEmprestimo || ""}</td>
            <td>${emp.dataDevolucaoPrevista || ""}</td>
            <td>${emp.dataDevolucaoReal || ""}</td>
            <td class='actions'>
                <button class='btn' onclick='editEmprestimo(${
                  emp.id
                })'>Editar</button>
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
  let emp = { socio: null, livros: [], dataDevolucaoPrevista: "" };
  let editando = false;
  if (id !== null) {
    emp = emprestimos.find((e) => e.id === id);
    editando = true;
    emprestimoEditando = id;
  } else {
    emprestimoEditando = null;
  }
  let sociosDisponiveis = socios;
  let livrosDisponiveis = livros.filter(
    (l) =>
      l.disponivel ||
      (editando && emp.livros.some((lv) => lv.idLivro === l.idLivro))
  );
  content.innerHTML = `
        <h2>${editando ? "Editar" : "Novo"} Empréstimo</h2>
        <form onsubmit="saveEmprestimo(event)">
            <div class="form-group"><label>Sócio</label>
                <select name="idSocio" required>
                    <option value="">Selecione</option>
                    ${sociosDisponiveis
                      .map(
                        (s) =>
                          `<option value="${s.idSocio}" ${
                            emp.socio && s.idSocio === emp.socio.idSocio
                              ? "selected"
                              : ""
                          }>${s.nome}</option>`
                      )
                      .join("")}
                </select>
            </div>
            <div class="form-group"><label>Livros</label>
                <select name="idLivros" multiple required>
                    ${livrosDisponiveis
                      .map(
                        (l) =>
                          `<option value="${l.idLivro}" ${
                            emp.livros &&
                            emp.livros.some((lv) => lv.idLivro === l.idLivro)
                              ? "selected"
                              : ""
                          }>${l.nomeLivro}</option>`
                      )
                      .join("")}
                </select>
                <small>Segure Ctrl para selecionar mais de um livro</small>
            </div>
            <div class="form-group"><label>Data Devolução Prevista</label><input type="date" name="dataDevolucaoPrevista" value="${
              emp.dataDevolucaoPrevista || ""
            }" required></div>
            <button class="btn" type="submit">Salvar</button>
            <button class="btn cancel" type="button" onclick="renderEmprestimos()">Cancelar</button>
        </form>
    `;
}

async function saveEmprestimo(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const idSocio = formData.get("idSocio");
  const idLivros = formData.getAll("idLivros");
  const dataDevolucaoPrevista = formData.get("dataDevolucaoPrevista");
  try {
    await axios.post(`${API_URL}/emprestimos`, {
      socio: { idSocio: Number(idSocio) },
      livros: idLivros.map((id) => ({ idLivro: Number(id) })),
      dataDevolucaoPrevista,
    });
    showTab("emprestimos");
    await fetchAllData();
  } catch (error) {
    alert("Erro ao salvar empréstimo. Verifique se o servidor está rodando.");
  }
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
                            <label>Data de Ingresso:</label>
                            <input type="date" name="dataIngresso" required>
                        </div>
                        <div class="form-group">
                            <label>Data de Nascimento:</label>
                            <input type="date" name="dataNascimento" required>
                        </div>
                        <div class="form-group">
                            <label>Profissão:</label>
                            <input type="text" name="profissao">
                        </div>
                        <div class="form-group">
                            <label>Telefone:</label>
                            <input type="text" name="telefone">
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
                            <label>Nome do Livro:</label>
                            <input type="text" name="nomeLivro" required>
                        </div>
                        <div class="form-group">
                            <label>Autor:</label>
                            <input type="text" name="autorLivro" required>
                        </div>
                        <div class="form-group">
                            <label>Data de Lançamento:</label>
                            <input type="date" name="dataLancamento" required>
                        </div>
                        <div class="form-group">
                            <label>Editora:</label>
                            <input type="text" name="editora">
                        </div>
                        <div class="form-group">
                            <label>Código de Barras:</label>
                            <input type="text" name="codBarras">
                        </div>
                        <div class="form-group">
                            <label>Preço:</label>
                            <input type="number" name="precoLivro" step="0.01" required>
                        </div>
                        <div class="form-group">
                            <label>Disponível:</label>
                            <input type="checkbox" name="disponivel" checked>
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
                            <label>Sócio:</label>
                            <select name="idSocio" required></select>
                        </div>
                        <div class="form-group">
                            <label>Livros:</label>
                            <select name="idLivros" multiple required></select>
                        </div>
                        <div class="form-group">
                            <label>Data Devolução Prevista:</label>
                            <input type="date" name="dataDevolucaoPrevista" required>
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

// Função para carregar opções dos selects
async function loadSelectOptions() {
  try {
    const [livrosResponse, sociosResponse] = await Promise.all([
      axios.get(`${API_URL}/livros`),
      axios.get(`${API_URL}/socios`),
    ]);

    const livroSelect = document.querySelector('select[name="idLivros"]');
    const socioSelect = document.querySelector('select[name="idSocio"]');

    livroSelect.innerHTML = `
            <option value="">Selecione um livro</option>
            ${livrosResponse.data
              .filter((livro) => livro.disponivel)
              .map(
                (livro) =>
                  `<option value="${livro.idLivro}">${livro.nomeLivro}</option>`
              )
              .join("")}
        `;

    socioSelect.innerHTML = `
            <option value="">Selecione um sócio</option>
            ${sociosResponse.data
              .map(
                (socio) =>
                  `<option value="${socio.idSocio}">${socio.nome}</option>`
              )
              .join("")}
        `;
  } catch (error) {
    console.error("Erro ao carregar opções:", error);
    alert("Erro ao carregar opções. Verifique se o servidor está rodando.");
  }
}

// Funções para buscar dados do backend e atualizar as listas
async function fetchAllData() {
  try {
    const [livrosRes, sociosRes, emprestimosRes] = await Promise.all([
      axios.get(`${API_URL}/livros`),
      axios.get(`${API_URL}/socios`),
      axios.get(`${API_URL}/emprestimos`),
    ]);
    livros = livrosRes.data;
    socios = sociosRes.data;
    emprestimos = emprestimosRes.data;
    renderLivros();
    renderSocios();
    renderEmprestimos();
  } catch (error) {
    console.error("Erro ao buscar dados do backend:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetchAllData();
  showTab("livros");
});

// Expondo funções para o escopo global
globalThis.showTab = showTab;
globalThis.showLivroForm = showLivroForm;
globalThis.editLivro = editLivro;
globalThis.deleteLivro = deleteLivro;
globalThis.showSocioForm = showSocioForm;
globalThis.editSocio = editSocio;
globalThis.deleteSocio = deleteSocio;
globalThis.showEmprestimoForm = showEmprestimoForm;
globalThis.devolverEmprestimo = deleteEmprestimo;
globalThis.deleteEmprestimo = deleteEmprestimo;
