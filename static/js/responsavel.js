document.addEventListener("DOMContentLoaded", () => {
  // — ELEMENTOS DO MODAL / OVERLAY
  const modal = document.getElementById("modal");
  const modalOverlay = document.getElementById("modalOverlay");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");
  const modalClose = document.getElementById("modalClose");
  const modalExpand = document.getElementById("modalExpand");
 
  const LARGURA_PADRAO = "720px";
  const MAX_ALTURA_PADRAO = "85vh";
  const FULL_WIDTH = "96vw";
  const FULL_HEIGHT = "92vh";
 
  // — FUNÇÃO PARA TOAST
  function ensureToastContainer() {
    let container = document.querySelector(".toast-container");
    if (!container) {
      container = document.createElement("div");
      container.className = "toast-container";
      // estilos inline para garantir visibilidade
      container.style.position = "fixed";
      container.style.bottom = "20px";
      container.style.right = "20px";
      container.style.zIndex = "99999";
      container.style.display = "flex";
      container.style.flexDirection = "column";
      container.style.gap = "10px";
      document.body.appendChild(container);
    }
    return container;
  }
 
  window.showToast = function (texto, tipo = "info") {
    const container = ensureToastContainer();
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = texto;
 
    const cores = {
      success: "var(--puroturquesa)",
      error: "#ff4d4d",
      warning: "#f3b72b",
      info: "#555"
    };
 
    toast.style.background = cores[tipo] || cores.info;
    toast.style.color = tipo === "warning" ? "#111" : "#fff";
    toast.style.padding = "10px 20px";
    toast.style.borderRadius = "8px";
    toast.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
    toast.style.opacity = "0";
    toast.style.transform = "translateX(50px)";
    toast.style.transition = "opacity 0.3s ease, transform 0.3s ease";
 
    container.appendChild(toast);
 
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateX(0)";
    });
 
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(60px)";
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3500);
  };
 
  // — FUNÇÕES DO MODAL
  function abrirModal(titulo, card, event) {
    if (event) {
      const tag = event.target.tagName;
      if (["SELECT", "INPUT", "TEXTAREA", "BUTTON", "A"].includes(tag)) {
        return;
      }
    }
 
    if (!modal || !modalOverlay || !modalTitle || !modalBody) return;
 
    modal.classList.remove("fullscreen");
    modal.style.width = LARGURA_PADRAO;
    modal.style.maxHeight = MAX_ALTURA_PADRAO;
    modal.style.transform = "translate(-50%, -50%) scale(0.9)";
 
    modalTitle.innerText = titulo || "";
    modalBody.innerHTML = "";
 
    const clone = card.cloneNode(true);
    clone.removeAttribute("ondblclick");
    clone
      .querySelectorAll("a, button, input, select, textarea")
      .forEach(el => el.addEventListener("click", e => e.stopPropagation()));
 
    modalBody.appendChild(clone);
 
    modal.style.display = "block";
    modalOverlay.style.display = "block";
 
    setTimeout(() => {
      modal.style.transform = "translate(-50%, -50%) scale(1)";
    }, 10);
  }
  window.abrirModal = abrirModal;
 
  function fecharModal() {
    if (!modal || !modalOverlay) return;
    modal.style.transform = "translate(-50%, -50%) scale(.9)";
    modalOverlay.style.display = "none";
    setTimeout(() => {
      modal.style.display = "none";
      modalBody.innerHTML = "";
    }, 180);
  }
 
  if (modalClose) modalClose.addEventListener("click", fecharModal);
  if (modalOverlay) {
    modalOverlay.addEventListener("click", e => {
      if (e.target === modalOverlay) {
        fecharModal();
      }
    });
  }
 
  if (modalExpand) {
    modalExpand.addEventListener("click", e => {
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
  }
 
  document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("dblclick", e => {
      const titulo = card.querySelector("h2")?.innerText || "";
      abrirModal(titulo, card, e);
    });
  });
 
  // — LÓGICA DE COMUNICAÇÃO / ENVIO DE MENSAGEM + TOAST
  const btnEnviar = document.getElementById("comunicacao-enviar");
  if (btnEnviar) {
    btnEnviar.addEventListener("click", e => {
      e.preventDefault();
      const destino = document.getElementById("comunicacao-destino");
      const textoInput = document.getElementById("comunicacao-texto");
      if (!destino || !textoInput) return;
 
      const destinatario = destino.value;
      const texto = textoInput.value.trim();
      if (!destinatario || destino.selectedIndex <= 0) {
        showToast("Selecione um destinatário.", "error");
        return;
      }
      if (texto.length < 5) {
        showToast("Digite uma mensagem válida (mínimo 5 caracteres).", "warning");
        return;
      }
 
      showToast("✔ Mensagem enviada com sucesso!", "success");
      textoInput.value = "";
      destino.selectedIndex = 0;
    });
  }
 
  // — resto do seu código (se houver) permanece inalterado...
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


