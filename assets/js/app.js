/* ==========================================================================
   Trilha Web
   Lê os guias em Markdown (pasta /guias), transforma cada "## Parte" em um
   módulo e cada "### tópico" em um item que pode ser marcado como estudado.
   Todo o progresso fica no localStorage do navegador.
   ========================================================================== */
(() => {
  'use strict';

  // ---------- Configuração dos guias ----------
  const GUIDES = [
    {
      id: 'csharp', file: 'guias/01-csharp-dotnet.md', line: 'csharp',
      label: 'Linha 1 · Guia 1 de 5', short: 'C# e .NET', nav: 'C# e .NET',
      desc: 'Lógica de programação, algoritmos, orientação a objetos, padrões de projeto e APIs com ASP.NET Core.',
    },
    {
      id: 'git', file: 'guias/02-git-versionamento.md', line: 'git',
      label: 'Linha 2 · Guia 2 de 5', short: 'Git e versionamento', nav: 'Git',
      desc: 'Commits, histórico, branches, merge e conflitos, GitHub e pull requests para versionar todos os seus projetos.',
    },
    {
      id: 'javascript', file: 'guias/03-javascript-typescript-angular.md', line: 'js',
      label: 'Linha 3 · Guia 3 de 5', short: 'JavaScript, TypeScript e Angular', nav: 'JS e Angular',
      desc: 'Lógica com JavaScript, linguagens compiladas e interpretadas, JavaScript na web, TypeScript e Angular.',
    },
    {
      id: 'html-css', file: 'guias/04-html-css.md', line: 'html',
      label: 'Linha 4 · Guia 4 de 5', short: 'HTML e CSS', nav: 'HTML e CSS',
      desc: 'HTML semântico e acessível, CSS moderno com Flexbox e Grid, design responsivo e frameworks de estilo.',
    },
    {
      id: 'sql', file: 'guias/05-sql-server.md', line: 'sql',
      label: 'Linha 5 · Guia 5 de 5', short: 'SQL com SQL Server', nav: 'SQL Server',
      desc: 'Tabelas, chaves primárias e estrangeiras, relacionamentos, consultas, JOINs, normalização e índices.',
    },
    {
      id: 'desafio', file: 'guias/06-desafio-final.md', line: 'desafio', challenge: true,
      label: 'Estação final · Desafio', short: 'Desafio final', nav: 'Desafio',
      desc: 'Construa um sistema de locação de instrumentos musicais com Angular, Web API em .NET e SQL Server.',
    },
  ];
  const CORE = GUIDES.filter((g) => !g.challenge);
  const BY_FILE = new Map(GUIDES.map((g) => [g.file.split('/').pop(), g]));

  const STORE_KEY = 'trilha-web:progresso:v1';
  const THEME_KEY = 'trilha-web:tema';
  const SKIP_H2 = /^sumário$/i;
  const REF_H2 = /^(glossário|para continuar)/i;

  const CODE_LABELS = {
    csharp: 'C#', cs: 'C#', js: 'JavaScript', javascript: 'JavaScript', ts: 'TypeScript',
    typescript: 'TypeScript', html: 'HTML', css: 'CSS', scss: 'SCSS', sql: 'SQL', bash: 'Terminal',
    powershell: 'PowerShell', json: 'JSON', http: 'HTTP', xml: 'XML',
  };

  const CHECK_SVG = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3.2 3.2L13 4.8"/></svg>';

  const DATA = new Map();
  const main = document.getElementById('conteudo');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = { type: null, id: null };
  let spy = null;

  // ---------- Armazenamento ----------
  const emptyState = () => ({ topics: {}, guides: {}, flags: {} });

  function readState() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      const d = raw ? JSON.parse(raw) : null;
      return { topics: d?.topics ?? {}, guides: d?.guides ?? {}, flags: d?.flags ?? {} };
    } catch {
      return emptyState();
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch {
      toast('Não foi possível salvar: o armazenamento deste navegador está bloqueado.');
    }
  }

  let state = readState();
  const isDone = (key) => Boolean(state.topics[key]);

  // ---------- Utilidades ----------
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  const slugify = (text) => text
    .toLowerCase()
    .normalize('NFC')
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-');

  const fmtDate = (ts) => new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    .format(new Date(ts));

  let toastTimer;
  function toast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-visible'), 2800);
  }

  // ---------- Processamento do Markdown ----------
  function processGuide(guide, md) {
    const root = document.createElement('div');
    root.innerHTML = marked.parse(md, { gfm: true });

    const h1 = root.querySelector('h1');
    const title = h1 ? h1.textContent.trim() : guide.short;
    h1?.remove();

    // Remove o sumário: a barra lateral cumpre esse papel
    root.querySelectorAll('h2').forEach((h2) => {
      if (!SKIP_H2.test(h2.textContent.trim())) return;
      let n = h2.nextElementSibling;
      h2.remove();
      while (n && n.tagName !== 'H2') {
        const next = n.nextElementSibling;
        n.remove();
        n = next;
      }
    });

    const used = new Set();
    const uid = (base) => {
      const b = base || 'secao';
      let s = b;
      let i = 2;
      while (used.has(s)) s = `${b}-${i++}`;
      used.add(s);
      return s;
    };

    const modules = [];
    const refs = [];
    let mod = null;
    let topic = null;

    const insertDone = (t, before) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'topic-done';
      btn.dataset.topic = t.key;
      btn.setAttribute('aria-pressed', 'false');
      btn.innerHTML = `<span class="topic-done__box" aria-hidden="true">${CHECK_SVG}</span>`
        + '<span class="topic-done__label">Marcar como estudado</span>'
        + `<span class="topic-done__sub">${esc(t.title)}</span>`;
      if (before) root.insertBefore(btn, before);
      else root.appendChild(btn);
    };

    const addChip = (heading, t) => {
      heading.innerHTML = `<span class="h-text">${heading.innerHTML}</span>`;
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'topic-chip';
      chip.dataset.topic = t.key;
      chip.setAttribute('aria-pressed', 'false');
      chip.setAttribute('aria-label', `Marcar “${t.title}” como estudado`);
      chip.innerHTML = '<span class="topic-chip__dot" aria-hidden="true"></span><span class="topic-chip__label">A estudar</span>';
      heading.appendChild(chip);
    };

    const closeTopic = (before) => {
      if (topic) insertDone(topic, before);
      topic = null;
    };

    // Módulo sem subtópicos vira um tópico único
    const closeModule = (before) => {
      if (mod && mod.topics.length === 0) {
        const t = { key: `${guide.id}:${mod.id}`, id: mod.id, title: mod.title };
        mod.topics.push(t);
        addChip(mod.el, t);
        insertDone(t, before);
      }
      mod = null;
    };

    for (const el of [...root.children]) {
      if (el.tagName === 'H2') {
        closeTopic(el);
        closeModule(el);
        const text = el.textContent.trim();
        const id = uid(slugify(text));
        el.id = id;
        if (REF_H2.test(text)) {
          refs.push({ id, title: text });
          continue;
        }
        mod = { id, title: text, topics: [], el };
        modules.push(mod);
      } else if (el.tagName === 'H3') {
        closeTopic(el);
        const text = el.textContent.trim();
        const id = uid(slugify(text));
        el.id = id;
        if (mod) {
          topic = { key: `${guide.id}:${id}`, id, title: text };
          mod.topics.push(topic);
          addChip(el, topic);
        }
      }
    }
    closeTopic(null);
    closeModule(null);

    // Tabelas roláveis no celular
    root.querySelectorAll('table').forEach((table) => {
      const wrap = document.createElement('div');
      wrap.className = 'table-wrap';
      table.replaceWith(wrap);
      wrap.appendChild(table);
    });

    // Blocos de código com rótulo e botão de copiar
    root.querySelectorAll('pre').forEach((pre) => {
      const code = pre.querySelector('code');
      const lang = (code?.className.match(/language-([\w-]+)/) || [])[1] || '';
      const box = document.createElement('div');
      box.className = 'code';
      box.innerHTML = `<div class="code__bar"><span>${esc(CODE_LABELS[lang] || lang || 'texto')}</span>`
        + '<button type="button" class="code__copy">Copiar</button></div>';
      pre.replaceWith(box);
      box.appendChild(pre);
    });

    // Links entre guias viram rotas do site
    root.querySelectorAll('a[href]').forEach((a) => {
      const href = a.getAttribute('href');
      if (/^https?:/i.test(href)) {
        a.target = '_blank';
        a.rel = 'noopener';
        return;
      }
      const [path, hash] = href.split('#');
      if (path.endsWith('.md')) {
        const file = path.split('/').pop();
        const target = BY_FILE.get(file);
        a.setAttribute('href', target ? `#/guia/${target.id}${hash ? `/${hash}` : ''}` : '#/');
      } else if (!path && hash) {
        a.setAttribute('href', `#/guia/${guide.id}/${hash}`);
      }
    });

    return { guide, title, html: root.innerHTML, modules, refs };
  }

  // ---------- Cálculo do progresso ----------
  function stats(guideId) {
    const d = DATA.get(guideId);
    let total = 0;
    let done = 0;
    const mods = d.modules.map((m) => {
      const n = m.topics.filter((t) => isDone(t.key)).length;
      total += m.topics.length;
      done += n;
      return { total: m.topics.length, done: n };
    });
    const complete = total > 0 && done === total;
    return { total, done, complete, mods, pct: complete ? 100 : Math.floor((done / (total || 1)) * 100) };
  }

  function overall() {
    let total = 0;
    let done = 0;
    let guidesDone = 0;
    for (const g of GUIDES) {
      const s = stats(g.id);
      total += s.total;
      done += s.done;
      if (s.complete && !g.challenge) guidesDone++;
    }
    return { total, done, guidesDone, pct: total ? Math.floor((done / total) * 100) : 0 };
  }

  // Mantém a marcação de "guia concluído" coerente com os tópicos
  function reconcile() {
    let changed = false;
    for (const g of GUIDES) {
      const s = stats(g.id);
      if (s.complete && !state.guides[g.id]) { state.guides[g.id] = Date.now(); changed = true; }
      if (!s.complete && state.guides[g.id]) { delete state.guides[g.id]; changed = true; }
    }
    if (changed) saveState();
  }

  function toggleTopic(key) {
    const gid = key.split(':')[0];
    if (!DATA.has(gid)) return;
    if (state.topics[key]) delete state.topics[key];
    else state.topics[key] = Date.now();

    const wasComplete = Boolean(state.guides[gid]);
    const s = stats(gid);
    let justCompleted = false;
    if (s.complete && !wasComplete) {
      state.guides[gid] = Date.now();
      justCompleted = true;
    } else if (!s.complete && wasComplete) {
      delete state.guides[gid];
    }
    saveState();
    refreshUI();
    if (justCompleted) celebrate(gid);
  }

  // ---------- Atualização da interface ----------
  function refreshUI() {
    document.querySelectorAll('[data-topic]').forEach((el) => {
      const on = isDone(el.dataset.topic);
      el.setAttribute('aria-pressed', String(on));
      const chipLabel = el.querySelector('.topic-chip__label');
      if (chipLabel) chipLabel.textContent = on ? 'Estudado' : 'A estudar';
      const doneLabel = el.querySelector('.topic-done__label');
      if (doneLabel) doneLabel.textContent = on ? 'Estudado' : 'Marcar como estudado';
    });

    const o = overall();
    document.getElementById('overall-pill').textContent = `${o.pct}% da trilha`;
    document.querySelectorAll('.topnav__link').forEach((a) => {
      a.classList.toggle('is-done', stats(a.dataset.guide).complete);
      a.toggleAttribute('aria-current', current.type === 'guide' && current.id === a.dataset.guide);
      if (a.hasAttribute('aria-current')) a.setAttribute('aria-current', 'page');
    });

    if (current.type !== 'guide') return;
    const d = DATA.get(current.id);
    const s = stats(current.id);

    d.modules.forEach((m, i) => {
      const ms = s.mods[i];
      const mark = (el) => {
        if (!el) return;
        el.classList.toggle('is-done', ms.done === ms.total);
        el.classList.toggle('is-started', ms.done > 0);
      };
      const det = main.querySelector(`[data-mod="${m.id}"]`);
      mark(det);
      if (det) det.querySelector('.mod__count').textContent = `${ms.done}/${ms.total}`;
      mark(main.querySelector(`[data-stop="${m.id}"]`));
      document.getElementById(m.id)?.classList.toggle('is-module-done', ms.done === ms.total);
    });

    const resumeBtn = main.querySelector('[data-action="resume"]');
    if (resumeBtn) resumeBtn.textContent = s.done ? 'Continuar de onde parei' : 'Começar a estudar';

    const count = document.getElementById('route-count');
    if (count) count.innerHTML = `<strong>${s.done}</strong> de ${s.total} tópicos estudados · ${s.pct}%`;

    const badge = document.getElementById('guide-badge');
    if (badge) {
      badge.hidden = !s.complete;
      if (s.complete) badge.textContent = `✓ Concluído em ${fmtDate(state.guides[current.id])}`;
    }
  }

  // ---------- Barra de navegação ----------
  function renderTopnav() {
    document.getElementById('topnav').innerHTML = GUIDES.map((g) => `
      <a class="topnav__link" href="#/guia/${g.id}" data-guide="${g.id}" data-line="${g.line}" title="${esc(g.short)}">
        <span class="topnav__dot" aria-hidden="true"></span>
        <span class="topnav__label">${esc(g.nav)}</span>
      </a>`).join('');
  }

  // ---------- Página inicial ----------
  function renderHome() {
    current = { type: 'home', id: null };
    spy?.disconnect();
    const o = overall();
    const next = GUIDES.find((g) => !stats(g.id).complete);
    const cta = !next
      ? '<a class="btn btn--primary" href="#/guia/desafio">Revisar o desafio final</a>'
      : o.done === 0
        ? `<a class="btn btn--primary" href="#/guia/${next.id}">Começar pelo guia 1</a>`
        : `<a class="btn btn--primary" href="#/guia/${next.id}">Continuar: ${esc(next.short)}</a>`;

    const segments = GUIDES.map((g) => {
      const s = stats(g.id);
      return `<span class="route-bar__seg" data-line="${g.line}" style="flex-grow:${s.total}" title="${esc(g.short)}: ${s.pct}%">
        <span class="route-bar__fill" style="--p:${s.pct}"></span></span>`;
    }).join('');

    const stations = GUIDES.map((g, i) => {
      const d = DATA.get(g.id);
      const s = stats(g.id);
      const status = s.complete
        ? `<span class="status status--done">✓ Concluído em ${fmtDate(state.guides[g.id])}</span>`
        : s.done
          ? `<span class="status">Em andamento · ${s.pct}%</span>`
          : '<span class="status">Não iniciado</span>';
      const ctaText = s.complete ? 'Revisar' : s.done ? 'Continuar' : g.challenge ? 'Ver o desafio' : 'Começar';
      const label = g.challenge && o.guidesDone < CORE.length ? `${g.label} · recomendado após os 5 guias` : g.label;
      const stops = d.modules.map((m, j) => {
        const ms = s.mods[j];
        const cls = ms.done === ms.total ? 'is-done' : ms.done ? 'is-started' : '';
        return `<li class="stops__stop ${cls}"><span class="stops__dot"></span></li>`;
      }).join('');
      return `
        <li class="station ${s.complete ? 'is-done' : ''} ${g.challenge ? 'station--terminus' : ''}"
            data-line="${g.line}" style="--p:${s.pct};--i:${i}">
          <span class="station__node" aria-hidden="true"></span>
          <a class="station__card" href="#/guia/${g.id}">
            <span class="station__line">${esc(label)}</span>
            <h2 class="station__title">${esc(g.short)}</h2>
            <p class="station__desc">${esc(g.desc)}</p>
            <span class="station__cta" aria-hidden="true">${ctaText} →</span>
            <ul class="stops" aria-hidden="true">${stops}</ul>
            <span class="station__meta">
              <span>${s.done}/${s.total} tópicos · ${d.modules.length} ${g.challenge ? 'etapas' : 'módulos'}</span>
              ${status}
            </span>
          </a>
        </li>`;
    }).join('');

    main.innerHTML = `
      <div class="home view-enter">
        <section class="hero" aria-labelledby="hero-title">
          <p class="hero__eyebrow">Trilha de estudos · desenvolvimento web</p>
          <h1 class="hero__title" id="hero-title">Do primeiro <code>Console.WriteLine</code> até a sua <span class="hero__end">primeira aplicação web completa.</span></h1>
          <p class="hero__lede">Cinco guias em sequência, do back-end ao banco de dados, passando pelo versionamento de código, e um desafio final que junta tudo. Marque cada tópico quando terminar de estudar: seu progresso fica salvo neste navegador.</p>
          <p style="margin-top:28px">${cta}</p>
          <div class="route-bar">
            <div class="route-bar__track" aria-hidden="true">${segments}</div>
            <p class="route-bar__label">
              <span><strong>${o.done}</strong> de ${o.total} tópicos estudados</span>
              <span><strong>${o.guidesDone}</strong> de ${CORE.length} guias concluídos</span>
            </p>
          </div>
        </section>

        <ol class="metro" aria-label="Guias da trilha, em ordem">${stations}</ol>

        <footer class="home__footer">
          <p>O progresso fica salvo só neste navegador. Em outro computador, em outro navegador ou numa janela anônima, ele começa do zero.</p>
          <button type="button" class="link-btn" data-action="reset">Apagar meu progresso</button>
        </footer>
      </div>`;

    refreshUI();
    window.scrollTo(0, 0);
  }

  // ---------- Página de um guia ----------
  function renderGuide(id, anchor) {
    const g = GUIDES.find((x) => x.id === id);
    if (!g) {
      renderNotFound();
      return;
    }
    current = { type: 'guide', id };
    const d = DATA.get(id);
    const s = stats(id);
    const idx = GUIDES.indexOf(g);
    const prev = GUIDES[idx - 1];
    const next = GUIDES[idx + 1];
    const firstOpen = d.modules.find((m) => m.topics.some((t) => !isDone(t.key))) || d.modules[0];
    const anchorModule = anchor && d.modules.find((m) => m.id === anchor || m.topics.some((t) => t.id === anchor));
    const openModule = anchorModule || firstOpen;
    const o = overall();

    const sidebar = d.modules.map((m) => `
      <details class="mod" data-mod="${m.id}" ${m === openModule ? 'open' : ''}>
        <summary class="mod__summary"><span>${esc(m.title)}</span><span class="mod__count"></span></summary>
        <ul class="mod__topics">
          ${m.topics.map((t) => `
            <li class="topic-row" data-row="${t.id}">
              <button type="button" class="check" data-topic="${t.key}" aria-pressed="false"
                      aria-label="Marcar “${esc(t.title)}” como estudado">${CHECK_SVG}</button>
              <a class="topic-row__link" href="#/guia/${id}/${t.id}">${esc(t.title)}</a>
            </li>`).join('')}
        </ul>
      </details>`).join('');

    const refs = d.refs.length
      ? `<nav class="sidebar__refs" aria-label="Referências">${d.refs.map((r) => `<a href="#/guia/${id}/${r.id}">${esc(r.title)}</a>`).join('')}</nav>`
      : '';

    const stops = d.modules.map((m) => `
      <li class="route__stop" data-stop="${m.id}">
        <button type="button" class="route__btn" data-goto="${m.id}" title="${esc(m.title)}" aria-label="Ir para ${esc(m.title)}"></button>
      </li>`).join('');

    const challengeNote = g.challenge && o.guidesDone < CORE.length
      ? `<div class="prose"><blockquote><p>Este desafio foi pensado para depois dos cinco guias. Você concluiu ${o.guidesDone} de ${CORE.length}. Pode dar uma olhada agora, mas volte para os guias se algum assunto parecer novo.</p></blockquote></div>`
      : '';

    main.innerHTML = `
      <div class="guide view-enter" data-line="${g.line}">
        <aside class="sidebar" id="sidebar" aria-label="${g.challenge ? 'Etapas do desafio' : 'Módulos e tópicos do guia'}">
          <div class="sidebar__head">
            <p class="sidebar__title">${g.challenge ? 'ETAPAS E TAREFAS' : 'MÓDULOS E TÓPICOS'}</p>
            <button type="button" class="icon-btn sidebar__close" data-action="close-drawer" aria-label="Fechar lista de tópicos">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
            </button>
          </div>
          ${sidebar}
          ${refs}
        </aside>
        <div class="scrim" data-action="close-drawer"></div>

        <article class="reader">
          <div class="reader__inner">
            <header class="guide-head">
              <a class="guide-head__back" href="#/">← Voltar para a trilha</a>
              <p class="guide-head__eyebrow">${esc(g.label)}</p>
              <h1 class="guide-head__title">${esc(d.title)}</h1>
              <span class="guide-head__badge" id="guide-badge" hidden></span>
              <div class="route">
                <ol class="route__stops">${stops}</ol>
                <div class="route__meta">
                  <span class="route__count" id="route-count"></span>
                  <span class="route__actions">
                    <button type="button" class="btn btn--ghost btn--small drawer-btn" data-action="open-drawer" aria-controls="sidebar">Ver tópicos</button>
                    <button type="button" class="btn btn--primary btn--small" data-action="resume">${s.done ? 'Continuar de onde parei' : 'Começar a estudar'}</button>
                  </span>
                </div>
              </div>
            </header>
            ${challengeNote}
            <div class="prose">${d.html}</div>
            <nav class="guide-end" aria-label="Outros guias">
              ${prev ? `<a class="guide-end__link" href="#/guia/${prev.id}"><small>← Anterior</small><strong>${esc(prev.short)}</strong></a>` : ''}
              ${next ? `<a class="guide-end__link guide-end__link--next" href="#/guia/${next.id}"><small>Próximo →</small><strong>${esc(next.short)}</strong></a>` : ''}
            </nav>
          </div>
        </article>
      </div>`;

    highlight();
    refreshUI();
    watchScroll(d);

    if (anchor) requestAnimationFrame(() => scrollToAnchor(anchor, false));
    else window.scrollTo(0, 0);
    main.focus({ preventScroll: true });
  }

  function renderNotFound() {
    current = { type: 'missing', id: null };
    main.innerHTML = `<div class="error-box view-enter"><h1>Página não encontrada</h1>
      <p>Esse endereço não corresponde a nenhum guia.</p><p><a class="btn btn--primary" href="#/">Ir para a trilha</a></p></div>`;
    refreshUI();
  }

  function renderError(err) {
    const local = location.protocol === 'file:';
    main.innerHTML = `
      <div class="error-box">
        <h1>Os guias não carregaram</h1>
        ${local
          ? '<p>O site foi aberto direto do disco, e o navegador bloqueia a leitura dos arquivos dos guias nesse modo. Abra por um servidor local: rode <code>npx serve .</code> na pasta do projeto, ou use a extensão Live Server do VS Code.</p>'
          : '<p>Confira sua conexão e recarregue a página. Se o problema continuar, verifique se a pasta <code>guias</code> foi publicada junto com o site.</p>'}
        <p><small>${esc(err.message)}</small></p>
      </div>`;
  }

  // ---------- Destaque de sintaxe ----------
  function highlight() {
    if (typeof hljs === 'undefined') return;
    main.querySelectorAll('.prose pre code').forEach((code) => {
      const lang = (code.className.match(/language-([\w-]+)/) || [])[1];
      if (lang && hljs.getLanguage(lang)) hljs.highlightElement(code);
    });
  }

  // ---------- Rolagem e tópico atual ----------
  function scrollToAnchor(id, smooth = true) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: smooth && !reducedMotion.matches ? 'smooth' : 'auto', block: 'start' });
  }

  function watchScroll(d) {
    spy?.disconnect();
    const rowFor = new Map();
    d.modules.forEach((m) => m.topics.forEach((t) => rowFor.set(t.id, m.id)));

    spy = new IntersectionObserver((entries) => {
      const hit = entries.find((e) => e.isIntersecting);
      if (!hit) return;
      const id = hit.target.id;
      const row = main.querySelector(`[data-row="${id}"]`);
      if (!row) return;
      main.querySelectorAll('.topic-row.is-current').forEach((r) => r.classList.remove('is-current'));
      row.classList.add('is-current');
      const det = row.closest('details');
      if (det && !det.open) det.open = true;
    }, { rootMargin: '-80px 0px -70% 0px' });

    main.querySelectorAll('.prose h2[id], .prose h3[id]').forEach((h) => {
      if (rowFor.has(h.id)) spy.observe(h);
    });
  }

  function resume() {
    const d = DATA.get(current.id);
    for (const m of d.modules) {
      const t = m.topics.find((x) => !isDone(x.key));
      if (t) {
        location.hash = `#/guia/${current.id}/${t.id}`;
        return;
      }
    }
    toast('Você já estudou todos os tópicos deste guia.');
  }

  // ---------- Gaveta (celular) ----------
  function setDrawer(open) {
    const guide = main.querySelector('.guide');
    if (!guide) return;
    guide.classList.toggle('drawer-open', open);
    if (open) main.querySelector('.sidebar .check, .sidebar summary')?.focus();
  }

  // ---------- Celebração ----------
  function celebrate(gid) {
    const g = GUIDES.find((x) => x.id === gid);
    const s = stats(gid);
    const dlg = document.getElementById('celebration');
    const title = document.getElementById('celebration-title');
    const text = document.getElementById('celebration-text');
    const next = document.getElementById('celebration-next');
    const o = overall();

    if (g.challenge) {
      title.textContent = 'Desafio concluído!';
      text.textContent = 'Você construiu uma aplicação web completa, do banco de dados à interface. Coloque o projeto no seu portfólio e mostre para o mundo.';
      next.textContent = 'Voltar para a trilha';
      next.href = '#/';
    } else if (o.guidesDone === CORE.length && !state.flags.challengeInvited) {
      state.flags.challengeInvited = Date.now();
      saveState();
      title.textContent = 'Os cinco guias estão concluídos!';
      text.textContent = 'Agora vem o desafio final: construir um sistema de locação de instrumentos musicais com Angular, uma Web API em .NET e SQL Server.';
      next.textContent = 'Aceitar o desafio';
      next.href = '#/guia/desafio';
    } else {
      const following = GUIDES.slice(GUIDES.indexOf(g) + 1).find((x) => !stats(x.id).complete);
      title.textContent = `${g.short}: guia concluído!`;
      text.textContent = following
        ? `Você estudou os ${s.total} tópicos deste guia. A próxima parada é ${following.short}.`
        : `Você estudou os ${s.total} tópicos deste guia.`;
      next.textContent = following ? `Ir para ${following.short}` : 'Voltar para a trilha';
      next.href = following ? `#/guia/${following.id}` : '#/';
    }

    dlg.dataset.line = g.line;
    if (typeof dlg.showModal === 'function') dlg.showModal();
    else toast(title.textContent);
    confetti();
  }

  function confetti() {
    if (reducedMotion.matches) return;
    const css = getComputedStyle(document.documentElement);
    const colors = ['--line-csharp', '--line-js', '--line-html', '--line-sql', '--line-desafio']
      .map((v) => css.getPropertyValue(v).trim());
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 80; i++) {
      const p = document.createElement('span');
      p.className = 'confetti';
      p.style.left = `${Math.random() * 100}vw`;
      p.style.background = colors[i % colors.length];
      p.style.setProperty('--x', `${(Math.random() - 0.5) * 240}px`);
      p.style.setProperty('--r', `${360 + Math.random() * 720}deg`);
      p.style.setProperty('--d', `${1.8 + Math.random() * 1.6}s`);
      p.style.animationDelay = `${Math.random() * 0.5}s`;
      p.style.width = `${6 + Math.random() * 6}px`;
      frag.appendChild(p);
    }
    document.body.appendChild(frag);
    setTimeout(() => document.querySelectorAll('.confetti').forEach((p) => p.remove()), 4500);
  }

  // ---------- Tema ----------
  function currentTheme() {
    const set = document.documentElement.dataset.theme;
    if (set) return set;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function updateThemeLabel() {
    const btn = document.getElementById('theme-toggle');
    btn.setAttribute('aria-label', currentTheme() === 'dark' ? 'Usar tema claro' : 'Usar tema escuro');
  }

  function toggleTheme() {
    const nextTheme = currentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = nextTheme;
    try { localStorage.setItem(THEME_KEY, nextTheme); } catch { /* sem armazenamento: vale só nesta visita */ }
    updateThemeLabel();
  }

  // ---------- Rotas ----------
  function route() {
    const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
    if (parts[0] === 'guia' && parts[1]) {
      if (current.type === 'guide' && current.id === parts[1]) {
        setDrawer(false);
        if (parts[2]) scrollToAnchor(parts[2]);
        else window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
        return;
      }
      renderGuide(parts[1], parts[2]);
    } else if (!parts.length) {
      renderHome();
    } else {
      renderNotFound();
    }
  }

  // ---------- Eventos ----------
  document.addEventListener('click', (e) => {
    const topicEl = e.target.closest('[data-topic]');
    if (topicEl) {
      toggleTopic(topicEl.dataset.topic);
      topicEl.classList.remove('pulse');
      void topicEl.offsetWidth;
      topicEl.classList.add('pulse');
      return;
    }

    const goto = e.target.closest('[data-goto]');
    if (goto) {
      location.hash = `#/guia/${current.id}/${goto.dataset.goto}`;
      return;
    }

    const copy = e.target.closest('.code__copy');
    if (copy) {
      const text = copy.closest('.code').querySelector('pre').innerText;
      navigator.clipboard?.writeText(text).then(
        () => { copy.textContent = 'Copiado'; setTimeout(() => { copy.textContent = 'Copiar'; }, 1600); },
        () => toast('Não foi possível copiar. Selecione o texto e use Ctrl+C.'),
      );
      return;
    }

    const action = e.target.closest('[data-action]')?.dataset.action;
    if (action === 'open-drawer') setDrawer(true);
    else if (action === 'close-drawer') setDrawer(false);
    else if (action === 'resume') resume();
    else if (action === 'reset') {
      if (window.confirm('Apagar todo o progresso salvo neste navegador? Essa ação não pode ser desfeita.')) {
        state = emptyState();
        saveState();
        renderHome();
        toast('Progresso apagado.');
      }
    }
  });

  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateThemeLabel);

  const dlg = document.getElementById('celebration');
  document.getElementById('celebration-close').addEventListener('click', () => dlg.close());
  document.getElementById('celebration-next').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setDrawer(false);
  });

  // Progresso alterado em outra aba
  window.addEventListener('storage', (e) => {
    if (e.key !== STORE_KEY) return;
    state = readState();
    if (current.type === 'home') renderHome();
    else refreshUI();
  });

  // ---------- Inicialização ----------
  async function init() {
    updateThemeLabel();
    try {
      if (typeof marked === 'undefined') throw new Error('A biblioteca de Markdown não carregou (sem acesso à CDN?).');
      if (typeof hljs !== 'undefined') hljs.configure({ ignoreUnescapedHTML: true });
      const loaded = await Promise.all(GUIDES.map(async (g) => {
        const res = await fetch(g.file, { cache: 'no-cache' });
        if (!res.ok) throw new Error(`${g.file}: HTTP ${res.status}`);
        return processGuide(g, await res.text());
      }));
      loaded.forEach((d) => DATA.set(d.guide.id, d));
    } catch (err) {
      renderError(err);
      return;
    }
    reconcile();
    renderTopnav();
    window.addEventListener('hashchange', route);
    route();
  }

  init();
})();
