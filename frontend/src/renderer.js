const API = 'http://localhost:8081';

// ── Navegação ─────────────────────────────────────────────────────────────────

document.querySelectorAll('[data-section]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const section = link.dataset.section;
    document.querySelectorAll('[data-section]').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    document.querySelectorAll('.section').forEach(s => s.classList.add('d-none'));
    document.getElementById(`section-${section}`).classList.remove('d-none');
    carregarSecao(section);
  });
});

function carregarSecao(section) {
  if (section === 'dashboard') carregarDashboard();
  if (section === 'livros')    carregarLivros();
  if (section === 'socios')    carregarSocios();
  if (section === 'emprestimos') carregarEmprestimos('todos');
}

// ── Status de conexão ─────────────────────────────────────────────────────────

async function verificarConexao() {
  const badge = document.getElementById('status-badge');
  try {
    const res = await fetch(`${API}/livros`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      badge.className = 'badge bg-success';
      badge.innerHTML = '<i class="bi bi-circle-fill me-1"></i>Conectado';
      return true;
    }
  } catch (_) {}
  badge.className = 'badge bg-danger';
  badge.innerHTML = '<i class="bi bi-circle-fill me-1"></i>Sem conexão';
  return false;
}

// ── API helpers ────────────────────────────────────────────────────────────────

async function get(path) {
  const res = await fetch(`${API}${path}`);
  if (!res.ok) throw new Error(await extrairErro(res));
  return res.json();
}

async function post(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(await extrairErro(res));
  return res.json();
}

async function put(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(await extrairErro(res));
  return res.json();
}

async function del(path) {
  const res = await fetch(`${API}${path}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(await extrairErro(res));
}

async function extrairErro(res) {
  try {
    const data = await res.json();
    return data.error || data.message || JSON.stringify(data);
  } catch (_) {
    return `Erro ${res.status}`;
  }
}

// ── Formatadores ───────────────────────────────────────────────────────────────

function fmtData(iso) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function fmtPreco(val) {
  return val ? `R$ ${parseFloat(val).toFixed(2)}` : '—';
}

function statusEmprestimoHTML(e) {
  if (e.dataDevolucaoReal) return '<span class="badge badge-devolvido">Devolvido</span>';
  const hoje = new Date().toISOString().split('T')[0];
  if (e.dataDevolucaoPrevista < hoje) return '<span class="badge badge-atrasado">Atrasado</span>';
  return '<span class="badge badge-emprestado">Ativo</span>';
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

async function carregarDashboard() {
  try {
    const [livros, socios, ativos, atrasados] = await Promise.all([
      get('/livros'),
      get('/socios'),
      get('/emprestimos/ativos'),
      get('/emprestimos/atrasados')
    ]);

    const livrosValidos = livros.filter(l => l != null);
    const ativosValidos = ativos.filter(e => e != null);
    const disponiveis = livrosValidos.filter(l => l.disponivel).length;
    document.getElementById('stat-total-livros').textContent = livrosValidos.length;
    document.getElementById('stat-disponiveis').textContent  = disponiveis;
    document.getElementById('stat-emprestados').textContent  = livrosValidos.length - disponiveis;
    document.getElementById('stat-socios').textContent       = socios.filter(s => s != null).length;
    document.getElementById('stat-ativos').textContent       = ativosValidos.length;
    document.getElementById('stat-atrasados').textContent    = atrasados.filter(e => e != null).length;

    const tbody = document.getElementById('dashboard-emprestimos');
    if (ativosValidos.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="empty-state">Nenhum empréstimo ativo</td></tr>';
      return;
    }
    tbody.innerHTML = ativosValidos.map(e => `
      <tr>
        <td>${e.socio?.nome || '—'}</td>
        <td>${e.livros?.map(l => l.nomeLivro).join(', ') || '—'}</td>
        <td>${fmtData(e.dataEmprestimo)}</td>
        <td>${fmtData(e.dataDevolucaoPrevista)}</td>
        <td>${statusEmprestimoHTML(e)}</td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Erro ao carregar dashboard:', err);
  }
}

// ── Livros ────────────────────────────────────────────────────────────────────

let searchLivrosTimer;
document.getElementById('search-livros').addEventListener('input', e => {
  clearTimeout(searchLivrosTimer);
  searchLivrosTimer = setTimeout(() => carregarLivros(e.target.value.trim()), 300);
});

async function carregarLivros(search = '') {
  const params = search ? `?search=${encodeURIComponent(search)}` : '';
  try {
    const raw = await get(`/livros${params}`);
    const livros = raw.filter(l => l != null);
    const tbody = document.getElementById('tabela-livros');
    if (livros.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="empty-state">Nenhum livro encontrado</td></tr>';
      return;
    }
    tbody.innerHTML = livros.map(l => `
      <tr>
        <td class="fw-semibold">${l.nomeLivro}</td>
        <td>${l.autorLivro}</td>
        <td>${l.editora || '—'}</td>
        <td><code>${l.codBarras || '—'}</code></td>
        <td>${fmtPreco(l.precoLivro)}</td>
        <td>${l.disponivel
          ? '<span class="badge badge-disponivel">Disponível</span>'
          : '<span class="badge badge-emprestado">Emprestado</span>'}</td>
        <td class="text-end">
          <button class="btn btn-outline-secondary action-btn me-1" onclick="editarLivro(${l.idLivro})"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-outline-danger action-btn" onclick="confirmarDelete('livro', ${l.idLivro}, '${escapeHtml(l.nomeLivro)}')"><i class="bi bi-trash"></i></button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Erro ao carregar livros:', err);
  }
}

function abrirModalLivro() {
  document.getElementById('modalLivroTitulo').textContent = 'Novo Livro';
  document.getElementById('formLivro').reset();
  document.getElementById('livro-id').value = '';
  document.getElementById('livro-disponivel').checked = true;
  esconderErro('livro-erro');
  new bootstrap.Modal('#modalLivro').show();
}

async function editarLivro(id) {
  try {
    const l = await get(`/livros/${id}`);
    document.getElementById('modalLivroTitulo').textContent = 'Editar Livro';
    document.getElementById('livro-id').value         = l.idLivro;
    document.getElementById('livro-nome').value       = l.nomeLivro;
    document.getElementById('livro-autor').value      = l.autorLivro;
    document.getElementById('livro-data').value       = l.dataLancamento;
    document.getElementById('livro-editora').value    = l.editora || '';
    document.getElementById('livro-codbarras').value  = l.codBarras || '';
    document.getElementById('livro-preco').value      = l.precoLivro;
    document.getElementById('livro-disponivel').checked = l.disponivel;
    esconderErro('livro-erro');
    new bootstrap.Modal('#modalLivro').show();
  } catch (err) {
    alert('Erro ao carregar livro: ' + err.message);
  }
}

async function salvarLivro(event) {
  event.preventDefault();
  const id = document.getElementById('livro-id').value;
  const body = {
    nomeLivro:      document.getElementById('livro-nome').value,
    autorLivro:     document.getElementById('livro-autor').value,
    dataLancamento: document.getElementById('livro-data').value,
    editora:        document.getElementById('livro-editora').value || null,
    codBarras:      document.getElementById('livro-codbarras').value || null,
    precoLivro:     parseFloat(document.getElementById('livro-preco').value) || 0,
    disponivel:     document.getElementById('livro-disponivel').checked
  };
  try {
    if (id) await put(`/livros/${id}`, body);
    else    await post('/livros', body);
    bootstrap.Modal.getInstance('#modalLivro').hide();
    carregarLivros(document.getElementById('search-livros').value.trim());
  } catch (err) {
    mostrarErro('livro-erro', err.message);
  }
}

// ── Sócios ────────────────────────────────────────────────────────────────────

let searchSociosTimer;
document.getElementById('search-socios').addEventListener('input', e => {
  clearTimeout(searchSociosTimer);
  searchSociosTimer = setTimeout(() => carregarSocios(e.target.value.trim()), 300);
});

async function carregarSocios(search = '') {
  const params = search ? `?search=${encodeURIComponent(search)}` : '';
  try {
    const raw = await get(`/socios${params}`);
    const socios = raw.filter(s => s != null);
    const tbody = document.getElementById('tabela-socios');
    if (socios.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="empty-state">Nenhum sócio encontrado</td></tr>';
      return;
    }
    tbody.innerHTML = socios.map(s => `
      <tr>
        <td class="fw-semibold">${s.nome}</td>
        <td>${s.profissao || '—'}</td>
        <td>${s.telefone || '—'}</td>
        <td>${fmtData(s.dataIngresso)}</td>
        <td class="text-end">
          <button class="btn btn-outline-secondary action-btn me-1" onclick="editarSocio(${s.idSocio})"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-outline-danger action-btn" onclick="confirmarDelete('socio', ${s.idSocio}, '${escapeHtml(s.nome)}')"><i class="bi bi-trash"></i></button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Erro ao carregar sócios:', err);
  }
}

function abrirModalSocio() {
  document.getElementById('modalSocioTitulo').textContent = 'Novo Sócio';
  document.getElementById('formSocio').reset();
  document.getElementById('socio-id').value = '';
  document.getElementById('socio-ingresso').value = new Date().toISOString().split('T')[0];
  esconderErro('socio-erro');
  new bootstrap.Modal('#modalSocio').show();
}

async function editarSocio(id) {
  try {
    const s = await get(`/socios/${id}`);
    document.getElementById('modalSocioTitulo').textContent = 'Editar Sócio';
    document.getElementById('socio-id').value         = s.idSocio;
    document.getElementById('socio-nome').value       = s.nome;
    document.getElementById('socio-ingresso').value   = s.dataIngresso;
    document.getElementById('socio-nascimento').value = s.dataNascimento || '';
    document.getElementById('socio-profissao').value  = s.profissao || '';
    document.getElementById('socio-telefone').value   = s.telefone || '';
    esconderErro('socio-erro');
    new bootstrap.Modal('#modalSocio').show();
  } catch (err) {
    alert('Erro ao carregar sócio: ' + err.message);
  }
}

async function salvarSocio(event) {
  event.preventDefault();
  const id = document.getElementById('socio-id').value;
  const body = {
    nome:           document.getElementById('socio-nome').value,
    dataIngresso:   document.getElementById('socio-ingresso').value,
    dataNascimento: document.getElementById('socio-nascimento').value || null,
    profissao:      document.getElementById('socio-profissao').value || null,
    telefone:       document.getElementById('socio-telefone').value || null
  };
  try {
    if (id) await put(`/socios/${id}`, body);
    else    await post('/socios', body);
    bootstrap.Modal.getInstance('#modalSocio').hide();
    carregarSocios(document.getElementById('search-socios').value.trim());
  } catch (err) {
    mostrarErro('socio-erro', err.message);
  }
}

// ── Empréstimos ───────────────────────────────────────────────────────────────

let filtroAtual = 'todos';
let livrosDisponiveis = [];

async function carregarEmprestimos(filtro) {
  filtroAtual = filtro;
  document.querySelectorAll('[id^=filter-]').forEach(b => b.classList.remove('active'));
  document.getElementById(`filter-${filtro}`).classList.add('active');

  const path = filtro === 'todos' ? '/emprestimos' :
               filtro === 'ativos' ? '/emprestimos/ativos' : '/emprestimos/atrasados';
  try {
    const raw = await get(path);
    const emprestimos = raw.filter(e => e != null);
    const tbody = document.getElementById('tabela-emprestimos');
    if (emprestimos.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="empty-state">Nenhum empréstimo encontrado</td></tr>';
      return;
    }
    tbody.innerHTML = emprestimos.map(e => `
      <tr>
        <td class="fw-semibold">${e.socio?.nome || '—'}</td>
        <td>${e.livros?.map(l => l.nomeLivro).join('<br>') || '—'}</td>
        <td>${fmtData(e.dataEmprestimo)}</td>
        <td>${fmtData(e.dataDevolucaoPrevista)}</td>
        <td>${fmtData(e.dataDevolucaoReal)}</td>
        <td>${statusEmprestimoHTML(e)}</td>
        <td class="text-end">
          ${!e.dataDevolucaoReal
            ? `<button class="btn btn-outline-success action-btn" onclick="confirmarDevolucao(${e.id})"><i class="bi bi-check-lg me-1"></i>Devolver</button>`
            : ''}
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Erro ao carregar empréstimos:', err);
  }
}

function filtrarEmprestimos(filtro) {
  carregarEmprestimos(filtro);
}

function renderizarOpcoesLivros() {
  const query = document.getElementById('emprestimo-livros-search').value.toLowerCase();
  const select = document.getElementById('emprestimo-livros');
  const selecionados = new Set(Array.from(select.selectedOptions).map(o => o.value));

  const filtrados = livrosDisponiveis.filter(l =>
    l.nomeLivro.toLowerCase().includes(query) ||
    l.autorLivro.toLowerCase().includes(query)
  );

  select.innerHTML = filtrados.length === 0
    ? '<option disabled>Nenhum livro encontrado</option>'
    : filtrados.map(l =>
        `<option value="${l.idLivro}" ${selecionados.has(String(l.idLivro)) ? 'selected' : ''}>${l.nomeLivro} — ${l.autorLivro}</option>`
      ).join('');
}

async function abrirModalEmprestimo() {
  try {
    const [rawSocios, rawLivros] = await Promise.all([get('/socios'), get('/livros/disponiveis')]);
    const socios = rawSocios.filter(s => s != null);
    livrosDisponiveis = rawLivros.filter(l => l != null);

    const selSocio = document.getElementById('emprestimo-socio');
    selSocio.innerHTML = socios.length === 0
      ? '<option value="">Nenhum sócio cadastrado</option>'
      : '<option value="">Selecione um sócio...</option>' +
        socios.map(s => `<option value="${s.idSocio}">${s.nome}</option>`).join('');

    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 14);

    esconderErro('emprestimo-erro');
    selSocio.value = '';
    document.getElementById('emprestimo-livros-search').value = '';
    document.getElementById('emprestimo-devolucao').value = amanha.toISOString().split('T')[0];
    renderizarOpcoesLivros();

    new bootstrap.Modal('#modalEmprestimo').show();
  } catch (err) {
    alert('Erro ao abrir formulário: ' + err.message);
  }
}

async function salvarEmprestimo(event) {
  event.preventDefault();
  const socioId  = document.getElementById('emprestimo-socio').value;
  const livroIds = Array.from(document.getElementById('emprestimo-livros').selectedOptions).map(o => o.value);
  const devolucao = document.getElementById('emprestimo-devolucao').value;

  if (!socioId) { mostrarErro('emprestimo-erro', 'Selecione um sócio'); return; }
  if (livroIds.length === 0) { mostrarErro('emprestimo-erro', 'Selecione pelo menos um livro'); return; }

  const body = {
    socio: { idSocio: parseInt(socioId) },
    livros: livroIds.map(id => ({ idLivro: parseInt(id) })),
    dataDevolucaoPrevista: devolucao
  };

  try {
    await post('/emprestimos', body);
    bootstrap.Modal.getInstance('#modalEmprestimo').hide();
    carregarEmprestimos(filtroAtual);
  } catch (err) {
    mostrarErro('emprestimo-erro', err.message);
  }
}

function confirmarDevolucao(id) {
  document.getElementById('confirmTitulo').textContent = 'Registrar Devolução';
  document.getElementById('confirmMsg').textContent    = 'Confirmar devolução deste empréstimo?';
  document.getElementById('confirmBtn').className      = 'btn btn-success';
  document.getElementById('confirmBtn').textContent    = 'Confirmar';
  document.getElementById('confirmBtn').onclick = async () => {
    try {
      await put(`/emprestimos/${id}/devolver`, {});
      bootstrap.Modal.getInstance('#modalConfirm').hide();
      carregarEmprestimos(filtroAtual);
    } catch (err) {
      alert('Erro: ' + err.message);
    }
  };
  new bootstrap.Modal('#modalConfirm').show();
}

// ── Delete ─────────────────────────────────────────────────────────────────────

function confirmarDelete(tipo, id, nome) {
  document.getElementById('confirmTitulo').textContent = 'Confirmar exclusão';
  document.getElementById('confirmMsg').textContent    = `Excluir "${nome}"? Esta ação não pode ser desfeita.`;
  document.getElementById('confirmBtn').className      = 'btn btn-danger';
  document.getElementById('confirmBtn').textContent    = 'Excluir';
  document.getElementById('confirmBtn').onclick = async () => {
    try {
      await del(`/${tipo === 'livro' ? 'livros' : 'socios'}/${id}`);
      bootstrap.Modal.getInstance('#modalConfirm').hide();
      if (tipo === 'livro') carregarLivros(document.getElementById('search-livros').value.trim());
      else                  carregarSocios(document.getElementById('search-socios').value.trim());
    } catch (err) {
      alert('Erro ao excluir: ' + err.message);
    }
  };
  new bootstrap.Modal('#modalConfirm').show();
}

// ── Utilitários ───────────────────────────────────────────────────────────────

function mostrarErro(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.classList.remove('d-none');
}

function esconderErro(id) {
  document.getElementById(id).classList.add('d-none');
}

function escapeHtml(str) {
  return String(str).replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

// ── Inicialização ─────────────────────────────────────────────────────────────

document.getElementById('emprestimo-livros-search').addEventListener('input', renderizarOpcoesLivros);

(async () => {
  await verificarConexao();
  carregarDashboard();
  setInterval(verificarConexao, 10000);
})();
