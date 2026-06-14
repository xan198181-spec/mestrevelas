// ===== Mestre das Velas - App Logic =====

const STORAGE_KEY = 'mestrevelas_progress';

let state = {
  screen: 'home',
  filtro: 'avancado', // todos | iniciante | intermediario | avancado | expert
  rodada: 0,
  fila: [],          // fila de padrões da rodada
  atual: null,       // padrão atual
  respondeu: false,
  resposta: null,    // 'alta' | 'baixa' | 'indecisao'
  acertos: 0,
  total: 0,
  streak: 0,
  xp: 0
};

const SIGNAL_LABELS = {
  alta: { label: 'Alta (Compra)', icon: '📈' },
  baixa: { label: 'Baixa (Venda)', icon: '📉' },
  indecisao: { label: 'Indecisão (Aguardar)', icon: '⏸️' }
};

const DIFF_META = {
  todos:        { label: 'Todos',        icon: '🎯', color: 'todos' },
  iniciante:    { label: 'Iniciante',    icon: '🟢', color: 'iniciante' },
  intermediario:{ label: 'Intermediário',icon: '🟡', color: 'intermediario' },
  avancado:     { label: 'Avançado',     icon: '🔴', color: 'avancado' },
  expert:       { label: 'Expert',       icon: '💀', color: 'expert' }
};

// ---------- Persistence ----------
function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      state.acertos = saved.acertos || 0;
      state.total = saved.total || 0;
      state.streak = saved.streak || 0;
      state.xp = saved.xp || 0;
    }
  } catch (e) {}
}
function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      acertos: state.acertos, total: state.total, streak: state.streak, xp: state.xp
    }));
  } catch (e) {}
}

// ---------- Game flow ----------
function filteredPatterns() {
  if (state.filtro === 'todos') return PATTERNS;
  return PATTERNS.filter(p => p.dificuldade === state.filtro);
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startGame() {
  const pool = filteredPatterns();
  if (pool.length === 0) return;
  state.fila = shuffle(pool);
  state.rodada = 1;
  state.respondeu = false;
  state.resposta = null;
  state.atual = state.fila.shift();
  state.screen = 'game';
  render();
}

function nextPattern() {
  if (state.fila.length === 0) {
    state.screen = 'end';
    render();
    return;
  }
  state.rodada++;
  state.atual = state.fila.shift();
  state.respondeu = false;
  state.resposta = null;
  render();
}

function answer(sig) {
  if (state.respondeu) return;
  state.respondeu = true;
  state.resposta = sig;
  state.total++;
  if (sig === state.atual.sinal) {
    state.acertos++;
    state.streak++;
    state.xp += state.atual.dificuldade === 'expert' ? 30 :
                state.atual.dificuldade === 'avancado' ? 20 :
                state.atual.dificuldade === 'intermediario' ? 12 : 8;
  } else {
    state.streak = 0;
  }
  saveProgress();
  render();
}

function goHome() {
  state.screen = 'home';
  render();
}

// ---------- Chart rendering ----------
function buildChartSVG(velas) {
  // compute global min/max across all candles' high/low
  let globalMax = -Infinity, globalMin = Infinity;
  velas.forEach(v => {
    globalMax = Math.max(globalMax, v.h);
    globalMin = Math.min(globalMin, v.l);
  });
  const pad = (globalMax - globalMin) * 0.12;
  const yMax = globalMax + pad;
  const yMin = globalMin - pad;
  const range = yMax - yMin;

  const W = 320;
  const H = 220;
  const n = velas.length;
  const slotW = W / n;
  const candleW = Math.min(56, slotW * 0.5);

  function yScale(val) {
    return H - ((val - yMin) / range) * H;
  }

  let svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;

  // grid lines (5 lines)
  const gridVals = [];
  for (let i = 0; i <= 4; i++) {
    gridVals.push(yMin + range * (i / 4));
  }
  gridVals.forEach(gv => {
    const y = yScale(gv);
    svg += `<line class="grid-line" x1="0" y1="${y}" x2="${W}" y2="${y}" />`;
  });

  velas.forEach((v, i) => {
    const cx = slotW * i + slotW / 2;
    const isGreen = v.c >= v.o;
    const color = isGreen ? 'var(--green)' : 'var(--red)';
    const bodyTop = yScale(Math.max(v.o, v.c));
    const bodyBottom = yScale(Math.min(v.o, v.c));
    const bodyHeight = Math.max(bodyBottom - bodyTop, 2);
    const wickTop = yScale(v.h);
    const wickBottom = yScale(v.l);

    // wick
    svg += `<line x1="${cx}" y1="${wickTop}" x2="${cx}" y2="${wickBottom}" stroke="${color}" stroke-width="2" />`;
    // body
    svg += `<rect x="${cx - candleW/2}" y="${bodyTop}" width="${candleW}" height="${bodyHeight}" fill="${color}" rx="2" />`;
  });

  svg += `</svg>`;
  return { svg, gridVals: gridVals.reverse() };
}

// ---------- Render functions ----------
function render() {
  const app = document.getElementById('app');
  if (state.screen === 'home') app.innerHTML = renderHome();
  else if (state.screen === 'game') app.innerHTML = renderGame();
  else if (state.screen === 'end') app.innerHTML = renderEnd();
  attachHandlers();
}

function renderHome() {
  const total = PATTERNS.length;
  const alta = PATTERNS.filter(p => p.sinal === 'alta').length;
  const baixa = PATTERNS.filter(p => p.sinal === 'baixa').length;

  let diffChips = '';
  Object.keys(DIFF_META).forEach(key => {
    const meta = DIFF_META[key];
    const active = state.filtro === key ? `active ${meta.color}` : '';
    diffChips += `<div class="chip ${active}" data-diff="${key}">${meta.icon} ${meta.label}</div>`;
  });

  return `
    <div class="topbar">
      <div></div>
      <div class="title">Mestre das Velas</div>
      <div style="width:36px"></div>
    </div>
    <div class="home">
      <div class="home-icon">📊</div>
      <h1>Mestre das <span>Velas</span></h1>
      <p class="sub">Domine os padrões de candlestick através da prática. Identifique sinais de compra, venda e indecisão.</p>
      <div class="stats-row">
        <div class="stat padroes"><div class="num">${total}</div><div class="lbl">Padrões</div></div>
        <div class="stat alta"><div class="num">${alta}</div><div class="lbl">De Alta</div></div>
        <div class="stat baixa"><div class="num">${baixa}</div><div class="lbl">De Baixa</div></div>
      </div>

      <div style="text-align:left; font-size:13px; color:var(--text-dim); margin-bottom:10px; font-weight:600;">DIFICULDADE</div>
      <div class="filters-row" style="padding:0 0 16px 0;">${diffChips}</div>

      <div class="score-bar">
        <div class="left">🎯 Acertos <b>${state.acertos}/${state.total}</b> (${state.total ? Math.round(state.acertos/state.total*100) : 0}%)</div>
        <div class="right">
          <span>🔥 ${state.streak}</span>
          <span>⚡ ${state.xp}</span>
        </div>
      </div>

      <button class="btn-primary" id="play-btn" style="margin-top:16px;">Jogar Agora →</button>
      <button class="btn-secondary" id="lib-btn">📖 Biblioteca</button>

      <div class="home-bars">
        ${Array.from({length:12}).map((_,i)=>{
          const h = 20 + Math.random()*60;
          const cls = i % 2 === 0 ? 'g' : 'r';
          return `<div class="bar ${cls}" style="height:${h}px"></div>`;
        }).join('')}
      </div>
    </div>
  `;
}

function renderGame() {
  const p = state.atual;
  const { svg, gridVals } = buildChartSVG(p.velas);

  let diffChips = '';
  Object.keys(DIFF_META).forEach(key => {
    const meta = DIFF_META[key];
    const active = state.filtro === key ? `active ${meta.color}` : '';
    diffChips += `<div class="chip ${active}" data-diff="${key}">${meta.icon} ${meta.label}</div>`;
  });

  let optionsHTML = '';
  ['alta', 'baixa', 'indecisao'].forEach(sig => {
    const meta = SIGNAL_LABELS[sig];
    let cls = '';
    if (state.respondeu) {
      if (sig === p.sinal) cls = 'correct';
      else if (sig === state.resposta) cls = 'wrong';
    }
    optionsHTML += `<button class="option-btn ${cls}" data-answer="${sig}" ${state.respondeu ? 'disabled' : ''}>
      <span class="ic">${meta.icon}</span> ${meta.label}
    </button>`;
  });

  let feedbackHTML = '';
  if (state.respondeu) {
    const correct = state.resposta === p.sinal;
    feedbackHTML = `
      <div class="feedback ${correct ? 'correto' : 'errado'}">
        <div class="feedback-head">${correct ? '✅ Correto!' : '❌ Errado!'}</div>
        <div class="feedback-sub"><b>${p.nome}</b> → ${SIGNAL_LABELS[p.sinal].icon} ${SIGNAL_LABELS[p.sinal].label}</div>
        <div class="info-box dica">
          <div class="lbl">💡 Dica</div>
          <p>${p.dica}</p>
        </div>
        <div class="info-box why">
          <div class="lbl">📖 Por que ${SIGNAL_LABELS[p.sinal].label}?</div>
          <p>${p.explicacao}</p>
        </div>
      </div>
      <button class="next-btn ${correct ? 'correto' : 'errado'}" id="next-btn">
        ${state.fila.length === 0 ? 'Ver Resultado 🏁' : 'Próximo Padrão →'}
      </button>
    `;
  }

  return `
    <div class="topbar">
      <button class="back" id="back-btn">←</button>
      <div class="rodada">Rodada <b>${state.rodada}</b></div>
      <button class="reset" id="reset-btn">↻</button>
    </div>

    ${!state.respondeu ? `<div class="filters-row">${diffChips}</div>
    <div class="score-bar">
      <div class="left">🎯 <b>${state.acertos}/${state.total}</b> ${state.total ? Math.round(state.acertos/state.total*100) : 0}%</div>
      <div class="right"><span>🔥 ${state.streak}</span><span>⚡ ${state.xp}</span></div>
    </div>` : ''}

    <div class="question-card">
      <h2>O que este padrão indica?</h2>
      <div class="chart-wrap">
        <div class="chart-axis">
          ${gridVals.map(v => `<span>${v.toFixed(1)}</span>`).join('')}
        </div>
        <div class="chart-svg-wrap">${svg}</div>
      </div>
    </div>

    <div class="options">${optionsHTML}</div>

    ${feedbackHTML}
  `;
}

function renderEnd() {
  const pct = state.total ? Math.round(state.acertos / state.total * 100) : 0;
  return `
    <div class="topbar">
      <button class="back" id="back-btn">←</button>
      <div class="title">Resultado</div>
      <div style="width:36px"></div>
    </div>
    <div class="end-screen">
      <div style="font-size:48px;">🏆</div>
      <div class="big-num">${pct}%</div>
      <div class="label">${state.acertos} de ${state.total} acertos totais — XP: ${state.xp}</div>
      <button class="btn-primary" id="restart-btn">Jogar Novamente →</button>
      <button class="btn-secondary" id="home-btn">🏠 Início</button>
    </div>
  `;
}

// ---------- Event handlers ----------
function attachHandlers() {
  document.querySelectorAll('[data-diff]').forEach(el => {
    el.addEventListener('click', () => {
      state.filtro = el.getAttribute('data-diff');
      render();
    });
  });

  const playBtn = document.getElementById('play-btn');
  if (playBtn) playBtn.addEventListener('click', startGame);

  const libBtn = document.getElementById('lib-btn');
  if (libBtn) libBtn.addEventListener('click', () => alert('Biblioteca em breve! Continue jogando para desbloquear todos os padrões.'));

  const backBtn = document.getElementById('back-btn');
  if (backBtn) backBtn.addEventListener('click', goHome);

  const resetBtn = document.getElementById('reset-btn');
  if (resetBtn) resetBtn.addEventListener('click', () => {
    if (confirm('Reiniciar esta rodada?')) startGame();
  });

  document.querySelectorAll('[data-answer]').forEach(el => {
    el.addEventListener('click', () => answer(el.getAttribute('data-answer')));
  });

  const nextBtn = document.getElementById('next-btn');
  if (nextBtn) nextBtn.addEventListener('click', nextPattern);

  const restartBtn = document.getElementById('restart-btn');
  if (restartBtn) restartBtn.addEventListener('click', startGame);

  const homeBtn = document.getElementById('home-btn');
  if (homeBtn) homeBtn.addEventListener('click', goHome);
}

// ---------- Init ----------
loadProgress();
render();

// ---------- PWA install prompt ----------
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallToast();
});

function showInstallToast() {
  if (document.getElementById('install-toast')) return;
  const toast = document.createElement('div');
  toast.id = 'install-toast';
  toast.className = 'install-toast';
  toast.innerHTML = `
    <span>📱 Instalar Mestre das Velas no seu Android?</span>
    <button id="install-btn">Instalar</button>
    <button class="close" id="close-toast">✕</button>
  `;
  document.body.appendChild(toast);
  document.getElementById('install-btn').addEventListener('click', async () => {
    toast.remove();
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
    }
  });
  document.getElementById('close-toast').addEventListener('click', () => toast.remove());
}

// ---------- Service Worker ----------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}
