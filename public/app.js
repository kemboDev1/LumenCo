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
  filePlus: '<path d="M13 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8"/><path d="M13 3v7h7M16 17h6M19 14v6"/>',
  folderPlus: '<path d="M3 6a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8"/><path d="M3 9h17M3 9v9a2 2 0 0 0 2 2h7M18 17v6M15 20h6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  save: '<path d="M5 3h12l4 4v14H3V3z"/><path d="M7 3v6h10V3M7 21v-8h10v8"/>',
  external: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  award: '<circle cx="12" cy="8" r="6"/><path d="m8.2 13-1.4 8 5.2-3 5.2 3-1.4-8"/>',
  bolt: '<path d="m13 2-3 9h7l-6 11 1-9H5z"/>',
  more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  arrowUp: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  refresh: '<path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.7 9a7 7 0 0 1 11.6-2.6L20 12M4 12l2.7 5.6A7 7 0 0 0 18.3 15"/>',
  terminal: '<path d="m4 17 5-5-5-5M12 19h8"/>',
  shield: '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z"/><path d="m9 12 2 2 4-4"/>',
  search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4 4"/>',
  gift: '<path d="M20 12v9H4v-9M2 7h20v5H2zM12 7v14M12 7H7a2.5 2.5 0 1 1 2.5-2.5C9.5 7 12 7 12 7ZM12 7h5a2.5 2.5 0 1 0-2.5-2.5C14.5 7 12 7 12 7Z"/>',
  play: '<path d="m8 5 11 7-11 7z"/>',
  eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  heart: '<path d="M20.8 8.9c0 4.6-8.8 10-8.8 10S3.2 13.5 3.2 8.9A4.4 4.4 0 0 1 12 6.8a4.4 4.4 0 0 1 8.8 2.1Z"/>',
  coin: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5c-.7-.8-1.8-1.2-3.2-1.2-1.8 0-3 .8-3 2s1.1 1.9 3 2.2 3 .9 3 2.2-1.2 2-3.1 2c-1.4 0-2.6-.5-3.4-1.4M12.3 5.5v13"/>'
};

const appRoot = document.getElementById('app');
const modalRoot = document.getElementById('modal-root');
const toastRoot = document.getElementById('toast-root');
const app = {
  state: null,
  screen: 'workspace',
  projectId: null,
  filePath: null,
  modal: null,
  shopFilter: 'all',
  lessonFilter: 'Barchasi',
  dirty: false,
  saveTimer: null,
  saving: false,
  modalLessonId: null,
  pendingPurchaseId: null,
  pendingDeletePath: null,
  locale: localStorage.getItem('lumenco-locale') || 'en',
  backend: 'local',
  authenticated: false,
  authMode: 'signin',
  authNotice: ''
};

function icon(name, extra = '') {
  return `<span class="icon ${extra}" aria-hidden="true"><svg viewBox="0 0 24 24">${ICONS[name] || ICONS.file}</svg></span>`;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

function formatNumber(value) {
  return new Intl.NumberFormat(LumenI18n.localeTag(app.locale)).format(Number(value) || 0);
}

function formatDate(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat(LumenI18n.localeTag(app.locale), { day: 'numeric', month: 'short' }).format(new Date(value));
}

function setLocale(locale) {
  if (!['en', 'uz', 'ru'].includes(locale)) return;
  app.locale = locale;
  localStorage.setItem('lumenco-locale', locale);
  document.documentElement.lang = locale;
  document.title = locale === 'uz' ? 'LumenCo — kod yoz va o‘s' : locale === 'ru' ? 'LumenCo — создавай и расти' : 'LumenCo — build and grow';
  render();
}

function getProject() {
  return app.state?.projects?.find((project) => project.id === app.projectId) || app.state?.projects?.[0] || null;
}

function getSelectedFile() {
  const project = getProject();
  if (!project || !app.filePath || !Object.hasOwn(project.files, app.filePath)) return null;
  return { path: app.filePath, content: project.files[app.filePath] };
}

function avatarForProfile(profile, large = false) {
  const item = app.state?.shopItems.find((entry) => entry.id === profile?.avatarItem);
  const letter = (profile?.name || 'L').slice(0, 1).toUpperCase();
  const color = profile?.avatarItem === 'avatar-comet' ? 'peach' : profile?.avatarItem === 'avatar-cobalt' ? 'blue' : 'lime';
  return `<span class="avatar ${color} ${large ? 'large' : ''}">${item ? item.emoji : escapeHtml(letter)}</span>`;
}

function currentItem(id) {
  return app.state?.shopItems.find((item) => item.id === id);
}

async function request(url, options = {}) {
  if (app.backend === 'supabase') return LumenBackend.apiRequest(url, options);
  const response = await fetch(url, {
    ...options,
    headers: { 'content-type': 'application/json', ...(options.headers || {}) }
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || 'So‘rov bajarilmadi.');
  return body;
}

function toast(message, type = 'success') {
  const item = document.createElement('div');
  item.className = `toast ${type === 'error' ? 'error' : ''}`;
  item.innerHTML = `<span class="toast-mark">${type === 'error' ? '!' : '✓'}</span><span>${escapeHtml(LumenI18n.translateText(message, app.locale))}</span>`;
  toastRoot.appendChild(item);
  window.setTimeout(() => item.remove(), 3500);
}

function screenName(screen) {
  return ({ workspace: 'Ish maydoni', editor: 'Kod muharriri', lessons: 'Darslar', shop: 'Coin do‘koni', profile: 'Profil' })[screen] || 'Ish maydoni';
}

function navButton(screen, label, iconName, badge = '') {
  return `<button class="nav-link ${app.screen === screen ? 'active' : ''}" type="button" data-action="navigate" data-screen="${screen}" ${app.screen === screen ? 'aria-current="page"' : ''}>${icon(iconName)}<span>${label}</span>${badge ? `<span class="nav-count">${badge}</span>` : ''}</button>`;
}

function renderShell(content) {
  const profile = app.state.profile;
  appRoot.innerHTML = `
    <div class="app-shell">
      <aside class="sidebar" aria-label="Asosiy menyu">
        <a class="brand" href="#home" data-action="navigate" data-screen="workspace" aria-label="LumenCo ish maydoni">
          <span class="brand-mark" aria-hidden="true">L</span><span class="brand-word">LumenCo<small>Kod yoz. O‘sib bor.</small></span>
        </a>
        <p class="side-label">Ish joyi</p>
        <nav class="nav-list">
          ${navButton('workspace', 'Ish maydoni', 'home')}
          ${navButton('editor', 'Muharrir', 'code')}
          ${navButton('lessons', 'Darslar', 'book')}
        </nav>
        <p class="side-label">Hamjamiyat</p>
        <nav class="nav-list">
          ${navButton('shop', 'Coin do‘koni', 'shop')}
          ${navButton('profile', 'Profil', 'user')}
        </nav>
        <div class="sidebar-spacer"></div>
        <div class="sidebar-card">
          <small>Har kuni ozgina</small><strong>Bugun yangi bir narsa o‘rgan.</strong>
          <button type="button" data-action="navigate" data-screen="lessons">Darslarni ko‘r ${icon('arrow')}</button>
        </div>
        <div class="sidebar-footer">
          ${avatarForProfile(profile)}
          <div class="profile-snippet"><strong>${escapeHtml(profile.name)}</strong><span>@${escapeHtml(profile.username)}</span></div>
          <button class="profile-more" type="button" data-action="navigate" data-screen="profile" aria-label="Profilni ochish">${icon('more')}</button>
        </div>
      </aside>
      <section class="main-panel">
        <header class="topbar">
          <div class="crumbs"><span>LumenCo</span>${icon('chevron')}<strong>${screenName(app.screen)}</strong></div>
          <div class="topbar-right">
            <label class="locale-picker-label"><span class="sr-only">Til</span><select class="locale-picker" aria-label="Language" data-locale-picker><option value="en" ${app.locale === 'en' ? 'selected' : ''}>EN</option><option value="uz" ${app.locale === 'uz' ? 'selected' : ''}>UZ</option><option value="ru" ${app.locale === 'ru' ? 'selected' : ''}>RU</option></select></label>
            <button class="coin-pill" type="button" data-action="navigate" data-screen="shop" aria-label="Coin do‘konini ochish"><span class="coin-symbol">L</span>${formatNumber(app.state.coins)} <span>coin</span></button>
            <button class="topbar-profile" type="button" data-action="navigate" data-screen="profile" aria-label="Profilni ochish">${avatarForProfile(profile)}<strong>${escapeHtml(profile.name)}</strong>${icon('down')}</button>
          </div>
        </header>
        <main class="content" id="main-content">${content}</main>
      </section>
      <nav class="mobile-nav" aria-label="Pastki menyu">
        ${navButton('workspace', 'Ish joyi', 'home')}
        ${navButton('editor', 'Muharrir', 'code')}
        ${navButton('lessons', 'Darslar', 'book')}
        ${navButton('shop', 'Do‘kon', 'shop')}
        ${navButton('profile', 'Profil', 'user')}
      </nav>
    </div>`;
  appRoot.innerHTML = LumenI18n.translateMarkup(appRoot.innerHTML, app.locale);
  document.documentElement.lang = app.locale;
}

function renderAuth() {
  const isSignup = app.authMode === 'signup';
  const heading = isSignup ? 'Hisob yarating' : 'LumenCo hisobingizga kiring';
  const intro = isSignup ? 'Boshlash bepul. Dasturlashni o‘rganing va loyihalar yarating.' : 'Loyihalaringiz va o‘sishingiz bitta joyda.';
  appRoot.innerHTML = `<main class="auth-page"><section class="auth-card"><div class="auth-brand"><span class="brand-mark" aria-hidden="true">L</span><span class="brand-word">LumenCo<small>Build. Keep growing.</small></span><label class="locale-picker-label"><span class="sr-only">Language</span><select class="locale-picker" aria-label="Language" data-locale-picker><option value="en" ${app.locale === 'en' ? 'selected' : ''}>EN</option><option value="uz" ${app.locale === 'uz' ? 'selected' : ''}>UZ</option><option value="ru" ${app.locale === 'ru' ? 'selected' : ''}>RU</option></select></label></div><p class="eyebrow"><span class="status-dot"></span> LumenCo coding studio</p><h1>${heading}</h1><p class="auth-intro">${intro}</p>${app.authNotice ? `<div class="auth-notice">${escapeHtml(app.authNotice)}</div>` : ''}<form class="auth-form" data-form="auth">${isSignup ? `<div class="field"><label for="auth-name">Ismingiz</label><input id="auth-name" name="name" autocomplete="name" minlength="2" maxlength="40" required /></div><div class="field"><label for="auth-username">Foydalanuvchi nomi</label><input id="auth-username" name="username" autocomplete="username" pattern="[a-zA-Z0-9._]{3,24}" minlength="3" maxlength="24" required /></div>` : ''}<div class="field"><label for="auth-email">Email manzili</label><input id="auth-email" type="email" name="email" autocomplete="email" required /></div><div class="field"><label for="auth-password">Parol</label><input id="auth-password" type="password" name="password" autocomplete="${isSignup ? 'new-password' : 'current-password'}" minlength="8" required />${isSignup ? '<small>Parol kamida 8 ta belgi bo‘lsin.</small>' : ''}</div><button class="btn auth-submit" type="submit">${isSignup ? 'Hisob yaratish' : 'Kirish'} ${icon('arrow')}</button></form><p class="auth-switch">${isSignup ? 'Hisobingiz bormi?' : 'Hisobingiz yo‘qmi?'} <button type="button" data-action="auth-toggle">${isSignup ? 'Kirish' : 'Ro‘yxatdan o‘tish'}</button></p><div class="auth-footnote">Projects · Lessons · Code editor · Community</div></section><aside class="auth-side"><span class="auth-orbit"></span><div class="auth-side-copy"><span class="auth-kicker">BUILD YOUR NEXT IDEA</span><h2>Every line moves you forward.</h2><p>Learn, build and keep your work organized in one calm workspace.</p><div class="auth-code-card"><span>01&nbsp;&nbsp; const idea = "yours";</span><span>02&nbsp;&nbsp; build(idea);</span><span>03&nbsp;&nbsp; growTogether();</span></div></div><div class="auth-side-footer">A little progress, every day.</div></aside></main>`;
  appRoot.innerHTML = LumenI18n.translateMarkup(appRoot.innerHTML, app.locale);
  document.documentElement.lang = app.locale;
}

function rankProgress(rank, color) {
  const percent = Math.max(0, Math.min(100, Number(rank.progress) || 0));
  const key = rank.key ? `data-rank-progress="${escapeHtml(rank.key)}"` : '';
  return `<div class="progress-track ${color === 'lime' ? 'lime' : ''}" ${key} role="progressbar" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100" aria-label="${escapeHtml(rank.name)} daraja progressi"><span style="width:${percent}%"></span></div>`;
}

function renderRankPanel() {
  const creator = app.state.creatorRank;
  const developer = app.state.developerRank;
  return `<section class="panel rank-card" data-rank-summary>
    <h3>Ikki yo‘l, bitta o‘sish</h3><p class="rank-description">Loyiha soni va saqlangan kod alohida hisoblanadi.</p>
    <div class="rank-line"><strong>${icon('layers')} <span data-rank-name="creator">${escapeHtml(creator.name)}</span></strong><span data-rank-subtitle="creator">${escapeHtml(creator.subtitle)}</span></div>${rankProgress({ ...creator, key: 'creator' }, 'lime')}
    <div class="rank-line"><strong>${icon('code')} <span data-rank-name="developer">${escapeHtml(developer.name)}</span></strong><span data-rank-subtitle="developer">${escapeHtml(developer.subtitle)}</span></div>${rankProgress({ ...developer, key: 'developer' }, 'blue')}
    <div class="rank-note">${icon('shield')} Fayllar, kod qatorlari, ma’noli papkalar va testlar Developer balliga qo‘shiladi.</div>
  </section>`;
}

function statCard(iconName, label, value, color = '') {
  return `<article class="stat-card"><span class="stat-icon ${color}">${icon(iconName)}</span><div><span>${label}</span><strong>${value}</strong></div></article>`;
}

function languageFor(pathName) {
  const extension = (pathName.split('.').pop() || '').toLowerCase();
  return ({ html: 'HTML', htm: 'HTML', css: 'CSS', js: 'JavaScript', jsx: 'JSX', ts: 'TypeScript', tsx: 'TSX', json: 'JSON', md: 'Markdown', py: 'Python' })[extension] || 'Matn';
}

function fileGlyph(pathName) {
  const extension = (pathName.split('.').pop() || '').toLowerCase();
  return extension === 'html' || extension === 'htm' ? '‹›' : extension === 'css' ? '#' : extension === 'js' || extension === 'jsx' ? 'JS' : extension === 'ts' || extension === 'tsx' ? 'TS' : extension === 'json' ? '{}' : '·';
}

function editorTree(project) {
  const folders = [...new Set(project.folders || [])].sort((a, b) => a.localeCompare(b));
  const files = Object.keys(project.files || {}).sort((a, b) => a.localeCompare(b));
  const paths = new Set(folders);
  for (const filePath of files) {
    const parts = filePath.split('/').slice(0, -1);
    for (let i = 1; i <= parts.length; i += 1) paths.add(parts.slice(0, i).join('/'));
  }
  const children = (parent) => {
    const directFolders = [...paths].filter((folder) => {
      const parentOf = folder.includes('/') ? folder.slice(0, folder.lastIndexOf('/')) : '';
      return parentOf === parent;
    }).sort((a, b) => a.localeCompare(b));
    const directFiles = files.filter((filePath) => {
      const parentOf = filePath.includes('/') ? filePath.slice(0, filePath.lastIndexOf('/')) : '';
      return parentOf === parent;
    });
    return { directFolders, directFiles };
  };
  const rows = [];
  function addChildren(parent, depth) {
    const { directFolders, directFiles } = children(parent);
    for (const folderPath of directFolders) {
      const name = folderPath.split('/').pop();
      rows.push(`<div class="tree-row"><button class="tree-item" type="button" data-action="select-folder" data-path="${escapeHtml(folderPath)}" style="padding-left:${5 + depth * 12}px" title="${escapeHtml(folderPath)}">${icon('folder')}<span>${escapeHtml(name)}</span></button></div>`);
      addChildren(folderPath, depth + 1);
    }
    for (const filePath of directFiles) {
      const name = filePath.split('/').pop();
      rows.push(`<div class="tree-row"><button class="tree-item ${app.filePath === filePath ? 'active' : ''}" type="button" data-action="select-file" data-path="${escapeHtml(filePath)}" style="padding-left:${5 + depth * 12}px" title="${escapeHtml(filePath)}"><span class="file-badge">${escapeHtml(fileGlyph(filePath))}</span><span>${escapeHtml(name)}</span></button><span class="tree-actions"><button type="button" data-action="confirm-delete-file" data-path="${escapeHtml(filePath)}" aria-label="${escapeHtml(name)} faylini o‘chirish">${icon('trash')}</button></span></div>`);
    }
  }
  addChildren('', 0);
  return rows.length ? rows.join('') : '<p class="tree-empty">Bu loyihada hali fayl yo‘q. Yuqoridan yangi fayl qo‘shing.</p>';
}

function projectPreview(project) {
  const htmlPath = Object.keys(project.files).find((filePath) => /(^|\/)index\.html?$/i.test(filePath)) || Object.keys(project.files).find((filePath) => /\.html?$/i.test(filePath));
  if (!htmlPath) return '<div class="preview-empty">Ko‘rinish yaratish uchun loyihaga HTML fayl qo‘shing.</div>';
  let html = String(project.files[htmlPath] || '');
  const cssPathFromLink = html.match(/href=["']([^"']+\.css)["']/i)?.[1]?.replace(/^\.\//, '');
  const htmlParent = htmlPath.includes('/') ? htmlPath.slice(0, htmlPath.lastIndexOf('/') + 1) : '';
  const cssPath = project.files[`${htmlParent}${cssPathFromLink || ''}`] ? `${htmlParent}${cssPathFromLink}` : Object.keys(project.files).find((filePath) => /\.css$/i.test(filePath));
  const css = cssPath ? `<style>${String(project.files[cssPath]).replace(/<\/style/gi, '<\\/style')}</style>` : '';
  if (/<head[^>]*>/i.test(html)) html = html.replace(/<head([^>]*)>/i, `<head$1>${css}`);
  else html = `${css}${html}`;
  return `<div class="preview-frame-wrap"><iframe class="preview-frame" title="Loyiha ko‘rinishi" sandbox="" srcdoc="${escapeHtml(html)}"></iframe></div>`;
}

function renderEditorPanel(project, large = false) {
  if (!project) return `<section class="panel empty-state"><div><strong>Loyihalaring hali yo‘q</strong><p>Birinchi loyiha ochib, o‘z g‘oyangni kodga aylantir.</p><button class="btn" data-action="new-project">${icon('plus')} Yangi loyiha</button></div></section>`;
  const paths = Object.keys(project.files || {});
  if (!app.filePath || !Object.hasOwn(project.files, app.filePath)) app.filePath = paths.find((pathName) => /index\.html?$/i.test(pathName)) || paths[0] || null;
  const activeFile = getSelectedFile();
  const lines = activeFile ? Math.max(1, activeFile.content.split('\n').length) : 1;
  const title = large ? `<div class="page-heading"><div><p class="eyebrow"><span class="status-dot"></span> Ijod qilish vaqti</p><h1>Kod muharriri</h1><p>Fayllaringni shu yerda tartibla, kod yoz va sahifangni tekshir.</p></div><button class="btn btn-secondary" type="button" data-action="navigate" data-screen="workspace">${icon('home')} Ish maydoniga qaytish</button></div>` : '';
  return `${title}<section class="panel editor-card ${large ? 'editor-page-card' : ''}" aria-label="Loyiha muharriri">
    <div class="panel-heading">
      <div><h2>${large ? 'Faol loyiha' : 'Davom ettir'}</h2><p>${large ? 'Loyihangni tanla yoki yangisini yarat.' : `${escapeHtml(project.name)} · oxirgi tahrir ${formatDate(project.updatedAt)}`}</p></div>
      <div class="editor-actions">
        <label class="sr-only" for="project-picker">Faol loyiha</label>
        <select id="project-picker" class="project-select" aria-label="Faol loyiha">${app.state.projects.map((item) => `<option value="${escapeHtml(item.id)}" ${item.id === project.id ? 'selected' : ''}>${escapeHtml(item.name)}</option>`).join('')}</select>
        <button class="btn btn-secondary" type="button" data-action="new-project" aria-label="Yangi loyiha">${icon('plus')}<span>Yangi</span></button>
      </div>
    </div>
    <div class="editor-toolbar">
      <div class="editor-toolbar-left"><span class="editor-tab active">${icon('folder')} Fayllar</span><span class="editor-tab">${icon('code')} ${activeFile ? languageFor(activeFile.path) : 'Muharrir'}</span></div>
      <div class="editor-toolbar-right"><span id="save-state" class="save-state"><span class="status-dot"></span>${app.dirty ? 'Saqlanmagan' : 'Saqlandi'}</span><button class="text-link" type="button" data-action="save-file">${icon('save')} Saqlash</button></div>
    </div>
    <div class="editor-body">
      <aside class="file-explorer" aria-label="Loyiha fayllari">
        <div class="explorer-head"><span>Explorer</span><span class="explorer-actions"><button type="button" data-action="new-file" aria-label="Fayl qo‘shish">${icon('filePlus')}</button><button type="button" data-action="new-folder" aria-label="Papka qo‘shish">${icon('folderPlus')}</button></span></div>
        <div class="tree-list">${editorTree(project)}</div>
      </aside>
      <section class="code-pane" aria-label="Kod muharriri">
        <div class="code-pane-head"><strong>${escapeHtml(activeFile?.path || 'Fayl tanlanmagan')}</strong><span>${activeFile ? languageFor(activeFile.path) : 'Loyiha'}</span></div>
        <div class="code-editor-wrap">
          <pre class="line-numbers" id="line-numbers" aria-hidden="true">${Array.from({ length: lines }, (_, index) => index + 1).join('\n')}</pre>
          <label class="sr-only" for="code-input">${escapeHtml(activeFile?.path || 'Kod muharriri')}</label>
          <textarea class="code-input" id="code-input" data-role="code-input" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off" aria-label="${escapeHtml(activeFile?.path || 'Kod muharriri')}" ${activeFile ? '' : 'disabled'}>${escapeHtml(activeFile?.content || '')}</textarea>
        </div>
      </section>
      <section class="preview-pane" aria-label="Loyiha preview oynasi">
        <div class="preview-head"><span><span class="preview-dot"></span>Ko‘rinish</span><span>${activeFile ? 'sandbox' : 'bo‘sh'}</span></div>
        ${projectPreview(project)}
      </section>
    </div>
    <div class="editor-footer"><span><strong>${escapeHtml(project.name)}</strong> · ${formatNumber(paths.length)} fayl · ${formatNumber(project.folders.length)} papka</span><span>${activeFile ? `${formatNumber(lines)} qator · ${languageFor(activeFile.path)}` : 'Fayl yarating'}</span></div>
  </section>`;
}

function renderWorkspace() {
  const project = getProject();
  const completed = app.state.completedLessons.length;
  const lesson = app.state.lessons.find((item) => !app.state.completedLessons.includes(item.id)) || app.state.lessons[0];
  return `<div class="welcome-grid">
      <section class="welcome-card">
        <div><p class="eyebrow"><span class="status-dot"></span> O‘zbek tilidagi kodlash ustaxonasi</p><h1>G‘oyangni yoz.<br><span>Ishlaydigan loyiha</span> yarat.</h1><p>Har bir papka va har bir qator — sening keyingi bosqiching. Bugun nimani quramiz?</p></div>
        <div><button class="btn" type="button" data-action="new-project">${icon('plus')} Yangi loyiha boshlash</button></div>
      </section>
      <section class="welcome-art" aria-label="Loyiha kod muharriri tasviri">
        <div class="art-orbit"></div><span class="art-spark">✳</span>
        <div class="art-board"><div class="art-board-head"><i></i><i></i><i></i><span>index.html</span></div><div class="art-code"><span></span><span></span><span></span><span></span><span></span></div></div>
        <div class="art-sticky"><strong>Yaxshi boshlanish!</strong><span>1 qator ham oldinga</span></div>
      </section>
    </div>
    <div class="stat-grid">
      ${statCard('layers', 'Loyihalar', formatNumber(app.state.projects.length), 'lavender')}
      ${statCard('award', 'Creator darajasi', escapeHtml(app.state.creatorRank.name), 'lime')}
      ${statCard('code', 'Developer darajasi', escapeHtml(app.state.developerRank.name), 'peach')}
      ${statCard('bolt', 'Toplangan XP', formatNumber(app.state.xp), '')}
    </div>
    <div class="dashboard-grid">
      <div>
        ${renderEditorPanel(project)}
        <section class="panel" style="margin-top:13px">
          <div class="panel-heading"><div><h2>Loyihalaring</h2><p>G‘oyangdan qurilgan kichik olamlar.</p></div><button class="text-link" type="button" data-action="navigate" data-screen="editor">Muharrirni ochish ${icon('arrow')}</button></div>
          <div class="project-list">${app.state.projects.slice(0, 4).map((item, index) => `<button type="button" class="project-card ${item.id === project?.id ? 'current' : ''}" data-action="open-project" data-project-id="${escapeHtml(item.id)}"><span class="project-glyph ${index % 3 === 1 ? 'green' : index % 3 === 2 ? 'orange' : ''}">${index % 2 ? icon('layers') : icon('code')}</span><span style="min-width:0"><strong>${escapeHtml(item.name)}</strong><span>${formatNumber(Object.keys(item.files).length)} fayl · ${escapeHtml(item.template === 'portfolio' ? 'Portfolio' : item.template === 'webapp' ? 'Web ilova' : 'Bo‘sh loyiha')}</span></span>${icon('chevron')}</button>`).join('')}</div>
        </section>
      </div>
      <aside class="side-stack">
        ${renderRankPanel()}
        <section class="panel lesson-teaser"><p class="eyebrow">${icon('book')} Keyingi qadam</p><h3>${escapeHtml(lesson.title)}</h3><p>${completed} ta dars yakunlandi. Yana bir kichik topshiriq bilan davom et.</p><button class="btn" type="button" data-action="open-lesson" data-lesson-id="${escapeHtml(lesson.id)}">${completed ? 'Darsni davom ettirish' : 'Birinchi darsni ochish'} ${icon('arrow')}</button></section>
        <section class="panel coin-mini"><div class="coin-mini-head"><span class="stat-icon lime">${icon('coin')}</span><div><strong>${formatNumber(app.state.coins)} coin</strong><span>Darslar orqali ko‘paytir</span></div></div><button class="text-link" type="button" data-action="navigate" data-screen="shop">Do‘konga o‘tish ${icon('arrow')}</button></section>
      </aside>
    </div>`;
}

const LESSON_COPY = {
  'html-structure': {
    intro: 'HTML sahifaning mazmuni va tuzilishini belgilaydi. Brauzer teglarni o‘qib, sarlavha, matn va havolalarni ko‘rsatadi.',
    heading: 'Sahifani semantik tuzing',
    body: 'Har bir sahifada bitta asosiy sarlavha bo‘lsin. Mazmunni <code>main</code>, <code>section</code> va <code>article</code> kabi teglar bilan guruhlang. Havolaga foydalanuvchi qayerga borishini ayting.',
    example: '<main>\n  <h1>Mening loyiham</h1>\n  <p>Bu yerda yangi fikrim turibdi.</p>\n  <a href="#ishlar">Ishlarimni ko‘rish</a>\n</main>',
    task: 'Portfolio loyihangda h1 sarlavha, qisqa tanishtiruv va bitta havola qo‘sh.'
  },
  'css-layout': {
    intro: 'CSS HTML elementlarining ko‘rinishi, oraliqlari va ekrandagi joylashuvini boshqaradi. Avval sahifaga o‘qilishi oson maket bering.',
    heading: 'Flexbox bilan markazga joylang',
    body: 'Konteynerga <code>display: flex</code> bering. <code>align-items</code> va <code>justify-content</code> elementlarni ikki o‘q bo‘ylab tekislaydi. Kichik ekranlar uchun oraliq va o‘lchamlarni moslang.',
    example: '.card {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 16px;\n}',
    task: 'Portfolio kartangda matn va tugmani bir qatorda joylashtirib ko‘r.'
  },
  'js-dom': {
    intro: 'JavaScript brauzerdagi elementlarni tanlaydi va foydalanuvchi harakatiga javob beradi. DOM — sahifaning o‘zgarishi mumkin bo‘lgan daraxti.',
    heading: 'Tugmaga hodisa ulang',
    body: '<code>querySelector</code> kerakli elementni topadi, <code>addEventListener</code> esa bosish kabi hodisani eshitadi. Kodni kichik funksiyalarga ajrating.',
    example: 'const button = document.querySelector("button");\n\nbutton.addEventListener("click", () => {\n  console.log("Ishladi!");\n});',
    task: 'Loyihangdagi tugmani tanlab, bosilganda matnni o‘zgartiradigan funksiya yoz.'
  },
  'project-structure': {
    intro: 'Yaxshi papka tuzilishi kerakli kodni topishni va qayta ishlatishni osonlashtiradi. Dastlab kichik loyihada ham nomlarni mazmuniga qarab tanlang.',
    heading: 'Mas’uliyatni ajrating',
    body: 'Sahifalar <code>pages</code>da, qayta ishlatiladigan bo‘laklar <code>components</code>da, umumiy yordamchi funksiyalar <code>utils</code>da turishi mumkin. Papka nomlari loyiha kattalashganda ham tushunarli bo‘lsin.',
    example: 'src/\n  components/\n    Button.js\n  pages/\n    Home.js\n  utils/\n    formatDate.js\n  main.js',
    task: 'Loyihangdagi fayllardan biri uchun mos papka ochib, uni shu yerga ko‘chir.'
  },
  'node-api': {
    intro: 'Node.js JavaScript kodini serverda ishga tushiradi. API brauzer va server orasida ma’lumot almashish uchun aniq manzillar beradi.',
    heading: 'HTTP so‘rovini qaytaring',
    body: 'Server so‘rov kelganda manzil va metodni tekshiradi, so‘ng JSON javob yuboradi. Har bir foydalanuvchi kiritgan qiymatni qabul qilishdan oldin tekshirish kerak.',
    example: 'server.get("/api/projects", (req, res) => {\n  res.json({ projects: [] });\n});',
    task: 'Loyihangga /api/hello manzilini qo‘shib, { salom: true } JSON yubor.'
  },
  'git-save': {
    intro: 'Git koddagi o‘zgarishlarni bosqichma-bosqich qayd qiladi. Har bir commit keyin nima o‘zgarganini ko‘rsatadigan kichik nuqtadir.',
    heading: 'Kichik va aniq commit',
    body: 'Avval kerakli o‘zgarishlarni tanlang, keyin nima qilganingizni qisqa fe’l bilan yozing. Masalan: <code>add project card layout</code>. Bir commitga bir-biriga yaqin vazifalarni jamlang.',
    example: 'git add .\ngit commit -m "add project card layout"\ngit status',
    task: 'Loyihada hozirgacha qilgan o‘zgarishingni bitta aniq gap bilan nomla.'
  }
};

function renderLessons() {
  const filters = ['Barchasi', ...new Set(app.state.lessons.map((lesson) => lesson.track))];
  const lessons = app.state.lessons.filter((lesson) => app.lessonFilter === 'Barchasi' || lesson.track === app.lessonFilter);
  return `<div class="page-heading"><div><p class="eyebrow"><span class="status-dot"></span> O‘rgan va amalda sinab ko‘r</p><h1>Darslar</h1><p>Qisqa tushuntirish, kichik vazifa va yakunda coin mukofoti.</p></div><div class="coin-pill"><span class="coin-symbol">L</span>${formatNumber(app.state.coins)} coin</div></div>
    <div class="shop-balance-note">${icon('sparkle')}<span><strong>${app.state.completedLessons.length}/${app.state.lessons.length} dars yakunlangan.</strong> Har dars mukofotini faqat bir marta olish mumkin. O‘rganganingni ish maydoningda sinab ko‘r.</span></div>
    <div class="filter-bar">${filters.map((filter) => `<button type="button" class="filter-chip ${app.lessonFilter === filter ? 'active' : ''}" data-action="lesson-filter" data-filter="${escapeHtml(filter)}">${escapeHtml(filter)}</button>`).join('')}</div>
    <section class="lesson-grid" aria-label="Darslar ro‘yxati">${lessons.length ? lessons.map((lesson, index) => renderLessonCard(lesson, index)).join('') : '<div class="panel empty-state"><div><strong>Dars topilmadi</strong><p>Boshqa yo‘nalishni tanlab ko‘r.</p></div></div>'}</section>`;
}

function renderLessonCard(lesson, index) {
  const complete = app.state.completedLessons.includes(lesson.id);
  const colors = ['', 'green', 'peach', 'violet'];
  const symbols = ['‹›', '⌗', 'JS', '⌘', 'API', '↗'];
  return `<article class="lesson-card ${complete ? 'completed' : ''}"><div class="lesson-card-top"><span class="lesson-icon ${colors[index % colors.length]}">${symbols[index % symbols.length]}</span><span class="level-chip">${escapeHtml(lesson.level)}</span></div><h3>${escapeHtml(lesson.title)}</h3><p>${escapeHtml(lesson.track)} · ${escapeHtml(lesson.duration)}</p><div class="lesson-card-bottom"><span class="lesson-reward"><span class="coin-symbol">L</span>+${lesson.coins} coin</span><button class="btn ${complete ? 'btn-secondary' : ''}" type="button" data-action="open-lesson" data-lesson-id="${escapeHtml(lesson.id)}">${complete ? `${icon('check')} Yakunlangan` : 'Darsni ochish'}</button></div></article>`;
}

function renderShop() {
  const filters = [['all', 'Barchasi'], ['avatar', 'Avatar'], ['tag', 'Name tag'], ['frame', 'Profil ramkasi'], ['subscription', 'Obuna']];
  const items = app.state.shopItems.filter((item) => app.shopFilter === 'all' || item.kind === app.shopFilter);
  return `<div class="page-heading"><div><p class="eyebrow"><span class="status-dot"></span> O‘rganganingni ko‘rinadigan qil</p><h1>Coin do‘koni</h1><p>Avatar, name tag va premium obunani dars coinlariga ol.</p></div><div class="coin-pill"><span class="coin-symbol">L</span>${formatNumber(app.state.coins)} coin</div></div>
    <div class="shop-balance-note">${icon('shield')}<span>Coinlar darslarni yakunlash orqali beriladi. Do‘kondagi narxlar virtual coinlarda. <strong>${app.state.subscription && new Date(app.state.subscription.expiresAt).getTime() > Date.now() ? `Lumen Plus ${formatDate(app.state.subscription.expiresAt)} gacha faol.` : 'Lumen Plus obunalarini coin bilan uzaytirish mumkin.'}</strong></span></div>
    <div class="filter-bar">${filters.map(([id, label]) => `<button class="filter-chip ${app.shopFilter === id ? 'active' : ''}" type="button" data-action="shop-filter" data-filter="${id}">${escapeHtml(label)}</button>`).join('')}</div>
    <section class="shop-grid" aria-label="Do‘kon mahsulotlari">${items.map((item) => renderShopCard(item)).join('')}</section>`;
}

function renderShopCard(item) {
  const owned = app.state.inventory.includes(item.id);
  const subscription = item.kind === 'subscription';
  const active = subscription && app.state.subscription?.itemId === item.id && new Date(app.state.subscription.expiresAt).getTime() > Date.now();
  const colors = item.kind === 'avatar' ? '' : item.kind === 'tag' ? 'green' : item.kind === 'frame' ? 'peach' : 'violet';
  const actionLabel = active ? 'Faol obuna' : owned ? 'Sotib olingan' : 'Sotib olish';
  return `<article class="shop-card ${subscription ? 'subscription' : ''}"><div class="shop-card-top"><span class="shop-icon ${colors}">${escapeHtml(item.emoji)}</span><span class="tag-chip">${escapeHtml(item.category)}</span></div><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.description)}${subscription ? ` ${item.days} kun.` : ''}</p><div class="shop-card-bottom"><span class="shop-price"><span class="coin-symbol">L</span>${formatNumber(item.price)}</span><button class="btn ${owned || active ? 'btn-secondary' : ''}" type="button" data-action="confirm-purchase" data-item-id="${escapeHtml(item.id)}" ${owned || active ? 'disabled' : ''}>${owned || active ? `${icon('check')} ${actionLabel}` : actionLabel}</button></div></article>`;
}

function renderProfile() {
  const profile = app.state.profile;
  const equippedTag = currentItem(profile.tagItem);
  const equippedFrame = currentItem(profile.frameItem);
  const ownedItems = app.state.inventory.map((id) => currentItem(id)).filter(Boolean);
  const transactions = app.state.coinLedger.slice(0, 6);
  const inventoryMarkup = ownedItems.length ? ownedItems.map((item) => {
    const profileKey = item.kind === 'avatar' ? 'avatarItem' : item.kind === 'tag' ? 'tagItem' : 'frameItem';
    const color = item.kind === 'tag' ? 'green' : item.kind === 'frame' ? 'peach' : '';
    const actionLabel = profile[profileKey] === item.id ? 'Yoqilgan' : 'Taqish';
    return `<div class="inventory-row"><span class="shop-icon ${color}">${escapeHtml(item.emoji)}</span><div style="min-width:0;flex:1"><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.category)}</span></div><button class="btn btn-secondary" style="min-height:28px;padding:0 8px;font-size:9px" type="button" data-action="equip-item" data-item-id="${escapeHtml(item.id)}">${actionLabel}</button></div>`;
  }).join('') : `<div class="empty-state"><div><strong>Hali bezak yo‘q</strong><p>Do‘kondan avatar yoki name tag ol.</p><button class="text-link" type="button" data-action="navigate" data-screen="shop">Do‘konni ochish ${icon('arrow')}</button></div></div>`;
  return `<div class="page-heading"><div><p class="eyebrow"><span class="status-dot"></span> O‘zingga moslashtir</p><h1>Profil</h1><p>Darajalar, xaridlar va ism ko‘rinishini boshqar.</p></div><div class="profile-heading-actions"><button class="btn btn-secondary" type="button" data-action="navigate" data-screen="shop">${icon('shop')} Coin do‘koniga o‘tish</button>${app.backend === 'supabase' ? '<button class="btn btn-quiet" type="button" data-action="sign-out">Hisobdan chiqish</button>' : ''}</div></div>
    <section class="profile-hero">
      ${avatarForProfile(profile, true)}
      <div class="profile-hero-info"><h2>${escapeHtml(profile.name)}</h2><p>@${escapeHtml(profile.username)} · ${escapeHtml(profile.bio || 'Hali bio yozilmagan.')}</p><div class="profile-tags"><span class="membership-chip">${icon('layers')} ${escapeHtml(app.state.creatorRank.name)}</span><span class="membership-chip">${icon('code')} ${escapeHtml(app.state.developerRank.name)}</span>${equippedTag ? `<span class="tag-chip">${escapeHtml(equippedTag.emoji)} ${escapeHtml(equippedTag.name)}</span>` : ''}${equippedFrame ? `<span class="tag-chip">${escapeHtml(equippedFrame.name)}</span>` : ''}${app.state.subscription && new Date(app.state.subscription.expiresAt).getTime() > Date.now() ? '<span class="membership-chip">✦ Lumen Plus</span>' : ''}</div></div>
      <button class="btn btn-secondary" type="button" data-action="scroll-profile-form">${icon('pencil')} Tahrirlash</button>
    </section>
    <div class="profile-level-grid">
      <article class="level-card"><div class="level-card-head"><span class="stat-icon lime">${icon('layers')}</span><div><span>Loyihalar bo‘yicha Creator</span><strong>${escapeHtml(app.state.creatorRank.name)}</strong></div></div><div class="rank-line"><span>${escapeHtml(app.state.creatorRank.subtitle)}</span><strong>${app.state.projects.length} loyiha</strong></div>${rankProgress(app.state.creatorRank, 'lime')}<p>Yangi loyihalar ochish orqali Builder’dan Creator va Legend’gacha bor.</p></article>
      <article class="level-card"><div class="level-card-head"><span class="stat-icon">${icon('code')}</span><div><span>Struktura bo‘yicha Developer</span><strong>${escapeHtml(app.state.developerRank.name)}</strong></div></div><div class="rank-line"><span>${escapeHtml(app.state.developerRank.subtitle)}</span><strong>${formatNumber(app.state.codeScore)} ball</strong></div>${rankProgress(app.state.developerRank, 'blue')}<p>Fayllar soni, kod qatorlari, ma’noli papkalar va testlar hisobga olinadi.</p></article>
    </div>
    <div class="profile-lower">
      <section class="panel" id="profile-form-panel"><div class="panel-heading"><div><h2>Profilni o‘zgartir</h2><p>Ism, handle va qisqa bio.</p></div></div><form class="profile-form" data-form="profile">
        <div class="field"><label for="profile-name">Ko‘rinadigan ism</label><input id="profile-name" name="name" value="${escapeHtml(profile.name)}" required minlength="2" maxlength="40" /></div>
        <div class="field"><label for="profile-username">Foydalanuvchi nomi</label><input id="profile-username" name="username" value="${escapeHtml(profile.username)}" required minlength="3" maxlength="24" /><small style="color:var(--muted);font-size:9px">Faqat a–z, raqam, nuqta va _ belgisi.</small></div>
        <div class="field full"><label for="profile-bio">Bio</label><textarea id="profile-bio" name="bio" maxlength="160" placeholder="Nima qurishni yoqtirasan?">${escapeHtml(profile.bio)}</textarea></div>
        <div class="form-footer"><button class="btn" type="submit">${icon('check')} O‘zgarishlarni saqlash</button></div>
      </form></section>
      <section class="panel"><div class="panel-heading"><div><h2>Balans</h2><p>Oxirgi coin harakatlari.</p></div><span class="coin-pill"><span class="coin-symbol">L</span>${formatNumber(app.state.coins)}</span></div><div class="ledger-list">${transactions.length ? transactions.map((item) => `<div class="ledger-row"><span class="stat-icon ${item.delta < 0 ? 'peach' : 'lime'}" style="width:28px;height:28px;border-radius:9px">${icon(item.delta < 0 ? 'shop' : 'gift')}</span><div style="min-width:0;flex:1"><strong>${escapeHtml(item.reason)}</strong><span>${formatDate(item.createdAt)}</span></div><span class="ledger-value ${item.delta < 0 ? 'negative' : ''}">${item.delta > 0 ? '+' : ''}${formatNumber(item.delta)}</span></div>`).join('') : '<div class="empty-state">Harakatlar hali yo‘q.</div>'}</div></section>
      <section class="panel"><div class="panel-heading"><div><h2>Yig‘ilgan bezaklar</h2><p>Olingan narsalaringni profilda ko‘r.</p></div></div><div class="inventory-list">${inventoryMarkup}</div></section>
      <section class="panel"><div class="panel-heading"><div><h2>Darslar va XP</h2><p>Har dars yangi ko‘nikma va XP beradi.</p></div></div><div style="padding:18px"><div class="rank-line"><strong>${app.state.completedLessons.length} / ${app.state.lessons.length} dars</strong><span>${formatNumber(app.state.xp)} XP</span></div>${rankProgress({ name: 'Darslar', progress: (app.state.completedLessons.length / app.state.lessons.length) * 100 }, 'blue')}<p class="rank-note">${icon('book')} Yakunlanmagan darslar uchun coin mukofoti hali ochiq.</p><button class="text-link" style="margin-top:12px" type="button" data-action="navigate" data-screen="lessons">Darslarga o‘tish ${icon('arrow')}</button></div></section>
    </div>`;
}

function renderEditorScreen() {
  return `<div class="editor-page">${renderEditorPanel(getProject(), true)}</div>`;
}

function render() {
  if (!app.state) {
    if (app.backend === 'supabase') renderAuth();
    return;
  }
  if (!app.state.projects.some((project) => project.id === app.projectId)) app.projectId = app.state.projects[0]?.id || null;
  let content = app.screen === 'lessons' ? renderLessons() : app.screen === 'shop' ? renderShop() : app.screen === 'profile' ? renderProfile() : app.screen === 'editor' ? renderEditorScreen() : renderWorkspace();
  renderShell(content);
  renderModal();
  modalRoot.innerHTML = LumenI18n.translateMarkup(modalRoot.innerHTML, app.locale);
}

function modalFrame(title, description, body, actions, className = '') {
  return `<div class="modal-backdrop" data-action="backdrop-close"><section class="modal ${className}" role="dialog" aria-modal="true" aria-labelledby="modal-title"><header class="modal-head"><div><h2 id="modal-title">${title}</h2>${description ? `<p>${description}</p>` : ''}</div><button class="modal-close" type="button" data-action="close-modal" aria-label="Yopish">${icon('close')}</button></header>${body}${actions}</section></div>`;
}

function renderModal() {
  if (!app.modal) { modalRoot.innerHTML = ''; return; }
  if (app.modal === 'new-project') {
    modalRoot.innerHTML = modalFrame('Yangi loyiha', 'Avval nom ber, so‘ng boshlang‘ich tuzilmani tanla.', `<form id="create-project-form" class="modal-body" data-form="new-project"><div class="field"><label for="new-project-name">Loyiha nomi</label><input id="new-project-name" name="name" placeholder="Masalan: Shaxsiy portfolio" minlength="2" maxlength="48" required autofocus /></div><div class="field"><label for="new-project-template">Boshlang‘ich tuzilma</label><select id="new-project-template" name="template"><option value="portfolio">Portfolio · HTML, CSS, JS</option><option value="webapp">Web ilova · src papkalari</option><option value="blank">Bo‘sh loyiha · README</option></select></div></form>`, `<footer class="modal-actions"><button class="btn btn-secondary" type="button" data-action="close-modal">Bekor qilish</button><button class="btn" type="submit" form="create-project-form">${icon('plus')} Loyiha yaratish</button></footer>`);
  } else if (app.modal === 'new-file' || app.modal === 'new-folder') {
    const isFile = app.modal === 'new-file';
    const selectedParent = app.filePath?.includes('/') ? app.filePath.slice(0, app.filePath.lastIndexOf('/') + 1) : '';
    const suggested = isFile ? `${selectedParent}script.js` : `${selectedParent}components`;
    modalRoot.innerHTML = modalFrame(isFile ? 'Yangi fayl' : 'Yangi papka', isFile ? 'Papka nomini qo‘shib yozsang, kerakli papkalar ham yaratiladi.' : 'Tartibli tuzilma uchun nomni aniq ber.', `<form id="create-entry-form" class="modal-body" data-form="${isFile ? 'new-file' : 'new-folder'}"><div class="field"><label for="new-entry-path">${isFile ? 'Fayl manzili' : 'Papka manzili'}</label><input id="new-entry-path" name="path" value="${escapeHtml(suggested)}" required maxlength="240" autocomplete="off" /><small style="color:var(--muted);font-size:9px">Masalan: src/components/card.js</small></div></form>`, `<footer class="modal-actions"><button class="btn btn-secondary" type="button" data-action="close-modal">Bekor qilish</button><button class="btn" type="submit" form="create-entry-form">${icon('plus')} ${isFile ? 'Fayl yaratish' : 'Papka yaratish'}</button></footer>`);
  } else if (app.modal === 'lesson') {
    const lesson = app.state.lessons.find((item) => item.id === app.modalLessonId);
    if (!lesson) { app.modal = null; modalRoot.innerHTML = ''; return; }
    const copy = LESSON_COPY[lesson.id];
    const complete = app.state.completedLessons.includes(lesson.id);
    const body = `<div class="modal-body"><div class="lesson-content"><p>${copy.intro}</p><h3>${copy.heading}</h3><p>${copy.body}</p><pre class="lesson-example">${escapeHtml(copy.example)}</pre><h3>O‘zing sinab ko‘r</h3><p>${copy.task}</p></div><div class="lesson-reward-box"><span>Ushbu dars mukofoti</span><strong>+${lesson.xp} XP · +${lesson.coins} coin</strong></div></div>`;
    const actions = `<footer class="modal-actions"><button class="btn btn-secondary" type="button" data-action="close-modal">Yopish</button><button class="btn" type="button" data-action="complete-lesson" data-lesson-id="${escapeHtml(lesson.id)}" ${complete ? 'disabled' : ''}>${complete ? `${icon('check')} Yakunlangan` : 'Darsni yakunlash'}</button></footer>`;
    modalRoot.innerHTML = modalFrame(escapeHtml(lesson.title), `${escapeHtml(lesson.track)} · ${escapeHtml(lesson.duration)}`, body, actions);
  } else if (app.modal === 'purchase') {
    const item = currentItem(app.pendingPurchaseId);
    if (!item) { app.modal = null; modalRoot.innerHTML = ''; return; }
    const enough = app.state.coins >= item.price;
    const after = app.state.coins - item.price;
    const body = `<div class="modal-body"><div class="inventory-row" style="padding:0 0 15px;border-bottom:1px solid var(--line)"><span class="shop-icon">${escapeHtml(item.emoji)}</span><div><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.description)}</span></div></div><div class="rank-line"><span>Narxi</span><strong>${formatNumber(item.price)} coin</strong></div><div class="rank-line"><span>Xariddan keyin</span><strong>${enough ? `${formatNumber(after)} coin` : `Yana ${formatNumber(Math.abs(after))} coin kerak`}</strong></div>${!enough ? '<p class="rank-note">Darslarni yakunlab coin yig‘. Haqiqiy pul yechilmaydi.</p>' : ''}</div>`;
    const actions = `<footer class="modal-actions"><button class="btn btn-secondary" type="button" data-action="close-modal">Bekor qilish</button>${enough ? `<button class="btn" type="button" data-action="buy-item" data-item-id="${escapeHtml(item.id)}">${icon('shop')} Coin bilan olish</button>` : `<button class="btn" type="button" data-action="go-lessons">${icon('book')} Darslarni ochish</button>`}</footer>`;
    modalRoot.innerHTML = modalFrame('Xaridni tasdiqlash', 'Coin balansing faqat shu demo hisobida o‘zgaradi.', body, actions);
  } else if (app.modal === 'delete-file') {
    modalRoot.innerHTML = modalFrame('Faylni o‘chirish', `“${escapeHtml(app.pendingDeletePath)}” faylini o‘chirish kerakmi?`, '<div class="modal-body"><p class="lesson-content">Bu amalni qaytarib bo‘lmaydi. Avval kerakli kodni boshqa faylga nusxalashing mumkin.</p></div>', `<footer class="modal-actions"><button class="btn btn-secondary" type="button" data-action="close-modal">Bekor qilish</button><button class="btn btn-danger" type="button" data-action="delete-file">${icon('trash')} Faylni o‘chirish</button></footer>`);
  }
}

function openModal(name) {
  app.modal = name;
  renderModal();
  window.setTimeout(() => modalRoot.querySelector('input, button:not([data-action="close-modal"])')?.focus(), 40);
}

function closeModal() {
  app.modal = null;
  app.modalLessonId = null;
  app.pendingPurchaseId = null;
  app.pendingDeletePath = null;
  modalRoot.innerHTML = '';
}

function setSaveStatus(message, isError = false) {
  const element = document.getElementById('save-state');
  if (!element) return;
  element.innerHTML = `<span class="status-dot" style="background:${isError ? '#d76a69' : app.dirty ? '#d6ae45' : '#80ad50'}"></span>${escapeHtml(LumenI18n.translateText(message, app.locale))}`;
}

function refreshWorkspaceRanks() {
  if (app.screen !== 'workspace') return;
  const creator = app.state.creatorRank;
  const developer = app.state.developerRank;
  const metrics = document.querySelectorAll('.stat-grid .stat-card strong');
  if (metrics[1]) metrics[1].textContent = creator.name;
  if (metrics[2]) metrics[2].textContent = developer.name;
  for (const [key, rank] of [['creator', creator], ['developer', developer]]) {
    const name = document.querySelector(`[data-rank-name="${key}"]`);
    const subtitle = document.querySelector(`[data-rank-subtitle="${key}"]`);
    const progress = document.querySelector(`[data-rank-progress="${key}"]`);
    if (name) name.textContent = rank.name;
    if (subtitle) subtitle.textContent = rank.subtitle;
    if (progress) {
      const value = Math.max(0, Math.min(100, Number(rank.progress) || 0));
      progress.setAttribute('aria-valuenow', String(value));
      progress.setAttribute('aria-label', LumenI18n.translateText(`${rank.name} daraja progressi`, app.locale));
      const bar = progress.querySelector('span');
      if (bar) bar.style.width = `${value}%`;
    }
  }
}

function syncLineNumbers(value) {
  const numbers = document.getElementById('line-numbers');
  const input = document.getElementById('code-input');
  if (!numbers || !input) return;
  const count = Math.max(1, value.split('\n').length);
  numbers.textContent = Array.from({ length: count }, (_, index) => index + 1).join('\n');
  numbers.scrollTop = input.scrollTop;
}

function markDirty(value) {
  const project = getProject();
  if (!project || !app.filePath) return;
  project.files[app.filePath] = value;
  app.dirty = true;
  setSaveStatus('Saqlanmagan');
  syncLineNumbers(value);
  const preview = document.querySelector('.preview-frame');
  if (preview && /\.html?$/i.test(app.filePath)) {
    const newPreview = projectPreview(project);
    const previewPane = document.querySelector('.preview-pane');
    const previewWrap = previewPane?.querySelector('.preview-frame-wrap, .preview-empty');
    if (previewWrap) previewWrap.outerHTML = newPreview;
  }
  window.clearTimeout(app.saveTimer);
  app.saveTimer = window.setTimeout(() => saveFile(true), 900);
}

async function saveFile(quiet = false) {
  const project = getProject();
  const input = document.getElementById('code-input');
  if (!project || !app.filePath || !input || !app.dirty || app.saving) return;
  window.clearTimeout(app.saveTimer);
  app.saving = true;
  const savedText = input.value;
  setSaveStatus('Saqlanmoqda…');
  try {
    const updated = await request(`/api/projects/${encodeURIComponent(project.id)}/files`, {
      method: 'PUT', body: JSON.stringify({ path: app.filePath, content: savedText })
    });
    app.state = updated;
    refreshWorkspaceRanks();
    const currentInput = document.getElementById('code-input');
    if (currentInput && currentInput.value === savedText) {
      app.dirty = false;
      setSaveStatus('Saqlandi');
      if (!quiet) toast('O‘zgarishlar serverda saqlandi.');
    } else {
      app.dirty = true;
      setSaveStatus('Saqlanmagan');
      app.saveTimer = window.setTimeout(() => saveFile(true), 250);
    }
  } catch (error) {
    setSaveStatus('Saqlanmadi', true);
    if (!quiet) toast(error.message, 'error');
  } finally {
    app.saving = false;
  }
}

async function flushFile() {
  if (!app.dirty) return;
  window.clearTimeout(app.saveTimer);
  await saveFile(true);
}

async function navigate(screen) {
  if (!['workspace', 'editor', 'lessons', 'shop', 'profile'].includes(screen)) return;
  if (screen === app.screen) return;
  await flushFile();
  app.screen = screen;
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function confirmPurchase(itemId) {
  app.pendingPurchaseId = itemId;
  openModal('purchase');
}

async function performPurchase(itemId) {
  const button = modalRoot.querySelector('[data-action="buy-item"]');
  if (button) button.disabled = true;
  try {
    app.state = await request('/api/shop/purchase', { method: 'POST', body: JSON.stringify({ itemId }) });
    const item = currentItem(itemId);
    closeModal();
    render();
    toast(`${item?.name || 'Mahsulot'} profilingizga qo‘shildi.`);
  } catch (error) {
    toast(error.message, 'error');
    renderModal();
  }
}

async function performLessonComplete(lessonId) {
  const button = modalRoot.querySelector('[data-action="complete-lesson"]');
  if (button) button.disabled = true;
  try {
    const lesson = app.state.lessons.find((item) => item.id === lessonId);
    app.state = await request(`/api/lessons/${encodeURIComponent(lessonId)}/complete`, { method: 'POST', body: '{}' });
    closeModal();
    render();
    toast(`Dars tugadi · +${lesson.xp} XP va +${lesson.coins} coin.`);
  } catch (error) {
    toast(error.message, 'error');
    renderModal();
  }
}

async function removeFile() {
  const project = getProject();
  const filePath = app.pendingDeletePath;
  if (!project || !filePath) return;
  try {
    app.state = await request(`/api/projects/${encodeURIComponent(project.id)}/files?path=${encodeURIComponent(filePath)}`, { method: 'DELETE' });
    if (app.filePath === filePath) app.filePath = Object.keys(getProject()?.files || {})[0] || null;
    closeModal();
    app.dirty = false;
    render();
    toast('Fayl o‘chirildi.');
  } catch (error) { toast(error.message, 'error'); }
}

async function createEntry(form, type) {
  const project = getProject();
  const formData = new FormData(form);
  const filePath = String(formData.get('path') || '').trim();
  if (!project || !filePath) return;
  try {
    await flushFile();
    const endpoint = `/api/projects/${encodeURIComponent(project.id)}/${type === 'new-file' ? 'files' : 'folders'}`;
    app.state = await request(endpoint, { method: 'POST', body: JSON.stringify({ path: filePath, content: type === 'new-file' ? starterFileContent(filePath) : undefined }) });
    app.projectId = project.id;
    if (type === 'new-file') app.filePath = filePath;
    closeModal();
    app.dirty = false;
    render();
    toast(type === 'new-file' ? 'Yangi fayl qo‘shildi.' : 'Yangi papka qo‘shildi.');
  } catch (error) { toast(error.message, 'error'); }
}

function starterFileContent(filePath) {
  if (/\.html?$/i.test(filePath)) return `<!doctype html>\n<html lang="uz">\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <title>Yangi sahifa</title>\n</head>\n<body>\n  <main>\n    <h1>Salom, LumenCo!</h1>\n    <p>Yangi sahifang shu yerdan boshlanadi.</p>\n  </main>\n</body>\n</html>\n`;
  if (/\.css$/i.test(filePath)) return `:root {\n  font-family: system-ui, sans-serif;\n  color: #202633;\n}\n`;
  if (/\.(js|jsx|ts|tsx)$/i.test(filePath)) return `// Yangi funksiyangni shu yerdan yoz.\n`;
  if (/\.json$/i.test(filePath)) return `{}\n`;
  if (/\.md$/i.test(filePath)) return `# Yangi fayl\n`;
  return '';
}

async function handleClick(event) {
  const actionElement = event.target.closest('[data-action]');
  if (!actionElement) return;
  const action = actionElement.dataset.action;
  if (action === 'auth-toggle') { app.authMode = app.authMode === 'signin' ? 'signup' : 'signin'; app.authNotice = ''; return renderAuth(); }
  if (action === 'sign-out') {
    await LumenBackend.signOut();
    app.authenticated = false; app.state = null; app.authMode = 'signin'; app.authNotice = '';
    return renderAuth();
  }
  if (action === 'navigate') return navigate(actionElement.dataset.screen);
  if (action === 'reload') return location.reload();
  if (action === 'new-project') return openModal('new-project');
  if (action === 'new-file') return openModal('new-file');
  if (action === 'new-folder') return openModal('new-folder');
  if (action === 'close-modal') return closeModal();
  if (action === 'backdrop-close' && event.target === actionElement) return closeModal();
  if (action === 'open-lesson') { app.modalLessonId = actionElement.dataset.lessonId; return openModal('lesson'); }
  if (action === 'complete-lesson') return performLessonComplete(actionElement.dataset.lessonId);
  if (action === 'confirm-purchase') return confirmPurchase(actionElement.dataset.itemId);
  if (action === 'buy-item') return performPurchase(actionElement.dataset.itemId);
  if (action === 'go-lessons') { closeModal(); return navigate('lessons'); }
  if (action === 'lesson-filter') { app.lessonFilter = actionElement.dataset.filter; return render(); }
  if (action === 'shop-filter') { app.shopFilter = actionElement.dataset.filter; return render(); }
  if (action === 'save-file') return saveFile(false);
  if (action === 'open-project') {
    await flushFile();
    app.projectId = actionElement.dataset.projectId;
    const project = getProject();
    app.filePath = Object.keys(project.files).find((item) => /index\.html?$/i.test(item)) || Object.keys(project.files)[0] || null;
    app.dirty = false;
    return render();
  }
  if (action === 'select-file') {
    await flushFile();
    app.filePath = actionElement.dataset.path;
    app.dirty = false;
    return render();
  }
  if (action === 'select-folder') {
    const pathValue = actionElement.dataset.path;
    const project = getProject();
    const childFile = Object.keys(project.files).find((filePath) => filePath.startsWith(`${pathValue}/`));
    if (childFile) { await flushFile(); app.filePath = childFile; app.dirty = false; return render(); }
  }
  if (action === 'confirm-delete-file') { app.pendingDeletePath = actionElement.dataset.path; return openModal('delete-file'); }
  if (action === 'delete-file') return removeFile();
  if (action === 'scroll-profile-form') {
    document.getElementById('profile-form-panel')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    window.setTimeout(() => document.getElementById('profile-name')?.focus(), 400);
  }
  if (action === 'equip-item') {
    try {
      app.state = await request('/api/profile/equip', { method: 'PATCH', body: JSON.stringify({ itemId: actionElement.dataset.itemId }) });
      render();
      toast('Profil ko‘rinishi yangilandi.');
    } catch (error) { toast(error.message, 'error'); }
  }
}

async function handleSubmit(event) {
  const form = event.target.closest('form[data-form]');
  if (!form) return;
  event.preventDefault();
  const kind = form.dataset.form;
  const values = new FormData(form);
  if (kind === 'auth') {
    const button = form.querySelector('button[type="submit"]');
    if (button) button.disabled = true;
    try {
      if (app.authMode === 'signup') {
        const result = await LumenBackend.signUp(String(values.get('email')).trim(), String(values.get('password')), String(values.get('name')).trim(), String(values.get('username')).trim().toLowerCase());
        if (result.needsEmail) {
          app.authMode = 'signin';
          app.authNotice = 'Hisobni ochish uchun tasdiqlash havolasini emailga yubordik.';
          return renderAuth();
        }
      } else await LumenBackend.signIn(String(values.get('email')).trim(), String(values.get('password')));
      app.authenticated = true;
      app.authNotice = '';
      app.state = await request('/api/state');
      app.projectId = app.state.projects[0]?.id || null;
      const project = getProject();
      app.filePath = project ? (Object.keys(project.files).find((pathName) => /index\.html?$/i.test(pathName)) || Object.keys(project.files)[0] || null) : null;
      render();
    } catch (error) { toast(error.message, 'error'); if (button) button.disabled = false; }
    return;
  }
  if (kind === 'new-project') {
    const button = modalRoot.querySelector('[form="create-project-form"]');
    if (button) button.disabled = true;
    try {
      await flushFile();
      app.state = await request('/api/projects', { method: 'POST', body: JSON.stringify({ name: values.get('name'), template: values.get('template') }) });
      const project = app.state.projects[0];
      app.projectId = project.id;
      app.filePath = Object.keys(project.files)[0] || null;
      app.screen = 'editor';
      app.dirty = false;
      closeModal();
      render();
      toast('Yangi loyiha muharrirda ochildi.');
    } catch (error) {
      toast(error.message, 'error');
      const buttonAgain = modalRoot.querySelector('[form="create-project-form"]');
      if (buttonAgain) buttonAgain.disabled = false;
    }
    return;
  }
  if (kind === 'new-file' || kind === 'new-folder') return createEntry(form, kind);
  if (kind === 'profile') {
    const button = form.querySelector('button[type="submit"]');
    if (button) button.disabled = true;
    try {
      app.state = await request('/api/profile', { method: 'PATCH', body: JSON.stringify({ name: values.get('name'), username: values.get('username'), bio: values.get('bio') }) });
      render();
      toast('Profil saqlandi.');
    } catch (error) {
      toast(error.message, 'error');
      if (button) button.disabled = false;
    }
  }
}

async function handleChange(event) {
  if (event.target.matches('[data-locale-picker]')) return setLocale(event.target.value);
  if (event.target.id === 'project-picker') {
    await flushFile();
    app.projectId = event.target.value;
    const project = getProject();
    app.filePath = Object.keys(project.files).find((pathName) => /index\.html?$/i.test(pathName)) || Object.keys(project.files)[0] || null;
    app.dirty = false;
    render();
  }
}

function handleInput(event) {
  const element = event.target;
  if (element.matches('[data-role="code-input"]')) markDirty(element.value);
}

function handleKeydown(event) {
  const input = event.target.closest('[data-role="code-input"]');
  if (!input) {
    if (event.key === 'Escape' && app.modal) closeModal();
    return;
  }
  if (event.key === 'Tab') {
    event.preventDefault();
    const start = input.selectionStart;
    const end = input.selectionEnd;
    input.setRangeText('  ', start, end, 'end');
    markDirty(input.value);
  }
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
    event.preventDefault();
    saveFile(false);
  }
  if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) saveFile(false);
}

async function boot() {
  try {
    app.backend = await LumenBackend.initialize();
    if (app.backend === 'supabase') {
      try { await LumenBackend.getSession(); app.authenticated = true; }
      catch { app.authenticated = false; return renderAuth(); }
    }
    app.state = await request('/api/state');
    app.projectId = app.state.projects[0]?.id || null;
    const project = getProject();
    app.filePath = project ? (Object.keys(project.files).find((pathName) => /index\.html?$/i.test(pathName)) || Object.keys(project.files)[0] || null) : null;
    render();
  } catch {
    appRoot.innerHTML = LumenI18n.translateMarkup(`<main class="boot-screen"><div class="boot-error"><span class="brand-mark">L</span><strong>Serverga ulanib bo‘lmadi</strong><p>LumenCo’ni papkadan ochish o‘rniga terminalda <code>npm start</code> buyrug‘ini ishga tushir, keyin localhost:3000 manzilini och.</p><button class="btn" type="button" data-action="reload">Qayta urinish</button></div></main>`, app.locale);
  }
}

appRoot.addEventListener('click', handleClick);
modalRoot.addEventListener('click', handleClick);
document.addEventListener('submit', handleSubmit);
document.addEventListener('change', handleChange);
document.addEventListener('input', handleInput);
document.addEventListener('keydown', handleKeydown);
document.addEventListener('scroll', (event) => {
  if (event.target?.id === 'code-input') {
    const lineNumbers = document.getElementById('line-numbers');
    if (lineNumbers) lineNumbers.scrollTop = event.target.scrollTop;
  }
}, true);

boot();
