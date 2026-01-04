document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById('modal');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');
  const modalExpand = document.getElementById('modalExpand');

  const LARGURA_PADRAO = "720px";
  const MAX_ALTURA_PADRAO = "85vh";
  const FULL_WIDTH = "96vw";
  const FULL_HEIGHT = "92vh";

  // Dados / opções do gráfico
  const chartData = {
    labels: ['Matemática', 'Português', 'História'],
    datasets: [{
      label: 'Notas',
      data: [7.5, 9.0, 8.5],
      backgroundColor: ['#00d8c6', '#01c290', '#2395ba'],
      borderRadius: 5
    }]
  };
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, max: 10 } }
  };

  function criarGraficoEm(canvas) {
    const ctx = canvas.getContext('2d');
    return new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: chartOptions
    });
  }

  // Inicializa gráfico no card principal com wrapper de tamanho
  (function initCardChart() {
    const cardCanvas = document.getElementById('graficoDesempenho');
    if (cardCanvas) {
      const wrapper = document.createElement('div');
      wrapper.style.position = 'relative';
      wrapper.style.width = '100%';
      wrapper.style.maxWidth = '600px';
      wrapper.style.minHeight = '200px';
      wrapper.style.margin = '0 auto';

      cardCanvas.parentNode.insertBefore(wrapper, cardCanvas);
      wrapper.appendChild(cardCanvas);

      criarGraficoEm(cardCanvas);
    }
  })();

  function abrirModal(titulo, card, event) {
    if (event) {
      const tag = event.target.tagName;
      if (["SELECT","INPUT","TEXTAREA","BUTTON","A"].includes(tag)) return;
    }

    modal.classList.remove("fullscreen");
    modal.style.width = LARGURA_PADRAO;
    modal.style.maxHeight = MAX_ALTURA_PADRAO;
    modal.style.transform = "translate(-50%, -50%) scale(0.9)";

    modalTitle.textContent = titulo;
    modalBody.innerHTML = "";

    const clone = card.cloneNode(true);
    clone.removeAttribute('ondblclick');
    const oldCanvas = clone.querySelector('canvas');
    if (oldCanvas) oldCanvas.remove();
    modalBody.appendChild(clone);

    if (titulo === 'Histórico Escolar') {
      const wrapper = document.createElement('div');
      wrapper.style.position = 'relative';
      wrapper.style.width = '100%';
      wrapper.style.minHeight = '250px';
      wrapper.style.margin = '0 auto';

      const newCanvas = document.createElement('canvas');
      wrapper.appendChild(newCanvas);
      modalBody.appendChild(wrapper);

      modal.style.display = "block";
      modalOverlay.style.display = "block";

      requestAnimationFrame(() => {
        criarGraficoEm(newCanvas);
      });
    } else {
      modal.style.display = "block";
      modalOverlay.style.display = "block";
    }

    setTimeout(() => {
      modal.style.transform = "translate(-50%, -50%) scale(1)";
    }, 10);
  }

  window.abrirModal = abrirModal;

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

  modalExpand.addEventListener("click", (e) => {
    e.stopPropagation();
    if (modal.classList.contains("fullscreen")) {
      modal.classList.remove("fullscreen");
      modal.style.width = LARGURA_PADRAO;
      modal.style.maxHeight = MAX_ALTURA_PADRAO;
    } else {
      modal.classList.add("fullscreen");
      modal.style.width = FULL_WIDTH;
      modal.style.maxHeight = FULL_HEIGHT;
    }
  });

  document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("dblclick", (e) => {
      const titulo = card.querySelector("h2")?.innerText || "";
      abrirModal(titulo, card, e);
    });
  });

  // Função para garantir contêiner de toast com z-index alto
  function ensureToastContainer() {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      container.style.position = 'fixed';
      container.style.bottom = '20px';
      container.style.right = '20px';
      container.style.zIndex = '99999';
      document.body.appendChild(container);
    }
    return container;
  }

  // Função showToast atualizada para usar ensureToastContainer
  window.showToast = function (texto, tipo = 'info') {
    const container = ensureToastContainer();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.textContent = texto;

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
        toast.style.color = '#fff';
        break;
    }

    toast.style.padding = '8px 60px';
    toast.style.borderRadius = '10px';
    toast.style.boxShadow = '0 6px 18px rgba(0,0,0,0.18)';
    toast.style.fontWeight = '600';
    toast.style.opacity = '0';
    toast.style.transition = 'transform .32s ease, opacity .32s ease';

    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(0)';
    });

    const DURATION = 4000;
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(60px)';
      setTimeout(() => toast.remove(), 350);
    }, DURATION);
  };

  // ================== COMUNICAÇÃO (SEND) ==================
  const selectProfessor = document.getElementById('selectProfessor');
  const mensagemTexto = document.getElementById('mensagemTexto');
  const btnEnviar = document.getElementById('btnEnviar');

  if (btnEnviar) {
    btnEnviar.addEventListener('click', function (e) {
      e.preventDefault();

      if (!selectProfessor || selectProfessor.selectedIndex <= 0) {
        return showToast('Selecione um professor.', 'error');
      }

      const msg = mensagemTexto.value.trim();
      if (msg.length < 5) {
        return showToast('Digite uma mensagem válida (mín. 5 caracteres).', 'warning');
      }

      showToast('Mensagem enviada com sucesso!', 'success');
      selectProfessor.selectedIndex = 0;
      mensagemTexto.value = '';
    });
  }

  // … resto do seu código continua igual …
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