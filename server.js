'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, 'public');
const DATA_DIR = path.join(ROOT, 'data');
const STORE_PATH = path.join(DATA_DIR, 'state.json');
const PORT = Number(process.env.PORT) || 3000;
const MAX_BODY_BYTES = 260_000;
const MAX_PROJECT_FILES = 200;
const MAX_PROJECT_FOLDERS = 100;
const MAX_PROJECT_BYTES = 2_000_000;

const LESSON_TITLES = {
  1: 'Build a semantic HTML page', 2: 'Use headings, paragraphs, and links', 3: 'Add images and accessible descriptions',
  4: 'Organize lists and data tables', 5: 'Create a form with labels and validation',
  6: 'Structure a page with semantic landmarks', 7: 'Set page metadata and a useful title',
  8: 'Select elements and apply color tokens', 9: 'Understand the CSS box model', 10: 'Choose readable type and spacing',
  11: 'Lay out a page with Flexbox', 12: 'Align and distribute interface elements', 13: 'Create a responsive CSS Grid',
  14: 'Build a dashboard with grid areas', 15: 'Reuse values with CSS custom properties',
  16: 'Add depth with shadows and gradients', 17: 'Design hover and focus states', 18: 'Adapt a layout for mobile screens',
  19: 'Plan a mobile-first interface', 20: 'Ship a small portfolio page', 21: 'Animate interface details with keyframes',
  22: 'Use transforms without breaking layout', 23: 'Build layered surfaces with CSS', 24: 'Compose utility classes consistently',
  25: 'Use SVG as a crisp interface asset', 35: 'Name components and styles with BEM', 50: 'Ship a responsive landing page',
  51: 'Use JavaScript values and types', 52: 'Write functions and understand scope', 53: 'Select and update DOM elements',
  54: 'Handle browser events safely', 55: 'Transform data with array methods', 56: 'Store small preferences in localStorage',
  65: 'Handle asynchronous work with promises', 70: 'Read JSON from a web API', 75: 'Draw an interactive scene on canvas',
  80: 'Split code into JavaScript modules', 81: 'Model data with classes and objects', 82: 'Keep each module focused on one job',
  83: 'Extend behavior without rewriting stable code', 84: 'Use substitutions that preserve behavior',
  85: 'Keep interfaces small and specific', 86: 'Depend on stable abstractions', 90: 'Choose a pattern for a real problem',
  95: 'Write focused unit tests', 100: 'Refactor a project into clear layers',
  101: 'Explain how a language model produces text', 102: 'Write prompts with clear context and output rules',
  110: 'Classify a small dataset in the browser', 130: 'Retrieve trusted context for a generated answer',
  150: 'Prepare text data for a language task', 200: 'Design an agent that calls bounded tools',
  201: 'Trace a Node.js request through the event loop', 210: 'Design a versioned REST API',
  225: 'Model relational data with PostgreSQL', 250: 'Protect sessions and validate access tokens',
  280: 'Deliver updates over a WebSocket connection', 310: 'Prevent injection and cross-site attacks',
  330: 'Package an app and automate delivery', 350: 'Design a resilient full-stack service'
};
const LESSON_TRACKS = [
  { from: 1, to: 20, track: 'Web Foundations', tier: 'free', base: 50, level: 'Medium' },
  { from: 21, to: 50, track: 'CSS and Interface Design', tier: 'pro', base: 60, level: 'Medium → solid' },
  { from: 51, to: 80, track: 'JavaScript and Browser APIs', tier: 'pro', base: 80, level: 'Medium → solid' },
  { from: 81, to: 100, track: 'Clean Code and Architecture', tier: 'pro', base: 100, level: 'Medium → solid' },
  { from: 101, to: 200, track: 'AI and Machine Learning', tier: 'max', base: 150, level: 'Advanced' },
  { from: 201, to: 350, track: 'Full-stack Engineering and Security', tier: 'max', base: 200, level: 'Advanced' }
];
const LESSONS = Array.from({ length: 350 }, (_, index) => {
  const number = index + 1;
  const track = LESSON_TRACKS.find((item) => number >= item.from && number <= item.to);
  return {
    id: `lesson-${number}`, index: number,
    title: LESSON_TITLES[number] || `${track.track}: practice lab ${number}`,
    track: track.track, tier: track.tier, level: track.level,
    xp: track.base + number * 2, coins: track.base,
    duration: `${15 + (number % 4) * 5} min`
  };
});

const SHOP_ITEMS = [
  ...[
    ['frame-yalpiz','Mint','frame',100],['frame-okean','Ocean','frame',150],['frame-olov','Ember','frame',200],['frame-shafaq','Dusk','frame',250],['frame-kiber','Signal','frame',300],['frame-noyob','Rare','frame',500],
    ['bg-yalpiz','Mint field','bg',150],['bg-konfet','Soft color','bg',200],['bg-shom','Dusk','bg',250],['bg-okean','Ocean','bg',250],['bg-nuqtalar','Dots','bg',300],['bg-ogohlantirish','Signal','bg',350],['bg-tolqinlar','Waves','bg',400],['bg-laboratoriya','Workshop','bg',500],
    ['theme-dracula','Dracula','theme',100],['theme-monokai','Monokai','theme',100],['theme-night-owl','Night Owl','theme',120],['theme-cobalt2','Cobalt','theme',150],['theme-claude','Warm dark','theme',150],['theme-nord','Nord','theme',180],['theme-github-dark','GitHub Dark','theme',180],['theme-oceanic','Oceanic','theme',200],
    ['avatar-cat','Pixel cat','avatar',200],['avatar-ninja','Night runner','avatar',250],['avatar-robot','Workshop robot','avatar',300],
    ['tag-clean-code','Clean coder','tag',420],['tag-night-owl','Night owl','tag',500],
    ['pet-wizard','Lumi cap','pet',150],['pet-vr','Lumi headset','pet',150],['pet-crown','Lumi crown','pet',300]
  ].map(([id, name, kind, price]) => ({ id, name, category: kind, kind, price, emoji: '✦', description: 'A profile item earned with lesson coins.' }))
];

function starterProject(template, name) {
  const title = String(name).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
  const nameLiteral = JSON.stringify(String(name)).replaceAll('<', '\\u003c').replaceAll('\u2028', '\\u2028').replaceAll('\u2029', '\\u2029');
  if (template === 'portfolio') {
    return {
      folders: ['assets'],
      files: {
        'index.html': `<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <title>${title}</title>\n  <link rel="stylesheet" href="styles.css" />\n</head>\n<body>\n  <main class="card">\n    <p class="eyebrow">A WORK IN PROGRESS</p>\n    <h1>Hello, builder.</h1>\n    <p>Write a first section, then make it yours.</p>\n    <a href="#projects">Explore the project</a>\n  </main>\n  <script src="app.js"></script>\n</body>\n</html>\n`,
        'styles.css': `:root { color-scheme: light; font-family: system-ui, sans-serif; }\nbody { min-height: 100vh; margin: 0; display: grid; place-items: center; background: #eff2ff; color: #192239; }\n.card { max-width: 520px; padding: 48px; border-radius: 28px; background: white; box-shadow: 0 24px 70px #24326018; }\n.eyebrow { color: #5867db; font-size: 12px; letter-spacing: .14em; }\nh1 { font-size: clamp(2rem, 6vw, 3.6rem); line-height: 1.06; }\na { color: #3548cb; }\n`,
        'app.js': `const link = document.querySelector('a');\nlink?.addEventListener('click', () => {\n  console.log('Build the next section here.');\n});\n`
      }
    };
  }
  if (template === 'webapp') {
    return {
      folders: ['src', 'src/components', 'src/pages', 'src/utils', 'public'],
      files: {
        'index.html': `<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <title>${title}</title>\n  <link rel="stylesheet" href="src/styles.css" />\n</head>\n<body>\n  <div id="app"></div>\n  <script src="src/main.js"></script>\n</body>\n</html>\n`,
        'src/main.js': `const root = document.querySelector('#app');\nconst heading = document.createElement('h1');\nheading.textContent = ${nameLiteral};\nconst main = document.createElement('main');\nmain.append(heading, Object.assign(document.createElement('p'), { textContent: 'Start building your idea here.' }));\nroot.append(main);\n`,
        'src/styles.css': `:root { font-family: system-ui, sans-serif; color: #192239; background: #eff2ff; }\nbody { min-height: 100vh; display: grid; place-items: center; margin: 0; }\nmain { padding: 48px; border-radius: 24px; background: white; }\n`,
        'README.md': `# ${name}\n\nCreated with LumenCo.\n`
      }
    };
  }
  return { folders: [], files: { 'README.md': `# ${name}\n\nDescribe your project here.\n` } };
}

function makeInitialState() {
  return {
    profile: {
      id: 'local-builder', name: 'Builder', username: 'builder', bio: '',
      avatarItem: null, tagItem: null, frameItem: null, bgItem: null, themeItem: null,
      role: 'user', plan: 'free', isBanned: false, petConfig: { name: 'Lumi', color: 'cyan', hat: 'none', glasses: 'none' }
    },
    coins: 0,
    xp: 0,
    projects: [],
    completedLessons: [],
    inventory: [],
    subscription: null,
    coinLedger: [],
    leaderboard: [],
    adminUsers: []
  };
}

fs.mkdirSync(DATA_DIR, { recursive: true });
let state;
try {
  state = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
} catch {
  state = makeInitialState();
  saveState();
}

function saveState() {
  const tempPath = `${STORE_PATH}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(state, null, 2), 'utf8');
  fs.renameSync(tempPath, STORE_PATH);
}

function projectCountRank(count) {
  if (count >= 10) return { name: 'Legend', next: null, progress: 100, subtitle: '10+ loyiha' };
  if (count >= 5) return { name: 'Creator', next: 'Legend', progress: Math.round(((count - 5) / 5) * 100), subtitle: `${count}/10 loyiha` };
  if (count >= 2) return { name: 'Builder', next: 'Creator', progress: Math.round(((count - 2) / 3) * 100), subtitle: `${count}/5 loyiha` };
  return { name: 'Yangi qadam', next: 'Builder', progress: count ? 50 : 0, subtitle: `${count}/2 loyiha` };
}

function structureScore(project) {
  const fileEntries = Object.entries(project.files || {});
  const folders = project.folders || [];
  const textEntries = fileEntries.filter(([, content]) => typeof content === 'string');
  const nonEmptyLines = textEntries.reduce((total, [, content]) => total + content.split(/\r?\n/).filter((line) => line.trim()).length, 0);
  const semanticFolders = new Set(['components', 'pages', 'services', 'utils', 'hooks', 'models', 'routes', 'controllers', 'tests', 'test', 'lib']);
  const meaningfulFolders = folders.reduce((total, folder) => total + (semanticFolders.has(path.posix.basename(folder).toLowerCase()) ? 1 : 0), 0);
  const hasTests = fileEntries.some(([filePath]) => /(^|\/)(__tests__|tests?)(\/|\.|$)|\.(test|spec)\./i.test(filePath));
  const extensions = new Set(fileEntries.map(([filePath]) => path.posix.extname(filePath)).filter(Boolean));
  return Math.min(150, Math.min(fileEntries.length, 24) * 3 + Math.min(folders.length, 16) * 4 + Math.min(nonEmptyLines, 220) * 0.11 + Math.min(meaningfulFolders, 6) * 7 + (hasTests ? 12 : 0) + (extensions.size >= 3 ? 5 : 0));
}

function developerRank(score) {
  if (score >= 270) return { name: 'Senior', next: null, progress: 100, subtitle: 'Mustahkam struktura' };
  if (score >= 145) return { name: 'Middle+', next: 'Senior', progress: Math.round(((score - 145) / 125) * 100), subtitle: 'Katta loyihalar sari' };
  if (score >= 75) return { name: 'Middle', next: 'Middle+', progress: Math.round(((score - 75) / 70) * 100), subtitle: 'Mustaqil yechimlar' };
  if (score >= 28) return { name: 'Junior+', next: 'Middle', progress: Math.round(((score - 28) / 47) * 100), subtitle: 'Struktura shakllanmoqda' };
  return { name: 'Junior', next: 'Junior+', progress: Math.round((score / 28) * 100), subtitle: 'Asoslarni mustahkamlash' };
}

function activePlan(profile = state.profile) {
  if (profile.role === 'admin') return 'max';
  const expires = profile.planExpiresAt ? Date.parse(profile.planExpiresAt) : 0;
  if (profile.plan && profile.plan !== 'free' && expires > Date.now()) return profile.plan;
  return 'free';
}

function publicState() {
  const score = state.projects.reduce((total, project) => total + structureScore(project), 0);
  const plan = activePlan();
  return {
    ...state,
    profile: { ...state.profile, plan },
    projects: state.projects.map((project) => ({ ...project, score: Math.round(structureScore(project)) })),
    creatorRank: projectCountRank(state.projects.length),
    developerRank: developerRank(score),
    codeScore: Math.round(score),
    lessons: LESSONS,
    shopItems: SHOP_ITEMS
  };
}

function json(res, status, payload) {
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff'
  });
  res.end(JSON.stringify(payload));
}

function fail(res, status, message) {
  json(res, status, { error: message });
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(Object.assign(new Error('So‘rov juda katta.'), { status: 413 }));
        req.destroy();
        return;
      }
      raw += chunk.toString('utf8');
    });
    req.on('end', () => {
      if (!raw) return resolve({});
      try { resolve(JSON.parse(raw)); }
      catch { reject(Object.assign(new Error('JSON formatini tekshiring.'), { status: 400 })); }
    });
    req.on('error', reject);
  });
}

function validProjectPath(value) {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().replaceAll('\\', '/');
  if (!normalized || normalized.length > 240 || normalized.startsWith('/') || /^[a-z]:/i.test(normalized)) return null;
  const parts = normalized.split('/');
  if (parts.some((part) => !part || part === '.' || part === '..' || /[\u0000-\u001f]/.test(part))) return null;
  return parts.join('/');
}

function findProject(id) {
  return state.projects.find((project) => project.id === id);
}

function projectBytes(project) {
  return Object.values(project.files || {}).reduce((total, content) => total + Buffer.byteLength(content, 'utf8'), 0);
}

function sendFile(res, requestPath) {
  let decoded;
  try { decoded = decodeURIComponent(requestPath); }
  catch { return fail(res, 400, 'Manzil formatini tekshiring.'); }
  const requested = decoded === '/' ? '/index.html' : decoded;
  const absolutePath = path.resolve(PUBLIC_DIR, `.${requested}`);
  const relative = path.relative(PUBLIC_DIR, absolutePath);
  if (relative.startsWith('..') || path.isAbsolute(relative)) return fail(res, 403, 'Bu faylni ochishga ruxsat yo‘q.');
  fs.readFile(absolutePath, (error, data) => {
    if (error) return fail(res, 404, 'Sahifa topilmadi.');
    const extension = path.extname(absolutePath).toLowerCase();
    const contentType = ({ '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon' })[extension] || 'application/octet-stream';
    const isPreview = relative === 'preview.html';
    const contentSecurityPolicy = isPreview
      ? "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:; font-src data:; connect-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'self'"
      : "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://jcdxficlsfnrlyrqmisa.supabase.co; frame-src 'self' data: blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'";
    res.writeHead(200, {
      'content-type': contentType,
      'cache-control': 'no-cache',
      'x-content-type-options': 'nosniff',
      'referrer-policy': 'same-origin',
      'x-frame-options': 'SAMEORIGIN',
      'content-security-policy': contentSecurityPolicy
    });
    res.end(data);
  });
}

async function route(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const { pathname } = url;
  if (pathname === '/api/config' && req.method === 'GET') return json(res, 200, { mode: 'local' });
  if (pathname === '/api/state' && req.method === 'GET') return json(res, 200, publicState());

  if (pathname === '/api/profile' && req.method === 'PATCH') {
    const body = await readJson(req);
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const username = typeof body.username === 'string' ? body.username.trim().toLowerCase().replace(/^@/, '') : '';
    const bio = typeof body.bio === 'string' ? body.bio.trim() : '';
    if (name.length < 2 || name.length > 40) return fail(res, 400, 'Ism 2–40 belgi orasida bo‘lsin.');
    if (!/^[a-z0-9._]{3,24}$/.test(username)) return fail(res, 400, 'Foydalanuvchi nomi 3–24 belgi: a–z, raqam, nuqta yoki pastki chiziq.');
    if (bio.length > 160) return fail(res, 400, 'Bio 160 belgidan oshmasin.');
    state.profile = { ...state.profile, name, username, bio };
    saveState();
    return json(res, 200, publicState());
  }

  if (pathname === '/api/profile/equip' && req.method === 'PATCH') {
    const body = await readJson(req);
    const item = SHOP_ITEMS.find((candidate) => candidate.id === body.itemId);
    if (!item || item.kind === 'subscription' || !state.inventory.includes(item.id)) return fail(res, 404, 'Bu bezak inventaringizda yo‘q.');
    const profileKey = `${item.kind}Item`;
    const profileFields = { avatar: 'avatarItem', tag: 'tagItem', frame: 'frameItem', bg: 'bgItem', theme: 'themeItem' };
    if (item.kind === 'pet') {
      if (item.id === 'pet-wizard') state.profile.petConfig.hat = 'wizard';
      if (item.id === 'pet-vr') state.profile.petConfig.glasses = 'vr';
      if (item.id === 'pet-crown') state.profile.petConfig.hat = 'crown';
      saveState();
      return json(res, 200, publicState());
    }
    if (!profileFields[item.kind]) return fail(res, 400, 'Bu bezakni taqib bo‘lmaydi.');
    const targetField = profileFields[item.kind];
    state.profile[targetField] = item.id;
    saveState();
    return json(res, 200, publicState());
  }

  if (pathname === '/api/pet/customize' && req.method === 'POST') {
    if (activePlan() !== 'max') return fail(res, 403, 'Lumi’ni sozlash uchun Max rejasi kerak.');
    const body = await readJson(req);
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const color = ['cyan', 'lime', 'gold', 'purple'].includes(body.color) ? body.color : null;
    if (name.length < 1 || name.length > 20 || !color) return fail(res, 400, 'Pet nomi yoki rangi noto‘g‘ri.');
    state.profile.petConfig = { ...state.profile.petConfig, name, color };
    saveState();
    return json(res, 200, publicState());
  }

  if (pathname === '/api/game/record' && req.method === 'POST') return json(res, 200, publicState());

  if (pathname === '/api/projects' && req.method === 'POST') {
    const body = await readJson(req);
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const template = ['blank', 'portfolio', 'webapp'].includes(body.template) ? body.template : 'blank';
    if (name.length < 2 || name.length > 48) return fail(res, 400, 'Loyiha nomi 2–48 belgi orasida bo‘lsin.');
    if (state.projects.length >= 100) return fail(res, 409, 'Hozircha 100 tagacha loyiha yaratish mumkin.');
    const starter = starterProject(template, name);
    const now = new Date().toISOString();
    state.projects.unshift({ id: crypto.randomUUID(), name, template, folders: starter.folders, files: starter.files, createdAt: now, updatedAt: now });
    saveState();
    return json(res, 201, publicState());
  }

  const fileMatch = pathname.match(/^\/api\/projects\/([\w-]+)\/files?$/);
  const folderMatch = pathname.match(/^\/api\/projects\/([\w-]+)\/folders$/);
  const deleteProjectMatch = pathname.match(/^\/api\/projects\/([\w-]+)$/);
  if ((fileMatch || folderMatch || deleteProjectMatch) && !req.method.startsWith('GET')) {
    const id = (fileMatch || folderMatch || deleteProjectMatch)[1];
    const project = findProject(id);
    if (!project) return fail(res, 404, 'Loyiha topilmadi.');
    if (fileMatch && req.method === 'PUT') {
      const body = await readJson(req);
      const filePath = validProjectPath(body.path);
      if (!filePath || typeof body.content !== 'string') return fail(res, 400, 'Fayl manzili yoki kodi noto‘g‘ri.');
      if (Buffer.byteLength(body.content, 'utf8') > 180_000) return fail(res, 413, 'Fayl 180 KB dan kichik bo‘lsin.');
      if (!Object.hasOwn(project.files, filePath)) return fail(res, 404, 'Fayl topilmadi.');
      const nextProjectBytes = projectBytes(project) - Buffer.byteLength(project.files[filePath], 'utf8') + Buffer.byteLength(body.content, 'utf8');
      if (nextProjectBytes > MAX_PROJECT_BYTES) return fail(res, 413, 'Loyiha kodining umumiy hajmi 2 MB dan kichik bo‘lsin.');
      project.files[filePath] = body.content;
      project.updatedAt = new Date().toISOString();
      saveState();
      return json(res, 200, publicState());
    }
    if (fileMatch && req.method === 'POST') {
      const body = await readJson(req);
      const filePath = validProjectPath(body.path);
      if (!filePath) return fail(res, 400, 'Fayl nomini tekshiring.');
      if (Object.hasOwn(project.files, filePath) || project.folders.includes(filePath)) return fail(res, 409, 'Bunday fayl yoki papka allaqachon bor.');
      const content = typeof body.content === 'string' ? body.content : '';
      if (Buffer.byteLength(content, 'utf8') > 180_000) return fail(res, 413, 'Fayl 180 KB dan kichik bo‘lsin.');
      const parents = filePath.split('/').slice(0, -1);
      const parentPaths = [];
      for (let i = 1; i <= parents.length; i += 1) parentPaths.push(parents.slice(0, i).join('/'));
      if (Object.keys(project.files).length >= MAX_PROJECT_FILES) return fail(res, 409, 'Har bir loyihada 200 tagacha fayl yaratish mumkin.');
      if (projectBytes(project) + Buffer.byteLength(content, 'utf8') > MAX_PROJECT_BYTES) return fail(res, 413, 'Loyiha kodining umumiy hajmi 2 MB dan kichik bo‘lsin.');
      if (new Set([...project.folders, ...parentPaths]).size > MAX_PROJECT_FOLDERS) return fail(res, 409, 'Har bir loyihada 100 tagacha papka yaratish mumkin.');
      for (const parent of parentPaths) {
        if (!project.folders.includes(parent)) project.folders.push(parent);
      }
      project.files[filePath] = content;
      project.updatedAt = new Date().toISOString();
      saveState();
      return json(res, 201, publicState());
    }
    if (fileMatch && req.method === 'DELETE') {
      const filePath = validProjectPath(url.searchParams.get('path'));
      if (!filePath || !Object.hasOwn(project.files, filePath)) return fail(res, 404, 'Fayl topilmadi.');
      delete project.files[filePath];
      project.updatedAt = new Date().toISOString();
      saveState();
      return json(res, 200, publicState());
    }
    if (folderMatch && req.method === 'POST') {
      const body = await readJson(req);
      const folderPath = validProjectPath(body.path);
      if (!folderPath) return fail(res, 400, 'Papka nomini tekshiring.');
      if (project.folders.includes(folderPath) || Object.hasOwn(project.files, folderPath)) return fail(res, 409, 'Bunday fayl yoki papka allaqachon bor.');
      const parents = folderPath.split('/').slice(0, -1);
      const parentPaths = [];
      for (let i = 1; i <= parents.length; i += 1) parentPaths.push(parents.slice(0, i).join('/'));
      if (new Set([...project.folders, ...parentPaths, folderPath]).size > MAX_PROJECT_FOLDERS) return fail(res, 409, 'Har bir loyihada 100 tagacha papka yaratish mumkin.');
      for (const parent of parentPaths) {
        if (!project.folders.includes(parent)) project.folders.push(parent);
      }
      project.folders.push(folderPath);
      project.updatedAt = new Date().toISOString();
      saveState();
      return json(res, 201, publicState());
    }
    if (deleteProjectMatch && req.method === 'DELETE') {
      if (state.projects.length <= 1) return fail(res, 409, 'Oxirgi loyihani o‘chirib bo‘lmaydi.');
      state.projects = state.projects.filter((item) => item.id !== id);
      saveState();
      return json(res, 200, publicState());
    }
    return fail(res, 405, 'Bu amal qo‘llab-quvvatlanmaydi.');
  }

  const lessonMatch = pathname.match(/^\/api\/lessons\/([\w-]+)\/complete$/);
  if (lessonMatch && req.method === 'POST') {
    const lesson = LESSONS.find((item) => item.id === lessonMatch[1]);
    if (!lesson) return fail(res, 404, 'Dars topilmadi.');
    if (state.completedLessons.includes(lesson.id)) return fail(res, 409, 'Bu dars uchun mukofot avval olingan.');
    const currentPlan = activePlan();
    const lessonLimit = currentPlan === 'max' ? 350 : currentPlan === 'pro' ? 100 : 20;
    if (lesson.index > lessonLimit || state.completedLessons.length >= lessonLimit) return fail(res, 403, 'Bu dars tanlagan rejangizda ochilmagan.');
    state.completedLessons.push(lesson.id);
    state.coins += lesson.coins;
    state.xp += lesson.xp;
    state.coinLedger.unshift({ id: crypto.randomUUID(), delta: lesson.coins, reason: `Dars: ${lesson.track}`, createdAt: new Date().toISOString() });
    saveState();
    return json(res, 200, publicState());
  }

  if (pathname === '/api/shop/purchase' && req.method === 'POST') {
    const body = await readJson(req);
    const item = SHOP_ITEMS.find((candidate) => candidate.id === body.itemId);
    if (!item) return fail(res, 404, 'Mahsulot topilmadi.');
    if (state.coins < item.price) return fail(res, 409, `Bu mahsulot uchun yana ${item.price - state.coins} coin kerak.`);
    if (item.kind !== 'subscription' && state.inventory.includes(item.id)) return fail(res, 409, 'Bu mahsulot profilingizda bor.');
    state.coins -= item.price;
    state.inventory.push(item.id);
    if (item.kind === 'avatar') state.profile.avatarItem = item.id;
    if (item.kind === 'tag') state.profile.tagItem = item.id;
    if (item.kind === 'frame') state.profile.frameItem = item.id;
    if (item.kind === 'bg') state.profile.bgItem = item.id;
    if (item.kind === 'theme') state.profile.themeItem = item.id;
    state.coinLedger.unshift({ id: crypto.randomUUID(), delta: -item.price, reason: `Do‘kon: ${item.name}`, createdAt: new Date().toISOString() });
    saveState();
    return json(res, 200, publicState());
  }

  if (pathname === '/api/plans/select' && req.method === 'POST') {
    const plan = body.plan;
    const price = plan === 'pro' ? 900 : plan === 'max' ? 3000 : null;
    if (!price) return fail(res, 400, 'Paid plan tanlang.');
    if (state.coins < price) return fail(res, 409, `Obunani faollashtirish uchun yana ${price - state.coins} coin kerak.`);
    const currentExpiry = state.profile.planExpiresAt && Date.parse(state.profile.planExpiresAt) > Date.now()
      ? Date.parse(state.profile.planExpiresAt) : Date.now();
    state.coins -= price;
    state.profile.plan = plan;
    state.profile.planExpiresAt = new Date(currentExpiry + 30 * 86_400_000).toISOString();
    state.subscription = { itemId: `plan-${plan}`, name: `Lumen ${plan.toUpperCase()}`, expiresAt: state.profile.planExpiresAt };
    state.coinLedger.unshift({ id: crypto.randomUUID(), delta: -price, reason: `Plan: ${plan}`, createdAt: new Date().toISOString() });
    saveState();
    return json(res, 200, publicState());
  }

  if (pathname.startsWith('/api/')) return fail(res, 404, 'API manzili topilmadi.');
  if (req.method !== 'GET' && req.method !== 'HEAD') return fail(res, 405, 'Bu amal qo‘llab-quvvatlanmaydi.');
  return sendFile(res, pathname);
}

const server = http.createServer((req, res) => {
  route(req, res).catch((error) => {
    if (!res.headersSent && !res.destroyed) fail(res, error.status || 500, error.status ? error.message : 'Server xatosi.');
    if (!error.status) console.error(error);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`LumenCo tayyor: http://localhost:${PORT}`);
});
