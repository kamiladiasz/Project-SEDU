// ================= VARIÁVEIS =================
const alunos = [
  "Lucas Silva",
  "Ana Santos",
  "João Pedro",
  "Carla Menezes",
  "Vitor Almeida"
];
let erroMostrado = false;

// ================= FUNÇÕES =================

// Formata data de "YYYY-MM-DD" para "DD/MM/AA"
function formatarData(data) {
  if (!data) return "-";
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano.slice(2)}`;
}

// Carrega a lista de alunos no formulário
function carregarListaAlunos() {
  const lista = document.getElementById("listaAlunos");
  lista.innerHTML = "";

  alunos.forEach((nome, i) => {
    const linha = document.createElement("div");
    linha.classList.add("linha-aluno");

    linha.innerHTML = `
      <div class="nome-aluno">${nome}</div>
      <input type="number" id="nota_${i}" min="0" max="10.1" step="0.01" placeholder="Nota">
      <input type="date" id="data_${i}">
      <button id="b-1" class="btnSalvarAluno" onclick="salvarNotaIndividual(${i})">Salvar</button>
    `;

    lista.appendChild(linha);
  });
}

// Salva a nota de um aluno individualmente
function salvarNotaIndividual(i) {
  const aluno = alunos[i];
  const nota = document.getElementById(`nota_${i}`).value;
  const dataLanc = document.getElementById(`data_${i}`).value;

  const tipo = document.getElementById("tipoAtividade").value;
  const dataAtividade = document.getElementById("dataAtividade").value;
  const disciplina = document.getElementById("disciplinaLancamento").value;
  const obs = document.getElementById("observacaoAtividade").value;

  if (!nota || !dataLanc || !tipo || !dataAtividade || !disciplina) {
    if (!erroMostrado) {
      showToast("Preencha a atividade e todos os dados do aluno para lançar a nota.", "warning");
      return false;
    }
    return;
  }

  adicionarAoHistorico({
    aluno,
    tipo,
    dataAtividade: formatarData(dataAtividade),
    disciplina,
    nota,
    dataLancamento: formatarData(dataLanc),
    obs   // ← AGORA SOBE JUNTO
  });
}

// Adiciona uma linha ao histórico no topo
function adicionarAoHistorico(reg) {
  const tabela = document.getElementById("tabelaHistorico");
  const linha = document.createElement("div");
  linha.classList.add("linha", "conteudo");

  linha.innerHTML = `
    <div data-label="Aluno">${reg.aluno}</div>
    <div data-label="Tipo da Atividade">${reg.tipo}</div>
    <div data-label="Data">${reg.dataAtividade}</div>
    <div data-label="Disciplina">${reg.disciplina}</div>
    <div data-label="Nota">${reg.nota}</div>
    <div data-label="Data de Lançamento">${reg.dataLancamento}</div>
    <div data-label="Observação">${reg.obs ? reg.obs : "-"}</div>
  `;

  // Insere logo abaixo do título
  const titulo = tabela.querySelector(".linha.titulo");
  tabela.insertBefore(linha, titulo.nextSibling);
}

// Salva todas as notas
document.getElementById("btnSalvarTodos").addEventListener("click", () => {
  let alertado = false;

  alunos.forEach((_, i) => {
    const resultado = salvarNotaIndividual(i);

    if (resultado === false && !alertado) {
      alertado = true;
    }
  });
});

// Aplica a data geral a todos os alunos (se vazio)
function aplicarDataGeral() {
  const data = document.getElementById("dataGeral")?.value;
  if (!data) return;
  alunos.forEach((_, i) => {
    const campo = document.getElementById(`data_${i}`);
    if (campo && !campo.value) campo.value = data;
  });
}



// ======== HAMBURGER / NAV MOBILE =========
const hamburger = document.getElementById('hamburger');
const mainNav = document.getElementById('main-nav');

if (hamburger && mainNav) {

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = mainNav.classList.toggle('open');
    hamburger.classList.toggle("active");
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Fecha ao clicar em link
  mainNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mainNav.classList.remove('open');
      hamburger.classList.remove("active");
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Fecha clicando fora
  document.addEventListener('click', (ev) => {
    if (!mainNav.classList.contains('open')) return;
    if (!mainNav.contains(ev.target) && ev.target !== hamburger) {
      mainNav.classList.remove('open');
      hamburger.classList.remove("active");
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  // Escape fecha o menu
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') {
      mainNav.classList.remove('open');
      hamburger.classList.remove("active");
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

// ================= INICIALIZAÇÃO =================
document.addEventListener("DOMContentLoaded", () => {
  carregarListaAlunos();
  initHamburger();

  const btnSalvarTodos = document.getElementById("btnSalvarTodos");
  if (btnSalvarTodos) btnSalvarTodos.addEventListener("click", salvarTodos);

  const dataGeral = document.getElementById("dataGeral");
  if (dataGeral) dataGeral.addEventListener("change", aplicarDataGeral);
});

function getToastContainer() {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  return container;
}

function showToast(texto, tipo = 'info') {
  const container = getToastContainer();

  // Remove toasts anteriores
  container.querySelectorAll(".toast").forEach(t => t.remove());

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.textContent = texto;

  // ---------- CORES ----------
  switch (tipo) {
    case 'success':
      toast.style.background = 'var(--puroturquesa)';
      toast.style.color = 'var(--branco)';
      break;
    case 'error':
      toast.style.background = 'var(--vermelho)';
      toast.style.color = 'var(--branco)';
      break;
    case 'warning':
      toast.style.background = '#f3b72b';
      toast.style.color = '#111';
      break;
    default:
      toast.style.background = '#555';
      toast.style.color = 'var(--branco)';
  }

  // ---------- BASE VISUAL ----------
  toast.style.padding = '6px 40px';
  toast.style.borderRadius = '12px';
  toast.style.boxShadow = '0 6px 20px rgba(0,0,0,0.25)';
  toast.style.fontSize = '14px';
  toast.style.fontWeight = '600';
  toast.style.opacity = '0';
  toast.style.transition = 'transform .35s ease, opacity .35s ease';

  const isMobile = window.matchMedia("(max-width: 600px)").matches;
 toast.style.transform = isMobile ? 'translateY(-20px)' : 'translateX(60px)';
        toast.style.transition = 'transform .32s ease, opacity .32s ease';
        toast.style.transform = isMobile ? 'translateY(-20px)' : 'translateX(60px)';
  container.appendChild(toast);

   // forçar reflow para animação
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        });


      // remover após tempo
        const DURATION = 4000;
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(60px)';
            setTimeout(() => toast.remove(), 350);
        }, DURATION);
    }

function initHamburger() {
  // vazio, só pra evitar erro
}

function salvarTodos() {
  // vazio, só pra evitar erro


  
}
