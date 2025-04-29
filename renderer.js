const axios = require("axios");

const API_URL = "http://localhost:8080";

// Função para mostrar diferentes seções
function showSection(section) {
  const content = document.getElementById("mainContent");

  switch (section) {
    case "socios":
      content.innerHTML = `
                <h2>Gerenciar Sócios</h2>
                <button onclick="showForm('socio')">Adicionar Sócio</button>
                <div id="sociosList"></div>
            `;
      loadSocios();
      break;

    case "livros":
      content.innerHTML = `
                <h2>Gerenciar Livros</h2>
                <button onclick="showForm('livro')">Adicionar Livro</button>
                <div id="livrosList"></div>
            `;
      loadLivros();
      break;

    case "emprestimos":
      content.innerHTML = `
                <h2>Gerenciar Empréstimos</h2>
                <button onclick="showForm('emprestimo')">Novo Empréstimo</button>
                <div id="emprestimosList"></div>
            `;
      loadEmprestimos();
      break;
  }
}

// Funções para carregar dados
async function loadSocios() {
  try {
    const response = await axios.get(`${API_URL}/socios`);
    const socios = response.data;
    const list = document.getElementById("sociosList");
    list.innerHTML = `
            <table>
                <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Ações</th>
                </tr>
                ${socios
                  .map(
                    (socio) => `
                    <tr>
                        <td>${socio.nome}</td>
                        <td>${socio.email}</td>
                        <td>
                            <button onclick="editSocio(${socio.id})">Editar</button>
                            <button onclick="deleteSocio(${socio.id})">Excluir</button>
                        </td>
                    </tr>
                `
                  )
                  .join("")}
            </table>
        `;
  } catch (error) {
    console.error("Erro ao carregar sócios:", error);
  }
}

async function loadLivros() {
  try {
    const response = await axios.get(`${API_URL}/livros`);
    const livros = response.data;
    const list = document.getElementById("livrosList");
    list.innerHTML = `
            <table>
                <tr>
                    <th>Título</th>
                    <th>Autor</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
                ${livros
                  .map(
                    (livro) => `
                    <tr>
                        <td>${livro.titulo}</td>
                        <td>${livro.autor}</td>
                        <td>${
                          livro.disponivel ? "Disponível" : "Emprestado"
                        }</td>
                        <td>
                            <button onclick="editLivro(${
                              livro.id
                            })">Editar</button>
                            <button onclick="deleteLivro(${
                              livro.id
                            })">Excluir</button>
                        </td>
                    </tr>
                `
                  )
                  .join("")}
            </table>
        `;
  } catch (error) {
    console.error("Erro ao carregar livros:", error);
  }
}

async function loadEmprestimos() {
  try {
    const response = await axios.get(`${API_URL}/emprestimos`);
    const emprestimos = response.data;
    const list = document.getElementById("emprestimosList");
    list.innerHTML = `
            <table>
                <tr>
                    <th>Livro</th>
                    <th>Sócio</th>
                    <th>Data Empréstimo</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
                ${emprestimos
                  .map(
                    (emp) => `
                    <tr>
                        <td>${emp.livro.titulo}</td>
                        <td>${emp.socio.nome}</td>
                        <td>${new Date(
                          emp.dataEmprestimo
                        ).toLocaleDateString()}</td>
                        <td>${
                          emp.dataDevolucaoReal ? "Devolvido" : "Em andamento"
                        }</td>
                        <td>
                            ${
                              !emp.dataDevolucaoReal
                                ? `<button onclick="devolverLivro(${emp.id})">Devolver</button>`
                                : ""
                            }
                        </td>
                    </tr>
                `
                  )
                  .join("")}
            </table>
        `;
  } catch (error) {
    console.error("Erro ao carregar empréstimos:", error);
  }
}

// Função para mostrar formulários
function showForm(type) {
  const content = document.getElementById("mainContent");
  let formHTML = "";

  switch (type) {
    case "socio":
      formHTML = `
                <h3>Adicionar Sócio</h3>
                <form onsubmit="saveSocio(event)">
                    <div>
                        <label>Nome:</label>
                        <input type="text" name="nome" required>
                    </div>
                    <div>
                        <label>Email:</label>
                        <input type="email" name="email" required>
                    </div>
                    <button type="submit">Salvar</button>
                    <button type="button" onclick="showSection('socios')">Cancelar</button>
                </form>
            `;
      break;

    case "livro":
      formHTML = `
                <h3>Adicionar Livro</h3>
                <form onsubmit="saveLivro(event)">
                    <div>
                        <label>Título:</label>
                        <input type="text" name="titulo" required>
                    </div>
                    <div>
                        <label>Autor:</label>
                        <input type="text" name="autor" required>
                    </div>
                    <button type="submit">Salvar</button>
                    <button type="button" onclick="showSection('livros')">Cancelar</button>
                </form>
            `;
      break;

    case "emprestimo":
      formHTML = `
                <h3>Novo Empréstimo</h3>
                <form onsubmit="saveEmprestimo(event)">
                    <div>
                        <label>Livro:</label>
                        <select name="livroId" required></select>
                    </div>
                    <div>
                        <label>Sócio:</label>
                        <select name="socioId" required></select>
                    </div>
                    <button type="submit">Salvar</button>
                    <button type="button" onclick="showSection('emprestimos')">Cancelar</button>
                </form>
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
    showSection("socios");
  } catch (error) {
    console.error("Erro ao salvar sócio:", error);
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
    showSection("livros");
  } catch (error) {
    console.error("Erro ao salvar livro:", error);
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
    showSection("emprestimos");
  } catch (error) {
    console.error("Erro ao salvar empréstimo:", error);
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
  }
}

// Função para devolver livro
async function devolverLivro(emprestimoId) {
  try {
    await axios.post(`${API_URL}/emprestimos/${emprestimoId}/devolver`);
    showSection("emprestimos");
  } catch (error) {
    console.error("Erro ao devolver livro:", error);
  }
}
