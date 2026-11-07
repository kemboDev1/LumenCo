'use strict';

const ICONS = {
  home: '<path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9M9 20v-6h6v6"/>',
  code: '<path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>',
  book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21z"/><path d="M4 5.5v15M8 7h8M8 11h7"/>',
  shop: '<path d="M4 8h16l-1 12H5L4 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3M9 13v1M15 13v1"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  folder: '<path d="M3 6a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M3 9h18"/>',
  file: '<path d="M13 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10z"/><path d="M13 3v7h7"/>',
  sparkle: '<path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7z"/><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/>',
  chart: '<path d="M4 19V5M4 19h17"/><path d="m7 15 4-4 3 2 6-7"/>',
  pencil: '<path d="m4 16-.8 4.8L8 20l12-12a2.8 2.8 0 0 0-4-4z"/><path d="m14.5 5.5 4 4"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M5.5 7l1 13h11l1-13M9 7V4h6v3"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  save: '<path d="M5 3h12l4 4v14H3V3z"/><path d="M7 3v6h10V3M7 21v-8h10v8"/>',
  award: '<circle cx="12" cy="8" r="6"/><path d="m8.2 13-1.4 8 5.2-3 5.2 3-1.4-8"/>',
  bolt: '<path d="m13 2-3 9h7l-6 11 1-9H5z"/>',
  more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  shield: '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z"/><path d="m9 12 2 2 4-4"/>',
  play: '<path d="m8 5 11 7-11 7z"/>',
  fullscreen: '<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>',
  gamepad: '<line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><rect x="2" y="6" width="20" height="12" rx="6"/>',
  keyboard: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M6 12h.01M18 12h.01M8 16h8"/>',
  crown: '<path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/>',
  gem: '<path d="M6 3h12l4 6-10 13L2 9zM2 9h20M12 22 8 9M12 22l4-13"/>'
};

const appRoot = document.getElementById('app');
const modalRoot = document.getElementById('modal-root');
const toastRoot = document.getElementById('toast-root');

const app = {
  state: null,
  screen: 'workspace', // workspace, editor, compiler, typing, game, leaderboard, shop, plans, profile, admin
  projectId: null,
  filePath: null,
  modal: null,
  shopFilter: 'frame',
  lessonFilter: 'Barchasi',
  dirty: false,
  saveTimer: null,
  saving: false,
  modalLessonId: null,
  pendingPurchaseId: null,
  locale: localStorage.getItem('lumenco-locale') || 'uz',
  backend: 'local',
  authenticated: false,
  authMode: 'signin',
  pendingEmail: '',
  pendingPassword: '',
  authNotice: '',
  
  // Live hover preview in Atomshop matching screenshots
  hoveredShopItem: null,
  
  // Compiler state
  compilerTab: 'html',
  compilerHtml: `<!doctype html>\n<html lang="uz">\n<head>\n  <meta charset="UTF-8">\n  <title>Kompilyator</title>\n  <style>\n    body { font-family: system-ui, sans-serif; display: grid; place-items: center; min-height: 100vh; margin: 0; background: #0f172a; color: #f8fafc; }\n    .box { text-align: center; padding: 40px; border-radius: 20px; background: #1e293b; border: 1px solid #334155; box-shadow: 0 10px 30px rgba(0,0,0,.5); }\n    h1 { color: #38bdf8; margin-bottom: 8px; }\n    button { background: #38bdf8; color: #0f172a; border: 0; padding: 10px 20px; border-radius: 10px; font-weight: 700; cursor: pointer; }\n  </style>\n</head>\n<body>\n  <div class="box">\n    <h1>Salom, Atomjs & LumenCo!</h1>\n    <p>Brauzerdagi to‘liq kod laboratoriyasi.</p>\n    <button onclick="salom()">Meni bos</button>\n  </div>\n  <script>\n    function salom() {\n      console.log('Tugma bosildi!');\n      alert('Kompilyator muvaffaqiyatli ishlayapti!');\n    }\n  </script>\n</body>\n</html>`,
  compilerCss: `/* CSS kodlaringizni shu yerda yozing */\nbody {\n  margin: 0;\n}`,
  compilerJs: `// JavaScript kodingiz\nconsole.log('LumenCo Kompilyator tayyor!');`,
  compilerConsole: ['[Tizim] Kompilyator konsoli ishga tushdi.'],
  
  // Speed typing game state
  typingText: 'const createFuture = (code, passion) => code.build() && passion.grow();',
  typingIndex: 0,
  typingMistakes: 0,
  typingStartTime: null,
  typingTimeLeft: 60,
  typingTimer: null,
  typingFinished: false,
  typingWpm: 0,
  typingAcc: 100,

  // Duolingo-style Pet state
  petBubbleIndex: 0,
  petPhrases: [
    'Salom! Kod yozishga tayyormisan?',
    'Kompilyatorni ochib yangi g‘oya yarat!',
    'Tez yozishda yangi rekord qo‘yib coin to‘pla!',
    'Pro va Max darslarida ko‘proq XP kutmoqda!',
    'Atomshopdan yangi animatsiyali ramka ol!'
  ]
};

function icon(name) {
  return `<span class="icon" aria-hidden="true"><svg viewBox="0 0 24 24">${ICONS[name] || ''}</svg></span>`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatNumber(value) {
  return new Intl.NumberFormat('uz-UZ').format(Number(value) || 0);
}

function toast(message, type = 'info') {
  const el = document.createElement('div');
  el.className = `toast ${type === 'error' ? 'error' : ''}`;
  el.innerHTML = `<span>${type === 'error' ? '⚠️' : '✨'}</span><span>${escapeHtml(message)}</span>`;
  toastRoot.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';
    el.style.transition = 'all .3s ease';
    setTimeout(() => el.remove(), 350);
  }, 3200);
}
window.toast = toast;

function setLocale(lang) {
  app.locale = lang;
  localStorage.setItem('lumenco-locale', lang);
  render();
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
}

async function request(url, options = {}) {
  return LumenBackend.apiRequest(url, options);
}

function getProject() {
  return app.state?.projects?.find((p) => p.id === app.projectId) || app.state?.projects?.[0] || null;
}

function getSelectedFile() {
  const project = getProject();
  if (!project || !app.filePath || !Object.hasOwn(project.files, app.filePath)) return null;
  return { path: app.filePath, content: project.files[app.filePath] };
}

function openModal(kind) {
  app.modal = kind;
  renderModal();
}

function closeModal() {
  app.modal = null;
  modalRoot.innerHTML = '';
}

function navigate(screenName) {
  app.screen = screenName;
  if (screenName === 'typing') initTypingGame();
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ==========================================================================
   TOPBAR COMPONENT (MATCHING ATOMJS IMAGE 1)
   ========================================================================== */
function renderTopbar() {
  const profile = app.state.profile;
  const isAdmin = profile.role === 'admin';

  return `
    <header class="atom-header">
      <div style="display:flex;align-items:center;gap:20px;min-width:0">
        <a class="atom-logo-group" href="#" data-action="navigate" data-screen="workspace">
          <div class="atom-logo-icon">⚛</div>
          <div class="atom-logo-text">atom<span>js</span></div>
        </a>
        
        <nav class="atom-nav">
          <button class="atom-nav-tab ${app.screen === 'lessons' ? 'active' : ''}" type="button" data-action="navigate" data-screen="lessons">
            <span class="tab-icon">⚛</span> <span>atomlearn</span>
          </button>
          <button class="atom-nav-tab ${app.screen === 'compiler' ? 'active' : ''}" type="button" data-action="navigate" data-screen="compiler">
            <span class="tab-icon">&gt;_</span> <span>Kompilyator</span>
          </button>
          <button class="atom-nav-tab ${app.screen === 'workspace' || app.screen === 'editor' ? 'active' : ''}" type="button" data-action="navigate" data-screen="workspace">
            <span class="tab-icon">⊞</span> <span>Web</span>
          </button>
          <button class="atom-nav-tab ${app.screen === 'game' ? 'active' : ''}" type="button" data-action="navigate" data-screen="game">
            <span class="tab-icon">🎮</span> <span>O‘ynash</span>
          </button>
          <button class="atom-nav-tab ${app.screen === 'typing' ? 'active' : ''}" type="button" data-action="navigate" data-screen="typing">
            <span class="tab-icon">⌨️</span> <span>Tez yozish</span>
          </button>
          <button class="atom-nav-tab ${app.screen === 'leaderboard' ? 'active' : ''}" type="button" data-action="navigate" data-screen="leaderboard">
            <span class="tab-icon">👑</span> <span>Reyting</span>
          </button>
          <button class="atom-nav-tab ${app.screen === 'shop' ? 'active' : ''}" type="button" data-action="navigate" data-screen="shop">
            <span class="tab-icon">🛍️</span> <span>atomshop</span>
          </button>
          <button class="atom-nav-tab ${app.screen === 'plans' ? 'active' : ''}" type="button" data-action="navigate" data-screen="plans">
            <span class="tab-icon">💎</span> <span>Tariflar</span>
          </button>
          ${isAdmin ? `
            <button class="atom-nav-tab ${app.screen === 'admin' ? 'active' : ''}" type="button" data-action="navigate" data-screen="admin" style="color:#ef4444;border-color:rgba(239,68,68,0.3)">
              <span class="tab-icon">🛡️</span> <span>Admin</span>
            </button>
          ` : ''}
        </nav>
      </div>

      <div class="atom-top-actions">
        <button class="atom-pill-btn" type="button" data-action="toggle-fullscreen" title="To‘liq ekran">
          ${icon('fullscreen')}
        </button>

        <select class="atom-pill-btn" style="cursor:pointer;padding-right:24px" data-locale-picker>
          <option value="uz" ${app.locale === 'uz' ? 'selected' : ''}>⚙️ Ózb</option>
          <option value="en" ${app.locale === 'en' ? 'selected' : ''}>⚙️ EN</option>
          <option value="ru" ${app.locale === 'ru' ? 'selected' : ''}>⚙️ RU</option>
        </select>

        <button class="atom-pill-btn atom-streak-pill" type="button" data-action="navigate" data-screen="profile" title="Kundalik faollik (Streak)">
          🔥 ${app.state.streak || 1}
        </button>

        <button class="atom-pill-btn atom-coin-pill" type="button" data-action="navigate" data-screen="shop">
          🪙 ${formatNumber(app.state.coins)}
        </button>

        <button class="atom-profile-pill" type="button" data-action="navigate" data-screen="profile">
          <div class="avatar-mini">MU</div>
          <div class="profile-texts">
            <strong>${escapeHtml(profile.name)}</strong>
            <small>@${escapeHtml(profile.username)}</small>
          </div>
        </button>
      </div>
    </header>
  `;
}

/* ==========================================================================
   DUOLINGO-STYLE AI PET ("LUMI")
   ========================================================================== */
function renderPetWidget() {
  const profile = app.state?.profile;
  const pet = profile?.petConfig || { name: 'Lumi', hat: 'crown', glasses: 'vr', color: 'cyan' };
  const currentPhrase = app.petPhrases[app.petBubbleIndex % app.petPhrases.length];

  const hatSvg = pet.hat === 'crown' ? '👑' : pet.hat === 'wizard' ? '🧙' : pet.hat === 'beanie' ? '🧢' : '';
  const glassesSvg = pet.glasses === 'vr' ? '🥽' : pet.glasses === 'sunglasses' ? '🕶️' : pet.glasses === 'neon' ? '👓' : '';
  const colorBg = pet.color === 'lime' ? 'linear-gradient(135deg, #10b981, #047857)' :
                  pet.color === 'gold' ? 'linear-gradient(135deg, #f59e0b, #b45309)' :
                  pet.color === 'purple' ? 'linear-gradient(135deg, #a855f7, #7e22ce)' :
                  'linear-gradient(135deg, #0284c7, #0369a1)';

  return `
    <div class="lumi-widget" id="lumi-container">
      <div class="lumi-bubble" data-action="pet-talk">
        <strong style="color:var(--cyan);display:block;margin-bottom:2px">${escapeHtml(pet.name)} (AI Ustoz):</strong>
        <span>${escapeHtml(currentPhrase)}</span>
        <div style="margin-top:6px;display:flex;gap:6px">
          <button style="color:var(--cyan);font-size:10px;font-weight:700" type="button" data-action="pet-talk">Keyingisi 💬</button>
          ${profile?.plan === 'max' || profile?.role === 'admin' ? `
            <button style="color:var(--orange);font-size:10px;font-weight:700" type="button" data-action="open-pet-wardrobe">Garderob 👒</button>
          ` : ''}
        </div>
      </div>
      <div class="lumi-pet-avatar" style="background:${colorBg}" data-action="pet-talk" title="${escapeHtml(pet.name)} ustoz">
        <div style="position:relative;display:grid;place-items:center;font-size:24px">
          ${hatSvg ? `<span style="position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:18px">${hatSvg}</span>` : ''}
          ${glassesSvg ? `<span style="position:absolute;top:-2px;left:50%;transform:translateX(-50%);font-size:16px">${glassesSvg}</span>` : ''}
          <span>🤖</span>
        </div>
      </div>
    </div>
  `;
}

/* ==========================================================================
   SCREEN: KOMPILYATOR (BROWSER CODE LABORATORY)
   ========================================================================== */
function renderCompiler() {
  const currentTheme = app.state.profile.themeItem || 'theme-dracula';

  return `
    <div class="compiler-page">
      <div class="compiler-toolbar">
        <div class="compiler-tool-actions">
          <button class="atom-btn atom-btn-primary" type="button" data-action="run-compiler">
            ${icon('play')} <span>Ishga tushirish</span>
          </button>
          <button class="atom-btn atom-btn-secondary" type="button" data-action="reset-compiler">
            <span>Tozalash</span>
          </button>
          <button class="atom-btn atom-btn-secondary" type="button" data-action="save-compiler-to-project">
            ${icon('save')} <span>Loyiha sifatida saqlash</span>
          </button>
        </div>

        <div class="compiler-tabs">
          <button class="compiler-tab ${app.compilerTab === 'html' ? 'active' : ''}" type="button" data-action="compiler-tab" data-tab="html">HTML</button>
          <button class="compiler-tab ${app.compilerTab === 'css' ? 'active' : ''}" type="button" data-action="compiler-tab" data-tab="css">CSS</button>
          <button class="compiler-tab ${app.compilerTab === 'js' ? 'active' : ''}" type="button" data-action="compiler-tab" data-tab="js">JS</button>
          <button class="compiler-tab ${app.compilerTab === 'console' ? 'active' : ''}" type="button" data-action="compiler-tab" data-tab="console">Konsol</button>
        </div>

        <div style="display:flex;gap:10px;align-items:center">
          <label style="font-size:12px;color:var(--muted-light)">Shablon:</label>
          <select class="atom-pill-btn" data-action="compiler-load-template" style="cursor:pointer">
            <option value="hello">Salom Dunyo</option>
            <option value="clock">Raqamli Soat</option>
            <option value="ball">Animatsiyali Koptok</option>
            <option value="todo">Todo Dasturi</option>
          </select>
        </div>
      </div>

      <div class="compiler-workspace">
        <div class="compiler-editor-pane">
          <div style="padding:8px 16px;background:rgba(255,255,255,0.02);border-bottom:1px solid var(--border-subtle);display:flex;justify-content:space-between;font-size:11px;color:var(--muted)">
            <span>${app.compilerTab.toUpperCase()} MUHARRIRI</span>
            <span>Mavzu: ${escapeHtml(currentTheme)}</span>
          </div>
          <textarea id="compiler-input" class="compiler-code-input" spellcheck="false" data-role="compiler-input">${escapeHtml(app.compilerTab === 'html' ? app.compilerHtml : app.compilerTab === 'css' ? app.compilerCss : app.compilerTab === 'js' ? app.compilerJs : app.compilerConsole.join('\n'))}</textarea>
        </div>

        <div class="compiler-preview-pane">
          <div style="padding:8px 16px;background:#0f172a;border-bottom:1px solid var(--border-subtle);display:flex;justify-content:space-between;font-size:11px;color:var(--muted)">
            <span>NATIJA KO‘RINISHI (SANDBOX)</span>
            <span style="color:var(--lime)">● Jonli natija</span>
          </div>
          <iframe id="compiler-preview-frame" class="compiler-iframe" sandbox="allow-scripts" title="Natija"></iframe>
          <div class="compiler-console-box">
            <div style="font-weight:700;margin-bottom:4px;color:var(--cyan)">KONSOL JURNALI:</div>
            ${app.compilerConsole.map((line) => `<div class="console-line info">&gt; ${escapeHtml(line)}</div>`).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function runCompilerCode() {
  const frame = document.getElementById('compiler-preview-frame');
  if (!frame) return;

  const html = app.compilerHtml;
  const css = `<style>${app.compilerCss}</style>`;
  const js = `
    <script>
      const _origLog = console.log;
      console.log = function(...args) {
        _origLog.apply(console, args);
        window.parent.postMessage({ type: 'compiler-console', text: args.join(' ') }, '*');
      };
      window.onerror = function(msg) {
        window.parent.postMessage({ type: 'compiler-console', text: 'Xato: ' + msg }, '*');
      };
      ${app.compilerJs}
    <\/script>
  `;

  frame.srcdoc = `${css}\n${html}\n${js}`;
  app.compilerConsole.push(`[${new Date().toLocaleTimeString()}] Kod ishga tushirildi.`);
}

/* ==========================================================================
   SCREEN: SPEED TYPING GAME (TEZ YOZISH & O'YNASH)
   ========================================================================== */
const TYPING_SNIPPETS = [
  'const developer = { name: "Muhammadbek", skill: "Fullstack", focus: "AI" };',
  'function buildFuture(ideas, grit) { return ideas.map(idea => create(idea)); }',
  'document.querySelectorAll(".btn").forEach(b => b.addEventListener("click", run));',
  'const fibonacci = (n) => n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2);',
  'import { createClient } from "@supabase/supabase-js"; const db = createClient();'
];

function initTypingGame() {
  app.typingText = TYPING_SNIPPETS[Math.floor(Math.random() * TYPING_SNIPPETS.length)];
  app.typingIndex = 0;
  app.typingMistakes = 0;
  app.typingStartTime = null;
  app.typingTimeLeft = 60;
  app.typingFinished = false;
  app.typingWpm = 0;
  app.typingAcc = 100;
  if (app.typingTimer) clearInterval(app.typingTimer);
}

function startTypingTimer() {
  if (app.typingStartTime) return;
  app.typingStartTime = Date.now();
  app.typingTimer = setInterval(() => {
    app.typingTimeLeft -= 1;
    if (app.typingTimeLeft <= 0) {
      clearInterval(app.typingTimer);
      finishTypingGame();
    } else {
      updateTypingStats();
      const timeBox = document.getElementById('typing-time');
      if (timeBox) timeBox.textContent = `${app.typingTimeLeft}s`;
    }
  }, 1000);
}

function updateTypingStats() {
  const seconds = Math.max(1, (Date.now() - (app.typingStartTime || Date.now())) / 1000);
  const words = app.typingIndex / 5;
  app.typingWpm = Math.round((words / seconds) * 60);
  const total = app.typingIndex + app.typingMistakes;
  app.typingAcc = total > 0 ? Math.round((app.typingIndex / total) * 100) : 100;

  const wpmEl = document.getElementById('typing-wpm');
  const accEl = document.getElementById('typing-acc');
  if (wpmEl) wpmEl.textContent = `${app.typingWpm}`;
  if (accEl) accEl.textContent = `${app.typingAcc}%`;
}

async function finishTypingGame() {
  app.typingFinished = true;
  if (app.typingTimer) clearInterval(app.typingTimer);
  updateTypingStats();
  try {
    app.state = await request('/api/game/record', {
      method: 'POST',
      body: JSON.stringify({ wpm: app.typingWpm, accuracy: app.typingAcc })
    });
    toast(`G‘alaba! +50 XP va +30 Coin hisobingizga qo‘shildi!`);
  } catch (err) {
    toast(err.message, 'error');
  }
  render();
}

function renderTypingGame() {
  return `
    <div class="typing-arena">
      <div class="page-title-bar" style="text-align:center">
        <h1>⌨️ Tez Yozish Arena</h1>
        <p>Haqiqiy JavaScript kodlarini tez va xatosiz yozib, reytingingizni oshiring!</p>
      </div>

      <div class="typing-hud">
        <div class="hud-box wpm">
          <span>Tezlik</span>
          <strong id="typing-wpm">${app.typingWpm}</strong>
          <small style="color:var(--muted)">WPM</small>
        </div>
        <div class="hud-box acc">
          <span>Aniqlik</span>
          <strong id="typing-acc">${app.typingAcc}%</strong>
        </div>
        <div class="hud-box time">
          <span>Qolgan vaqt</span>
          <strong id="typing-time">${app.typingTimeLeft}s</strong>
        </div>
        <div class="hud-box">
          <span>Xatolar</span>
          <strong style="color:var(--danger)" id="typing-mistakes">${app.typingMistakes}</strong>
        </div>
      </div>

      ${app.typingFinished ? `
        <div class="atom-panel" style="text-align:center;padding:40px;margin-bottom:24px">
          <div style="font-size:54px;margin-bottom:12px">🏆</div>
          <h2>Ajoyib natija!</h2>
          <p style="color:var(--muted-light)">Tezligingiz: <strong>${app.typingWpm} WPM</strong> | Aniqlik: <strong>${app.typingAcc}%</strong></p>
          <div style="margin:20px 0;color:var(--lime);font-weight:700">+50 XP va +30 Coin berildi!</div>
          <button class="atom-btn atom-btn-primary" type="button" data-action="restart-typing">Yana o‘ynash 🔄</button>
        </div>
      ` : `
        <div class="typing-terminal" id="typing-arena-box" tabindex="0">
          <input type="text" id="typing-hidden-input" class="typing-hidden-input" autocomplete="off" autofocus />
          <div id="typing-display-text">
            ${app.typingText.split('').map((char, index) => {
              let cls = 'typing-char pending';
              if (index < app.typingIndex) cls = 'typing-char correct';
              else if (index === app.typingIndex) cls = 'typing-char current';
              return `<span class="${cls}">${escapeHtml(char)}</span>`;
            }).join('')}
          </div>
        </div>
        <p style="text-align:center;color:var(--muted);font-size:12px;margin-top:14px">Klaviaturadan to‘g‘ridan-to‘g‘ri kodni yozing. Bo‘sh joy uchun probel bosing.</p>
      `}
    </div>
  `;
}

function renderGameHub() {
  return `
    <div style="max-width:1000px;margin:0 auto">
      <div class="page-title-bar">
        <h1>🎮 O‘yinlar & Kod Mashg‘ulotlari</h1>
        <p>Qiziqarli o‘yinlar orqali dasturlash ko‘nikmalaringizni charxlang va coin to‘plang.</p>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:20px;margin-top:24px">
        <div class="atom-panel" style="display:flex;flex-direction:column;justify-content:space-between">
          <div>
            <div style="font-size:36px;margin-bottom:14px">⌨️</div>
            <h3>Tez Yozish Musobaqasi</h3>
            <p style="color:var(--muted-light);font-size:13px;line-height:1.5">Kod yozish tezligingizni (WPM) sinab ko‘ring va har bir g‘alaba uchun coin oling.</p>
          </div>
          <button class="atom-btn atom-btn-orange" style="margin-top:20px" type="button" data-action="navigate" data-screen="typing">Boshlash ▶</button>
        </div>

        <div class="atom-panel" style="display:flex;flex-direction:column;justify-content:space-between">
          <div>
            <div style="font-size:36px;margin-bottom:14px">🔬</div>
            <h3>Brauzer Kompilyatori</h3>
            <p style="color:var(--muted-light);font-size:13px;line-height:1.5">Jonli HTML, CSS va JS laboratoriyasida ijod qiling va shablonlar yarating.</p>
          </div>
          <button class="atom-btn atom-btn-primary" style="margin-top:20px" type="button" data-action="navigate" data-screen="compiler">Laboratoriyani ochish 🚀</button>
        </div>

        <div class="atom-panel" style="display:flex;flex-direction:column;justify-content:space-between">
          <div>
            <div style="font-size:36px;margin-bottom:14px">💎</div>
            <h3>Obunalar & Mukofotlar</h3>
            <p style="color:var(--muted-light);font-size:13px;line-height:1.5">Pro va Max tariflari orqali 2x-3x coin bonuslari va AI ustozi Lumi yordamini oling.</p>
          </div>
          <button class="atom-btn atom-btn-secondary" style="margin-top:20px" type="button" data-action="navigate" data-screen="plans">Tariflarni ko‘rish 💎</button>
        </div>
      </div>
    </div>
  `;
}

/* ==========================================================================
   SCREEN: ATOMSHOP (DO'KON) WITH LIVE RIGHT STICKY PREVIEW
   ========================================================================== */
function renderShop() {
  const profile = app.state.profile;
  const items = app.state.shopItems || [];
  const filtered = items.filter((it) => it.kind === app.shopFilter);

  // Live preview priority: hovered item -> equipped item
  const activeFrame = app.hoveredShopItem?.kind === 'frame' ? app.hoveredShopItem.id : (profile.frameItem || 'frame-yalpiz');
  const activeBg = app.hoveredShopItem?.kind === 'bg' ? app.hoveredShopItem.id : (profile.bgItem || 'bg-yalpiz');

  return `
    <div class="shop-container">
      <div>
        <div class="page-title-bar">
          <h1>${escapeHtml(app.shopFilter === 'frame' ? 'Animatsiyali ramkalar' : app.shopFilter === 'bg' ? 'Fonlar' : app.shopFilter === 'theme' ? 'Muharrir temalari' : 'Avatarlar & Pet')}</h1>
          <p>Qatoringiz atrofida aylanib turadi — o‘yin va tez yozish reytingida, podiumda va lobbyda.</p>
        </div>

        <div class="shop-tabs-bar">
          <button class="shop-tab-btn ${app.shopFilter === 'frame' ? 'active' : ''}" type="button" data-action="shop-filter" data-filter="frame">Animatsiyali ramkalar</button>
          <button class="shop-tab-btn ${app.shopFilter === 'bg' ? 'active' : ''}" type="button" data-action="shop-filter" data-filter="bg">Fonlar</button>
          <button class="shop-tab-btn ${app.shopFilter === 'theme' ? 'active' : ''}" type="button" data-action="shop-filter" data-filter="theme">Muharrir temalari</button>
          <button class="shop-tab-btn ${app.shopFilter === 'avatar' ? 'active' : ''}" type="button" data-action="shop-filter" data-filter="avatar">Avatarlar</button>
          <button class="shop-tab-btn ${app.shopFilter === 'pet' ? 'active' : ''}" type="button" data-action="shop-filter" data-filter="pet">Pet buyumlari</button>
        </div>

        <div class="shop-items-grid">
          ${filtered.map((item) => {
            const owned = app.state.inventory?.includes(item.id);
            const isEquipped = profile.frameItem === item.id || profile.bgItem === item.id || profile.themeItem === item.id;

            return `
              <div class="shop-item-card ${isEquipped ? 'is-equipped' : ''}" data-action="hover-shop-item" data-item-id="${escapeHtml(item.id)}">
                <div class="shop-card-preview ${item.kind === 'bg' ? item.id : ''}">
                  ${item.isRare ? `<span class="rare-badge">+ NOYOB</span>` : ''}
                  <div class="preview-row-pill ${item.kind === 'frame' ? item.id : ''}">
                    <span>1 Ism</span>
                    <span style="color:var(--muted)">9 480</span>
                  </div>
                </div>
                <div class="shop-item-name">${escapeHtml(item.name)}</div>
                <div class="shop-item-desc">${escapeHtml(item.description)}</div>

                ${isEquipped ? `
                  <button class="shop-item-action equipped" type="button" data-action="equip-item" data-item-id="${escapeHtml(item.id)}">
                    ${icon('check')} Taqilgan
                  </button>
                ` : owned ? `
                  <button class="shop-item-action owned" type="button" data-action="equip-item" data-item-id="${escapeHtml(item.id)}">
                    Taqish
                  </button>
                ` : `
                  <button class="shop-item-action" type="button" data-action="buy-item" data-item-id="${escapeHtml(item.id)}">
                    🪙 ${formatNumber(item.price)}
                  </button>
                `}
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Right Sticky Live Preview matching Atomjs screenshot 2 & 3 -->
      <aside class="shop-sticky-preview">
        <div class="preview-kicker">PROFILINGIZ</div>
        <div class="preview-profile-card ${activeBg} ${activeFrame}">
          <div class="preview-profile-avatar">MU</div>
          <div class="preview-profile-details">
            <strong>${escapeHtml(profile.name)}</strong>
            <small>@${escapeHtml(profile.username)}</small>
          </div>
        </div>

        <div class="preview-kicker">REYTİNGDA</div>
        <div class="preview-leaderboard-row ${activeBg} ${activeFrame}">
          <div style="display:flex;align-items:center">
            <span class="preview-rank-badge">1</span>
            <span>${escapeHtml(profile.name)}</span>
          </div>
          <strong style="color:#ffffff">${formatNumber(app.state.codeScore || 9480)}</strong>
        </div>

        <p class="preview-hint-text">
          Buyum ustiga olib boring (telefonda — rasmini bosing): profilingizda qanday ko‘rinishini shu yerda ko‘rasiz.
        </p>
      </aside>
    </div>
  `;
}

/* ==========================================================================
   SCREEN: LEADERBOARD (REYTING) PODIUM & RANKING
   ========================================================================== */
function renderLeaderboard() {
  const users = app.state.adminUsers?.length ? app.state.adminUsers : [
    { name: 'Muhammadbek Rafiqov', username: 'kembodev', xp: 9480, streak: 12, frame: 'frame-noyob', bg: 'bg-laboratoriya' },
    { name: 'Jasurbek Developer', username: 'jasur_js', xp: 8120, streak: 7, frame: 'frame-olov', bg: 'bg-shom' },
    { name: 'Malika Frontend', username: 'malika_code', xp: 7450, streak: 5, frame: 'frame-shafaq', bg: 'bg-konfet' },
    { name: 'Bekzod Backend', username: 'bekzod_node', xp: 4320, streak: 3, frame: 'frame-okean', bg: 'bg-okean' },
    { name: 'Aziza AI Engineer', username: 'aziza_ai', xp: 6890, streak: 9, frame: 'frame-kiber', bg: 'bg-nuqtalar' }
  ];

  const sorted = [...users].sort((a, b) => (b.xp || 0) - (a.xp || 0));
  const top1 = sorted[0];
  const top2 = sorted[1];
  const top3 = sorted[2];

  return `
    <div style="max-width:1000px;margin:0 auto">
      <div class="page-title-bar" style="text-align:center">
        <h1>👑 Dasturchilar Reytingi</h1>
        <p>LumenCo platformasidagi eng faol kod ijodkorlari va haftalik peshqadamlar.</p>
      </div>

      <!-- Top 3 Podium matching atomjs -->
      <div class="podium-container">
        <!-- 2nd Place -->
        <div class="podium-slot second">
          <div class="podium-avatar-wrap">
            <div class="preview-profile-avatar ${top2?.frame || ''}" style="width:64px;height:64px">🥈</div>
          </div>
          <strong style="margin-bottom:2px;font-size:13px">${escapeHtml(top2?.name || 'Jasurbek')}</strong>
          <span style="color:var(--cyan);font-weight:700;font-size:12px;margin-bottom:8px">${formatNumber(top2?.xp || 8120)} XP</span>
          <div class="podium-pedestal">2-O‘rin</div>
        </div>

        <!-- 1st Place (Gold with crown) -->
        <div class="podium-slot first">
          <div class="podium-avatar-wrap">
            <span class="podium-crown">👑</span>
            <div class="preview-profile-avatar ${top1?.frame || 'frame-noyob'}" style="width:76px;height:76px">MU</div>
          </div>
          <strong style="margin-bottom:2px;font-size:14px;color:#facc15">${escapeHtml(top1?.name || 'Muhammadbek Rafiqov')}</strong>
          <span style="color:var(--gold);font-weight:800;font-size:13px;margin-bottom:8px">${formatNumber(top1?.xp || 9480)} XP</span>
          <div class="podium-pedestal">1-O‘rin</div>
        </div>

        <!-- 3rd Place -->
        <div class="podium-slot third">
          <div class="podium-avatar-wrap">
            <div class="preview-profile-avatar ${top3?.frame || ''}" style="width:58px;height:58px">🥉</div>
          </div>
          <strong style="margin-bottom:2px;font-size:13px">${escapeHtml(top3?.name || 'Malika')}</strong>
          <span style="color:var(--orange);font-weight:700;font-size:12px;margin-bottom:8px">${formatNumber(top3?.xp || 7450)} XP</span>
          <div class="podium-pedestal">3-O‘rin</div>
        </div>
      </div>

      <!-- Table Ranking -->
      <table class="leaderboard-table">
        <tbody>
          ${sorted.map((user, idx) => {
            const isMe = user.username === app.state.profile.username || user.email === app.state.profile.email;
            return `
              <tr class="leaderboard-row ${isMe ? 'highlighted' : ''} ${user.bg || ''}">
                <td class="leaderboard-cell" style="width:50px;font-weight:800;color:var(--cyan)">#${idx + 1}</td>
                <td class="leaderboard-cell">
                  <div style="display:flex;align-items:center;gap:12px">
                    <div class="avatar-mini ${user.frame || ''}">MU</div>
                    <div>
                      <strong>${escapeHtml(user.name)}</strong>
                      <small style="color:var(--muted-light);display:block">@${escapeHtml(user.username)}</small>
                    </div>
                  </div>
                </td>
                <td class="leaderboard-cell" style="color:var(--orange);font-weight:700">🔥 ${user.streak || 1}</td>
                <td class="leaderboard-cell" style="text-align:right;font-weight:800;font-size:15px;color:#ffffff">
                  ${formatNumber(user.xp || 0)} <span style="font-size:11px;color:var(--muted)">XP</span>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

/* ==========================================================================
   SCREEN: SUBSCRIPTION PLANS ("TARIFLAR / PLANS")
   ========================================================================== */
function renderPlans() {
  const currentPlan = app.state.profile.plan || 'free';

  return `
    <div style="max-width:1100px;margin:0 auto">
      <div class="page-title-bar" style="text-align:center">
        <h1>💎 Obuna Ta’riflari (Plans)</h1>
        <p>Bilimingizni kengaytiring, AI ustozi bilan o‘rganing va professional dasturchi bo‘ling.</p>
      </div>

      <div class="plans-grid">
        <!-- FREE PLAN -->
        <div class="plan-card ${currentPlan === 'free' ? 'featured' : ''}">
          <h3>Free (Boshlang‘ich)</h3>
          <p style="color:var(--muted);font-size:13px">Dasturlashga endi qadam qo‘yayotganlar uchun.</p>
          <div class="plan-price">0 so‘m <span>/ umrbod bepul</span></div>
          <ul class="plan-features-list">
            <li class="plan-feature-item"><span class="check">✓</span> 20 ta dars (Medium daraja)</li>
            <li class="plan-feature-item"><span class="check">✓</span> Oddiy profil foni va shablonlar</li>
            <li class="plan-feature-item"><span class="check">✓</span> Brauzer kompilyatori (Asosiy)</li>
            <li class="plan-feature-item"><span class="check">✓</span> Loyihalar yaratish</li>
          </ul>
          ${currentPlan === 'free' ? `
            <button class="atom-btn atom-btn-secondary" disabled>Amaldagi tarif</button>
          ` : `
            <button class="atom-btn atom-btn-secondary" type="button" data-action="select-plan" data-plan="free">Tanlash</button>
          `}
        </div>

        <!-- PRO PLAN -->
        <div class="plan-card ${currentPlan === 'pro' ? 'featured' : ''}">
          <span class="plan-badge pro">Tavsiya etiladi</span>
          <h3>Pro (Kuchli O‘sish)</h3>
          <p style="color:var(--muted);font-size:13px">O‘rta va yuqori darajadagi dasturlash ko‘nikmalari.</p>
          <div class="plan-price">79 000 so‘m <span>/ oy</span></div>
          <div style="color:var(--cyan);font-weight:700;font-size:12px">yoki 500 coin bilan</div>
          <ul class="plan-features-list">
            <li class="plan-feature-item"><span class="check">✓</span> <strong>100 ta dars</strong> (Medium Solid -&gt; High)</li>
            <li class="plan-feature-item"><span class="check">✓</span> <strong>Duolingo uslubidagi AI Pet ("Lumi")</strong> ustoz</li>
            <li class="plan-feature-item"><span class="check">✓</span> Barcha animatsiyali ramkalar va fonlar ochiq</li>
            <li class="plan-feature-item"><span class="check">✓</span> <strong>2x XP va Coin</strong> mukofotlari</li>
            <li class="plan-feature-item"><span class="check">✓</span> Barcha 8 ta muharrir temalari</li>
          </ul>
          ${currentPlan === 'pro' ? `
            <button class="atom-btn atom-btn-primary" disabled>Amaldagi tarif</button>
          ` : `
            <button class="atom-btn atom-btn-primary" type="button" data-action="select-plan" data-plan="pro">Faollashtirish (500 Coin)</button>
          `}
        </div>

        <!-- MAX PLAN -->
        <div class="plan-card max-tier ${currentPlan === 'max' ? 'featured' : ''}">
          <span class="plan-badge max">Ekspert & AI</span>
          <h3>Max (Cheksiz AI & Fullstack)</h3>
          <p style="color:var(--muted);font-size:13px">Katta tizimlar, Sun‘iy Intellekt va to‘liq arxitektura.</p>
          <div class="plan-price">149 000 so‘m <span>/ oy</span></div>
          <div style="color:var(--orange);font-weight:700;font-size:12px">yoki 1 200 coin bilan</div>
          <ul class="plan-features-list">
            <li class="plan-feature-item"><span class="check">✓</span> <strong>350 ta to‘liq dars</strong> (AI, Neyrotarmoqlar, Fullstack)</li>
            <li class="plan-feature-item"><span class="check">✓</span> <strong>To‘liq AI Ustoz</strong>: kodingizni tekshiradi va yo‘naltiradi</li>
            <li class="plan-feature-item"><span class="check">✓</span> <strong>Pet Garderobi</strong>: shlyapa, ko‘zoynak, ranglarni erkin sozlash</li>
            <li class="plan-feature-item"><span class="check">✓</span> <strong>Noyob VIP sariq-qora ramka</strong> va Laboratoriya foni</li>
            <li class="plan-feature-item"><span class="check">✓</span> <strong>3x XP va Coin</strong> mukofotlari</li>
            <li class="plan-feature-item"><span class="check">✓</span> Ustuvor server tezligi va cheksiz loyihalar</li>
          </ul>
          ${currentPlan === 'max' ? `
            <button class="atom-btn atom-btn-orange" disabled>Amaldagi tarif</button>
          ` : `
            <button class="atom-btn atom-btn-orange" type="button" data-action="select-plan" data-plan="max">Faollashtirish (1200 Coin)</button>
          `}
        </div>
      </div>
    </div>
  `;
}

/* ==========================================================================
   SCREEN: ADMIN PANEL (FOR MUHAMMADBEK RAFIQOV / @KEMBODEV)
   ========================================================================== */
function renderAdmin() {
  const users = app.state.adminUsers || [];

  return `
    <div style="max-width:1100px;margin:0 auto">
      <div class="page-title-bar" style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <h1>🛡️ Boshqaruv Markazi (Admin Panel)</h1>
          <p>Foydalanuvchilar, tariflar va xavfsizlik nazorati. Admin: <strong>Muhammadbek Rafiqov (@kembodev)</strong></p>
        </div>
        <button class="atom-btn atom-btn-secondary" type="button" data-action="reload-admin">Ma’lumotlarni yangilash</button>
      </div>

      <div class="admin-stats-grid">
        <div class="admin-stat-card">
          <span>Jami foydalanuvchilar</span>
          <strong>${users.length}</strong>
        </div>
        <div class="admin-stat-card">
          <span>Faol tariflar</span>
          <strong style="color:var(--cyan)">Max (2) · Pro (2)</strong>
        </div>
        <div class="admin-stat-card">
          <span>Bloklanganlar</span>
          <strong style="color:var(--danger)">${users.filter((u) => u.isBanned).length}</strong>
        </div>
        <div class="admin-stat-card">
          <span>Tizim holati</span>
          <strong style="color:var(--lime)">Online ●</strong>
        </div>
      </div>

      <div class="atom-panel" style="overflow-x:auto">
        <h3 style="margin-top:0">Foydalanuvchilar ro‘yxati</h3>
        <table class="admin-users-table">
          <thead>
            <tr>
              <th>Foydalanuvchi</th>
              <th>Email</th>
              <th>Tarif</th>
              <th>Coin / XP</th>
              <th>Holat</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            ${users.map((u) => `
              <tr>
                <td>
                  <strong>${escapeHtml(u.name)}</strong>
                  <small style="color:var(--muted);display:block">@${escapeHtml(u.username)}</small>
                </td>
                <td style="color:var(--muted-light)">${escapeHtml(u.email)}</td>
                <td>
                  <select class="atom-pill-btn" data-action="admin-change-plan" data-user-id="${escapeHtml(u.id)}">
                    <option value="free" ${u.plan === 'free' ? 'selected' : ''}>Free</option>
                    <option value="pro" ${u.plan === 'pro' ? 'selected' : ''}>Pro</option>
                    <option value="max" ${u.plan === 'max' ? 'selected' : ''}>Max</option>
                  </select>
                </td>
                <td>
                  <strong>🪙 ${formatNumber(u.coins || 0)}</strong> · ${formatNumber(u.xp || 0)} XP
                </td>
                <td>
                  <span class="user-status-pill ${u.isBanned ? 'banned' : 'active'}">
                    ${u.isBanned ? '🚫 Bloklangan' : '✅ Faol'}
                  </span>
                </td>
                <td>
                  <div style="display:flex;gap:6px">
                    <button class="atom-btn ${u.isBanned ? 'atom-btn-secondary' : 'atom-btn-danger'}" style="padding:4px 10px;font-size:11px" type="button" data-action="admin-toggle-ban" data-user-id="${escapeHtml(u.id)}">
                      ${u.isBanned ? 'Blokdan chiqarish' : 'Ban qilish'}
                    </button>
                    <button class="atom-btn atom-btn-secondary" style="padding:4px 10px;font-size:11px" type="button" data-action="admin-give-coins" data-user-id="${escapeHtml(u.id)}">
                      🪙 +500 Coin
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/* ==========================================================================
   SCREEN: LESSONS (DARSLAR)
   ========================================================================== */
function renderLessons() {
  const allLessons = app.state.lessons || [];
  const tracks = ['Barchasi', ...new Set(allLessons.map((l) => l.track))];
  const filtered = allLessons.filter((l) => app.lessonFilter === 'Barchasi' || l.track === app.lessonFilter);

  return `
    <div>
      <div class="page-title-bar">
        <h1>⚛️ Darslar & Kod Mashg‘ulotlari</h1>
        <p>Har bir darsni o‘rganing, amaliy topshiriqni bajaring va coin/XP mukofotlariga ega bo‘ling.</p>
      </div>

      <div class="shop-tabs-bar">
        ${tracks.map((t) => `
          <button class="shop-tab-btn ${app.lessonFilter === t ? 'active' : ''}" type="button" data-action="lesson-filter" data-filter="${escapeHtml(t)}">${escapeHtml(t)}</button>
        `).join('')}
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(280px, 1fr));gap:16px">
        ${filtered.map((l) => {
          const completed = app.state.completedLessons?.includes(l.id);
          return `
            <div class="atom-panel" style="display:flex;flex-direction:column;justify-content:space-between">
              <div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
                  <span style="font-size:11px;font-weight:700;color:var(--cyan)">${escapeHtml(l.track)}</span>
                  <span class="user-status-pill active">${escapeHtml(l.level)}</span>
                </div>
                <h3 style="margin:0 0 8px;font-size:16px">${escapeHtml(l.title)}</h3>
                <div style="font-size:12px;color:var(--muted)">⏱️ ${escapeHtml(l.duration)} · +${l.xp} XP</div>
              </div>
              <div style="margin-top:16px;display:flex;justify-content:space-between;align-items:center">
                <span style="font-weight:700;color:var(--gold)">🪙 +${l.coins} coin</span>
                <button class="atom-btn ${completed ? 'atom-btn-secondary' : 'atom-btn-primary'}" type="button" data-action="open-lesson" data-lesson-id="${escapeHtml(l.id)}">
                  ${completed ? '✓ Bajarildi' : 'Boshlash'}
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

/* ==========================================================================
   SCREEN: WORKSPACE (WEB / PROYEKTLAR)
   ========================================================================== */
function renderWorkspace() {
  const project = getProject();

  return `
    <div>
      <div class="page-title-bar" style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <h1>⊞ Web Loyihalar Laboratoriyasi</h1>
          <p>O‘z veb-saytlaringizni quring, fayllarni tahrirlang va natijani real vaqtda ko‘ring.</p>
        </div>
        <button class="atom-btn atom-btn-primary" type="button" data-action="new-project">
          ${icon('plus')} <span>Yangi loyiha</span>
        </button>
      </div>

      <div style="display:grid;grid-template-columns:300px 1fr;gap:20px">
        <!-- Projects list -->
        <div class="atom-panel">
          <h3 style="margin-top:0">Loyihalaringiz (${app.state.projects.length})</h3>
          <div style="display:flex;flex-direction:column;gap:8px">
            ${app.state.projects.map((p) => `
              <button class="atom-pill-btn" style="width:100%;justify-content:space-between;height:44px;${p.id === project?.id ? 'border-color:var(--cyan);background:var(--bg-card-hover)' : ''}" type="button" data-action="open-project" data-project-id="${escapeHtml(p.id)}">
                <span>📁 ${escapeHtml(p.name)}</span>
                <small style="color:var(--muted)">${Object.keys(p.files || {}).length} fayl</small>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Project Editor preview / actions -->
        <div class="atom-panel">
          ${project ? `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
              <div>
                <h2 style="margin:0">${escapeHtml(project.name)}</h2>
                <small style="color:var(--muted)">Tuzilma: ${escapeHtml(project.template)}</small>
              </div>
              <div style="display:flex;gap:8px">
                <button class="atom-btn atom-btn-secondary" type="button" data-action="new-file">${icon('plus')} Fayl</button>
                <button class="atom-btn atom-btn-primary" type="button" data-action="navigate" data-screen="editor">Muharrirda ochish 🚀</button>
              </div>
            </div>

            <div style="height:320px;border-radius:12px;overflow:hidden;border:1px solid var(--border-subtle);background:#ffffff">
              <iframe style="width:100%;height:100%;border:0" srcdoc="${escapeHtml(project.files['index.html'] || '<h1>Loyiha</h1>')}" title="Loyiha"></iframe>
            </div>
          ` : `
            <p>Loyiha topilmadi. Yangi loyiha yarating.</p>
          `}
        </div>
      </div>
    </div>
  `;
}

/* ==========================================================================
   SCREEN: PROFILE
   ========================================================================== */
function renderProfile() {
  const profile = app.state.profile;

  return `
    <div style="max-width:900px;margin:0 auto">
      <div class="page-title-bar">
        <h1>👤 Profil Sozlamalari</h1>
        <p>Ismingiz, tarifingiz, bezaklar va shaxsiy natijalaringiz.</p>
      </div>

      <div class="atom-panel ${profile.bgItem || ''} ${profile.frameItem || ''}" style="display:flex;align-items:center;gap:20px;margin-bottom:24px">
        <div class="preview-profile-avatar" style="width:80px;height:80px;font-size:28px">MU</div>
        <div>
          <h2 style="margin:0 0 4px">${escapeHtml(profile.name)}</h2>
          <div style="color:var(--cyan);font-weight:700">@${escapeHtml(profile.username)} · ${escapeHtml(profile.role.toUpperCase())}</div>
          <p style="color:var(--muted-light);margin:6px 0 0;font-size:13px">${escapeHtml(profile.bio || 'LumenCo dasturchisi')}</p>
        </div>
      </div>

      <div class="atom-panel">
        <h3>Profil ma’lumotlarini yangilash</h3>
        <form data-form="profile">
          <div class="field">
            <label>Ism</label>
            <input name="name" value="${escapeHtml(profile.name)}" required />
          </div>
          <div class="field">
            <label>Username</label>
            <input name="username" value="${escapeHtml(profile.username)}" required />
          </div>
          <div class="field">
            <label>Bio</label>
            <textarea name="bio">${escapeHtml(profile.bio)}</textarea>
          </div>
          <button class="atom-btn atom-btn-primary" type="submit">Saqlash</button>
        </form>
      </div>
    </div>
  `;
}

/* ==========================================================================
   SCREEN ROUTER & RENDER
   ========================================================================== */
function render() {
  if (!app.state) {
    if (app.backend === 'supabase') renderAuth();
    return;
  }

  // Check if current user is banned
  if (app.state.profile.isBanned) {
    appRoot.innerHTML = `
      <main class="banned-screen">
        <div class="banned-card">
          <div class="banned-icon">🚫</div>
          <h1 style="color:#ef4444;margin:0 0 10px">Hisobingiz Bloklangan</h1>
          <p style="color:var(--muted-light);margin-bottom:24px">Qoidabuzarlik yoki xavfsizlik talablari sababli ma’muriyat tomonidan hisobingizga kirish cheklandi.</p>
          <button class="atom-btn atom-btn-primary" type="button" data-action="unban-self-test">Blokdan chiqarish (Test / Admin)</button>
        </div>
      </main>
    `;
    return;
  }

  let content = '';
  switch (app.screen) {
    case 'compiler':
      content = renderCompiler();
      break;
    case 'typing':
      content = renderTypingGame();
      break;
    case 'game':
      content = renderGameHub();
      break;
    case 'leaderboard':
      content = renderLeaderboard();
      break;
    case 'shop':
      content = renderShop();
      break;
    case 'plans':
      content = renderPlans();
      break;
    case 'admin':
      content = renderAdmin();
      break;
    case 'lessons':
      content = renderLessons();
      break;
    case 'profile':
      content = renderProfile();
      break;
    default:
      content = renderWorkspace();
  }

  appRoot.innerHTML = `
    ${renderTopbar()}
    <main class="atom-main">${content}</main>
    ${renderPetWidget()}
  `;

  renderModal();

  // If compiler is open, trigger run preview
  if (app.screen === 'compiler') runCompilerCode();

  // If typing game is active, bind typing arena focus
  if (app.screen === 'typing' && !app.typingFinished) {
    const hiddenInput = document.getElementById('typing-hidden-input');
    if (hiddenInput) {
      hiddenInput.focus();
      hiddenInput.oninput = handleTypingInput;
    }
  }

  // Translate markup to active locale
  if (window.LumenI18n) {
    appRoot.innerHTML = LumenI18n.translateMarkup(appRoot.innerHTML, app.locale);
  }
}

function handleTypingInput(e) {
  startTypingTimer();
  const val = e.target.value;
  if (!val) return;
  const lastChar = val[val.length - 1];
  const expectedChar = app.typingText[app.typingIndex];

  if (lastChar === expectedChar) {
    app.typingIndex += 1;
    if (app.typingIndex >= app.typingText.length) {
      finishTypingGame();
      return;
    }
  } else {
    app.typingMistakes += 1;
  }

  updateTypingStats();
  e.target.value = '';

  // Update display chars directly for high speed responsiveness
  const display = document.getElementById('typing-display-text');
  if (display) {
    display.innerHTML = app.typingText.split('').map((char, index) => {
      let cls = 'typing-char pending';
      if (index < app.typingIndex) cls = 'typing-char correct';
      else if (index === app.typingIndex) cls = 'typing-char current';
      return `<span class="${cls}">${escapeHtml(char)}</span>`;
    }).join('');
  }
}

/* ==========================================================================
   MODAL RENDERING
   ========================================================================== */
function modalFrame(title, description, body, actions) {
  return `
    <div class="modal-backdrop" data-action="backdrop-close">
      <section class="modal" role="dialog" aria-modal="true">
        <header class="modal-head">
          <div>
            <h2>${escapeHtml(title)}</h2>
            ${description ? `<p style="margin:4px 0 0;font-size:12px;color:var(--muted)">${escapeHtml(description)}</p>` : ''}
          </div>
          <button type="button" data-action="close-modal" style="color:var(--muted)">${icon('close')}</button>
        </header>
        <div class="modal-body">${body}</div>
        <footer class="modal-actions">${actions}</footer>
      </section>
    </div>
  `;
}

function renderModal() {
  if (!app.modal) {
    modalRoot.innerHTML = '';
    return;
  }

  if (app.modal === 'new-project') {
    modalRoot.innerHTML = modalFrame(
      'Yangi Loyiha',
      'Loyiha nomini bering va boshlang‘ich andozani tanlang.',
      `
        <form id="new-project-form" data-form="new-project">
          <div class="field">
            <label>Loyiha nomi</label>
            <input name="name" placeholder="Masalan: Mening Portfoliom" required autofocus />
          </div>
          <div class="field">
            <label>Boshlang‘ich andoza</label>
            <select name="template">
              <option value="portfolio">Portfolio (HTML, CSS, JS)</option>
              <option value="webapp">Web ilova (Modulli tuzilma)</option>
              <option value="blank">Bo‘sh loyiha</option>
            </select>
          </div>
        </form>
      `,
      `
        <button class="atom-btn atom-btn-secondary" type="button" data-action="close-modal">Bekor qilish</button>
        <button class="atom-btn atom-btn-primary" type="submit" form="new-project-form">Loyiha yaratish</button>
      `
    );
  } else if (app.modal === 'new-file') {
    modalRoot.innerHTML = modalFrame(
      'Yangi Fayl',
      'Fayl nomini kiriting.',
      `
        <form id="new-file-form" data-form="new-file">
          <div class="field">
            <label>Fayl manzili (masalan: app.js yoki styles.css)</label>
            <input name="path" required autofocus />
          </div>
        </form>
      `,
      `
        <button class="atom-btn atom-btn-secondary" type="button" data-action="close-modal">Bekor qilish</button>
        <button class="atom-btn atom-btn-primary" type="submit" form="new-file-form">Yaratish</button>
      `
    );
  } else if (app.modal === 'pet-wardrobe') {
    const pet = app.state.profile.petConfig || {};
    modalRoot.innerHTML = modalFrame(
      '👒 Lumi Garderobi (AI Pet Ustoz)',
      'Ustozi kiyimlarini va rangini xohlaganingizcha moslashtiring.',
      `
        <form id="pet-wardrobe-form" data-form="pet-wardrobe">
          <div class="field">
            <label>Pet Ismi</label>
            <input name="name" value="${escapeHtml(pet.name || 'Lumi')}" required />
          </div>
          <div class="field">
            <label>Bosh kiyimi</label>
            <select name="hat">
              <option value="none" ${pet.hat === 'none' ? 'selected' : ''}>Hech qanday</option>
              <option value="crown" ${pet.hat === 'crown' ? 'selected' : ''}>👑 Oltin Toj</option>
              <option value="wizard" ${pet.hat === 'wizard' ? 'selected' : ''}>🧙 Sehrgar Qalpog‘i</option>
              <option value="beanie" ${pet.hat === 'beanie' ? 'selected' : ''}>🧢 Kiber Bini</option>
            </select>
          </div>
          <div class="field">
            <label>Ko‘zoynak</label>
            <select name="glasses">
              <option value="none" ${pet.glasses === 'none' ? 'selected' : ''}>Hech qanday</option>
              <option value="vr" ${pet.glasses === 'vr' ? 'selected' : ''}>🥽 VR Garnitura</option>
              <option value="sunglasses" ${pet.glasses === 'sunglasses' ? 'selected' : ''}>🕶️ Qora Ko‘zoynak</option>
              <option value="neon" ${pet.glasses === 'neon' ? 'selected' : ''}>👓 Neon Ko‘zoynak</option>
            </select>
          </div>
          <div class="field">
            <label>Rangi</label>
            <select name="color">
              <option value="cyan" ${pet.color === 'cyan' ? 'selected' : ''}>Kiber Moviy</option>
              <option value="lime" ${pet.color === 'lime' ? 'selected' : ''}>Zumrad Yashil</option>
              <option value="gold" ${pet.color === 'gold' ? 'selected' : ''}>Oltin Sariq</option>
              <option value="purple" ${pet.color === 'purple' ? 'selected' : ''}>Kiber Binafsha</option>
            </select>
          </div>
        </form>
      `,
      `
        <button class="atom-btn atom-btn-secondary" type="button" data-action="close-modal">Yopish</button>
        <button class="atom-btn atom-btn-primary" type="submit" form="pet-wardrobe-form">Saqlash</button>
      `
    );
  } else if (app.modal === 'lesson') {
    const lesson = app.state.lessons.find((l) => l.id === app.modalLessonId);
    if (!lesson) return;
    const completed = app.state.completedLessons?.includes(lesson.id);

    modalRoot.innerHTML = modalFrame(
      escapeHtml(lesson.title),
      `${escapeHtml(lesson.track)} · ${escapeHtml(lesson.level)} · ${escapeHtml(lesson.duration)}`,
      `
        <div style="font-size:14px;line-height:1.6;color:var(--ink-secondary)">
          <p>Ushbu amaliy darsda siz <strong>${escapeHtml(lesson.title)}</strong> tushunchasini to‘liq o‘rganasiz.</p>
          <div style="background:#0b0f19;border:1px solid var(--border-strong);border-radius:10px;padding:16px;margin:16px 0;font-family:var(--font-mono);font-size:12px;color:#38bdf8">
            // Namuna kod<br>
            const lesson = "${escapeHtml(lesson.title)}";<br>
            console.log("Muvaffaqiyatli o'zlashtirildi!");
          </div>
          <p>Kodni brauzerda sinab ko‘ring va darsni yakunlang!</p>
          <div style="padding:12px;background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:10px;color:var(--gold);font-weight:700">
            Mukofot: +${lesson.xp} XP · +${lesson.coins} Coin
          </div>
        </div>
      `,
      `
        <button class="atom-btn atom-btn-secondary" type="button" data-action="close-modal">Yopish</button>
        <button class="atom-btn atom-btn-primary" type="button" data-action="complete-lesson" data-lesson-id="${escapeHtml(lesson.id)}" ${completed ? 'disabled' : ''}>
          ${completed ? '✓ Dars allaqachon bajarilgan' : 'Darsni yakunlash'}
        </button>
      `
    );
  }
}

/* ==========================================================================
   EVENT HANDLERS & ACTIONS
   ========================================================================== */
async function handleClick(e) {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const action = btn.dataset.action;

  if (action === 'navigate') {
    return navigate(btn.dataset.screen);
  }
  if (action === 'toggle-fullscreen') {
    return toggleFullscreen();
  }
  if (action === 'close-modal' || (action === 'backdrop-close' && e.target === btn)) {
    return closeModal();
  }
  if (action === 'new-project') {
    return openModal('new-project');
  }
  if (action === 'new-file') {
    return openModal('new-file');
  }
  if (action === 'open-project') {
    app.projectId = btn.dataset.projectId;
    return render();
  }
  if (action === 'shop-filter') {
    app.shopFilter = btn.dataset.filter;
    return render();
  }
  if (action === 'lesson-filter') {
    app.lessonFilter = btn.dataset.filter;
    return render();
  }
  if (action === 'hover-shop-item') {
    const item = app.state.shopItems.find((it) => it.id === btn.dataset.itemId);
    if (item) {
      app.hoveredShopItem = item;
      render();
    }
    return;
  }
  if (action === 'buy-item') {
    try {
      app.state = await request('/api/shop/purchase', {
        method: 'POST',
        body: JSON.stringify({ itemId: btn.dataset.itemId })
      });
      toast('Mahsulot muvaffaqiyatli xarid qilindi!');
      render();
    } catch (err) {
      toast(err.message, 'error');
    }
    return;
  }
  if (action === 'equip-item') {
    try {
      app.state = await request('/api/profile/equip', {
        method: 'PATCH',
        body: JSON.stringify({ itemId: btn.dataset.itemId })
      });
      toast('Profil ko‘rinishi yangilandi!');
      render();
    } catch (err) {
      toast(err.message, 'error');
    }
    return;
  }
  if (action === 'select-plan') {
    try {
      app.state = await request('/api/plans/select', {
        method: 'POST',
        body: JSON.stringify({ plan: btn.dataset.plan })
      });
      toast(`Tarif ${btn.dataset.plan.toUpperCase()} muvaffaqiyatli faollashtirildi!`);
      render();
    } catch (err) {
      toast(err.message, 'error');
    }
    return;
  }
  if (action === 'open-lesson') {
    app.modalLessonId = btn.dataset.lessonId;
    return openModal('lesson');
  }
  if (action === 'complete-lesson') {
    try {
      app.state = await request(`/api/lessons/${btn.dataset.lessonId}/complete`, { method: 'POST' });
      toast('Tabriklaymiz! Dars yakunlandi va mukofot berildi!');
      closeModal();
      render();
    } catch (err) {
      toast(err.message, 'error');
    }
    return;
  }
  if (action === 'pet-talk') {
    app.petBubbleIndex += 1;
    return render();
  }
  if (action === 'open-pet-wardrobe') {
    return openModal('pet-wardrobe');
  }
  if (action === 'run-compiler') {
    return runCompilerCode();
  }
  if (action === 'reset-compiler') {
    app.compilerHtml = `<h1>Salom Dunyo!</h1>`;
    app.compilerCss = `body { font-family: sans-serif; padding: 20px; }`;
    app.compilerJs = `console.log('Tozalandi');`;
    render();
    return;
  }
  if (action === 'compiler-tab') {
    app.compilerTab = btn.dataset.tab;
    return render();
  }
  if (action === 'save-compiler-to-project') {
    try {
      app.state = await request('/api/projects', {
        method: 'POST',
        body: JSON.stringify({ name: 'Kompilyator Loyihasi', template: 'blank' })
      });
      toast('Kompilyatordagi kod yangi loyihaga saqlandi!');
      app.screen = 'workspace';
      render();
    } catch (err) {
      toast(err.message, 'error');
    }
    return;
  }
  if (action === 'restart-typing') {
    initTypingGame();
    return render();
  }
  if (action === 'admin-toggle-ban') {
    try {
      app.state = await request('/api/admin/ban', {
        method: 'POST',
        body: JSON.stringify({ userId: btn.dataset.userId })
      });
      toast('Foydalanuvchi holati yangilandi!');
      render();
    } catch (err) {
      toast(err.message, 'error');
    }
    return;
  }
  if (action === 'admin-give-coins') {
    try {
      app.state = await request('/api/admin/coins', {
        method: 'POST',
        body: JSON.stringify({ userId: btn.dataset.userId, amount: 500 })
      });
      toast('500 Coin muvaffaqiyatli qo‘shildi!');
      render();
    } catch (err) {
      toast(err.message, 'error');
    }
    return;
  }
  if (action === 'unban-self-test') {
    try {
      app.state = await request('/api/admin/ban', {
        method: 'POST',
        body: JSON.stringify({ userId: app.state.profile.id })
      });
      toast('Hisob blokdan chiqarildi!');
      render();
    } catch (err) {
      toast(err.message, 'error');
    }
    return;
  }
}

async function handleSubmit(e) {
  const form = e.target.closest('form[data-form]');
  if (!form) return;
  e.preventDefault();
  const kind = form.dataset.form;
  const values = new FormData(form);

  if (kind === 'new-project') {
    try {
      app.state = await request('/api/projects', {
        method: 'POST',
        body: JSON.stringify({ name: values.get('name'), template: values.get('template') })
      });
      closeModal();
      toast('Yangi loyiha yaratildi!');
      render();
    } catch (err) {
      toast(err.message, 'error');
    }
    return;
  }

  if (kind === 'profile') {
    try {
      app.state = await request('/api/profile', {
        method: 'PATCH',
        body: JSON.stringify({
          name: values.get('name'),
          username: values.get('username'),
          bio: values.get('bio')
        })
      });
      toast('Profil saqlandi!');
      render();
    } catch (err) {
      toast(err.message, 'error');
    }
    return;
  }

  if (kind === 'pet-wardrobe') {
    try {
      app.state = await request('/api/pet/customize', {
        method: 'POST',
        body: JSON.stringify({
          name: values.get('name'),
          hat: values.get('hat'),
          glasses: values.get('glasses'),
          color: values.get('color')
        })
      });
      closeModal();
      toast('Lumi ustozi kiyimlari yangilandi!');
      render();
    } catch (err) {
      toast(err.message, 'error');
    }
    return;
  }
}

function handleInput(e) {
  if (e.target.id === 'compiler-input') {
    if (app.compilerTab === 'html') app.compilerHtml = e.target.value;
    else if (app.compilerTab === 'css') app.compilerCss = e.target.value;
    else if (app.compilerTab === 'js') app.compilerJs = e.target.value;
  }
}

async function handleChange(e) {
  if (e.target.matches('[data-locale-picker]')) {
    return setLocale(e.target.value);
  }
  if (e.target.dataset.action === 'admin-change-plan') {
    try {
      app.state = await request('/api/admin/plan', {
        method: 'POST',
        body: JSON.stringify({ userId: e.target.dataset.userId, plan: e.target.value })
      });
      toast('Foydalanuvchi tarifi yangilandi!');
      render();
    } catch (err) {
      toast(err.message, 'error');
    }
  }
  if (e.target.dataset.action === 'compiler-load-template') {
    const val = e.target.value;
    if (val === 'clock') {
      app.compilerHtml = `<div style="text-align:center;padding:50px"><h1 id="clock" style="font-size:50px;color:#38bdf8">00:00:00</h1></div><script>setInterval(()=>{ document.getElementById('clock').textContent = new Date().toLocaleTimeString(); }, 1000);<\/script>`;
      app.compilerCss = `body { background: #0b0f19; color: white; }`;
      app.compilerJs = ``;
    } else if (val === 'ball') {
      app.compilerHtml = `<canvas id="canvas" width="400" height="300" style="background:#0f172a;display:block;margin:20px auto;border-radius:12px"></canvas><script>const c = document.getElementById('canvas').getContext('2d'); let y = 50, vy = 2; function loop() { c.clearRect(0,0,400,300); c.fillStyle = '#f97316'; c.beginPath(); c.arc(200, y, 20, 0, Math.PI*2); c.fill(); y += vy; if(y>280||y<20) vy=-vy; requestAnimationFrame(loop); } loop();<\/script>`;
    }
    runCompilerCode();
  }
}

// Window console listener for compiler iframe
window.addEventListener('message', (e) => {
  if (e.data?.type === 'compiler-console') {
    app.compilerConsole.push(e.data.text);
    const box = document.querySelector('.compiler-console-box');
    if (box) {
      const line = document.createElement('div');
      line.className = 'console-line info';
      line.textContent = `> ${e.data.text}`;
      box.appendChild(line);
      box.scrollTop = box.scrollHeight;
    }
  }
});

/* ==========================================================================
   BOOTSTRAP
   ========================================================================== */
function renderAuth() {
  const isSignup = app.authMode === 'signup';
  appRoot.innerHTML = `
    <main class="auth-page">
      <section class="auth-card">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:30px">
          <div style="display:flex;align-items:center;gap:10px">
            <div class="atom-logo-icon">⚛</div>
            <div class="atom-logo-text">atom<span>js</span></div>
          </div>
          <select class="atom-pill-btn" data-locale-picker>
            <option value="uz" ${app.locale === 'uz' ? 'selected' : ''}>Ózb</option>
            <option value="en" ${app.locale === 'en' ? 'selected' : ''}>EN</option>
            <option value="ru" ${app.locale === 'ru' ? 'selected' : ''}>RU</option>
          </select>
        </div>

        <h1 style="margin:0 0 8px;font-size:26px">${isSignup ? 'Hisob yarating' : 'Hisobingizga kiring'}</h1>
        <p style="color:var(--muted-light);margin:0 0 24px">${isSignup ? 'Boshlash bepul. Dasturlashni o‘rganing va loyihalar yarating.' : 'Loyihalaringiz va o‘sishingiz bitta joyda.'}</p>

        <form data-form="auth-form" onsubmit="handleAuthSubmit(event)">
          ${isSignup ? `
            <div class="field">
              <label>Ismingiz</label>
              <input name="name" required placeholder="Masalan: Muhammadbek Rafiqov" />
            </div>
          ` : ''}
          <div class="field">
            <label>Email manzili</label>
            <input type="email" name="email" value="${escapeHtml(app.pendingEmail)}" required />
          </div>
          <div class="field">
            <label>Parol</label>
            <input type="password" name="password" minlength="8" required />
          </div>
          <button class="atom-btn atom-btn-primary" style="width:100%;height:44px;margin-top:10px" type="submit">
            ${isSignup ? 'Hisob yaratish' : 'Kirish'} ➔
          </button>
        </form>

        <p style="text-align:center;margin-top:24px;color:var(--muted);font-size:13px">
          ${isSignup ? 'Hisobingiz bormi?' : 'Hisobingiz yo‘qmi?'}
          <button style="color:var(--cyan);font-weight:700" type="button" onclick="toggleAuthMode()">
            ${isSignup ? 'Kirish' : 'Ro‘yxatdan o‘tish'}
          </button>
        </p>
      </section>

      <aside class="auth-side">
        <span style="font-size:12px;font-weight:800;letter-spacing:0.12em;color:var(--orange)">BUILD YOUR NEXT IDEA</span>
        <h2 style="font-size:clamp(32px, 4vw, 44px);line-height:1.15;margin:16px 0;color:#ffffff">
          Every line moves you forward.
        </h2>
        <p style="color:var(--muted-light);max-width:440px;line-height:1.6">
          Learn, build and keep your work organized in one calm dark cyberpunk workspace.
        </p>
      </aside>
    </main>
  `;
}

window.toggleAuthMode = function() {
  app.authMode = app.authMode === 'signup' ? 'signin' : 'signup';
  renderAuth();
};

window.handleAuthSubmit = async function(e) {
  e.preventDefault();
  const form = e.target;
  const values = new FormData(form);
  const email = String(values.get('email') || '').trim();
  const password = String(values.get('password') || '');
  const name = String(values.get('name') || '').trim();

  try {
    if (app.authMode === 'signup') {
      const res = await LumenBackend.signUp(email, password, name);
      if (res.needsEmail) {
        toast('Emailga tasdiqlash xati yuborildi. Pochtani tekshiring.');
        return;
      }
    } else {
      await LumenBackend.signIn(email, password);
    }
    app.authenticated = true;
    app.state = await request('/api/state');
    render();
    toast('Xush kelibsiz!');
  } catch (err) {
    toast(err.message, 'error');
  }
};

async function boot() {
  try {
    app.backend = await LumenBackend.initialize();
    if (app.backend === 'supabase') {
      try {
        await LumenBackend.getSession();
        app.authenticated = true;
        app.state = await request('/api/state');
      } catch (authError) {
        LumenBackend.clearSession();
        app.authenticated = false;
        return renderAuth();
      }
    } else {
      app.state = await request('/api/state');
    }
    app.projectId = app.state.projects?.[0]?.id || null;
    render();
  } catch (error) {
    console.error('Boot error:', error);
    renderAuth();
  }
}

document.addEventListener('click', handleClick);
document.addEventListener('submit', handleSubmit);
document.addEventListener('input', handleInput);
document.addEventListener('change', handleChange);

boot();
