/* ==========================================================================
   GABRIEL JOSÉ — MASTER JAVASCRIPT ENGINE
   Includes: Vertical Theme Bar Controller, Command Palette (⌘+K), Cost Calculator,
   Case Study Modals & Toast System
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --- 1. STATE --- */
  const state = {
    theme: localStorage.getItem('raum_theme') || 'neutral'
  };

  const caseData = {
    'spatial-mirror': {
      title: 'Sistema de Arquitetura & Design de Interfaces',
      desc: 'Conceito de design funcional focando em harmonia geométrica, elementos circulares e navegação fluida por comandos.',
      image: 'imgs/raum_mirror.jpg'
    },
    'wood-shelving': {
      title: 'Sistema Modular de Projetos POO',
      desc: 'Modelagem de software orientada a objetos aplicada a estruturas de dados organizadas e escaláveis.',
      image: 'imgs/raum_shelving.jpg'
    },
    'nova-ai': {
      title: 'Nova AI — Suíte de Inteligência Financeira',
      desc: 'Plataforma web integrando visualizações dinâmicas, modelos preditivos e arquitetura orientada a objetos.',
      image: 'imgs/fintech.jpg'
    },
    'arce-studio': {
      title: 'Arcé Studio — Identidade & Arquitetura Visual',
      desc: 'Design editorial, tipografia minimalista e sistema de componentes para estúdios criativos.',
      image: 'imgs/brand.jpg'
    },
    'aurora-fashion': {
      title: 'Aurora Collective — Plataforma E-Commerce 3D',
      desc: 'Vitrine interativa de produtos com navegação tridimensional e alta performance no navegador.',
      image: 'imgs/ecom.jpg'
    },
    'synapse-saas': {
      title: 'Synapse — Motor de Automação POO',
      desc: 'Interface de canvas para gerenciamento de nós de execução em tempo real.',
      image: 'imgs/saas.jpg'
    }
  };

  /* --- 2. THEME CONTROLLER --- */
  function applyTheme(themeName) {
    state.theme = themeName;
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('raum_theme', themeName);

    document.querySelectorAll('.theme-dot-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === themeName);
    });
  }

  // Init Theme
  applyTheme(state.theme);

  document.querySelectorAll('.theme-dot-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const selected = e.currentTarget.dataset.theme;
      applyTheme(selected);
      showToast(`Tema alterado para: ${selected.toUpperCase()}`);
    });
  });

  /* --- 3. COMMAND PALETTE (⌘+K) --- */
  const cmdModal = document.getElementById('command-palette');
  const cmdInput = document.getElementById('cmd-input');
  const cmdRows = document.querySelectorAll('.cmd-row');

  function openCmdPalette() {
    cmdModal?.classList.add('show');
    cmdInput?.focus();
  }

  function closeCmdPalette() {
    cmdModal?.classList.remove('show');
    if (cmdInput) cmdInput.value = '';
  }

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      cmdModal?.classList.contains('show') ? closeCmdPalette() : openCmdPalette();
    } else if (e.key === 'Escape') {
      closeCmdPalette();
      closeModal('case-study-modal');
      closeModal('calculator-modal');
    }
  });

  document.querySelectorAll('[data-open-cmd]').forEach(el => {
    el.addEventListener('click', openCmdPalette);
  });

  cmdModal?.addEventListener('click', (e) => {
    if (e.target === cmdModal) closeCmdPalette();
  });

  cmdInput?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    cmdRows.forEach(row => {
      const text = row.innerText.toLowerCase();
      row.style.display = text.includes(q) ? 'flex' : 'none';
    });
  });

  cmdRows.forEach(row => {
    row.addEventListener('click', () => {
      const action = row.dataset.action;
      closeCmdPalette();

      if (action === 'nav-home') {
        window.location.href = 'index.html';
      } else if (action === 'nav-sobre') {
        window.location.href = 'sobre.html';
      } else if (action === 'nav-portfolio') {
        if (window.location.pathname.endsWith('sobre.html')) {
          window.location.href = 'index.html#portfolio';
        } else {
          document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (action === 'open-calc') {
        openModal('calculator-modal');
      } else if (action?.startsWith('set-theme-')) {
        const theme = action.replace('set-theme-', '');
        applyTheme(theme);
        showToast(`Tema alterado: ${theme.toUpperCase()}`);
      }
    });
  });

  /* --- 4. CASE STUDY MODAL --- */
  document.querySelectorAll('[data-open-case]').forEach(card => {
    card.addEventListener('click', () => {
      const key = card.dataset.openCase;
      const data = caseData[key];
      if (data) {
        document.getElementById('modal-case-title').textContent = data.title;
        document.getElementById('modal-case-desc').textContent = data.desc;
        document.getElementById('modal-case-img').src = data.image;
        openModal('case-study-modal');
      }
    });
  });

  /* --- 5. CALCULATOR MODAL --- */
  document.querySelectorAll('[data-calc-type]').forEach(box => {
    box.addEventListener('click', () => {
      document.querySelectorAll('[data-calc-type]').forEach(b => b.classList.remove('selected'));
      box.classList.add('selected');
      const price = box.dataset.calcType === 'spatial' ? 'R$ 4.500' : 'R$ 2.800';
      document.getElementById('calc-estimate-price').textContent = price;
    });
  });

  document.getElementById('calc-submit-btn')?.addEventListener('click', () => {
    closeModal('calculator-modal');
    showToast('Solicitação recebida com sucesso! Entraremos em contato em breve.');
  });

  /* --- 6. MODAL HELPERS --- */
  function openModal(id) {
    document.getElementById(id)?.classList.add('show');
  }

  function closeModal(id) {
    document.getElementById(id)?.classList.remove('show');
  }

  document.querySelectorAll('.modal-close-icon').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.target.closest('.modal-overlay')?.classList.remove('show');
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('show');
    });
  });

  /* --- 7. TOAST ENGINE --- */
  function showToast(msg) {
    const existing = document.querySelector('.toast-msg');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.textContent = msg;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
  }

});
