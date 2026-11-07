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
  keyboard: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M6 12h.01M18 12h.01M8 16h8"/>',
  crown: '<path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/>',
  gem: '<path d="M6 3h12l4 6-10 13L2 9zM2 9h20M12 22 8 9M12 22l4-13"/>',
  flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  palette: '<circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2z"/>',
  zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>'
};

const appRoot = document.getElementById('app');
const modalRoot = document.getElementById('modal-root');
const toastRoot = document.getElementById('toast-root');

const app = {
  state: null,
  screen: 'workspace', // workspace, editor, compiler, typing, leaderboard, shop, plans, profile, admin
  projectId: null,
  filePath: null,
  modal: null,
  shopFilter: 'frame',
  lessonFilter: 'Barchasi',
  dirty: false,
  modalLessonId: null,
  locale: localStorage.getItem('lumenco-locale') || 'uz',
  backend: 'local',
  authenticated: false,
  authMode: 'signin',
  pendingEmail: '',
  pendingPassword: '',
  authNotice: '',

  // Live hover preview in Shop
  hoveredShopItem: null,

  // Compiler state
  compilerTab: 'html',
  compilerHtml: `<!doctype html>\n<html lang="uz">\n<head>\n  <meta charset="UTF-8">\n  <title>LumenCo Kompilyator</title>\n  <style>\n    body { font-family: system-ui, sans-serif; display: grid; place-items: center; min-height: 100vh; margin: 0; background: #0c101a; color: #f8fafc; }\n    .box { text-align: center; padding: 40px; border-radius: 20px; background: #141b2d; border: 1px solid #1e2a44; box-shadow: 0 10px 30px rgba(0,0,0,.5); }\n    h1 { color: #38bdf8; margin-bottom: 8px; }\n    button { background: #38bdf8; color: #0c101a; border: 0; padding: 10px 20px; border-radius: 10px; font-weight: 700; cursor: pointer; }\n  </style>\n</head>\n<body>\n  <div class="box">\n    <h1>Salom, LumenCo!</h1>\n    <p>Brauzerdagi shaxsiy kod laboratoriyangiz.</p>\n    <button onclick="salom()">Meni bos</button>\n  </div>\n  <script>\n    function salom() {\n      console.log('LumenCo tugmasi bosildi!');\n      alert('Kompilyator muvaffaqiyatli ishlayapti!');\n    }\n  </script>\n</body>\n</html>`,
  compilerCss: `/* CSS stillaringiz */\nbody { margin: 0; }`,
  compilerJs: `// JavaScript kodingiz\nconsole.log('LumenCo kompilyatori tayyor.');`,
  compilerConsole: ['[Tizim] LumenCo laboratoriya konsoli faol.'],

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

  // Duolingo-style Pet AI ("Lumi") state
  petBubbleIndex: 0,
  petPhrases: [
    'Salom, Muhammadbek! Bugun qaysi loyihani quramiz?',
    'Kompilyatorda yangi g‘oya sinab ko‘ring!',
    'Tez yozishda yangi rekord o‘rnatib, coin yig‘ing!',
    'Pro va Max darslarida ko‘proq XP kutmoqda!',
    'Do‘kondan yangi animatsiyali ramka tanlang!'
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
  el.innerHTML = `${icon(type === 'error' ? 'shield' : 'sparkle')}<span>${escapeHtml(message)}</span>`;
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
  if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
  else document.exitFullscreen().catch(() => {});
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
   LUMENCO SHELL: SIDEBAR + TOPBAR (NO STICKER EMOJIS, PURE SVG)
   ========================================================================== */
function navItem(screenId, label, iconName, count = null) {
  const active = app.screen === screenId;
  return `
    <button type="button" class="nav-link ${active ? 'active' : ''} ${screenId === 'admin' ? 'admin-link' : ''}" data-action="navigate" data-screen="${screenId}">
      ${icon(iconName)}
      <span>${escapeHtml(label)}</span>
      ${count !== null ? `<span style="margin-left:auto;font-size:11px;color:var(--muted)">${count}</span>` : ''}
    </button>
  `;
}

function renderShell(content) {
  const profile = app.state.profile;
  const isAdmin = profile.role === 'admin';

  appRoot.innerHTML = `
    <div class="app-shell">
      <!-- Sidebar -->
      <aside class="sidebar">
        <a class="brand" href="#" data-action="navigate" data-screen="workspace">
          <span class="brand-mark">L</span>
          <span class="brand-word">LumenCo<small>Kod yoz. O‘sib bor.</small></span>
        </a>

        <p class="side-label">ISH MAYDONI</p>
        <nav class="nav-list">
          ${navItem('workspace', 'Ish maydoni', 'home', app.state.projects?.length || 0)}
          ${navItem('editor', 'Kod muharriri', 'code')}
          ${navItem('compiler', 'Kompilyator', 'zap')}
          ${navItem('lessons', 'Darslar', 'book', app.state.lessons?.length || 350)}
        </nav>

        <p class="side-label">AMALIYOT &amp; O‘YIN</p>
        <nav class="nav-list">
          ${navItem('typing', 'Tez yozish', 'keyboard')}
          ${navItem('leaderboard', 'Reyting', 'crown')}
        </nav>

        <p class="side-label">HAMJAMIYAT &amp; TA’RIF</p>
        <nav class="nav-list">
          ${navItem('shop', 'Bezaklar do‘koni', 'shop')}
          ${navItem('plans', 'Ta’riflar (Plans)', 'gem')}
          ${isAdmin ? navItem('admin', 'Admin Panel', 'shield') : ''}
          ${navItem('profile', 'Profil', 'user')}
        </nav>

        <div class="sidebar-spacer"></div>

        <div class="sidebar-footer">
          <div class="avatar ${profile.frameItem || ''}">MU</div>
          <div class="profile-snippet">
            <strong>${escapeHtml(profile.name)}</strong>
            <span>@${escapeHtml(profile.username)}</span>
          </div>
          <button type="button" class="btn-secondary" style="width:28px;height:28px;padding:0;border-radius:8px" data-action="navigate" data-screen="profile" title="Profil">
            ${icon('pencil')}
          </button>
        </div>
      </aside>

      <!-- Main Panel -->
      <section class="main-panel">
        <header class="topbar">
          <div class="crumbs">
            <span>LumenCo</span>
            ${icon('chevron')}
            <strong>${escapeHtml(app.screen.toUpperCase())}</strong>
          </div>

          <div class="topbar-right">
            <button class="pill-badge streak" type="button" data-action="navigate" data-screen="profile" title="Kundalik faollik">
              ${icon('flame')} ${app.state.streak || 1}
            </button>

            <button class="pill-badge coin" type="button" data-action="navigate" data-screen="shop">
              <span class="coin-symbol">L</span>
              ${formatNumber(app.state.coins)} coin
            </button>

            <select class="locale-picker" data-locale-picker>
              <option value="uz" ${app.locale === 'uz' ? 'selected' : ''}>UZ</option>
              <option value="en" ${app.locale === 'en' ? 'selected' : ''}>EN</option>
              <option value="ru" ${app.locale === 'ru' ? 'selected' : ''}>RU</option>
            </select>

            <button class="pill-badge" type="button" data-action="toggle-fullscreen" title="To‘liq ekran">
              ${icon('fullscreen')}
            </button>
          </div>
        </header>

        <main class="content">${content}</main>
      </section>
    </div>
    ${renderPetWidget()}
  `;

  renderModal();

  if (window.LumenI18n) {
    appRoot.innerHTML = LumenI18n.translateMarkup(appRoot.innerHTML, app.locale);
  }
}

/* ==========================================================================
   DUOLINGO-STYLE AI PET ("LUMI" VECTOR ROBOT - NO EMOJIS)
   ========================================================================== */
function renderPetWidget() {
  const profile = app.state?.profile;
  const pet = profile?.petConfig || { name: 'Lumi', color: 'cyan' };
  const phrase = app.petPhrases[app.petBubbleIndex % app.petPhrases.length];

  return `
    <div class="lumi-box" id="lumi-container">
      <div class="lumi-speech" data-action="pet-talk">
        <strong style="color:var(--cyan);display:block;margin-bottom:2px">${escapeHtml(pet.name)} (LumenCo AI):</strong>
        <span>${escapeHtml(phrase)}</span>
        <div style="margin-top:8px;display:flex;gap:6px">
          <button style="color:var(--cyan);font-size:10px;font-weight:700" type="button" data-action="pet-talk">Maslahat ➔</button>
          ${profile?.plan === 'max' || profile?.role === 'admin' ? `
            <button style="color:var(--orange);font-size:10px;font-weight:700" type="button" data-action="open-pet-wardrobe">Garderob</button>
          ` : ''}
        </div>
      </div>
      <div class="lumi-svg-wrap" data-action="pet-talk" title="${escapeHtml(pet.name)}">
        <!-- Pure Vector Robot SVG -->
        <svg viewBox="0 0 36 36" width="34" height="34" fill="none">
          <rect x="7" y="10" width="22" height="18" rx="7" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
          <circle cx="13" cy="19" r="2.5" fill="#38bdf8"/>
          <circle cx="23" cy="19" r="2.5" fill="#38bdf8"/>
          <line x1="18" y1="4" x2="18" y2="10" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>
          <circle cx="18" cy="3" r="2" fill="#f97316"/>
          <path d="M14 24 Q18 27 22 24" stroke="#38bdf8" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </div>
    </div>
  `;
}

/* ==========================================================================
   SCREEN: WORKSPACE (LOYIHALAR & MAKETLAR)
   ========================================================================== */
function renderWorkspace() {
  const project = getProject();
  const projects = app.state.projects || [];
  const completed = app.state.completedLessons?.length || 0;

  return `
    <div>
      <div class="page-heading">
        <div>
          <h1>Loyiha Ish Maydoni</h1>
          <p>Yangi g‘oyalaringizni kodlang, fayllarni tartiblang va o‘sib boring.</p>
        </div>
        <button class="btn" type="button" data-action="new-project">
          ${icon('plus')} <span>Yangi loyiha</span>
        </button>
      </div>

      <div class="stat-grid">
        <div class="stat-card">
          <span class="stat-icon">${icon('layers')}</span>
          <div><span>Loyihalar</span><strong>${projects.length}</strong></div>
        </div>
        <div class="stat-card">
          <span class="stat-icon lime">${icon('award')}</span>
          <div><span>Creator darajasi</span><strong>${escapeHtml(app.state.creatorRank.name)}</strong></div>
        </div>
        <div class="stat-card">
          <span class="stat-icon purple">${icon('code')}</span>
          <div><span>Developer darajasi</span><strong>${escapeHtml(app.state.developerRank.name)}</strong></div>
        </div>
        <div class="stat-card">
          <span class="stat-icon orange">${icon('bolt')}</span>
          <div><span>To‘plangan XP</span><strong>${formatNumber(app.state.xp)}</strong></div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:minmax(0, 1.4fr) minmax(320px, 0.8fr);gap:20px">
        <div>
          <div class="panel">
            <div class="panel-heading">
              <div>
                <h2>Faol loyiha ko‘rinishi</h2>
                <p>${project ? `${escapeHtml(project.name)} · ${Object.keys(project.files || {}).length} ta fayl` : 'Loyiha tanlanmagan'}</p>
              </div>
              <button class="btn btn-secondary" type="button" data-action="navigate" data-screen="editor">
                ${icon('code')} Muharrirda ochish
              </button>
            </div>
            ${project ? `
              <div style="height:320px;border-radius:12px;overflow:hidden;border:1px solid var(--border);background:#ffffff">
                <iframe style="width:100%;height:100%;border:0" sandbox="" srcdoc="${escapeHtml(project.files['index.html'] || '<h2 style=\'color:#333;font-family:sans-serif;padding:20px\'>Loyiha boshlandi</h2>')}"></iframe>
              </div>
            ` : `<p style="color:var(--muted)">Hali loyiha yaratilmagan.</p>`}
          </div>

          <div class="panel" style="margin-top:20px">
            <div class="panel-heading">
              <div><h2>Barcha loyihalar</h2><p>G‘oyangizdan qurilgan veb-sahifalar.</p></div>
            </div>
            <div style="display:grid;gap:8px">
              ${projects.map((p) => `
                <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:var(--bg-card);border:1px solid var(--border);border-radius:10px">
                  <div style="display:flex;align-items:center;gap:12px">
                    <span style="color:var(--cyan)">${icon('folder')}</span>
                    <div>
                      <strong style="color:#ffffff">${escapeHtml(p.name)}</strong>
                      <small style="color:var(--muted);display:block">${escapeHtml(p.template)} · ${Object.keys(p.files || {}).length} fayl</small>
                    </div>
                  </div>
                  <button class="btn btn-secondary" style="height:32px;padding:0 12px;font-size:11px" type="button" data-action="open-project" data-project-id="${escapeHtml(p.id)}">
                    Tanlash
                  </button>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <aside style="display:flex;flex-direction:column;gap:20px">
          <div class="panel">
            <div class="panel-heading">
              <div><h2>Keyingi qadam</h2><p>Darslar orqali ko‘nikmalaringizni charxlang.</p></div>
            </div>
            <p style="color:var(--muted-light);font-size:13px">Hozirgacha <strong>${completed} ta dars</strong> yakunlandi.</p>
            <button class="btn" style="width:100%;margin-top:10px" type="button" data-action="navigate" data-screen="lessons">
              ${icon('book')} Darslarni davom ettirish
            </button>
          </div>

          <div class="panel">
            <div class="panel-heading">
              <div><h2>Tez Yozish Mashg‘uloti</h2><p>Barmoqlaringiz tezligini sinang.</p></div>
            </div>
            <p style="color:var(--muted-light);font-size:13px">WPM tezlik ko‘rsatkichini oshirib, coin to‘plang.</p>
            <button class="btn btn-secondary" style="width:100%;margin-top:10px" type="button" data-action="navigate" data-screen="typing">
              ${icon('keyboard')} Tez yozishni boshlash
            </button>
          </div>
        </aside>
      </div>
    </div>
  `;
}

/* ==========================================================================
   SCREEN: KOD MUHARRIRI (FULL EDITOR)
   ========================================================================== */
function renderEditorScreen() {
  const project = getProject();
  if (!project) return `<div class="panel">Loyihalar topilmadi. Avval yangi loyiha yarating.</div>`;

  const files = Object.keys(project.files || {});
  if (!app.filePath || !files.includes(app.filePath)) app.filePath = files[0] || null;
  const currentFile = getSelectedFile();

  return `
    <div>
      <div class="page-heading">
        <div>
          <h1>Kod Muharriri: ${escapeHtml(project.name)}</h1>
          <p>Fayllarni boshqaring, kod yozing va saqlang.</p>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-secondary" type="button" data-action="new-file">${icon('plus')} Yangi fayl</button>
          <button class="btn" type="button" data-action="save-active-file">${icon('save')} Saqlash</button>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:260px 1fr 1fr;gap:16px;height:calc(100vh - 180px)">
        <!-- File Tree -->
        <div class="panel" style="overflow-y:auto;padding:14px">
          <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;margin-bottom:10px">Loyiha fayllari</div>
          <div style="display:flex;flex-direction:column;gap:4px">
            ${files.map((path) => `
              <button type="button" class="nav-link ${path === app.filePath ? 'active' : ''}" style="height:34px;font-size:12px" data-action="select-file" data-path="${escapeHtml(path)}">
                ${icon('file')}
                <span>${escapeHtml(path)}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Editor Area -->
        <div class="panel" style="padding:0;overflow:hidden;display:flex;flex-direction:column">
          <div style="padding:10px 16px;background:var(--bg-card);border-bottom:1px solid var(--border);display:flex;justify-content:space-between;font-size:12px;color:var(--muted-light)">
            <span>${escapeHtml(app.filePath || 'Fayl tanlanmagan')}</span>
            <span style="color:var(--cyan)">UTF-8</span>
          </div>
          <textarea id="project-code-input" class="compiler-input-area" spellcheck="false">${escapeHtml(currentFile?.content || '')}</textarea>
        </div>

        <!-- Live Preview -->
        <div class="panel" style="padding:0;overflow:hidden;display:flex;flex-direction:column;background:#ffffff">
          <div style="padding:10px 16px;background:#0c101a;border-bottom:1px solid var(--border);font-size:12px;color:var(--muted)">
            Jonli natija ko‘rinishi
          </div>
          <iframe style="flex:1;border:0;width:100%" sandbox="" srcdoc="${escapeHtml(project.files['index.html'] || '')}"></iframe>
        </div>
      </div>
    </div>
  `;
}

/* ==========================================================================
   SCREEN: KOMPILYATOR (BROWSER CODE LABORATORY)
   ========================================================================== */
function renderCompiler() {
  return `
    <div class="compiler-layout">
      <div class="compiler-bar">
        <div style="display:flex;align-items:center;gap:8px">
          <button class="btn" type="button" data-action="run-compiler">
            ${icon('play')} <span>Ishga tushirish</span>
          </button>
          <button class="btn btn-secondary" type="button" data-action="reset-compiler">
            <span>Tozalash</span>
          </button>
          <button class="btn btn-secondary" type="button" data-action="save-compiler-to-project">
            ${icon('save')} <span>Loyiha sifatida saqlash</span>
          </button>
        </div>

        <div style="display:flex;gap:6px">
          <button class="filter-tab-btn ${app.compilerTab === 'html' ? 'active' : ''}" type="button" data-action="compiler-tab" data-tab="html">HTML</button>
          <button class="filter-tab-btn ${app.compilerTab === 'css' ? 'active' : ''}" type="button" data-action="compiler-tab" data-tab="css">CSS</button>
          <button class="filter-tab-btn ${app.compilerTab === 'js' ? 'active' : ''}" type="button" data-action="compiler-tab" data-tab="js">JavaScript</button>
          <button class="filter-tab-btn ${app.compilerTab === 'console' ? 'active' : ''}" type="button" data-action="compiler-tab" data-tab="console">Konsol</button>
        </div>

        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:12px;color:var(--muted)">Shablon:</span>
          <select class="pill-badge" data-action="compiler-load-template" style="cursor:pointer">
            <option value="hello">Salom Dunyo</option>
            <option value="clock">Raqamli Soat</option>
            <option value="ball">Animatsiyali Koptok</option>
          </select>
        </div>
      </div>

      <div class="compiler-grid">
        <div class="panel" style="padding:0;overflow:hidden;display:flex;flex-direction:column">
          <div style="padding:8px 16px;background:var(--bg-card);border-bottom:1px solid var(--border);font-size:11px;color:var(--muted);text-transform:uppercase">
            ${app.compilerTab} kodi
          </div>
          <textarea id="compiler-input" class="compiler-input-area" spellcheck="false">${escapeHtml(app.compilerTab === 'html' ? app.compilerHtml : app.compilerTab === 'css' ? app.compilerCss : app.compilerTab === 'js' ? app.compilerJs : app.compilerConsole.join('\n'))}</textarea>
        </div>

        <div class="panel" style="padding:0;overflow:hidden;display:flex;flex-direction:column;background:#ffffff">
          <div style="padding:8px 16px;background:#0c101a;border-bottom:1px solid var(--border);font-size:11px;color:var(--muted)">
            Jonli natija (Sandbox)
          </div>
          <iframe id="compiler-preview-frame" style="flex:1;border:0;width:100%" sandbox="allow-scripts" title="Natija"></iframe>
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
      ${app.compilerJs}
    <\/script>
  `;
  frame.srcdoc = `${css}\n${html}\n${js}`;
}

/* ==========================================================================
   SCREEN: TEZ YOZISH (SPEED TYPING)
   ========================================================================== */
const TYPING_SNIPPETS = [
  'const developer = { name: "Muhammadbek", skill: "Fullstack", focus: "AI" };',
  'function buildFuture(ideas, grit) { return ideas.map(idea => create(idea)); }',
  'document.querySelectorAll(".btn").forEach(b => b.addEventListener("click", run));',
  'const fibonacci = (n) => n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2);'
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

function renderTypingGame() {
  return `
    <div class="typing-wrap">
      <div class="page-heading" style="text-align:center;display:block">
        <h1>Tez Yozish Mashg‘uloti</h1>
        <p>Haqiqiy kod sintaksisini tez va xatosiz yozib, tezlik (WPM) ko‘rsatkichini oshiring.</p>
      </div>

      <div class="typing-hud">
        <div class="typing-hud-card">
          <span>Tezlik</span>
          <strong style="color:var(--cyan)" id="typing-wpm">${app.typingWpm}</strong>
          <small style="color:var(--muted)">WPM</small>
        </div>
        <div class="typing-hud-card">
          <span>Aniqlik</span>
          <strong style="color:var(--lime)" id="typing-acc">${app.typingAcc}%</strong>
        </div>
        <div class="typing-hud-card">
          <span>Qolgan vaqt</span>
          <strong style="color:var(--orange)" id="typing-time">${app.typingTimeLeft}s</strong>
        </div>
        <div class="typing-hud-card">
          <span>Xatolar</span>
          <strong style="color:var(--danger)">${app.typingMistakes}</strong>
        </div>
      </div>

      ${app.typingFinished ? `
        <div class="panel" style="text-align:center;padding:40px">
          <span style="color:var(--gold)">${icon('award')}</span>
          <h2>Ajoyib natija!</h2>
          <p style="color:var(--muted-light)">Tezligingiz: <strong>${app.typingWpm} WPM</strong> | Aniqlik: <strong>${app.typingAcc}%</strong></p>
          <div style="margin:20px 0;color:var(--lime);font-weight:700">+50 XP va +30 Coin hisobingizga qo‘shildi!</div>
          <button class="btn" type="button" data-action="restart-typing">Qayta sinash</button>
        </div>
      ` : `
        <div class="typing-terminal" tabindex="0">
          <input type="text" id="typing-hidden-input" style="position:absolute;top:0;left:0;opacity:0;width:100%;height:100%;cursor:default" autocomplete="off" autofocus />
          <div id="typing-display-text">
            ${app.typingText.split('').map((char, index) => {
              let cls = 'typing-char pending';
              if (index < app.typingIndex) cls = 'typing-char correct';
              else if (index === app.typingIndex) cls = 'typing-char current';
              return `<span class="${cls}">${escapeHtml(char)}</span>`;
            }).join('')}
          </div>
        </div>
        <p style="text-align:center;color:var(--muted);font-size:12px;margin-top:14px">Klaviaturadan to‘g‘ridan-to‘g‘ri kodni yozing.</p>
      `}
    </div>
  `;
}

/* ==========================================================================
   SCREEN: REYTING (LEADERBOARD PODIUM & TABLE)
   ========================================================================== */
function renderLeaderboard() {
  const users = app.state.adminUsers?.length ? app.state.adminUsers : [
    { name: 'Muhammadbek Rafiqov', username: 'kembodev', xp: 9480, streak: 12, frame: 'frame-noyob', bg: 'bg-laboratoriya' },
    { name: 'Jasurbek Developer', username: 'jasur_js', xp: 8120, streak: 7, frame: 'frame-olov', bg: 'bg-shom' },
    { name: 'Malika Frontend', username: 'malika_code', xp: 7450, streak: 5, frame: 'frame-shafaq', bg: 'bg-konfet' },
    { name: 'Bekzod Backend', username: 'bekzod_node', xp: 4320, streak: 3, frame: 'frame-okean', bg: 'bg-okean' }
  ];

  const sorted = [...users].sort((a, b) => (b.xp || 0) - (a.xp || 0));
  const top1 = sorted[0];
  const top2 = sorted[1];
  const top3 = sorted[2];

  return `
    <div style="max-width:960px;margin:0 auto">
      <div class="page-heading" style="text-align:center;display:block">
        <h1>Dasturchilar Reytingi</h1>
        <p>LumenCo platformasidagi eng faol dasturchilar va peshqadamlar.</p>
      </div>

      <!-- Podium -->
      <div class="podium-wrap">
        <div class="podium-col second">
          <div class="avatar ${top2?.frame || ''}" style="width:58px;height:58px;margin-bottom:8px">2</div>
          <strong style="font-size:13px">${escapeHtml(top2?.name || 'Jasurbek')}</strong>
          <span style="color:var(--cyan);font-weight:700;font-size:12px;margin-bottom:8px">${formatNumber(top2?.xp || 8120)} XP</span>
          <div class="podium-pedestal">2-O‘rin</div>
        </div>

        <div class="podium-col first">
          <span style="color:var(--gold);margin-bottom:4px">${icon('crown')}</span>
          <div class="avatar ${top1?.frame || 'frame-noyob'}" style="width:72px;height:72px;margin-bottom:8px">MU</div>
          <strong style="font-size:14px;color:#facc15">${escapeHtml(top1?.name || 'Muhammadbek Rafiqov')}</strong>
          <span style="color:var(--gold);font-weight:800;font-size:13px;margin-bottom:8px">${formatNumber(top1?.xp || 9480)} XP</span>
          <div class="podium-pedestal">1-O‘rin</div>
        </div>

        <div class="podium-col third">
          <div class="avatar ${top3?.frame || ''}" style="width:54px;height:54px;margin-bottom:8px">3</div>
          <strong style="font-size:13px">${escapeHtml(top3?.name || 'Malika')}</strong>
          <span style="color:var(--orange);font-weight:700;font-size:12px;margin-bottom:8px">${formatNumber(top3?.xp || 7450)} XP</span>
          <div class="podium-pedestal">3-O‘rin</div>
        </div>
      </div>

      <!-- Table -->
      <div class="panel" style="padding:0;overflow:hidden">
        <table style="width:100%;border-collapse:collapse">
          <thead>
            <tr style="border-bottom:1px solid var(--border);color:var(--muted);font-size:11px;text-transform:uppercase">
              <th style="padding:14px 18px;text-align:left"># O‘rin</th>
              <th style="padding:14px 18px;text-align:left">Dasturchi</th>
              <th style="padding:14px 18px;text-align:left">Streak</th>
              <th style="padding:14px 18px;text-align:right">XP Balli</th>
            </tr>
          </thead>
          <tbody>
            ${sorted.map((u, i) => `
              <tr style="border-bottom:1px solid var(--border)">
                <td style="padding:14px 18px;font-weight:800;color:var(--cyan)">#${i + 1}</td>
                <td style="padding:14px 18px">
                  <div style="display:flex;align-items:center;gap:12px">
                    <div class="avatar ${u.frame || ''}" style="width:34px;height:34px;font-size:12px">MU</div>
                    <div>
                      <strong>${escapeHtml(u.name)}</strong>
                      <small style="color:var(--muted);display:block">@${escapeHtml(u.username)}</small>
                    </div>
                  </div>
                </td>
                <td style="padding:14px 18px;color:var(--orange);font-weight:700">🔥 ${u.streak || 1}</td>
                <td style="padding:14px 18px;text-align:right;font-weight:800;color:#ffffff">${formatNumber(u.xp || 0)} XP</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/* ==========================================================================
   SCREEN: BEZAKLAR DO‘KONI (SHOP WITH LIVE RIGHT PREVIEW)
   ========================================================================== */
function renderShop() {
  const profile = app.state.profile;
  const items = app.state.shopItems || [];
  const filtered = items.filter((it) => it.kind === app.shopFilter);

  const activeFrame = app.hoveredShopItem?.kind === 'frame' ? app.hoveredShopItem.id : (profile.frameItem || 'frame-yalpiz');
  const activeBg = app.hoveredShopItem?.kind === 'bg' ? app.hoveredShopItem.id : (profile.bgItem || 'bg-yalpiz');

  return `
    <div class="shop-layout">
      <div>
        <div class="page-heading">
          <div>
            <h1>LumenCo Bezaklar Do‘koni</h1>
            <p>Profilingiz va reyting qatoringizni animatsiyali ramkalar va fonlar bilan bezang.</p>
          </div>
        </div>

        <div class="filter-tabs">
          <button class="filter-tab-btn ${app.shopFilter === 'frame' ? 'active' : ''}" type="button" data-action="shop-filter" data-filter="frame">Animatsiyali ramkalar</button>
          <button class="filter-tab-btn ${app.shopFilter === 'bg' ? 'active' : ''}" type="button" data-action="shop-filter" data-filter="bg">Fonlar</button>
          <button class="filter-tab-btn ${app.shopFilter === 'theme' ? 'active' : ''}" type="button" data-action="shop-filter" data-filter="theme">Muharrir temalari</button>
          <button class="filter-tab-btn ${app.shopFilter === 'avatar' ? 'active' : ''}" type="button" data-action="shop-filter" data-filter="avatar">Avatarlar</button>
        </div>

        <div class="shop-grid">
          ${filtered.map((item) => {
            const owned = app.state.inventory?.includes(item.id);
            const isEquipped = profile.frameItem === item.id || profile.bgItem === item.id || profile.themeItem === item.id;

            return `
              <div class="shop-item-card" data-action="hover-shop-item" data-item-id="${escapeHtml(item.id)}">
                <div class="shop-item-preview-box ${item.kind === 'bg' ? item.id : ''}">
                  <div style="width:85%;height:36px;border-radius:8px;background:var(--bg-card);display:flex;align-items:center;justify-content:space-between;padding:0 10px;font-size:11px" class="${item.kind === 'frame' ? item.id : ''}">
                    <span>1 Ism</span>
                    <span style="color:var(--muted)">9 480</span>
                  </div>
                </div>
                <strong style="color:#ffffff;font-size:14px;margin-bottom:4px">${escapeHtml(item.name)}</strong>
                <p style="color:var(--muted);font-size:11px;margin:0 0 12px;line-height:1.4;flex:1">${escapeHtml(item.description)}</p>

                ${isEquipped ? `
                  <button class="btn btn-secondary" style="width:100%;color:var(--lime);border-color:var(--lime)" disabled>
                    ${icon('check')} Taqilgan
                  </button>
                ` : owned ? `
                  <button class="btn btn-secondary" style="width:100%" type="button" data-action="equip-item" data-item-id="${escapeHtml(item.id)}">
                    Taqish
                  </button>
                ` : `
                  <button class="btn" style="width:100%" type="button" data-action="buy-item" data-item-id="${escapeHtml(item.id)}">
                    🪙 ${formatNumber(item.price)} coin
                  </button>
                `}
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Right Sticky Live Preview -->
      <aside class="shop-sticky-card">
        <div style="font-size:11px;font-weight:800;color:var(--orange);letter-spacing:0.12em;text-transform:uppercase;margin-bottom:12px">
          PROFILINGIZDA KO‘RINIShI
        </div>
        <div style="padding:16px;border-radius:12px;display:flex;align-items:center;gap:12px;margin-bottom:20px;border:1px solid var(--border)" class="${activeBg} ${activeFrame}">
          <div class="avatar" style="width:48px;height:48px;font-size:18px">MU</div>
          <div>
            <strong style="display:block;color:#ffffff">${escapeHtml(profile.name)}</strong>
            <small style="color:var(--muted-light)">@${escapeHtml(profile.username)}</small>
          </div>
        </div>

        <div style="font-size:11px;font-weight:800;color:var(--orange);letter-spacing:0.12em;text-transform:uppercase;margin-bottom:12px">
          REYTİNGDA KO‘RINIShI
        </div>
        <div style="height:44px;border-radius:10px;display:flex;align-items:center;justify-content:space-between;padding:0 14px;border:1px solid var(--border);margin-bottom:16px" class="${activeBg} ${activeFrame}">
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-weight:800;color:var(--cyan)">#1</span>
            <span>${escapeHtml(profile.name)}</span>
          </div>
          <strong>${formatNumber(app.state.codeScore || 9480)}</strong>
        </div>

        <p style="font-size:11px;color:var(--muted);line-height:1.5;margin:0;border-top:1px solid var(--border);padding-top:14px">
          Buyum ustiga olib boring: profilingizda va reytingda qanday ko‘rinishini shu yerda jonli ko‘rasiz.
        </p>
      </aside>
    </div>
  `;
}

/* ==========================================================================
   SCREEN: TARIFLAR (PLANS)
   ========================================================================== */
function renderPlans() {
  const currentPlan = app.state.profile.plan || 'free';

  return `
    <div style="max-width:1050px;margin:0 auto">
      <div class="page-heading" style="text-align:center;display:block">
        <h1>Obuna Ta’riflari (Plans)</h1>
        <p>LumenCo imkoniyatlarini kengaytiring va sun‘iy intellekt ustozi yordamida o‘rganing.</p>
      </div>

      <div class="plans-grid">
        <!-- Free -->
        <div class="plan-card ${currentPlan === 'free' ? 'featured' : ''}">
          <h3>Free (Boshlang‘ich)</h3>
          <p style="color:var(--muted);font-size:13px">Dasturlashni endi boshlayotganlar uchun.</p>
          <div style="font-size:30px;font-weight:900;color:#ffffff;margin:14px 0 6px">0 so‘m</div>
          <div style="color:var(--muted);font-size:12px;margin-bottom:20px">Umrbod bepul</div>
          <ul style="list-style:none;padding:0;margin:0 0 24px;display:flex;flex-direction:column;gap:10px;font-size:13px;flex:1">
            <li><span style="color:var(--lime);font-weight:800">✓</span> 20 ta dars (Medium daraja)</li>
            <li><span style="color:var(--lime);font-weight:800">✓</span> Oddiy profil foni va shablonlar</li>
            <li><span style="color:var(--lime);font-weight:800">✓</span> Asosiy brauzer kompilyatori</li>
            <li><span style="color:var(--lime);font-weight:800">✓</span> Loyihalar yaratish</li>
          </ul>
          ${currentPlan === 'free' ? `
            <button class="btn btn-secondary" disabled>Amaldagi tarif</button>
          ` : `
            <button class="btn btn-secondary" type="button" data-action="select-plan" data-plan="free">Tanlash</button>
          `}
        </div>

        <!-- Pro -->
        <div class="plan-card ${currentPlan === 'pro' ? 'featured' : ''}">
          <h3>Pro (Kuchli O‘sish)</h3>
          <p style="color:var(--muted);font-size:13px">O‘rta va mustahkam bilim oluvchilar uchun.</p>
          <div style="font-size:30px;font-weight:900;color:#ffffff;margin:14px 0 6px">79 000 so‘m</div>
          <div style="color:var(--cyan);font-weight:700;font-size:12px;margin-bottom:20px">yoki 500 coin bilan / oy</div>
          <ul style="list-style:none;padding:0;margin:0 0 24px;display:flex;flex-direction:column;gap:10px;font-size:13px;flex:1">
            <li><span style="color:var(--lime);font-weight:800">✓</span> <strong>100 ta dars</strong> (Medium Solid -&gt; High)</li>
            <li><span style="color:var(--lime);font-weight:800">✓</span> <strong>AI Pet ustozi Lumi</strong> yordami</li>
            <li><span style="color:var(--lime);font-weight:800">✓</span> Animatsiyali ramkalar va fonlar ochiq</li>
            <li><span style="color:var(--lime);font-weight:800">✓</span> <strong>2x XP va Coin</strong> mukofotlari</li>
            <li><span style="color:var(--lime);font-weight:800">✓</span> Barcha muharrir temalari</li>
          </ul>
          ${currentPlan === 'pro' ? `
            <button class="btn" disabled>Amaldagi tarif</button>
          ` : `
            <button class="btn" type="button" data-action="select-plan" data-plan="pro">Faollashtirish (500 Coin)</button>
          `}
        </div>

        <!-- Max -->
        <div class="plan-card max ${currentPlan === 'max' ? 'featured' : ''}">
          <h3>Max (To‘liq AI &amp; Fullstack)</h3>
          <p style="color:var(--muted);font-size:13px">Katta tizimlar, AI va Fullstack arxitektura.</p>
          <div style="font-size:30px;font-weight:900;color:#ffffff;margin:14px 0 6px">149 000 so‘m</div>
          <div style="color:var(--orange);font-weight:700;font-size:12px;margin-bottom:20px">yoki 1 200 coin bilan / oy</div>
          <ul style="list-style:none;padding:0;margin:0 0 24px;display:flex;flex-direction:column;gap:10px;font-size:13px;flex:1">
            <li><span style="color:var(--lime);font-weight:800">✓</span> <strong>350 ta to‘liq dars</strong> (AI, Neyrotarmoqlar, Fullstack)</li>
            <li><span style="color:var(--lime);font-weight:800">✓</span> <strong>To‘liq AI Ustoz</strong>: kodingizni tekshirib yo‘naltiradi</li>
            <li><span style="color:var(--lime);font-weight:800">✓</span> <strong>Pet Garderobi</strong>: Lumi ko‘rinishini sozlash</li>
            <li><span style="color:var(--lime);font-weight:800">✓</span> <strong>Noyob VIP sariq-qora ramka</strong> va Laboratoriya foni</li>
            <li><span style="color:var(--lime);font-weight:800">✓</span> <strong>3x XP va Coin</strong> mukofotlari</li>
            <li><span style="color:var(--lime);font-weight:800">✓</span> Cheksiz loyihalar va ustuvor server tezligi</li>
          </ul>
          ${currentPlan === 'max' ? `
            <button class="btn" style="background:var(--orange)" disabled>Amaldagi tarif</button>
          ` : `
            <button class="btn" style="background:var(--orange)" type="button" data-action="select-plan" data-plan="max">Faollashtirish (1200 Coin)</button>
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
    <div style="max-width:1050px;margin:0 auto">
      <div class="page-heading">
        <div>
          <h1>LumenCo Admin Panel</h1>
          <p>Tizim boshqaruvi. Mas’ul: <strong>Muhammadbek Rafiqov (@kembodev)</strong></p>
        </div>
      </div>

      <div class="stat-grid">
        <div class="stat-card">
          <span class="stat-icon">${icon('user')}</span>
          <div><span>Foydalanuvchilar</span><strong>${users.length}</strong></div>
        </div>
        <div class="stat-card">
          <span class="stat-icon lime">${icon('gem')}</span>
          <div><span>Faol Tariflar</span><strong>Max (2) · Pro (2)</strong></div>
        </div>
        <div class="stat-card">
          <span class="stat-icon orange">${icon('shield')}</span>
          <div><span>Bloklanganlar</span><strong>${users.filter((u) => u.isBanned).length}</strong></div>
        </div>
        <div class="stat-card">
          <span class="stat-icon purple">${icon('bolt')}</span>
          <div><span>Server Holati</span><strong style="color:var(--lime)">Online</strong></div>
        </div>
      </div>

      <div class="panel" style="padding:0;overflow:hidden">
        <table style="width:100%;border-collapse:collapse">
          <thead>
            <tr style="border-bottom:1px solid var(--border);color:var(--muted);font-size:11px;text-transform:uppercase">
              <th style="padding:14px 18px;text-align:left">Foydalanuvchi</th>
              <th style="padding:14px 18px;text-align:left">Email</th>
              <th style="padding:14px 18px;text-align:left">Tarif</th>
              <th style="padding:14px 18px;text-align:left">Balans</th>
              <th style="padding:14px 18px;text-align:left">Holat</th>
              <th style="padding:14px 18px;text-align:right">Amallar</th>
            </tr>
          </thead>
          <tbody>
            ${users.map((u) => `
              <tr style="border-bottom:1px solid var(--border)">
                <td style="padding:14px 18px">
                  <strong>${escapeHtml(u.name)}</strong>
                  <small style="color:var(--muted);display:block">@${escapeHtml(u.username)}</small>
                </td>
                <td style="padding:14px 18px;color:var(--muted-light)">${escapeHtml(u.email)}</td>
                <td style="padding:14px 18px">
                  <select class="pill-badge" data-action="admin-change-plan" data-user-id="${escapeHtml(u.id)}">
                    <option value="free" ${u.plan === 'free' ? 'selected' : ''}>Free</option>
                    <option value="pro" ${u.plan === 'pro' ? 'selected' : ''}>Pro</option>
                    <option value="max" ${u.plan === 'max' ? 'selected' : ''}>Max</option>
                  </select>
                </td>
                <td style="padding:14px 18px">
                  <strong>${formatNumber(u.coins || 0)} coin</strong>
                </td>
                <td style="padding:14px 18px">
                  <span style="padding:3px 8px;border-radius:6px;font-size:11px;font-weight:700;background:${u.isBanned ? 'rgba(239,68,68,0.15);color:#ef4444' : 'rgba(16,185,129,0.15);color:#10b981'}">
                    ${u.isBanned ? 'Bloklangan' : 'Faol'}
                  </span>
                </td>
                <td style="padding:14px 18px;text-align:right">
                  <div style="display:inline-flex;gap:6px">
                    <button class="${u.isBanned ? 'btn btn-secondary' : 'btn btn-danger'}" style="height:32px;padding:0 10px;font-size:11px" type="button" data-action="admin-toggle-ban" data-user-id="${escapeHtml(u.id)}">
                      ${u.isBanned ? 'Blokdan chiqarish' : 'Ban qilish'}
                    </button>
                    <button class="btn btn-secondary" style="height:32px;padding:0 10px;font-size:11px" type="button" data-action="admin-give-coins" data-user-id="${escapeHtml(u.id)}">
                      +500 Coin
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
   SCREEN: DARSLAR
   ========================================================================== */
function renderLessons() {
  const lessons = app.state.lessons || [];
  const tracks = ['Barchasi', ...new Set(lessons.map((l) => l.track))];
  const filtered = lessons.filter((l) => app.lessonFilter === 'Barchasi' || l.track === app.lessonFilter);

  return `
    <div>
      <div class="page-heading">
        <div>
          <h1>Dasturlash Darslari</h1>
          <p>HTML, CSS, JavaScript, SOLID arxitekturasi va AI darsliklari.</p>
        </div>
      </div>

      <div class="filter-tabs">
        ${tracks.map((t) => `
          <button class="filter-tab-btn ${app.lessonFilter === t ? 'active' : ''}" type="button" data-action="lesson-filter" data-filter="${escapeHtml(t)}">
            ${escapeHtml(t)}
          </button>
        `).join('')}
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(280px, 1fr));gap:16px">
        ${filtered.map((l) => {
          const completed = app.state.completedLessons?.includes(l.id);
          return `
            <div class="panel" style="display:flex;flex-direction:column;justify-content:space-between">
              <div>
                <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:11px;font-weight:700">
                  <span style="color:var(--cyan)">${escapeHtml(l.track)}</span>
                  <span style="color:var(--muted)">${escapeHtml(l.level)}</span>
                </div>
                <h3 style="margin:0 0 8px;font-size:15px">${escapeHtml(l.title)}</h3>
                <div style="font-size:12px;color:var(--muted)">⏱️ ${escapeHtml(l.duration)} · +${l.xp} XP</div>
              </div>
              <div style="margin-top:16px;display:flex;justify-content:space-between;align-items:center">
                <span style="color:var(--gold);font-weight:700">+${l.coins} coin</span>
                <button class="btn ${completed ? 'btn-secondary' : ''}" style="height:32px;font-size:11px" type="button" data-action="open-lesson" data-lesson-id="${escapeHtml(l.id)}">
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
   SCREEN: PROFIL
   ========================================================================== */
function renderProfile() {
  const profile = app.state.profile;

  return `
    <div style="max-width:850px;margin:0 auto">
      <div class="page-heading">
        <div>
          <h1>Foydalanuvchi Profili</h1>
          <p>Shaxsiy ma’lumotlaringiz va jihozlangan bezaklar.</p>
        </div>
      </div>

      <div class="panel ${profile.bgItem || ''} ${profile.frameItem || ''}" style="display:flex;align-items:center;gap:20px;margin-bottom:24px">
        <div class="avatar" style="width:70px;height:70px;font-size:24px">MU</div>
        <div>
          <h2 style="margin:0 0 4px">${escapeHtml(profile.name)}</h2>
          <div style="color:var(--cyan);font-weight:700">@${escapeHtml(profile.username)} · ${escapeHtml(profile.role.toUpperCase())}</div>
          <p style="color:var(--muted-light);margin:6px 0 0;font-size:13px">${escapeHtml(profile.bio || 'LumenCo dasturchisi')}</p>
        </div>
      </div>

      <div class="panel">
        <h3 style="margin-top:0">Profilni tahrirlash</h3>
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
          <button class="btn" type="submit">Saqlash</button>
        </form>
      </div>
    </div>
  `;
}

/* ==========================================================================
   APP RENDER ROUTER
   ========================================================================== */
function render() {
  if (!app.state) {
    if (app.backend === 'supabase') renderAuth();
    return;
  }

  if (app.state.profile.isBanned) {
    appRoot.innerHTML = `
      <main style="min-height:80vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:30px">
        <div class="panel" style="max-width:440px;border-color:var(--danger)">
          <div style="font-size:48px;margin-bottom:12px;color:var(--danger)">🚫</div>
          <h2 style="margin:0 0 8px;color:#ffffff">Hisobingiz Cheklangan</h2>
          <p style="color:var(--muted-light);margin-bottom:20px">Qoidabuzarlik yoki tekshiruv sababli ma’muriyat tomonidan hisobingiz bloklangan.</p>
          <button class="btn" type="button" data-action="unban-self-test">Blokdan chiqarish (Test)</button>
        </div>
      </main>
    `;
    return;
  }

  let content = '';
  switch (app.screen) {
    case 'editor': content = renderEditorScreen(); break;
    case 'compiler': content = renderCompiler(); break;
    case 'typing': content = renderTypingGame(); break;
    case 'leaderboard': content = renderLeaderboard(); break;
    case 'shop': content = renderShop(); break;
    case 'plans': content = renderPlans(); break;
    case 'admin': content = renderAdmin(); break;
    case 'lessons': content = renderLessons(); break;
    case 'profile': content = renderProfile(); break;
    default: content = renderWorkspace();
  }

  renderShell(content);

  if (app.screen === 'compiler') runCompilerCode();

  if (app.screen === 'typing' && !app.typingFinished) {
    const input = document.getElementById('typing-hidden-input');
    if (input) {
      input.focus();
      input.oninput = handleTypingInput;
    }
  }
}

function handleTypingInput(e) {
  if (!app.typingStartTime) {
    app.typingStartTime = Date.now();
    app.typingTimer = setInterval(() => {
      app.typingTimeLeft -= 1;
      if (app.typingTimeLeft <= 0) {
        clearInterval(app.typingTimer);
        finishTypingGame();
      } else {
        const seconds = Math.max(1, (Date.now() - app.typingStartTime) / 1000);
        app.typingWpm = Math.round((app.typingIndex / 5 / seconds) * 60);
        const wpmEl = document.getElementById('typing-wpm');
        const timeEl = document.getElementById('typing-time');
        if (wpmEl) wpmEl.textContent = app.typingWpm;
        if (timeEl) timeEl.textContent = `${app.typingTimeLeft}s`;
      }
    }, 1000);
  }

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

  const seconds = Math.max(1, (Date.now() - app.typingStartTime) / 1000);
  app.typingWpm = Math.round((app.typingIndex / 5 / seconds) * 60);
  const total = app.typingIndex + app.typingMistakes;
  app.typingAcc = total > 0 ? Math.round((app.typingIndex / total) * 100) : 100;

  e.target.value = '';

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

async function finishTypingGame() {
  app.typingFinished = true;
  if (app.typingTimer) clearInterval(app.typingTimer);
  try {
    app.state = await request('/api/game/record', {
      method: 'POST',
      body: JSON.stringify({ wpm: app.typingWpm, accuracy: app.typingAcc })
    });
    toast('Tabriklaymiz! +50 XP va +30 Coin hisobingizga qo‘shildi!');
  } catch (err) {
    toast(err.message, 'error');
  }
  render();
}

/* ==========================================================================
   MODAL RENDER
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
      'Loyiha nomini va boshlang‘ich shablonni tanlang.',
      `
        <form id="new-project-form" data-form="new-project">
          <div class="field">
            <label>Loyiha nomi</label>
            <input name="name" placeholder="Masalan: Shaxsiy Portfolio" required autofocus />
          </div>
          <div class="field">
            <label>Shablon</label>
            <select name="template">
              <option value="portfolio">Portfolio (HTML, CSS, JS)</option>
              <option value="webapp">Veb ilova (Modulli)</option>
              <option value="blank">Bo‘sh loyiha</option>
            </select>
          </div>
        </form>
      `,
      `
        <button class="btn btn-secondary" type="button" data-action="close-modal">Bekor qilish</button>
        <button class="btn" type="submit" form="new-project-form">Yaratish</button>
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
        <button class="btn btn-secondary" type="button" data-action="close-modal">Bekor qilish</button>
        <button class="btn" type="submit" form="new-file-form">Fayl yaratish</button>
      `
    );
  } else if (app.modal === 'pet-wardrobe') {
    const pet = app.state.profile.petConfig || {};
    modalRoot.innerHTML = modalFrame(
      'Lumi Garderobi',
      'AI ustozi Lumi rangini va aksessuarlarini sozlang.',
      `
        <form id="pet-wardrobe-form" data-form="pet-wardrobe">
          <div class="field">
            <label>Pet Ismi</label>
            <input name="name" value="${escapeHtml(pet.name || 'Lumi')}" required />
          </div>
          <div class="field">
            <label>Rangi</label>
            <select name="color">
              <option value="cyan" ${pet.color === 'cyan' ? 'selected' : ''}>Kiber Moviy</option>
              <option value="lime" ${pet.color === 'lime' ? 'selected' : ''}>Zumrad Yashil</option>
              <option value="gold" ${pet.color === 'gold' ? 'selected' : ''}>Oltin Sariq</option>
              <option value="purple" ${pet.color === 'purple' ? 'selected' : ''}>Binafsha</option>
            </select>
          </div>
        </form>
      `,
      `
        <button class="btn btn-secondary" type="button" data-action="close-modal">Yopish</button>
        <button class="btn" type="submit" form="pet-wardrobe-form">Saqlash</button>
      `
    );
  } else if (app.modal === 'lesson') {
    const lesson = app.state.lessons?.find((l) => l.id === app.modalLessonId);
    if (!lesson) return;
    const completed = app.state.completedLessons?.includes(lesson.id);

    modalRoot.innerHTML = modalFrame(
      escapeHtml(lesson.title),
      `${escapeHtml(lesson.track)} · ${escapeHtml(lesson.level)} · ${escapeHtml(lesson.duration)}`,
      `
        <div style="font-size:13px;line-height:1.6;color:var(--ink-secondary)">
          <p>Ushbu darsda siz <strong>${escapeHtml(lesson.title)}</strong> mavzusini amaliy tarzda o‘rganasiz.</p>
          <div style="background:#090d16;border:1px solid var(--border);border-radius:10px;padding:16px;margin:16px 0;font-family:var(--font-mono);font-size:12px;color:var(--cyan)">
            // Mavzu kodi<br>
            const lesson = "${escapeHtml(lesson.title)}";<br>
            console.log("Muvaffaqiyatli yakunlandi!");
          </div>
          <div style="padding:12px;background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:10px;color:var(--gold);font-weight:700">
            Mukofot: +${lesson.xp} XP · +${lesson.coins} Coin
          </div>
        </div>
      `,
      `
        <button class="btn btn-secondary" type="button" data-action="close-modal">Yopish</button>
        <button class="btn" type="button" data-action="complete-lesson" data-lesson-id="${escapeHtml(lesson.id)}" ${completed ? 'disabled' : ''}>
          ${completed ? '✓ Bajarilgan' : 'Darsni yakunlash'}
        </button>
      `
    );
  }
}

/* ==========================================================================
   EVENT HANDLERS
   ========================================================================== */
async function handleClick(e) {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const action = btn.dataset.action;

  if (action === 'navigate') return navigate(btn.dataset.screen);
  if (action === 'toggle-fullscreen') return toggleFullscreen();
  if (action === 'close-modal' || (action === 'backdrop-close' && e.target === btn)) return closeModal();
  if (action === 'new-project') return openModal('new-project');
  if (action === 'new-file') return openModal('new-file');
  if (action === 'open-project') { app.projectId = btn.dataset.projectId; return render(); }
  if (action === 'select-file') { app.filePath = btn.dataset.path; return render(); }
  if (action === 'save-active-file') {
    const input = document.getElementById('project-code-input');
    if (input && app.projectId && app.filePath) {
      try {
        app.state = await request(`/api/projects/${app.projectId}/files`, {
          method: 'PUT',
          body: JSON.stringify({ path: app.filePath, content: input.value })
        });
        toast('Fayl saqlandi!');
        render();
      } catch (err) { toast(err.message, 'error'); }
    }
    return;
  }
  if (action === 'shop-filter') { app.shopFilter = btn.dataset.filter; return render(); }
  if (action === 'lesson-filter') { app.lessonFilter = btn.dataset.filter; return render(); }
  if (action === 'hover-shop-item') {
    const item = app.state.shopItems?.find((it) => it.id === btn.dataset.itemId);
    if (item) { app.hoveredShopItem = item; render(); }
    return;
  }
  if (action === 'buy-item') {
    try {
      app.state = await request('/api/shop/purchase', { method: 'POST', body: JSON.stringify({ itemId: btn.dataset.itemId }) });
      toast('Bezak xarid qilindi!');
      render();
    } catch (err) { toast(err.message, 'error'); }
    return;
  }
  if (action === 'equip-item') {
    try {
      app.state = await request('/api/profile/equip', { method: 'PATCH', body: JSON.stringify({ itemId: btn.dataset.itemId }) });
      toast('Profil ko‘rinishi yangilandi!');
      render();
    } catch (err) { toast(err.message, 'error'); }
    return;
  }
  if (action === 'select-plan') {
    try {
      app.state = await request('/api/plans/select', { method: 'POST', body: JSON.stringify({ plan: btn.dataset.plan }) });
      toast(`Tarif ${btn.dataset.plan.toUpperCase()} faollashtirildi!`);
      render();
    } catch (err) { toast(err.message, 'error'); }
    return;
  }
  if (action === 'open-lesson') {
    app.modalLessonId = btn.dataset.lessonId;
    return openModal('lesson');
  }
  if (action === 'complete-lesson') {
    try {
      app.state = await request(`/api/lessons/${btn.dataset.lessonId}/complete`, { method: 'POST' });
      toast('Dars yakunlandi va mukofot berildi!');
      closeModal();
      render();
    } catch (err) { toast(err.message, 'error'); }
    return;
  }
  if (action === 'pet-talk') {
    app.petBubbleIndex += 1;
    return render();
  }
  if (action === 'open-pet-wardrobe') return openModal('pet-wardrobe');
  if (action === 'run-compiler') return runCompilerCode();
  if (action === 'reset-compiler') {
    app.compilerHtml = `<h1>Salom Dunyo</h1>`;
    app.compilerCss = `body { padding: 20px; font-family: sans-serif; }`;
    app.compilerJs = ``;
    render();
    return;
  }
  if (action === 'compiler-tab') { app.compilerTab = btn.dataset.tab; return render(); }
  if (action === 'save-compiler-to-project') {
    try {
      app.state = await request('/api/projects', {
        method: 'POST',
        body: JSON.stringify({ name: 'Kompilyator Loyihasi', template: 'blank' })
      });
      toast('Yangi loyiha sifatida saqlandi!');
      app.screen = 'workspace';
      render();
    } catch (err) { toast(err.message, 'error'); }
    return;
  }
  if (action === 'restart-typing') { initTypingGame(); return render(); }
  if (action === 'admin-toggle-ban') {
    try {
      app.state = await request('/api/admin/ban', { method: 'POST', body: JSON.stringify({ userId: btn.dataset.userId }) });
      toast('Foydalanuvchi holati yangilandi!');
      render();
    } catch (err) { toast(err.message, 'error'); }
    return;
  }
  if (action === 'admin-give-coins') {
    try {
      app.state = await request('/api/admin/coins', { method: 'POST', body: JSON.stringify({ userId: btn.dataset.userId, amount: 500 }) });
      toast('500 Coin qo‘shildi!');
      render();
    } catch (err) { toast(err.message, 'error'); }
    return;
  }
  if (action === 'unban-self-test') {
    try {
      app.state = await request('/api/admin/ban', { method: 'POST', body: JSON.stringify({ userId: app.state.profile.id }) });
      toast('Hisob blokdan chiqarildi!');
      render();
    } catch (err) { toast(err.message, 'error'); }
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
      app.state = await request('/api/projects', { method: 'POST', body: JSON.stringify({ name: values.get('name'), template: values.get('template') }) });
      closeModal();
      toast('Loyiha yaratildi!');
      render();
    } catch (err) { toast(err.message, 'error'); }
    return;
  }
  if (kind === 'new-file') {
    try {
      const p = getProject();
      if (!p) throw new Error('Loyiha topilmadi.');
      app.state = await request(`/api/projects/${p.id}/files`, { method: 'POST', body: JSON.stringify({ path: values.get('path'), content: '' }) });
      app.filePath = values.get('path');
      closeModal();
      toast('Fayl yaratildi!');
      render();
    } catch (err) { toast(err.message, 'error'); }
    return;
  }
  if (kind === 'profile') {
    try {
      app.state = await request('/api/profile', {
        method: 'PATCH',
        body: JSON.stringify({ name: values.get('name'), username: values.get('username'), bio: values.get('bio') })
      });
      toast('Profil saqlandi!');
      render();
    } catch (err) { toast(err.message, 'error'); }
    return;
  }
  if (kind === 'pet-wardrobe') {
    try {
      app.state = await request('/api/pet/customize', {
        method: 'POST',
        body: JSON.stringify({ name: values.get('name'), color: values.get('color') })
      });
      closeModal();
      toast('Lumi ko‘rinishi yangilandi!');
      render();
    } catch (err) { toast(err.message, 'error'); }
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
  if (e.target.matches('[data-locale-picker]')) return setLocale(e.target.value);
  if (e.target.dataset.action === 'admin-change-plan') {
    try {
      app.state = await request('/api/admin/plan', {
        method: 'POST',
        body: JSON.stringify({ userId: e.target.dataset.userId, plan: e.target.value })
      });
      toast('Foydalanuvchi tarifi yangilandi!');
      render();
    } catch (err) { toast(err.message, 'error'); }
  }
  if (e.target.dataset.action === 'compiler-load-template') {
    const val = e.target.value;
    if (val === 'clock') {
      app.compilerHtml = `<div style="text-align:center;padding:50px"><h1 id="clock" style="font-size:46px;color:#38bdf8">00:00:00</h1></div><script>setInterval(()=>{ document.getElementById('clock').textContent = new Date().toLocaleTimeString(); }, 1000);<\/script>`;
      app.compilerCss = `body { background: #0c101a; color: white; }`;
      app.compilerJs = ``;
    } else if (val === 'ball') {
      app.compilerHtml = `<canvas id="canvas" width="400" height="280" style="background:#141b2d;display:block;margin:20px auto;border-radius:12px"></canvas><script>const c = document.getElementById('canvas').getContext('2d'); let y = 50, vy = 2; function loop() { c.clearRect(0,0,400,280); c.fillStyle = '#38bdf8'; c.beginPath(); c.arc(200, y, 18, 0, Math.PI*2); c.fill(); y += vy; if(y>260||y<20) vy=-vy; requestAnimationFrame(loop); } loop();<\/script>`;
    }
    runCompilerCode();
  }
}

window.addEventListener('message', (e) => {
  if (e.data?.type === 'compiler-console') {
    app.compilerConsole.push(e.data.text);
  }
});

/* ==========================================================================
   AUTH PAGE
   ========================================================================== */
function renderAuth() {
  const isSignup = app.authMode === 'signup';
  appRoot.innerHTML = `
    <main class="auth-page">
      <section class="auth-card">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:30px">
          <a class="brand" href="#" style="padding:0">
            <span class="brand-mark">L</span>
            <span class="brand-word">LumenCo<small>Build. Keep growing.</small></span>
          </a>
          <select class="locale-picker" data-locale-picker>
            <option value="uz" ${app.locale === 'uz' ? 'selected' : ''}>UZ</option>
            <option value="en" ${app.locale === 'en' ? 'selected' : ''}>EN</option>
            <option value="ru" ${app.locale === 'ru' ? 'selected' : ''}>RU</option>
          </select>
        </div>

        <h1 style="margin:0 0 8px;font-size:26px">${isSignup ? 'Hisob yarating' : 'LumenCo hisobingizga kiring'}</h1>
        <p style="color:var(--muted-light);margin:0 0 24px">${isSignup ? 'Boshlash bepul. Dasturlashni o‘rganing va loyihalar yarating.' : 'Loyihalaringiz va o‘sishingiz bitta joyda.'}</p>

        <form data-form="auth-form" onsubmit="handleAuthSubmit(event)">
          ${isSignup ? `
            <div class="field">
              <label>Ismingiz</label>
              <input name="name" required placeholder="Muhammadbek Rafiqov" />
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
          <button class="btn" style="width:100%;height:42px;margin-top:10px" type="submit">
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
        <span style="font-size:12px;font-weight:800;letter-spacing:0.12em;color:var(--cyan)">BUILD YOUR NEXT IDEA</span>
        <h2 style="font-size:clamp(32px, 4vw, 44px);line-height:1.15;margin:16px 0;color:#ffffff">
          Every line moves you forward.
        </h2>
        <p style="color:var(--muted-light);max-width:440px;line-height:1.6">
          Learn, build and keep your work organized in one calm studio workspace.
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
  } catch (err) { toast(err.message, 'error'); }
};

/* ==========================================================================
   BOOTSTRAP
   ========================================================================== */
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
