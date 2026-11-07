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

  async function authFetch(path, options = {}, bearer = config?.key) {
    const response = await fetch(`${config.url}/auth/v1${path}`, {
      method: options.method || 'GET',
      headers: {
        apikey: config.key,
        authorization: `Bearer ${bearer || config.key}`,
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
        'index.html': `<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <title>${name}</title>\n  <link rel="stylesheet" href="styles.css" />\n</head>\n<body>\n  <main class="card">\n    <p class="eyebrow">MY PORTFOLIO</p>\n    <h1>Hello, I’m Azizbek.</h1>\n    <p>This is my first project page.</p>\n    <a href="#projects">See my projects</a>\n  </main>\n</body>\n</html>\n`,
        'styles.css': `:root { color-scheme: light; font-family: system-ui, sans-serif; }\nbody { min-height: 100vh; margin: 0; display: grid; place-items: center; background: #eff2ff; color: #192239; }\n.card { max-width: 520px; padding: 48px; border-radius: 28px; background: white; box-shadow: 0 24px 70px #24326018; }\n.eyebrow { color: #5867db; font-size: 12px; letter-spacing: .14em; }\nh1 { font-size: clamp(2rem, 6vw, 3.6rem); line-height: 1.06; }\na { color: #3548cb; }\n`,
        'app.js': `const link = document.querySelector('a');\nlink?.addEventListener('click', () => {\n  console.log('Build the next section here.');\n});\n`
      }
    };
    if (template === 'webapp') return {
      folders: ['src', 'src/components', 'src/pages', 'src/utils', 'public'],
      files: {
        'index.html': `<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <title>${name}</title>\n  <link rel="stylesheet" href="src/styles.css" />\n</head>\n<body>\n  <div id="app"></div>\n  <script src="src/main.js"></script>\n</body>\n</html>\n`,
        'src/main.js': `const root = document.querySelector('#app');\nroot.innerHTML = '<main><h1>${name}</h1><p>Start building your idea here.</p></main>';\n`,
        'src/styles.css': `:root { font-family: system-ui, sans-serif; color: #192239; background: #eff2ff; }\nbody { min-height: 100vh; display: grid; place-items: center; margin: 0; }\nmain { padding: 48px; border-radius: 24px; background: white; }\n`,
        'README.md': `# ${name}\n\nCreated with LumenCo.\n`
      }
    };
    return { folders: [], files: { 'README.md': `# ${name}\n\nDescribe your project here.\n` } };
  }

  function starterFileContent(path) {
    if (/\.html?$/i.test(path)) return `<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <title>New page</title>\n</head>\n<body>\n  <main>\n    <h1>Hello, LumenCo!</h1>\n    <p>Your new page starts here.</p>\n  </main>\n</body>\n</html>\n`;
    if (/\.css$/i.test(path)) return `:root {\n  font-family: system-ui, sans-serif;\n  color: #202633;\n}\n`;
    if (/\.(js|jsx|ts|tsx)$/i.test(path)) return `// Start building your new feature here.\n`;
    if (/\.json$/i.test(path)) return `{}\n`;
    if (/\.md$/i.test(path)) return `# New file\n`;
    return '';
  }

  function creatorRank(count) {
    if (count >= 10) return { name: 'Legend', next: null, progress: 100, subtitle: `${count}/10 projects` };
    if (count >= 5) return { name: 'Creator', next: 'Legend', progress: Math.round(((count - 5) / 5) * 100), subtitle: `${count}/10 projects` };
    if (count >= 2) return { name: 'Builder', next: 'Creator', progress: Math.round(((count - 2) / 3) * 100), subtitle: `${count}/5 projects` };
    return { name: 'Starter', next: 'Builder', progress: count ? 50 : 0, subtitle: `${count}/2 projects` };
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
    if (score >= 270) return { name: 'Senior', next: null, progress: 100, subtitle: 'Strong project structure' };
    if (score >= 145) return { name: 'Middle+', next: 'Senior', progress: Math.round(((score - 145) / 125) * 100), subtitle: 'Growing into larger projects' };
    if (score >= 75) return { name: 'Middle', next: 'Middle+', progress: Math.round(((score - 75) / 70) * 100), subtitle: 'Building independently' };
    if (score >= 28) return { name: 'Junior+', next: 'Middle', progress: Math.round(((score - 28) / 47) * 100), subtitle: 'Structure taking shape' };
    return { name: 'Junior', next: 'Junior+', progress: Math.round((score / 28) * 100), subtitle: 'Strengthen the foundations' };
  }

  function stateWithRanks(state) {
    const score = state.projects.reduce((total, project) => total + scoreProject(project), 0);
    return {
      ...state,
      projects: state.projects.map((project) => ({ ...project, score: Math.round(scoreProject(project)) })),
      creatorRank: creatorRank(state.projects.length),
      developerRank: developerRank(score),
      codeScore: Math.round(score)
    };
  }

  async function restGet(path) { return supabaseFetch(path); }

  async function loadState() {
    const activeSession = await currentSession();
    const user = await authFetch('/user', {}, activeSession.access_token);
    const userId = user.id;
    const [profiles, projects, lessons, completions, shopItems, inventory, ledger] = await Promise.all([
      restGet(`/profiles${query({ id: `eq.${userId}`, select: 'id,username,display_name,bio,avatar_item,tag_item,frame_item,premium_item,premium_until,xp,coins' })}`),
      restGet(`/projects${query({ owner_id: `eq.${userId}`, select: 'id,owner_id,name,template,created_at,updated_at', order: 'updated_at.desc' })}`),
      restGet(`/lessons${query({ published: 'eq.true', select: 'id,title,track,duration_minutes,level,xp_reward,coin_reward', order: 'id.asc' })}`),
      restGet(`/lesson_completions${query({ profile_id: `eq.${userId}`, select: 'lesson_id' })}`),
      restGet(`/shop_items${query({ active: 'eq.true', select: 'id,name,category,emoji,description,kind,coin_price,duration_days', order: 'coin_price.asc' })}`),
      restGet(`/inventory${query({ profile_id: `eq.${userId}`, select: 'item_id' })}`),
      restGet(`/coin_ledger${query({ profile_id: `eq.${userId}`, select: 'id,delta,reason,created_at', order: 'created_at.desc', limit: '20' })}`)
    ]);
    let profile = profiles?.[0];
    if (!profile) {
      try {
        const baseName = (user.user_metadata?.display_name || user.email?.split('@')[0] || 'Builder').trim();
        const baseUsername = (baseName.toLowerCase().replace(/[^a-z0-9._]/g, '').slice(0, 18) || 'builder') + '_' + (user.id ? user.id.replace(/-/g, '').slice(0, 4) : '01');
        await supabaseFetch('/profiles', {
          method: 'POST',
          body: {
            id: userId,
            display_name: baseName.slice(0, 40),
            username: baseUsername,
            bio: 'Building one project at a time.'
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
        display_name: (user.user_metadata?.display_name || user.email?.split('@')[0] || 'Builder').slice(0, 40),
        username: (user.email?.split('@')[0] || 'builder').slice(0, 24),
        bio: 'Building one project at a time.',
        avatar_item: null,
        tag_item: null,
        frame_item: null,
        premium_item: null,
        premium_until: null,
        xp: 0,
        coins: 2100
      };
    }
    const projectFiles = await Promise.all(projects.map((project) => restGet(`/project_files${query({ project_id: `eq.${project.id}`, select: 'path,kind,content', order: 'path.asc' })}`)));
    const mappedProjects = projects.map((project, index) => {
      const fileRows = projectFiles[index] || [];
      const files = {};
      const folders = [];
      for (const row of fileRows) {
        if (row.kind === 'folder') folders.push(row.path);
        else files[row.path] = row.content || '';
      }
      return { id: project.id, name: project.name, template: project.template, folders, files, createdAt: project.created_at, updatedAt: project.updated_at };
    });
    const subscription = profile.premium_until && new Date(profile.premium_until).getTime() > Date.now()
      ? { itemId: profile.premium_item, name: 'Lumen Plus', expiresAt: profile.premium_until }
      : null;
    return stateWithRanks({
      profile: { name: profile.display_name, username: profile.username, bio: profile.bio || '', avatarItem: profile.avatar_item, tagItem: profile.tag_item, frameItem: profile.frame_item },
      coins: profile.coins,
      xp: profile.xp,
      projects: mappedProjects,
      completedLessons: completions.map((entry) => entry.lesson_id),
      inventory: inventory.map((entry) => entry.item_id),
      subscription,
      coinLedger: ledger.map((entry) => ({ id: entry.id, delta: entry.delta, reason: entry.reason, createdAt: entry.created_at })),
      lessons: lessons.map((lesson) => ({ id: lesson.id, title: lesson.title, track: lesson.track, xp: lesson.xp_reward, coins: lesson.coin_reward, duration: `${lesson.duration_minutes} min`, level: lesson.level })),
      shopItems: shopItems.map((item) => ({ id: item.id, name: item.name, category: item.category, emoji: item.emoji, description: item.description, kind: item.kind, price: item.coin_price, days: item.duration_days }))
    });
  }

  async function touchProject(projectId) {
    await supabaseFetch(`/projects${query({ id: `eq.${projectId}` })}`, {
      method: 'PATCH', body: { updated_at: new Date().toISOString() }, prefer: 'return=minimal'
    });
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
    const current = await loadState();
    if (current.projects.length >= 100) throw new Error('Hozircha 100 tagacha loyiha yaratish mumkin.');
    const user = await authFetch('/user');
    const created = await supabaseFetch(`/projects${query({ select: 'id' })}`, {
      method: 'POST', body: { owner_id: user.id, name, template }, prefer: 'return=representation'
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
    });
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
      const user = await authFetch('/user');
      await supabaseFetch(`/profiles${query({ id: `eq.${user.id}` })}`, {
        method: 'PATCH', body: { display_name: name, username, bio }, prefer: 'return=representation'
      });
      return loadState();
    }
    if (pathname === '/api/profile/equip' && method === 'PATCH') {
      await supabaseFetch('/rpc/equip_shop_item', { method: 'POST', body: { p_item_id: body.itemId } });
      return loadState();
    }
    if (pathname === '/api/shop/purchase' && method === 'POST') {
      await supabaseFetch('/rpc/purchase_shop_item', { method: 'POST', body: { p_item_id: body.itemId } });
      return loadState();
    }
    const lessonMatch = pathname.match(/^\/api\/lessons\/([\w-]+)\/complete$/);
    if (lessonMatch && method === 'POST') {
      await supabaseFetch('/rpc/complete_lesson', { method: 'POST', body: { p_lesson_id: lessonMatch[1] } });
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
