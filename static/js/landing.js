// =========================
// LOGIN SIMPLES
// =========================
const loginBtn = document.getElementById('login-btn');
if (loginBtn) {
  loginBtn.addEventListener('click', () => {
    const user = document.getElementById('user').value.trim();
    const pass = document.getElementById('password').value.trim();
    const msg = document.getElementById('login-msg');

    if (!user || !pass) {
      msg.textContent = 'Preencha todos os campos.';
      msg.style.color = '#ffd166';
      return;
    }

    msg.textContent = `Bem-vindo, ${user}! (login simulado)`;
    msg.style.color = '#00ffcc';
  });
}

// =========================
// BOTÃO VOLTAR AO TOPO
// =========================
const topBtn = document.getElementById('top-btn');
if (topBtn) {
  window.addEventListener('scroll', () => {
    topBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
  });

  topBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// =========================
// HAMBÚRGUER / MENU MOBILE
// =========================
const hamburger = document.getElementById('hamburger');
const mainNav = document.getElementById('main-nav');

if (hamburger && mainNav) {
  
  // 🔥 animação do hambúrguer para X
  function toggleHamburgerAnimation(open) {
    hamburger.classList.toggle('open', open);
  }

  // abre/fecha o menu
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    
    const aberto = mainNav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', aberto ? 'true' : 'false');

    toggleHamburgerAnimation(aberto);

    if (aberto) {
      const firstLink = mainNav.querySelector('a');
      if (firstLink) firstLink.focus();
    }
  });

  // fechar ao clicar em algum link
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      toggleHamburgerAnimation(false);
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // fechar ao clicar fora
  document.addEventListener('click', (e) => {
    if (!mainNav.classList.contains('open')) return;
    const isClickInsideNav = mainNav.contains(e.target);
    const isClickHamburger = hamburger.contains(e.target);
    if (!isClickInsideNav && !isClickHamburger) {
      mainNav.classList.remove('open');
      toggleHamburgerAnimation(false);
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  // fechar com tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav.classList.contains('open')) {
      mainNav.classList.remove('open');
      toggleHamburgerAnimation(false);
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.focus();
    }
  });
}

// =========================
// FORMULÁRIO DE CONTATO (EMAILJS + fallback)
// =========================
const contatoForm = document.getElementById('contato-form');
const contatoFeedback = document.getElementById('contato-feedback');

if (contatoForm) {
  contatoForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const perfil = document.getElementById('perfil').value;
    const mensagem = document.getElementById('mensagem').value.trim();

    if (!email || !telefone || !mensagem) {
      contatoFeedback.textContent = 'Preencha os campos obrigatórios (email, telefone e mensagem).';
      contatoFeedback.style.color = '#ffd166';
      return;
    }

    contatoFeedback.textContent = 'Enviando...';
    contatoFeedback.style.color = '#fff';

    // CONFIGURAÇÕES EMAILJS
    const useEmailJS = true;
    const SERVICE_ID = 'service_glyg5so';
    const TEMPLATE_ID = 'template_coemtym';
    const USER_ID = 'DesFll64BpRKGpdCt';

    const payload = { nome, email, telefone, perfil, mensagem };

    try {
      if (useEmailJS && window.emailjs) {
        await emailjs.send(SERVICE_ID, TEMPLATE_ID, payload);
        contatoFeedback.textContent = 'Mensagem enviada com sucesso!';
        contatoFeedback.style.color = '#00ffcc';
        contatoForm.reset();
        return;
      }

      // fallback — mailto
      const destino = 'sedu_oficial@outlook.com.br';
      const subject = encodeURIComponent('Contato pelo site SEDU - ' + nome);
      const body = encodeURIComponent(
        `Nome: ${nome}\nEmail: ${email}\nTelefone: ${telefone}\nPerfil: ${perfil}\n\n${mensagem}`
      );

      window.location.href = `mailto:${destino}?subject=${subject}&body=${body}`;
      contatoFeedback.textContent = 'Abrindo cliente de email...';
      contatoFeedback.style.color = '#00ffcc';

    } catch (err) {
      console.error('Erro ao enviar:', err);
      contatoFeedback.textContent = 'Erro ao enviar. Tente novamente.';
      contatoFeedback.style.color = '#ff6b6b';
    }
  });
}
