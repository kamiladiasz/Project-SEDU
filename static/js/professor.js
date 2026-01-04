// professor.js

// ========================== INICIALIZAÇÃO ==========================
document.addEventListener("DOMContentLoaded", () => {

    // 1️⃣ Preenche automaticamente a data atual
    const dataChamada = document.getElementById("data-chamada");
    const dataRegistro = document.getElementById("data-registro");
    const hoje = new Date().toISOString().split("T")[0];
    if (dataChamada) dataChamada.value = hoje;
    if (dataRegistro) dataRegistro.value = hoje;

    // 2️⃣ MENU HAMBURGUER
   const btn = document.getElementById("hamburger");
const nav = document.getElementById("main-nav");

btn.addEventListener("click", () => {
  const aberto = nav.classList.toggle("open");
  btn.setAttribute("aria-expanded", aberto);
  nav.setAttribute("aria-hidden", !aberto);
});


   // ========================= MODAL UNIVERSAL =========================
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

  function abrirModal(titulo, card, event) {
    if (event) {
      const tag = event.target.tagName;
      if (["SELECT","INPUT","TEXTAREA","BUTTON","A"].includes(tag)) return;
    }

    // Resetar modal para tamanho padrão
    modal.classList.remove("fullscreen");
    modal.style.width = LARGURA_PADRAO;
    modal.style.height = "";
    modal.style.maxHeight = MAX_ALTURA_PADRAO;
    modal.style.transform = "translate(-50%, -50%) scale(0.9)";

    modalTitle.textContent = titulo;
    modalBody.innerHTML = "";

    const clone = card.cloneNode(true);
    clone.removeAttribute("ondblclick");
    clone.querySelectorAll("a, button, input, select, textarea")
      .forEach(el => el.addEventListener("click", e => e.stopPropagation()));

    // Verificar se há canvases no clone; se houver, recriar gráfico
    const canvases = clone.querySelectorAll("canvas");
    if (canvases.length > 0) {
      canvases.forEach(oldCanvas => {
        // Cria wrapper para o canvas
        const wrapper = document.createElement("div");
        wrapper.style.position = "relative";
        wrapper.style.width = "100%";
        wrapper.style.minHeight = "200px";

        const newCanvas = document.createElement("canvas");
        wrapper.appendChild(newCanvas);
        oldCanvas.replaceWith(wrapper);

        const ctx = newCanvas.getContext("2d");

        // Aqui você deve adaptar para desenhar o mesmo gráfico que estava no canvas original.
        // Como exemplo, copiamos os dados do graficoNotas.
        new Chart(ctx, {
          type: 'line',  // ajuste conforme o tipo original
          data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
            datasets: [{
              label: 'Média de notas',
              data: [7.5, 8.2, 8.7, 8.4, 8.9],  // mesmos dados usados fora do modal
              borderColor: '#2395ba',
              backgroundColor: 'rgba(35,149,186,0.2)',
              fill: true,
              tension: 0.3
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true } }
          }
        });
      });
    }

    modalBody.appendChild(clone);
    modal.style.display = "block";
    modalOverlay.style.display = "block";

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
      modal.style.height = "";
      modal.style.maxHeight = MAX_ALTURA_PADRAO;
    } else {
      modal.classList.add("fullscreen");
      modal.style.width = FULL_WIDTH;
      modal.style.height = FULL_HEIGHT;
      modal.style.maxHeight = "none";
    }
  });

  // Vincular cards para abrir modal
  document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("dblclick", (e) => {
      const titulo = card.querySelector("h2")?.innerText || "";
      abrirModal(titulo, card, e);
    });
  });

    // 4️⃣ LISTA DE ALUNOS POR TURMA
    const alunosPorTurma = {
        "6A": ["Ana Beatriz", "Carlos Eduardo", "Daniel Lima", "Fernanda Alves"],
        "7B": ["Gabriel Souza", "Marina Silva", "Rafael Torres", "Juliana Mendes"],
        "8C": ["Pedro Henrique", "Vitória Santos", "Lucas Araújo", "Bianca Ferreira"]
    };
    const selectTurma = document.getElementById("select-turma");
    const listaAlunos = document.getElementById("lista-alunos");

    if (selectTurma && listaAlunos) {
        selectTurma.addEventListener("change", () => {
            const turma = selectTurma.value;
            listaAlunos.innerHTML = "";
            if (!alunosPorTurma[turma]) {
                listaAlunos.innerHTML = "<p>Nenhum aluno encontrado.</p>";
                return;
            }
            alunosPorTurma[turma].forEach(aluno => {
                const linha = document.createElement("div");
                linha.classList.add("linha-aluno");
                linha.innerHTML = `
                    <span class="nome-aluno">${aluno}</span>
                    <label><input type="radio" name="${aluno}" value="presente"> Presente</label>
                    <label><input type="radio" name="${aluno}" value="falta"> Falta</label>
                    <label><input type="radio" name="${aluno}" value="atestado"> Atestado</label>
                `;
                listaAlunos.appendChild(linha);
            });
        });
    }

    // 5️⃣ SALVAR CHAMADA

    // =======================================================
    //  CONFIRM MODAL (Promise)
    // =======================================================
    function showConfirm(mensagem, titulo = "Confirmação") {
        return new Promise(resolve => {
            const overlay = document.createElement('div');
            overlay.style = `
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.45);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 6000;
        `;

            const box = document.createElement('div');
            box.style = `
            width: 320px;
            max-width: calc(100% - 40px);
            background: #fff;
            color: #111;
            padding: 16px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.25);
            font-family: Poppins, sans-serif;
        `;

            box.innerHTML = `
            <h3 style="margin:0 0 8px;font-size:16px;color:#164757;">${titulo}</h3>
            <p style="margin:0 0 16px;font-size:14px;white-space:pre-wrap;">${mensagem}</p>
            <div style="display:flex;gap:8px;justify-content:flex-end;">
                <button data-role="cancel" style="background:#ff5454;color:#fff;border:none;padding:8px 12px;border-radius:8px;cursor:pointer;">Cancelar</button>
                <button data-role="confirm" style="background:var(--puroturquesa);color:#fff;border:none;padding:8px 12px;border-radius:8px;cursor:pointer;">Confirmar</button>
            </div>
        `;

            overlay.appendChild(box);
            document.body.appendChild(overlay);

            const confirmBtn = box.querySelector('[data-role="confirm"]');
            const cancelBtn = box.querySelector('[data-role="cancel"]');

            function cleanup(result) {
                document.removeEventListener('keydown', onKey);
                overlay.remove();
                resolve(result);
            }

            function onKey(e) {
                if (e.key === 'Escape') cleanup(false);
                if (e.key === 'Enter') cleanup(true);
            }

            confirmBtn.focus();
            confirmBtn.addEventListener('click', () => cleanup(true));
            cancelBtn.addEventListener('click', () => cleanup(false));
            document.addEventListener('keydown', onKey);
        });
    }



    // =======================================================
    //  SALVAR CHAMADA — COMPLETO E FUNCIONAL
    // =======================================================
    (function initSalvarChamada() {
        const btnSalvarChamada = document.getElementById("btn-salvar");
        const selectTurma = document.getElementById("select-turma");
        const selectTurno = document.getElementById("select-turno");
        const dataChamada = document.getElementById("data-chamada");

        if (!btnSalvarChamada) {
            console.warn("Botão #btn-salvar não encontrado.");
            return;
        }

        btnSalvarChamada.addEventListener("click", async (e) => {
            e.preventDefault();

            // -------- VALIDAÇÕES BÁSICAS --------
            if (selectTurma.selectedIndex <= 0) {
                showToast("Selecione uma turma.", "error");
                return;
            }

            if (selectTurno.selectedIndex <= 0) {
                showToast("Selecione o turno.", "warning");
                return;
            }

            if (!dataChamada.value) {
                showToast("Selecione a data da chamada.", "warning");
                return;
            }

            // -------- VALIDAR SE TODOS OS ALUNOS TÊM UMA OPÇÃO MARCADA --------
            const linhas = document.querySelectorAll(".linha-aluno");
            let totalAlunos = linhas.length;
            let respostasMarcadas = document.querySelectorAll(".linha-aluno input:checked").length;

            if (respostasMarcadas < totalAlunos) {
                showToast("Marque presença, falta ou atestado para todos os alunos.", "error");
                return;
            }

            // -------- TEXTO DE CONFIRMAÇÃO --------
            const turmaLabel = selectTurma.options[selectTurma.selectedIndex].text;
            const turnoLabel = selectTurno.options[selectTurno.selectedIndex].text;

            const mensagemConfirm = `Confirmar envio da chamada?\n\nData: ${dataChamada.value}\nTurma: ${turmaLabel}\nTurno: ${turnoLabel}`;

            const ok = await showConfirm(mensagemConfirm, "Confirmar Chamada");

            if (!ok) {
                showToast("Envio cancelado.", "info");
                return;
            }

            // -------- COLETA DAS RESPOSTAS --------
            const radios = document.querySelectorAll(".linha-aluno input:checked");
            const chamadaFinal = {};

            radios.forEach(r => chamadaFinal[r.name] = r.value);

            // -------- REGISTRAR / ENVIAR --------
            console.log("CHAMADA REGISTRADA:", {
                data: dataChamada.value,
                turma: turmaLabel,
                turno: turnoLabel,
                chamada: chamadaFinal
            });

            showToast("✔ Chamada salva com sucesso!", "success");
        });
    })();

    // 8️⃣ COMUNICAÇÃO

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
                toast.style.color = '#111';
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

    // ======== VALIDAÇÃO E ENVIO (COMUNICAÇÃO) ========

    (function initComunicacao() {
        const nomeSelect = document.getElementById('select-nome');
        const emailSelect = document.getElementById('select-email');
        const msgArea = document.getElementById('texto-mensagem');
        const btnEnviar = document.getElementById('btn-enviar-mensagem');

        if (!btnEnviar) {
            console.warn('Botão de enviar não encontrado: #btn-enviar-mensagem');
            return;
        }

        btnEnviar.addEventListener('click', (e) => {
            e.preventDefault();

            // checa existência dos elementos
            if (!nomeSelect) { showToast('Erro: select-nome não encontrado.', 'error'); return; }
            if (!emailSelect) { showToast('Erro: select-email não encontrado.', 'error'); return; }
            if (!msgArea) { showToast('Erro: area de texto não encontrada.', 'error'); return; }

            // validações claras e específicas:
            // para selects, usamos selectedIndex para detectar a opção default "Selecionar..."
            if (nomeSelect.selectedIndex <= 0) {
                showToast('Selecione um destinatário.', 'error'); // vermelho
                return;
            }

            if (emailSelect.selectedIndex <= 0) {
                showToast('Selecione um email.', 'warning'); // amarelo
                return;
            }

            const mensagem = msgArea.value.trim();
            if (mensagem.length < 8) {
                showToast('Digite uma mensagem válida (mínimo 8 caracteres).', 'info'); // cinza/azul
                return;
            }

            // se chegou até aqui, tudo validado — executar envio (simulado ou real)
            // coloque aqui a chamada à API / EmailJS etc. Se for apenas simular:
            console.log('Mensagem enviada:', {
                destinatario: nomeSelect.options[nomeSelect.selectedIndex].text,
                email: emailSelect.value,
                texto: mensagem
            });

            // limpa campos (opcional)
            msgArea.value = '';
            nomeSelect.selectedIndex = 0;
            emailSelect.selectedIndex = 0;

            showToast('✔ Mensagem enviada com sucesso!', 'success');
        });
    })();



    // ======== DIÁRIO DE CLASSE — VALIDADO + TOAST PADRÃO ========

    (function initDiarioRegistro() {
        const btnSalvarRegistro = document.getElementById('btn-salvar-registro');
        const turmaSelect = document.getElementById('turma-registro'); // valida seleção de turma
        const msgArea = document.getElementById('texto-registro');     // texto do registro (opcional)

        if (!btnSalvarRegistro) {
            console.warn('Botão #btn-salvar-registro não encontrado.');
            return;
        }

        btnSalvarRegistro.addEventListener('click', function (e) {
            e.preventDefault();

            // valida existência dos elementos (ajuda depurar se algo estiver faltando)
            if (!turmaSelect) { showToast('Erro: campo de turma não encontrado.', 'error'); return; }
            if (!msgArea) { showToast('Erro: área de registro não encontrada.', 'error'); return; }

            // Validação 1: turma selecionada (assume option padrão na pos 0 = "Selecione a turma")
            if (turmaSelect.selectedIndex <= 0) {
                showToast('Selecione a turma.', 'error'); // vermelho
                return; // importante: interrompe, não mostra success
            }

            // Validação 2: mensagem (opcional — ajuste minLength se quiser)
            const texto = msgArea.value.trim();
            const MIN_LEN = 3; // ajustar conforme necessário
            if (texto.length < MIN_LEN) {
                showToast(`Digite uma observação válida (mínimo ${MIN_LEN} caracteres).`, 'warning'); // amarelo
                return;
            }

            // (aqui coloque chamada à API / storage real se tiver)
            console.log('Registro do diário salvo:', {
                turma: turmaSelect.options[turmaSelect.selectedIndex].text,
                texto
            });

            // Limpeza opcional dos campos + feedback visual
            msgArea.value = '';
            turmaSelect.selectedIndex = 0;

            showToast('✔ Registro salvo com sucesso!', 'success');
        });
    })();

    // 9️⃣ GRÁFICO DE NOTAS
    const graficoNotas = document.getElementById('graficoNotas');
    if (graficoNotas) {
        const ctx = graficoNotas.getContext('2d');
        graficoNotasChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
                datasets: [{
                    label: 'Média de notas',
                    data: [7.5, 8.2, 8.7, 8.4, 8.9],
                    borderColor: '#2395ba',
                    backgroundColor: 'rgba(35,149,186,.2)',
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

});

