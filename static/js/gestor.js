document.addEventListener("DOMContentLoaded", () => {

  // ========================= HAMBÚRGUER =========================
  function toggleMenu(el) {
    el.classList.toggle('open');
    document.querySelector('.nav-responsivo').classList.toggle('active');
  }
  window.toggleMenu = toggleMenu;

  // ========================= MODAL =========================
  const modal = document.getElementById('modal');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');
  const modalExpand = document.getElementById('modalExpand');

  function abrirModal(titulo, card) {

    // ======= PADRÃO DE TAMANHO DO MODAL =======
    const LARGURA_PADRAO = "720px";
    const MAX_ALTURA_PADRAO = "85vh";

    modal.classList.remove("fullscreen");
    modal.style.width = LARGURA_PADRAO;
    modal.style.height = "";
    modal.style.maxHeight = MAX_ALTURA_PADRAO;
    modal.style.transform = "translate(-50%, -50%) scale(0.9)";
    // ==========================================

    modalTitle.textContent = titulo;
    modalBody.innerHTML = '';

    const clone = card.cloneNode(true);
    clone.removeAttribute('ondblclick');

    clone.querySelectorAll('a,button,input,select,textarea')
      .forEach(el => el.addEventListener('click', e => e.stopPropagation()));

    // ==================== RECRIAR GRÁFICOS ====================
    const canvasList = clone.querySelectorAll("canvas");

    canvasList.forEach((oldCanvas, index) => {
      const newCanvas = document.createElement("canvas");
      oldCanvas.removeAttribute("id"); // evitar conflito de ID
      oldCanvas.replaceWith(newCanvas);

      if (titulo === "Desempenho Geral") {
        new Chart(newCanvas.getContext("2d"), {
          type: 'bar',
          data: {
            labels: ['Matemática', 'Português', 'Ciências', 'História', 'Geografia'],
            datasets: [{ label: 'Média de Notas', data: [8.2, 7.5, 7.8, 8.0, 7.6], backgroundColor: '#276749' }]
          },
          options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 10 } } }
        });
      }

      if (titulo === "Desempenho por Turma") {
        new Chart(newCanvas.getContext("2d"), {
          type: 'line',
          data: {
            labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
            datasets: [{ label: 'Desempenho', data: [7.5, 7.8, 8.0, 7.9], borderColor: '#2395ba', backgroundColor: 'rgba(35,149,186,0.08)', fill: true, tension: 0.3 }]
          },
          options: { responsive: true, plugins: { legend: { display: false } } }
        });
      }
    });

    modalBody.appendChild(clone);
    modal.style.display = 'block';
    modalOverlay.style.display = 'block';

    setTimeout(() => {
      modal.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);
  }
  window.abrirModal = abrirModal;

  // ========================= EXPANDIR =========================
  modalExpand.addEventListener("click", e => {
    e.stopPropagation();
    if (modal.classList.contains("fullscreen")) {
      modal.classList.remove("fullscreen");
      modal.style.width = "720px";
      modal.style.height = "";
      modal.style.maxHeight = "85vh";
    } else {
      modal.classList.add("fullscreen");
      modal.style.width = "96vw";
      modal.style.height = "92vh";
    }
  });

  // ========================= FECHAR =========================
  function fecharModal() {
    modal.style.transform = "translate(-50%,-50%) scale(.9)";
    modalOverlay.style.display = "none";

    setTimeout(() => {
      modal.style.display = "none";
      modalBody.innerHTML = "";
    }, 180);
  }

  modalClose.addEventListener("click", fecharModal);
  modalOverlay.addEventListener("click", fecharModal);

});

// ========================= SELECT DINÂMICO =========================
const dados = {
  professores: [
    { nome: "João Silva", email: "joao.silva@escola.com" },
    { nome: "Clara Santos", email: "clara.santos@escola.com" },
    { nome: "Claudio Romão", email: "claudio.romao@escola.com" },
    { nome: "Silvia Nascimento", email: "silvia.nascimento@escola.com" }
  ],
  responsaveis: [
    { nome: "Maria Pereira (pai)", email: "maria.pereira@example.com" },
    { nome: "Carlos Sousa (mãe)", email: "carlos.sousa@example.com" },
    { nome: "Ana Rocha (responsável)", email: "ana.rocha@example.com" }
  ]
};

const tipoSelect = document.getElementById('select-tipo');
const nomeSelect = document.getElementById('select-nome-gestor');

tipoSelect.addEventListener('change', function () {
  const tipo = this.value;
  nomeSelect.innerHTML = '<option disabled selected>Selecione o nome / email</option>';
  if (!dados[tipo]) return;
  dados[tipo].forEach(item => {
    const opt = document.createElement('option');
    opt.value = item.email;
    opt.textContent = `${item.nome} — ${item.email}`;
    nomeSelect.appendChild(opt);
  });
});

// ========================= ENVIO DE MENSAGEM =========================
document.getElementById('btn-enviar-gestor').addEventListener('click', () => {
  const tipo = tipoSelect.value;
  const destinatario = nomeSelect.value;
  const texto = document.getElementById('texto-comunicado').value.trim();

  if (!tipo) return mostrarToast('Escolha o tipo de destinatário.');
  if (!destinatario) return mostrarToast('Escolha um destinatário.');
  if (!texto) return mostrarToast('Escreva a mensagem.');

  mostrarToast(`Mensagem enviada para: ${destinatario}`);
  document.getElementById('texto-comunicado').value = '';
});

// ========================= INFO PROFESSORES =========================
const professoresInfo = {
  "João Silva": { nome: "João Silva", turma: "6º Ano A", materia: "Matemática", email: "joao.silva@escola.com", telefone: "(61)90000-0001", cargaHoraria: "20h semanais", observacoes: "Responsável por olimpíada de matemática." },
  "Clara Santos": { nome: "Clara Santos", turma: "7º Ano B", materia: "Português", email: "clara.santos@escola.com", telefone: "(61)90000-0002", cargaHoraria: "20h semanais", observacoes: "Coordena o clube de leitura." },
  "Claudio Romão": { nome: "Claudio Romão", turma: "8º Ano C", materia: "Química", email: "claudio.romao@escola.com", telefone: "(61)90000-0003", cargaHoraria: "16h semanais", observacoes: "Responsável pelo laboratório de ciências." },
  "Silvia Nascimento": { nome: "Silvia Nascimento", turma: "7º Ano A", materia: "Educação Física", email: "silvia.nascimento@escola.com", telefone: "(61)90000-0004", cargaHoraria: "30h semanais", observacoes: "Treinadora da equipe de vôlei." }
};

document.querySelectorAll('button[data-prof]').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const nome = btn.getAttribute('data-prof');
    const prof = professoresInfo[nome];
    if (!prof) return;

    const modal = document.getElementById('modal');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    modalTitle.textContent = `Detalhes — ${prof.nome}`;
    modalBody.innerHTML = `
      <div style="padding:10px;">
        <h3 style="margin-top:0;color:#164757;">Informações do Professor</h3>
        <p><strong>Nome:</strong> ${prof.nome}</p>
        <p><strong>Turma:</strong> ${prof.turma}</p>
        <p><strong>Matéria:</strong> ${prof.materia}</p>
        <p><strong>Email:</strong> ${prof.email}</p>
        <p><strong>Telefone:</strong> ${prof.telefone}</p>
        <p><strong>Carga Horária:</strong> ${prof.cargaHoraria}</p>
        <div style="background:#e8f6ff;padding:10px;border-radius:8px;margin-top:10px;">
          <strong>Observações:</strong><br>${prof.observacoes}
        </div>
      </div>
    `;
    modal.style.display = 'block';
    modalOverlay.style.display = 'block';
  });
});

// ========================= GRÁFICOS INICIAIS =========================
(function initCharts() {
  const ctxGeral = document.getElementById('graficoGeral').getContext('2d');
  new Chart(ctxGeral, {
    type: 'bar',
    data: {
      labels: ['Matemática', 'Português', 'Ciências', 'História', 'Geografia'],
      datasets: [{ label: 'Média de Notas', data: [8.2, 7.5, 7.8, 8.0, 7.6], backgroundColor: '#276749' }]
    },
    options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 10 } } }
  });

  const ctxTurma = document.getElementById('graficoTurma').getContext('2d');
  new Chart(ctxTurma, {
    type: 'line',
    data: {
      labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
      datasets: [{ label: 'Desempenho', data: [7.5, 7.8, 8.0, 7.9], borderColor: '#2395ba', backgroundColor: 'rgba(35,149,186,0.08)', tension: 0.3, fill: true }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });
})();

/* ========================= TOAST SEDU — PADRÃO OFICIAL ========================= */

// 8️⃣ COMUNICAÇÃO

function getToastContainer() {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.classList.add("toast-container");
    document.body.appendChild(container);
  }
  return container;
}

function showToast(message, type = "info") {
  const container = getToastContainer();

  const toast = document.createElement("div");
  toast.classList.add("toast");

  /* cores seguindo o professor.js */
  const colors = {
    success: "var(--puroturquesa)",   // #01c290
    error: "var(--vermelho)",         // #ff3b30
    warning: "var(--amarelo)",        // #f6a200
    info: "var(--cinza2)"             // #444
  };

  toast.style.background = colors[type] || colors.info;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}




/* ================================
   2. MODAL PADRONIZADO SEDU
   ================================ */
function openModal(title, element) {
  const modal = document.getElementById("modal");
  const overlay = document.getElementById("modalOverlay");

  document.getElementById("modalTitle").textContent = title;

  /* Puxa conteúdo da div/card */
  document.getElementById("modalBody").innerHTML = element.innerHTML;

  modal.classList.add("active");
  overlay.classList.add("active");
}

function closeModal() {
  document.getElementById("modal").classList.remove("active");
  document.getElementById("modalOverlay").classList.remove("active");
}

/* fecha modal no X */
document.getElementById("modalClose")?.addEventListener("click", closeModal);

/* Expansão opcional */
document.getElementById("modalExpand")?.addEventListener("click", () => {
  document.getElementById("modal").classList.toggle("fullscreen");
});

/* ================================
   3. COMUNICAÇÃO DO GESTOR
   Envio de mensagem com validação
   ================================ */
function getToastContainer() {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            // coloca no body (posição definida via CSS)
            document.body.appendChild(container);
        }
        return container;
    }

    /*FunçãoshowToast(texto, tipo)*/
    function showToast(texto, tipo = 'info') {
        const container = getToastContainer();

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        toast.textContent = texto;

        // cores por tipo (inline para garantir visual mesmo sem classes)
        switch (tipo) {
            case 'success':
                toast.style.background = 'var(--puroturquesa)'; // verde/azul
                toast.style.color = 'var(--branco)';
                break;
            case 'error':
                toast.style.background = 'var(--vermelho)';
                toast.style.color = 'var(--branco)';
                break;
            case 'warning':
                toast.style.background = '#f3b72b'; // amarelo
                toast.style.color = '#ffffffff';
                break;
            default: // info
                toast.style.background = '#555'; // neutro
                toast.style.color = 'var(--branco)';
                break;
        }

        // animação / entrada
        toast.style.padding = '8px 60px';
        toast.style.borderRadius = '10px';
        toast.style.boxShadow = '0 6px 18px rgba(0,0,0,0.18)';
        toast.style.fontWeight = '600';
        toast.style.opacity = '0';
        // Detectar mobile por largura da tela
        const isMobile = window.matchMedia("(max-width: 600px)").matches;

        // Animação inicial
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





(function initCommunicationManager() {
  // ================== COMUNICAÇÃO (SEND) — MODELO REPLICADO ==================
const tipoSelect = document.getElementById('select-tipo');
const emailSelect = document.getElementById('select-nome-gestor');
const mensagemGestor = document.getElementById('texto-comunicado');
const btnEnviarGestor = document.getElementById('btn-enviar-gestor');

if (btnEnviarGestor) {
  btnEnviarGestor.addEventListener('click', function (e) {
    e.preventDefault();

    // valida tipo
    if (!tipoSelect || tipoSelect.selectedIndex <= 0) {
      return showToast('Selecione o tipo de destinatário.', 'error');
    }

    // valida nome/email
    if (!emailSelect || emailSelect.selectedIndex <= 0) {
      return showToast('Selecione um destinatário.', 'error');
    }

    // valida mensagem
    const msg = mensagemGestor.value.trim();
    if (msg.length < 8) {
      return showToast('Digite uma mensagem válida (mínimo 8 caracteres).', 'neutro');
    }

    // sucesso
    showToast('Mensagem enviada com sucesso!', 'success');

    // limpar
    tipoSelect.selectedIndex = 0;
    emailSelect.selectedIndex = 0;
    mensagemGestor.value = '';
  });
}
  
})();

/* ================================
   4. ABRIR MODAL AO CLICAR NOS CARDS
   ================================ */
document.querySelectorAll("[data-modal]").forEach(card => {
  card.addEventListener("dblclick", () => {
    const title = card.getAttribute("data-title") || "Detalhes";
    openModal(title, card);
  });
});
/* ==================================
   HAMBÚRGUER MENU — COMPONENTE ISOLADO
=================================== */
document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("hamburger");
  const menu = document.getElementById("main-nav");

  if (!button || !menu) return;

  // Alterna o menu
  button.addEventListener("click", () => {
    menu.classList.toggle("open");
    button.setAttribute("aria-expanded", menu.classList.contains("open"));
  });

  // Fecha ao clicar fora
  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && !button.contains(e.target)) {
      menu.classList.remove("open");
      button.setAttribute("aria-expanded", "false");
    }
  });
});

