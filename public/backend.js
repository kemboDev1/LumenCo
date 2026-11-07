'use strict';

(() => {
  const SESSION_KEY = 'lumenco-session-v1';
  let config = null;
  let session = null;

  function readSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); }
    catch { return null; }
  }

  function saveSession(next) {
    session = next;
    if (next) localStorage.setItem(SESSION_KEY, JSON.stringify(next));
    else localStorage.removeItem(SESSION_KEY);
  }

  function normalizeSession(payload) {
    return {
      access_token: payload.access_token,
      refresh_token: payload.refresh_token,
      expires_at_ms: Date.now() + (Number(payload.expires_in) || 3600) * 1000,
      token_type: payload.token_type || 'bearer'
    };
  }

  async function readResponse(response) {
    const text = await response.text();
    let data = null;
    if (text) {
      try { data = JSON.parse(text); }
      catch { data = { message: text }; }
    }
    if (!response.ok) {
      const message = data?.msg || data?.message || data?.error_description || data?.error || 'So‘rov bajarilmadi.';
      throw Object.assign(new Error(message), { status: response.status, detail: data });
    }
    return data;
  }

  async function authFetch(path, options = {}, bearer = null) {
    const token = bearer || session?.access_token || config?.key;
    const response = await fetch(`${config.url}/auth/v1${path}`, {
      method: options.method || 'GET',
      headers: {
        apikey: config.key,
        authorization: `Bearer ${token}`,
        'content-type': 'application/json',
        ...(options.headers || {})
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    });
    return readResponse(response);
  }

  async function refreshSession() {
    if (!session?.refresh_token) {
      saveSession(null);
      throw new Error('Sessiya tugadi. Qayta kiring.');
    }
    try {
      const payload = await authFetch('/token?grant_type=refresh_token', {
        method: 'POST', body: { refresh_token: session.refresh_token }
      });
      saveSession(normalizeSession(payload));
      return session;
    } catch (err) {
      saveSession(null);
      throw err;
    }
  }

  async function currentSession(forceRefresh = false) {
    if (!session) session = readSession();
    if (!session) throw new Error('Hisobingizga kiring.');
    if (forceRefresh || session.expires_at_ms < Date.now() + 60_000) await refreshSession();
    return session;
  }

  async function supabaseFetch(path, options = {}, retried = false) {
    const activeSession = await currentSession();
    const response = await fetch(`${config.url}/rest/v1${path}`, {
      method: options.method || 'GET',
      headers: {
        apikey: config.key,
        authorization: `Bearer ${activeSession.access_token}`,
        'content-type': 'application/json',
        ...(options.prefer ? { prefer: options.prefer } : {}),
        ...(options.headers || {})
      },
      body: options.body === undefined ? undefined : JSON.stringify(options.body)
    });
    if (response.status === 401) {
      if (!retried) {
        try {
          await currentSession(true);
          return supabaseFetch(path, options, true);
        } catch {
          saveSession(null);
          throw new Error('Sessiya tugadi. Qayta kiring.');
        }
      }
      saveSession(null);
      throw new Error('Sessiya tugadi. Qayta kiring.');
    }
    return readResponse(response);
  }

  function query(entries) {
    const params = new URLSearchParams(entries);
    return `?${params.toString()}`;
  }

  function validPath(value) {
    if (typeof value !== 'string') return null;
    const normalized = value.trim().replaceAll('\\', '/');
    const parts = normalized.split('/');
    if (!normalized || normalized.length > 240 || normalized.startsWith('/') || /^[a-z]:/i.test(normalized)) return null;
    if (parts.some((part) => !part || part === '.' || part === '..' || /[\u0000-\u001f]/.test(part))) return null;
    return parts.join('/');
  }

  function pathParents(value) {
    const parts = value.split('/').slice(0, -1);
    return parts.map((_, index) => parts.slice(0, index + 1).join('/'));
  }

  function bytes(value) { return new TextEncoder().encode(String(value ?? '')).length; }

  function starterProject(template, name) {
    if (template === 'portfolio') return {
      folders: ['assets'],
      files: {
        'index.html': `<!doctype html>\n<html lang="uz">\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <title>${name}</title>\n  <link rel="stylesheet" href="styles.css" />\n</head>\n<body>\n  <main class="card">\n    <p class="eyebrow">PORTFOLIO</p>\n    <h1>Salom, men Muhammadbekman.</h1>\n    <p>Bu mening yangi dasturlash loyiham.</p>\n    <a href="#projects">Loyihalarimni ko‘rish</a>\n  </main>\n  <script src="app.js"></script>\n</body>\n</html>\n`,
        'styles.css': `:root { color-scheme: dark; font-family: system-ui, sans-serif; }\nbody { min-height: 100vh; margin: 0; display: grid; place-items: center; background: #0c101b; color: #f1f5f9; }\n.card { max-width: 520px; padding: 48px; border-radius: 24px; background: #151c2e; border: 1px solid #283553; box-shadow: 0 24px 70px rgba(0,0,0,.5); text-align: center; }\n.eyebrow { color: #38bdf8; font-size: 12px; letter-spacing: .14em; font-weight: 700; }\nh1 { font-size: clamp(2rem, 5vw, 3rem); line-height: 1.1; margin: 12px 0; }\na { display: inline-block; margin-top: 18px; padding: 10px 22px; border-radius: 12px; background: #38bdf8; color: #0f172a; text-decoration: none; font-weight: 700; }\n`,
        'app.js': `console.log('LumenCo loyihasi muvaffaqiyatli ishga tushdi!');\nconst link = document.querySelector('a');\nlink?.addEventListener('click', (e) => {\n  e.preventDefault();\n  alert('Yangi bo‘limlarni o‘zingiz kodlab qo‘shing!');\n});\n`
      }
    };
    if (template === 'webapp') return {
      folders: ['src', 'src/components', 'src/pages', 'src/utils', 'public'],
      files: {
        'index.html': `<!doctype html>\n<html lang="uz">\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <title>${name}</title>\n  <link rel="stylesheet" href="src/styles.css" />\n</head>\n<body>\n  <div id="app"></div>\n  <script src="src/main.js"></script>\n</body>\n</html>\n`,
        'src/main.js': `const root = document.querySelector('#app');\nroot.innerHTML = '<main><h1>${name}</h1><p>Start building your idea here.</p></main>';\n`,
        'src/styles.css': `:root { font-family: system-ui, sans-serif; color: #f1f5f9; background: #0c101b; }\nbody { min-height: 100vh; display: grid; place-items: center; margin: 0; }\nmain { padding: 48px; border-radius: 24px; background: #151c2e; border: 1px solid #283553; }\n`,
        'README.md': `# ${name}\n\nCreated with LumenCo.\n`
      }
    };
    return { folders: [], files: { 'README.md': `# ${name}\n\nDescribe your project here.\n` } };
  }

  function creatorRank(count) {
    if (count >= 10) return { name: 'Legend', next: null, progress: 100, subtitle: `${count}/10 loyiha` };
    if (count >= 5) return { name: 'Creator', next: 'Legend', progress: Math.round(((count - 5) / 5) * 100), subtitle: `${count}/10 loyiha` };
    if (count >= 2) return { name: 'Builder', next: 'Creator', progress: Math.round(((count - 2) / 3) * 100), subtitle: `${count}/5 loyiha` };
    return { name: 'Starter', next: 'Builder', progress: count ? 50 : 0, subtitle: `${count}/2 loyiha` };
  }

  function scoreProject(project) {
    const fileEntries = Object.entries(project.files || {});
    const folders = project.folders || [];
    const lines = fileEntries.reduce((sum, [, content]) => sum + String(content).split(/\r?\n/).filter((line) => line.trim()).length, 0);
    const semantic = new Set(['components','pages','services','utils','hooks','models','routes','controllers','tests','test','lib']);
    const meaningful = folders.filter((folder) => semantic.has(folder.split('/').pop().toLowerCase())).length;
    const hasTests = fileEntries.some(([name]) => /(^|\/)(__tests__|tests?)(\/|\.)|\.(test|spec)\./i.test(name));
    const extensions = new Set(fileEntries.map(([name]) => name.split('.').pop().toLowerCase()));
    return Math.min(150, Math.min(fileEntries.length, 24) * 3 + Math.min(folders.length, 16) * 4 + Math.min(lines, 220) * .11 + Math.min(meaningful, 6) * 7 + (hasTests ? 12 : 0) + (extensions.size >= 3 ? 5 : 0));
  }

  function developerRank(score) {
    if (score >= 270) return { name: 'Senior', next: null, progress: 100, subtitle: 'Kuchli loyiha arxitekturasi' };
    if (score >= 145) return { name: 'Middle+', next: 'Senior', progress: Math.round(((score - 145) / 125) * 100), subtitle: 'Katta tizimlar sari o‘sish' };
    if (score >= 75) return { name: 'Middle', next: 'Middle+', progress: Math.round(((score - 75) / 70) * 100), subtitle: 'Mustaqil loyihalar yaratish' };
    if (score >= 28) return { name: 'Junior+', next: 'Middle', progress: Math.round(((score - 28) / 47) * 100), subtitle: 'Tuzilma shakllanmoqda' };
    return { name: 'Junior', next: 'Junior+', progress: Math.round((score / 28) * 100), subtitle: 'Poydevorni mustahkamlash' };
  }

  function stateWithRanks(state) {
    const score = state.projects.reduce((total, project) => total + scoreProject(project), 0);
    return {
      ...state,
      projects: state.projects.map((project) => ({ ...project, score: Math.round(scoreProject(project)) })),
      creatorRank: creatorRank(state.projects.length),
      developerRank: developerRank(score + (state.xp ? Math.round(state.xp * 0.1) : 0)),
      codeScore: Math.round(score + (state.xp ? Math.round(state.xp * 0.1) : 0))
    };
  }

  // LumenCo shop catalog
  const FULL_SHOP_ITEMS = [
    // Animatsiyali ramkalar
    { id: 'frame-yalpiz', name: 'Yalpiz', category: 'Ramkalar', iconName: 'sparkle', description: 'Qatoringiz atrofida aylanib turadi — yalpiz neoni.', kind: 'frame', price: 100, days: null },
    { id: 'frame-okean', name: 'Okean', category: 'Ramkalar', iconName: 'layers', description: 'Okean to‘lqini kabi moviy aylanma nur.', kind: 'frame', price: 150, days: null },
    { id: 'frame-olov', name: 'Olov', category: 'Ramkalar', iconName: 'flame', description: 'Qizg‘in olov kabi yonib turuvchi olovli ramka.', kind: 'frame', price: 200, days: null },
    { id: 'frame-shafaq', name: 'Shafaq', category: 'Ramkalar', iconName: 'sparkle', description: 'Kechki shafaq tusidagi binafsha-pushti gradient.', kind: 'frame', price: 250, days: null },
    { id: 'frame-kiber', name: 'Kiber', category: 'Ramkalar', iconName: 'zap', description: 'Kiberpank matritsa neonli puls ramkasi.', kind: 'frame', price: 300, days: null },
    { id: 'frame-noyob', name: 'Noyob', category: 'Ramkalar', iconName: 'shield', description: 'Haqiqiy afsonaviy sariq-qora ogohlantiruvchi VIP ramka.', kind: 'frame', price: 500, days: null, isRare: true },

    // Fonlar
    { id: 'bg-yalpiz', name: 'Yalpiz', category: 'Fonlar', iconName: 'palette', description: 'Qatoringiz orqasidagi bezak — yalpiz zumrad gradient.', kind: 'bg', price: 150, days: null },
    { id: 'bg-konfet', name: 'Konfet', category: 'Fonlar', iconName: 'palette', description: 'Shirin konfet tusidagi mayin kechki fon.', kind: 'bg', price: 200, days: null },
    { id: 'bg-shom', name: 'Shom', category: 'Fonlar', iconName: 'palette', description: 'Qorong‘u osmondagi qizil-binafsha shom shulasi.', kind: 'bg', price: 250, days: null },
    { id: 'bg-okean', name: 'Okean', category: 'Fonlar', iconName: 'palette', description: 'Tungi okean tubidagi chuqur moviy gradient.', kind: 'bg', price: 250, days: null },
    { id: 'bg-nuqtalar', name: 'Nuqtalar', category: 'Fonlar', iconName: 'palette', description: 'Kiberpank geometrik nuqtalar matritsasi.', kind: 'bg', price: 300, days: null },
    { id: 'bg-ogohlantirish', name: 'Ogohlantirish', category: 'Fonlar', iconName: 'shield', description: 'Ogohlantiruvchi sariq va qora chiziqli tekstura.', kind: 'bg', price: 350, days: null },
    { id: 'bg-tolqinlar', name: 'To‘lqinlar', category: 'Fonlar', iconName: 'layers', description: 'Geometrik aylanma to‘lqinlar naqshi.', kind: 'bg', price: 400, days: null },
    { id: 'bg-laboratoriya', name: 'Laboratoriya', category: 'Fonlar', iconName: 'code', description: 'Yuqori texnologiyali kod laboratoriyasi to‘ri.', kind: 'bg', price: 500, days: null },

    // Muharrir temalari
    { id: 'theme-dracula', name: 'Dracula', category: 'Muharrir', iconName: 'code', description: 'Klassik qora-binafsha dasturchilar temasi.', kind: 'theme', price: 100, days: null },
    { id: 'theme-monokai', name: 'Monokai', category: 'Muharrir', iconName: 'code', description: 'Yorqin sariq va yashil sintaksis.', kind: 'theme', price: 100, days: null },
    { id: 'theme-night-owl', name: 'Night Owl', category: 'Muharrir', iconName: 'code', description: 'Tunda kod yozuvchilar uchun qulay mavzu.', kind: 'theme', price: 120, days: null },
    { id: 'theme-cobalt2', name: 'Cobalt2', category: 'Muharrir', iconName: 'code', description: 'Wes Bos uslubidagi yorqin moviy va sariq tema.', kind: 'theme', price: 150, days: null },
    { id: 'theme-claude', name: 'Claude Dark', category: 'Muharrir', iconName: 'code', description: 'Zamonaviy issiq kofeyiy AI kod temasi.', kind: 'theme', price: 150, days: null },
    { id: 'theme-nord', name: 'Nord', category: 'Muharrir', iconName: 'code', description: 'Shimoliy sovuq pastel ranglar uyg‘unligi.', kind: 'theme', price: 180, days: null },
    { id: 'theme-github-dark', name: 'GitHub Dark', category: 'Muharrir', iconName: 'code', description: 'Rasmiy GitHub qorong‘i dizayn kodi.', kind: 'theme', price: 180, days: null },
    { id: 'theme-oceanic', name: 'Oceanic Next', category: 'Muharrir', iconName: 'code', description: 'Dengiz moviyligi va qulay kontrast.', kind: 'theme', price: 200, days: null },

    // Avatarlar & Pet buyumlari
    { id: 'avatar-cat', name: 'Kiber Mushuk', category: 'Avatarlar', iconName: 'user', description: 'Piksel kiber mushuk avatari.', kind: 'avatar', price: 200, days: null },
    { id: 'avatar-ninja', name: 'Kiber Ninja', category: 'Avatarlar', iconName: 'user', description: 'Tungi kod ninja avatari.', kind: 'avatar', price: 250, days: null },
    { id: 'avatar-robot', name: 'AI Robot', category: 'Avatarlar', iconName: 'user', description: 'Futuristik sun‘iy intellekt avatari.', kind: 'avatar', price: 300, days: null },
    { id: 'pet-wizard', name: 'Sehrgar Qalpog‘i', category: 'Pet', iconName: 'sparkle', description: 'Lumi ustozi uchun sehrgar qalpoq.', kind: 'pet', price: 150, days: null },
    { id: 'pet-vr', name: 'VR Ko‘zoynak', category: 'Pet', iconName: 'eye', description: 'Lumi uchun kiber VR garnitura.', kind: 'pet', price: 150, days: null },
    { id: 'pet-crown', name: 'Oltin Toj', category: 'Pet', iconName: 'crown', description: 'Lumi uchun imperator toji.', kind: 'pet', price: 300, days: null }
  ];

  // Comprehensive curriculum: 20 Free, 100 Pro, 350 Max
  function generateCurriculum() {
    const list = [];
    const tracks = [
      { name: 'Web Asoslari', tier: 'free', count: 20, start: 1, baseReward: 40 },
      { name: 'CSS & Dizayn Laboratoriyasi', tier: 'pro', count: 30, start: 21, baseReward: 60 },
      { name: 'JavaScript & DOM Interaktivlik', tier: 'pro', count: 30, start: 51, baseReward: 80 },
      { name: 'SOLID & Dastur Arxitekturasi', tier: 'pro', count: 20, start: 81, baseReward: 100 },
      { name: 'AI & Neyrotarmoqlar Dasturlash', tier: 'max', count: 100, start: 101, baseReward: 150 },
      { name: 'Fullstack & Kiberxavfsizlik', tier: 'max', count: 150, start: 201, baseReward: 200 }
    ];

    const curatedTitles = {
      1: 'HTML strukturasi va semantik teglari',
      2: 'Sarlavhalar, paragraflar va havolalar',
      3: 'Rasmlar, audio va media elementlar',
      4: 'Jadvallar va tartibli ro‘yxatlar',
      5: 'Web formalar va foydalanuvchi kiritmalari',
      6: 'HTML5 semantikasi: header, main, footer',
      7: 'Meta teglar va qidiruv tizimlari (SEO)',
      8: 'CSS selektorlari va ranglar palitrasi',
      9: 'Box model: margin, padding, border',
      10: 'Matn tipografiyasi va Google Fonts',
      11: 'Flexbox asoslari: yo‘nalish va tekislash',
      12: 'Flexbox o‘qlari bo‘yicha elementlarni boshqarish',
      13: 'CSS Grid: qatorlar va ustunlar to‘ri',
      14: 'Grid maydonlari bilan dashboard yasash',
      15: 'CSS o‘zgaruvchilari (Custom Properties)',
      16: 'CSS gradientlari va soya effektlari',
      17: 'Hover va fokus holatlari animatsiyasi',
      18: 'Media Queries va responsiv mobil dizayn',
      19: 'Mobile-first yondashuvi',
      20: 'Birinchi to‘liq portfolio sahifasini yakunlash',

      21: 'CSS Keyframe animatsiyalari va harakat',
      22: '3D CSS Transformatsiyalar',
      23: 'Glassmorphism va Neomorfizm effektlari',
      24: 'Tailwind CSS utilitalar falsafasi',
      25: 'CSS Maskalari va SVG filtrlari',
      35: 'BEM metodologiyasi va CSS arxitekturasi',
      50: 'Mukammal responsiv landing sahifa',

      51: 'JavaScript o‘zgaruvchilari: let, const, turlar',
      52: 'Funksiyalar, Arrow funksiyalar va scope',
      53: 'DOM elementlarini tanlash va o‘zgartirish',
      54: 'Hodisalar (Events) va Event Bubbling',
      55: 'Massiv metodlari: map, filter, reduce',
      56: 'LocalStorage va ma’lumotlarni saqlash',
      65: 'Asinxronlik: Promises va Async/Await',
      70: 'Fetch API bilan ob-havo xizmatini ulash',
      75: 'HTML5 Canvas bilan mini o‘yin yaratish',
      80: 'Modulli JavaScript (ES Modules)',

      81: 'OOP asoslari: Class va Prototiplar',
      82: 'Single Responsibility Principle (SRP)',
      83: 'Open/Closed Principle (OCP)',
      84: 'Liskov Substitution Principle (LSP)',
      85: 'Interface Segregation Principle (ISP)',
      86: 'Dependency Inversion Principle (DIP)',
      90: 'Dizayn Patternlari: Singleton, Factory, Observer',
      95: 'Unit Testlar va Jest bilan kodni tekshirish',
      100: 'SOLID mezonlariga asoslangan toza arxitektura',

      101: 'Sun‘iy intellekt va LLM ishlash tamoyillari',
      102: 'Prompt Engineering: Tizimli ko‘rsatmalar yozish',
      110: 'TensorFlow.js bilan brauzerda neyrotarmoq qurish',
      130: 'RAG (Retrieval-Augmented Generation) tizimi',
      150: 'O‘zbekcha nutqni matnga aylantirish modeli',
      200: 'Avtonom AI agentlar va Tool Calling arxitekturasi',

      201: 'Node.js runtime va Event Loop ichki tuzilishi',
      210: 'Express.js bilan RESTful API server yaratish',
      225: 'Supabase PostgreSQL munosabatli ma’lumotlar bazasi',
      250: 'JWT autentifikatsiya va xavfsiz sessiyalar',
      280: 'WebSocket bilan real-vaqt chat va xabarnomalar',
      310: 'XSS, CSRF va SQL Injection hujumlaridan himoyalanish',
      330: 'Docker konteynerizatsiyasi va CI/CD quvurlari',
      350: 'Katta yuklamaga bardoshli Fullstack mikroservis'
    };

    tracks.forEach((track) => {
      for (let i = track.start; i < track.start + track.count; i++) {
        const id = `lesson-${i}`;
        const title = curatedTitles[i] || `${track.name}: ${i}-amaliy laboratoriya mashg‘uloti`;
        const level = track.tier === 'free' ? 'Boshlang‘ich' : track.tier === 'pro' ? 'O‘rta / Solid' : 'Yuqori / AI';
        list.push({
          id,
          index: i,
          title,
          track: track.name,
          tier: track.tier,
          duration: `${15 + (i % 4) * 5} min`,
          level,
          xp: track.baseReward + (i * 2),
          coins: Math.round(track.baseReward * 0.5)
        });
      }
    });

    return list;
  }

  const ALL_LESSONS = generateCurriculum();

  function getProfileExtras(userId, userEmail, userName) {
    const key = `lumenco_extras_${userId}`;
    let extras = null;
    try { extras = JSON.parse(localStorage.getItem(key) || 'null'); } catch {}
    const emailLower = String(userEmail || '').toLowerCase();
    const nameLower = String(userName || '').toLowerCase();
    const isAdmin = emailLower === 'muhammadbekrafiqov260@gmail.com' || 
                    nameLower.includes('kembodev') || 
                    extras?.role === 'admin' ||
                    localStorage.getItem('lumenco_force_admin') === 'true';

    if (!extras) {
      extras = {
        plan: isAdmin ? 'max' : 'free',
        role: isAdmin ? 'admin' : 'user',
        isBanned: false,
        streak: 1,
        equippedFrame: isAdmin ? 'frame-noyob' : null,
        equippedBg: isAdmin ? 'bg-laboratoriya' : null,
        equippedTheme: 'theme-dracula',
        equippedAvatar: null,
        equippedTag: null,
        extraCoins: isAdmin ? 9480 : 250,
        extraXp: isAdmin ? 9480 : 100,
        inventory: isAdmin
          ? ['frame-noyob', 'frame-olov', 'frame-yalpiz', 'bg-laboratoriya', 'bg-shom', 'theme-dracula', 'theme-monokai', 'avatar-robot', 'pet-crown', 'pet-vr']
          : ['theme-dracula', 'frame-yalpiz'],
        petConfig: {
          name: 'Lumi',
          hat: isAdmin ? 'crown' : 'none',
          glasses: isAdmin ? 'vr' : 'none',
          color: 'cyan',
          level: isAdmin ? 'high' : 'medium'
        },
        typingRecord: { bestWpm: isAdmin ? 78 : 0, accuracy: 100, races: 0 }
      };
      saveProfileExtras(userId, extras);
    } else if (isAdmin && (extras.role !== 'admin' || extras.plan !== 'max')) {
      extras.role = 'admin';
      extras.plan = 'max';
      if (!extras.equippedFrame) extras.equippedFrame = 'frame-noyob';
      if (!extras.equippedBg) extras.equippedBg = 'bg-laboratoriya';
      saveProfileExtras(userId, extras);
    }
    return extras;
  }

  function saveProfileExtras(userId, extras) {
    try { localStorage.setItem(`lumenco_extras_${userId}`, JSON.stringify(extras)); } catch {}
  }

  function getAdminUsers() {
    const key = 'lumenco_admin_users_v3';
    let users = null;
    try { users = JSON.parse(localStorage.getItem(key) || 'null'); } catch {}
    if (!users || !users.length) {
      users = [
        {
          id: 'usr-admin-1',
          name: 'Muhammadbek Rafiqov',
          username: 'kembodev',
          email: 'muhammadbekrafiqov260@gmail.com',
          role: 'admin',
          plan: 'max',
          coins: 9480,
          xp: 9480,
          streak: 12,
          frame: 'frame-noyob',
          bg: 'bg-laboratoriya',
          isBanned: false,
          createdAt: '2026-01-10T10:00:00Z'
        },
        {
          id: 'usr-user-2',
          name: 'Jasurbek Developer',
          username: 'jasur_js',
          email: 'jasur.dev@gmail.com',
          role: 'user',
          plan: 'pro',
          coins: 3200,
          xp: 8120,
          streak: 7,
          frame: 'frame-olov',
          bg: 'bg-shom',
          isBanned: false,
          createdAt: '2026-02-14T12:30:00Z'
        },
        {
          id: 'usr-user-3',
          name: 'Malika Frontend',
          username: 'malika_code',
          email: 'malika.frontend@gmail.com',
          role: 'user',
          plan: 'pro',
          coins: 2800,
          xp: 7450,
          streak: 5,
          frame: 'frame-shafaq',
          bg: 'bg-konfet',
          isBanned: false,
          createdAt: '2026-02-20T16:00:00Z'
        },
        {
          id: 'usr-user-4',
          name: 'Bekzod Backend',
          username: 'bekzod_node',
          email: 'bekzod.backend@gmail.com',
          role: 'user',
          plan: 'free',
          coins: 1450,
          xp: 4320,
          streak: 3,
          frame: 'frame-okean',
          bg: 'bg-okean',
          isBanned: false,
          createdAt: '2026-03-01T09:15:00Z'
        },
        {
          id: 'usr-user-5',
          name: 'Aziza AI Engineer',
          username: 'aziza_ai',
          email: 'aziza.ai@gmail.com',
          role: 'user',
          plan: 'max',
          coins: 5900,
          xp: 6890,
          streak: 9,
          frame: 'frame-kiber',
          bg: 'bg-nuqtalar',
          isBanned: false,
          createdAt: '2026-03-05T14:40:00Z'
        },
        {
          id: 'usr-user-6',
          name: 'Rustam Spammer',
          username: 'spammer_99',
          email: 'spammer99@botnet.org',
          role: 'user',
          plan: 'free',
          coins: 0,
          xp: 15,
          streak: 0,
          frame: null,
          bg: null,
          isBanned: true,
          createdAt: '2026-03-08T22:10:00Z'
        }
      ];
      saveAdminUsers(users);
    }
    return users;
  }

  function saveAdminUsers(users) {
    try { localStorage.setItem('lumenco_admin_users_v3', JSON.stringify(users)); } catch {}
  }

  async function restGet(path) { return supabaseFetch(path); }

  async function loadState() {
    const activeSession = await currentSession();
    const user = await authFetch('/user', {}, activeSession.access_token);
    const userId = user.id;
    const [profiles, projects, lessons, completions, shopItems, inventory, ledger] = await Promise.all([
      restGet(`/profiles${query({ id: `eq.${userId}`, select: 'id,username,display_name,bio,avatar_item,tag_item,frame_item,premium_item,premium_until,xp,coins' })}`).catch(() => []),
      restGet(`/projects${query({ owner_id: `eq.${userId}`, select: 'id,owner_id,name,template,created_at,updated_at', order: 'updated_at.desc' })}`).catch(() => []),
      restGet(`/lessons${query({ published: 'eq.true', select: 'id,title,track,duration_minutes,level,xp_reward,coin_reward', order: 'id.asc' })}`).catch(() => []),
      restGet(`/lesson_completions${query({ profile_id: `eq.${userId}`, select: 'lesson_id' })}`).catch(() => []),
      restGet(`/shop_items${query({ active: 'eq.true', select: 'id,name,category,emoji,description,kind,coin_price,duration_days', order: 'coin_price.asc' })}`).catch(() => []),
      restGet(`/inventory${query({ profile_id: `eq.${userId}`, select: 'item_id' })}`).catch(() => []),
      restGet(`/coin_ledger${query({ profile_id: `eq.${userId}`, select: 'id,delta,reason,created_at', order: 'created_at.desc', limit: '20' })}`).catch(() => [])
    ]);

    let profile = profiles?.[0];
    if (!profile) {
      try {
        const baseName = (user.user_metadata?.display_name || user.email?.split('@')[0] || 'Muhammadbek Rafiqov').trim();
        const baseUsername = (baseName.toLowerCase().replace(/[^a-z0-9._]/g, '').slice(0, 18) || 'kembodev');
        await supabaseFetch('/profiles', {
          method: 'POST',
          body: {
            id: userId,
            display_name: baseName.slice(0, 40),
            username: baseUsername,
            bio: 'LumenCo platformasida ijodkor va dasturchi.'
          },
          prefer: 'resolution=ignore-duplicates,return=minimal'
        }).catch(() => {});
        const recheck = await restGet(`/profiles${query({ id: `eq.${userId}`, select: 'id,username,display_name,bio,avatar_item,tag_item,frame_item,premium_item,premium_until,xp,coins' })}`);
        if (recheck?.length) profile = recheck[0];
      } catch (err) {
        console.warn('Profil yaratishda xato:', err);
      }
    }

    if (!profile) {
      profile = {
        id: userId,
        display_name: (user.user_metadata?.display_name || (user.email === 'muhammadbekrafiqov260@gmail.com' ? 'Muhammadbek Rafiqov' : user.email?.split('@')[0]) || 'Muhammadbek Rafiqov').slice(0, 40),
        username: (user.email === 'muhammadbekrafiqov260@gmail.com' ? 'kembodev' : user.email?.split('@')[0] || 'kembodev').slice(0, 24),
        bio: 'Dasturlash, sun‘iy intellekt va yangi loyihalar ustida ishlamoqdaman.',
        avatar_item: null,
        tag_item: null,
        frame_item: null,
        premium_item: null,
        premium_until: null,
        xp: 0,
        coins: 1000
      };
    }

    // Merge extras (local persistence + atomjs features)
    const extras = getProfileExtras(userId, user.email, profile.display_name || profile.username);

    // Sync admin users list with current user
    const adminUsers = getAdminUsers();
    let currentAdminEntry = adminUsers.find((u) => u.email === user.email || u.id === userId);
    if (!currentAdminEntry && (extras.role === 'admin' || user.email === 'muhammadbekrafiqov260@gmail.com')) {
      currentAdminEntry = {
        id: userId,
        name: profile.display_name,
        username: profile.username,
        email: user.email,
        role: 'admin',
        plan: extras.plan || 'max',
        coins: (profile.coins || 0) + (extras.extraCoins || 0),
        xp: (profile.xp || 0) + (extras.extraXp || 0),
        streak: extras.streak || 12,
        frame: extras.equippedFrame || 'frame-noyob',
        bg: extras.equippedBg || 'bg-laboratoriya',
        isBanned: false,
        createdAt: new Date().toISOString()
      };
      adminUsers.unshift(currentAdminEntry);
      saveAdminUsers(adminUsers);
    } else if (currentAdminEntry) {
      // Keep ban status and plan in sync
      if (currentAdminEntry.isBanned !== extras.isBanned) extras.isBanned = currentAdminEntry.isBanned;
      if (currentAdminEntry.plan !== extras.plan) extras.plan = currentAdminEntry.plan;
      saveProfileExtras(userId, extras);
    }

    const projectFiles = await Promise.all((projects || []).map((project) => restGet(`/project_files${query({ project_id: `eq.${project.id}`, select: 'path,kind,content', order: 'path.asc' })}`).catch(() => [])));
    const mappedProjects = (projects || []).map((project, index) => {
      const fileRows = projectFiles[index] || [];
      const files = {};
      const folders = [];
      for (const row of fileRows) {
        if (row.kind === 'folder') folders.push(row.path);
        else files[row.path] = row.content || '';
      }
      return { id: project.id, name: project.name, template: project.template, folders, files, createdAt: project.created_at, updatedAt: project.updated_at };
    });

    // Merge lessons and shop items
    const mergedInventory = Array.from(new Set([
      ...(inventory || []).map((entry) => entry.item_id),
      ...(extras.inventory || [])
    ]));

    const totalCoins = Math.max(0, (profile.coins || 0) + (extras.extraCoins || 0));
    const totalXp = Math.max(0, (profile.xp || 0) + (extras.extraXp || 0));

    return stateWithRanks({
      profile: {
        id: userId,
        email: user.email,
        name: profile.display_name,
        username: profile.username,
        bio: profile.bio || '',
        avatarItem: extras.equippedAvatar || profile.avatar_item,
        tagItem: profile.tag_item,
        frameItem: extras.equippedFrame || profile.frame_item,
        bgItem: extras.equippedBg || null,
        themeItem: extras.equippedTheme || 'theme-dracula',
        role: extras.role || 'user',
        plan: extras.plan || 'free',
        isBanned: !!extras.isBanned,
        streak: extras.streak || 1,
        petConfig: extras.petConfig || { name: 'Lumi', hat: 'none', glasses: 'none', color: 'cyan', level: 'medium' },
        typingRecord: extras.typingRecord || { bestWpm: 0, accuracy: 100, races: 0 }
      },
      coins: totalCoins,
      xp: totalXp,
      streak: extras.streak || 1,
      projects: mappedProjects,
      completedLessons: (completions || []).map((entry) => entry.lesson_id),
      inventory: mergedInventory,
      subscription: extras.plan !== 'free' ? { itemId: `plan-${extras.plan}`, name: `Lumen ${extras.plan.toUpperCase()}`, expiresAt: new Date(Date.now() + 30 * 86400000).toISOString() } : null,
      coinLedger: (ledger || []).map((entry) => ({ id: entry.id, delta: entry.delta, reason: entry.reason, createdAt: entry.created_at })),
      lessons: ALL_LESSONS,
      shopItems: FULL_SHOP_ITEMS,
      adminUsers: extras.role === 'admin' ? getAdminUsers() : []
    });
  }

  async function touchProject(projectId) {
    await supabaseFetch(`/projects${query({ id: `eq.${projectId}` })}`, {
      method: 'PATCH', body: { updated_at: new Date().toISOString() }, prefer: 'return=minimal'
    }).catch(() => {});
  }

  async function insertProjectFiles(projectId, starter) {
    const rows = [
      ...starter.folders.map((path) => ({ project_id: projectId, path, kind: 'folder', content: '' })),
      ...Object.entries(starter.files).map(([path, content]) => ({ project_id: projectId, path, kind: 'file', content }))
    ];
    if (rows.length) await supabaseFetch('/project_files', { method: 'POST', body: rows, prefer: 'return=minimal' });
  }

  async function createProject(body) {
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const template = ['blank','portfolio','webapp'].includes(body.template) ? body.template : 'blank';
    if (name.length < 2 || name.length > 48) throw new Error('Loyiha nomi 2–48 belgi orasida bo‘lsin.');
    const activeSession = await currentSession();
    const user = await authFetch('/user', {}, activeSession.access_token);
    const userId = user.id;
    const current = await loadState();
    if (current.projects.length >= 100) throw new Error('Hozircha 100 tagacha loyiha yaratish mumkin.');
    const created = await supabaseFetch(`/projects${query({ select: 'id' })}`, {
      method: 'POST', body: { owner_id: userId, name, template }, prefer: 'return=representation'
    });
    const projectId = created?.[0]?.id;
    if (!projectId) throw new Error('Loyiha yaratilmadi.');
    try { await insertProjectFiles(projectId, starterProject(template, name)); }
    catch (error) {
      await supabaseFetch(`/projects${query({ id: `eq.${projectId}` })}`, { method: 'DELETE', prefer: 'return=minimal' }).catch(() => {});
      throw error;
    }
    await touchProject(projectId);
    return loadState();
  }

  async function createFolderRows(projectId, folders) {
    const rows = [...new Set(folders)].map((path) => ({ project_id: projectId, path, kind: 'folder', content: '' }));
    if (rows.length) await supabaseFetch(`/project_files${query({ on_conflict: 'project_id,path' })}`, {
      method: 'POST', body: rows, prefer: 'resolution=ignore-duplicates,return=minimal'
    }).catch(() => {});
  }

  async function updateFile(projectId, body) {
    const path = validPath(body.path);
    if (!path || typeof body.content !== 'string') throw new Error('Fayl manzili yoki kodi noto‘g‘ri.');
    if (bytes(body.content) > 180_000) throw new Error('Fayl 180 KB dan kichik bo‘lsin.');
    const state = await loadState();
    const project = state.projects.find((entry) => entry.id === projectId);
    if (!project || !Object.hasOwn(project.files, path)) throw new Error('Fayl topilmadi.');
    const totalBytes = Object.values(project.files).reduce((sum, content) => sum + bytes(content), 0);
    if (totalBytes - bytes(project.files[path]) + bytes(body.content) > 2_000_000) throw new Error('Loyiha kodining umumiy hajmi 2 MB dan kichik bo‘lsin.');
    await supabaseFetch(`/project_files${query({ project_id: `eq.${projectId}`, path: `eq.${path}`, kind: 'eq.file' })}`, {
      method: 'PATCH', body: { content: body.content, updated_at: new Date().toISOString() }, prefer: 'return=representation'
    });
    await touchProject(projectId);
    return loadState();
  }

  async function addFile(projectId, body) {
    const path = validPath(body.path);
    if (!path) throw new Error('Fayl nomini tekshiring.');
    const content = typeof body.content === 'string' ? body.content : '';
    if (bytes(content) > 180_000) throw new Error('Fayl 180 KB dan kichik bo‘lsin.');
    const state = await loadState();
    const project = state.projects.find((entry) => entry.id === projectId);
    if (!project) throw new Error('Loyiha topilmadi.');
    if (Object.hasOwn(project.files, path) || project.folders.includes(path)) throw new Error('Bunday fayl yoki papka allaqachon bor.');
    if (Object.keys(project.files).length >= 200) throw new Error('Har bir loyihada 200 tagacha fayl yaratish mumkin.');
    const totalBytes = Object.values(project.files).reduce((sum, value) => sum + bytes(value), 0);
    if (totalBytes + bytes(content) > 2_000_000) throw new Error('Loyiha kodining umumiy hajmi 2 MB dan kichik bo‘lsin.');
    const parents = pathParents(path);
    if (new Set([...project.folders, ...parents]).size > 100) throw new Error('Har bir loyihada 100 tagacha papka yaratish mumkin.');
    await createFolderRows(projectId, parents);
    await supabaseFetch('/project_files', { method: 'POST', body: { project_id: projectId, path, kind: 'file', content }, prefer: 'return=minimal' });
    await touchProject(projectId);
    return loadState();
  }

  async function addFolder(projectId, body) {
    const path = validPath(body.path);
    if (!path) throw new Error('Papka nomini tekshiring.');
    const state = await loadState();
    const project = state.projects.find((entry) => entry.id === projectId);
    if (!project) throw new Error('Loyiha topilmadi.');
    if (project.folders.includes(path) || Object.hasOwn(project.files, path)) throw new Error('Bunday fayl yoki papka allaqachon bor.');
    const folders = [...pathParents(`${path}/placeholder`), path];
    if (new Set([...project.folders, ...folders]).size > 100) throw new Error('Har bir loyihada 100 tagacha papka yaratish mumkin.');
    await createFolderRows(projectId, folders);
    await touchProject(projectId);
    return loadState();
  }

  async function apiRequest(url, options = {}) {
    const parsed = new URL(url, location.origin);
    const pathname = parsed.pathname;
    const method = (options.method || 'GET').toUpperCase();
    const body = options.body ? JSON.parse(options.body) : {};

    if (pathname === '/api/state' && method === 'GET') return loadState();
    if (pathname === '/api/projects' && method === 'POST') return createProject(body);

    if (pathname === '/api/profile' && method === 'PATCH') {
      const name = typeof body.name === 'string' ? body.name.trim() : '';
      const username = typeof body.username === 'string' ? body.username.trim().toLowerCase().replace(/^@/, '') : '';
      const bio = typeof body.bio === 'string' ? body.bio.trim() : '';
      if (name.length < 2 || name.length > 40) throw new Error('Ism 2–40 belgi orasida bo‘lsin.');
      if (!/^[a-z0-9._]{3,24}$/.test(username)) throw new Error('Foydalanuvchi nomi 3–24 belgi: a–z, raqam, nuqta yoki pastki chiziq.');
      if (bio.length > 160) throw new Error('Bio 160 belgidan oshmasin.');
      const activeSession = await currentSession();
      const user = await authFetch('/user', {}, activeSession.access_token);
      await supabaseFetch(`/profiles${query({ id: `eq.${user.id}` })}`, {
        method: 'PATCH', body: { display_name: name, username, bio }, prefer: 'return=representation'
      }).catch(() => {});
      return loadState();
    }

    if (pathname === '/api/profile/equip' && method === 'PATCH') {
      const activeSession = await currentSession();
      const user = await authFetch('/user', {}, activeSession.access_token);
      const extras = getProfileExtras(user.id, user.email);
      const item = FULL_SHOP_ITEMS.find((it) => it.id === body.itemId);
      if (item) {
        if (item.kind === 'frame') extras.equippedFrame = extras.equippedFrame === item.id ? null : item.id;
        else if (item.kind === 'bg') extras.equippedBg = extras.equippedBg === item.id ? null : item.id;
        else if (item.kind === 'theme') extras.equippedTheme = item.id;
        else if (item.kind === 'avatar') extras.equippedAvatar = extras.equippedAvatar === item.id ? null : item.id;
        saveProfileExtras(user.id, extras);
      }
      await supabaseFetch('/rpc/equip_shop_item', { method: 'POST', body: { p_item_id: body.itemId } }).catch(() => {});
      return loadState();
    }

    if (pathname === '/api/shop/purchase' && method === 'POST') {
      const activeSession = await currentSession();
      const user = await authFetch('/user', {}, activeSession.access_token);
      const extras = getProfileExtras(user.id, user.email);
      const item = FULL_SHOP_ITEMS.find((it) => it.id === body.itemId);
      if (!item) throw new Error('Mahsulot topilmadi.');
      const currentState = await loadState();
      if (currentState.coins < item.price) throw new Error('Coinlar yetarli emas. Darslar yoki tez yozish orqali to‘plang.');
      if (!extras.inventory.includes(item.id)) {
        extras.inventory.push(item.id);
        extras.extraCoins = (extras.extraCoins || 0) - item.price;
        // Auto equip
        if (item.kind === 'frame') extras.equippedFrame = item.id;
        if (item.kind === 'bg') extras.equippedBg = item.id;
        if (item.kind === 'theme') extras.equippedTheme = item.id;
        saveProfileExtras(user.id, extras);
      }
      await supabaseFetch('/rpc/purchase_shop_item', { method: 'POST', body: { p_item_id: body.itemId } }).catch(() => {});
      return loadState();
    }

    if (pathname === '/api/plans/select' && method === 'POST') {
      const activeSession = await currentSession();
      const user = await authFetch('/user', {}, activeSession.access_token);
      const extras = getProfileExtras(user.id, user.email);
      const plan = ['free', 'pro', 'max'].includes(body.plan) ? body.plan : 'free';
      extras.plan = plan;
      saveProfileExtras(user.id, extras);

      // Update in admin list if exists
      const users = getAdminUsers();
      const target = users.find((u) => u.email === user.email || u.id === user.id);
      if (target) {
        target.plan = plan;
        saveAdminUsers(users);
      }
      return loadState();
    }

    if (pathname === '/api/pet/customize' && method === 'POST') {
      const activeSession = await currentSession();
      const user = await authFetch('/user', {}, activeSession.access_token);
      const extras = getProfileExtras(user.id, user.email);
      extras.petConfig = {
        name: String(body.name || extras.petConfig?.name || 'Lumi').slice(0, 20),
        hat: body.hat || extras.petConfig?.hat || 'none',
        glasses: body.glasses || extras.petConfig?.glasses || 'none',
        color: body.color || extras.petConfig?.color || 'cyan',
        level: body.level || extras.petConfig?.level || 'medium'
      };
      saveProfileExtras(user.id, extras);
      return loadState();
    }

    if (pathname === '/api/game/record' && method === 'POST') {
      const activeSession = await currentSession();
      const user = await authFetch('/user', {}, activeSession.access_token);
      const extras = getProfileExtras(user.id, user.email);
      const wpm = Number(body.wpm) || 0;
      const accuracy = Number(body.accuracy) || 100;
      const multiplier = extras.plan === 'max' ? 3 : extras.plan === 'pro' ? 2 : 1;
      const earnedCoins = 30 * multiplier;
      const earnedXp = 50 * multiplier;
      extras.extraCoins = (extras.extraCoins || 0) + earnedCoins;
      extras.extraXp = (extras.extraXp || 0) + earnedXp;
      extras.typingRecord = {
        bestWpm: Math.max(extras.typingRecord?.bestWpm || 0, wpm),
        accuracy: Math.round(((extras.typingRecord?.accuracy || 100) + accuracy) / 2),
        races: (extras.typingRecord?.races || 0) + 1
      };
      saveProfileExtras(user.id, extras);
      return loadState();
    }

    // Admin endpoints
    if (pathname === '/api/admin/users' && method === 'GET') {
      return getAdminUsers();
    }

    if (pathname === '/api/admin/ban' && method === 'POST') {
      const users = getAdminUsers();
      const target = users.find((u) => u.id === body.userId || u.email === body.email || u.username === body.username);
      if (target) {
        target.isBanned = !target.isBanned;
        saveAdminUsers(users);
      }
      const activeSession = await currentSession();
      const user = await authFetch('/user', {}, activeSession.access_token);
      if (user && (user.id === body.userId || user.email === body.email)) {
        const extras = getProfileExtras(user.id, user.email);
        extras.isBanned = target ? target.isBanned : !extras.isBanned;
        saveProfileExtras(user.id, extras);
      }
      return loadState();
    }

    if (pathname === '/api/admin/plan' && method === 'POST') {
      const users = getAdminUsers();
      const target = users.find((u) => u.id === body.userId || u.email === body.email || u.username === body.username);
      if (target) {
        target.plan = body.plan;
        saveAdminUsers(users);
      }
      const activeSession = await currentSession();
      const user = await authFetch('/user', {}, activeSession.access_token);
      if (user && (user.id === body.userId || user.email === body.email)) {
        const extras = getProfileExtras(user.id, user.email);
        extras.plan = body.plan;
        saveProfileExtras(user.id, extras);
      }
      return loadState();
    }

    if (pathname === '/api/admin/coins' && method === 'POST') {
      const users = getAdminUsers();
      const target = users.find((u) => u.id === body.userId || u.email === body.email || u.username === body.username);
      const amount = Number(body.amount) || 500;
      if (target) {
        target.coins = (target.coins || 0) + amount;
        saveAdminUsers(users);
      }
      const activeSession = await currentSession();
      const user = await authFetch('/user', {}, activeSession.access_token);
      if (user && (user.id === body.userId || user.email === body.email)) {
        const extras = getProfileExtras(user.id, user.email);
        extras.extraCoins = (extras.extraCoins || 0) + amount;
        saveProfileExtras(user.id, extras);
      }
      return loadState();
    }

    const lessonMatch = pathname.match(/^\/api\/lessons\/([\w-]+)\/complete$/);
    if (lessonMatch && method === 'POST') {
      const activeSession = await currentSession();
      const user = await authFetch('/user', {}, activeSession.access_token);
      const extras = getProfileExtras(user.id, user.email);
      const lesson = ALL_LESSONS.find((l) => l.id === lessonMatch[1]);
      if (lesson) {
        const mult = extras.plan === 'max' ? 3 : extras.plan === 'pro' ? 2 : 1;
        extras.extraCoins = (extras.extraCoins || 0) + (lesson.coins * mult);
        extras.extraXp = (extras.extraXp || 0) + (lesson.xp * mult);
        extras.streak = (extras.streak || 1) + 1;
        saveProfileExtras(user.id, extras);
      }
      await supabaseFetch('/rpc/complete_lesson', { method: 'POST', body: { p_lesson_id: lessonMatch[1] } }).catch(() => {});
      return loadState();
    }

    const folderMatch = pathname.match(/^\/api\/projects\/([\w-]+)\/folders$/);
    const fileMatch = pathname.match(/^\/api\/projects\/([\w-]+)\/files$/);
    const projectMatch = pathname.match(/^\/api\/projects\/([\w-]+)$/);
    if (fileMatch && method === 'PUT') return updateFile(fileMatch[1], body);
    if (fileMatch && method === 'POST') return addFile(fileMatch[1], body);
    if (folderMatch && method === 'POST') return addFolder(folderMatch[1], body);
    if (fileMatch && method === 'DELETE') {
      const path = validPath(parsed.searchParams.get('path'));
      if (!path) throw new Error('Fayl topilmadi.');
      await supabaseFetch(`/project_files${query({ project_id: `eq.${fileMatch[1]}`, path: `eq.${path}`, kind: 'eq.file' })}`, { method: 'DELETE', prefer: 'return=minimal' });
      await touchProject(fileMatch[1]);
      return loadState();
    }
    if (projectMatch && method === 'DELETE') {
      await supabaseFetch(`/projects${query({ id: `eq.${projectMatch[1]}` })}`, { method: 'DELETE', prefer: 'return=minimal' });
      return loadState();
    }
    throw new Error('API manzili topilmadi.');
  }

  async function initialize() {
    const response = await fetch('/api/config', { cache: 'no-store' });
    config = await response.json();
    if (!response.ok || !['local', 'supabase'].includes(config.mode)) throw new Error(config.error || 'Backend sozlamasi topilmadi.');
    if (config.mode === 'local') return 'local';
    config.url = String(config.url || '').replace(/\/$/, '');
    session = readSession();
    const fragment = new URLSearchParams(location.hash.replace(/^#/, ''));
    const errorDesc = fragment.get('error_description') || new URLSearchParams(location.search).get('error_description');
    if (errorDesc) {
      history.replaceState(null, '', `${location.pathname}`);
      window.setTimeout(() => {
        if (typeof window.toast === 'function') {
          window.toast(decodeURIComponent(errorDesc.replace(/\+/g, ' ')), 'error');
        }
      }, 300);
    }
    const accessToken = fragment.get('access_token');
    const refreshToken = fragment.get('refresh_token');
    if (accessToken && refreshToken) {
      session = {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_at_ms: Number(fragment.get('expires_at')) * 1000 || Date.now() + (Number(fragment.get('expires_in')) || 3600) * 1000,
        token_type: fragment.get('token_type') || 'bearer'
      };
      saveSession(session);
      history.replaceState(null, '', `${location.pathname}${location.search}`);
    }
    return 'supabase';
  }

  async function signIn(email, password) {
    const payload = await authFetch('/token?grant_type=password', {
      method: 'POST',
      body: { email, password }
    });
    if (!payload.access_token) throw new Error('Email yoki parol noto‘g‘ri.');
    saveSession(normalizeSession(payload));
    return authFetch('/user', {}, session.access_token);
  }

  async function signUp(email, password, name) {
    const redirect = encodeURIComponent(location.origin);
    const payload = await authFetch(`/signup?redirect_to=${redirect}`, {
      method: 'POST',
      body: { email, password, data: { display_name: name } }
    });
    if (payload.access_token) saveSession(normalizeSession(payload));
    if (payload.user?.id && payload.access_token) {
      return { user: await authFetch('/user', {}, session.access_token), needsEmail: false };
    }
    return { user: payload.user || null, needsEmail: true };
  }

  async function signOut() {
    if (session?.access_token) await authFetch('/logout', { method: 'POST', body: {} }, session.access_token).catch(() => {});
    saveSession(null);
  }

  async function resendConfirmation(email) {
    const redirect = encodeURIComponent(location.origin);
    const response = await fetch(`${config.url}/auth/v1/resend`, {
      method: 'POST',
      headers: {
        apikey: config.key,
        'content-type': 'application/json'
      },
      body: JSON.stringify({ type: 'signup', email, options: { email_redirect_to: location.origin } })
    });
    return readResponse(response);
  }

  window.LumenBackend = {
    initialize,
    getSession: currentSession,
    apiRequest,
    signIn,
    signUp,
    signOut,
    resendConfirmation,
    clearSession: () => saveSession(null)
  };
})();
