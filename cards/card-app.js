(function () {
  const CARD_META = {
    india: { title: 'India Markets', icon: '🇮🇳', tab: 'india', kicker: 'NSE / BSE • INDIA MARKETS' },
    us: { title: 'U.S. Markets', icon: '🇺🇸', tab: 'us', kicker: 'NYSE / NASDAQ • U.S. MARKETS' },
    crypto: { title: 'Crypto Markets', icon: '₿', tab: 'crypto', kicker: '24/7 GLOBAL SPOT (USD) • CRYPTO MARKETS' },
    commodities: { title: 'Commodities', icon: '🛢️', tab: 'commodities', kicker: 'GLOBAL FUTURES & SPOT • COMMODITIES' },
    astro: { title: 'Astro Daily', icon: '♉', tab: 'astro', kicker: 'ASTRO DAILY • VEDIC & WESTERN' },
    news: { title: 'World News', icon: '🌐', tab: 'intel', kicker: 'WORLD NEWS • GLOBAL, U.S., INDIA & STEM' }
  };

  const FALLBACK_FX = {
    INR: { prefix: '₹', value: 92.96, decimals: 2 },
    EUR: { prefix: '€', value: 0.947, decimals: 3 },
    GBP: { prefix: '£', value: 0.791, decimals: 3 },
    JPY: { prefix: '¥', value: 152.39, decimals: 2 },
    AED: { prefix: 'AED ', value: 3.672, decimals: 3 },
    CHF: { prefix: 'Fr ', value: 0.884, decimals: 3 },
    CAD: { prefix: 'C$', value: 1.398, decimals: 3 },
    AUD: { prefix: 'A$', value: 1.536, decimals: 3 }
  };

  const FALLBACK_MARKETS = {
    india: {
      NIFTYBEES: { name: 'Nippon India ETF Nifty 50 BeES', symbol: 'NSE:NIFTYBEES', price: 292.00, change: -3.33, changePct: -1.13, dayLow: 291.75, dayHigh: 295.44, w52Low: 251.70, w52High: 302.25, sub: 'Nifty 50 ETF • Vol & Regime' },
      SENSEXIETF: { name: 'ICICI Prudential BSE Sensex ETF', symbol: 'BSE:SENSEXIETF', price: 955.99, change: -11.41, changePct: -1.18, dayLow: 954.10, dayHigh: 967.20, w52Low: 828.00, w52High: 992.40, sub: '30-Stock Mega-Cap Benchmark' },
      BANKBEES: { name: 'Nippon India ETF Bank BeES', symbol: 'NSE:BANKBEES', price: 538.40, change: -5.80, changePct: -1.07, dayLow: 536.90, dayHigh: 544.50, w52Low: 468.20, w52High: 559.00, sub: 'Banking Sector ETF' },
      GOLDBEES: { name: 'Nippon India ETF Gold BeES', symbol: 'NSE:GOLDBEES', price: 102.85, change: 1.18, changePct: 1.16, dayLow: 101.90, dayHigh: 103.20, w52Low: 72.40, w52High: 104.50, sub: 'Domestic Gold Bullion Tracker' },
      RELIANCE: { name: 'Reliance Industries Ltd', symbol: 'NSE:RELIANCE', price: 1348.60, change: 12.40, changePct: 0.93, dayLow: 1334.00, dayHigh: 1355.80, w52Low: 1195.00, w52High: 1540.00, sub: 'Energy / Telecom / Retail' },
      HDFCBANK: { name: 'HDFC Bank Ltd', symbol: 'NSE:HDFCBANK', price: 1784.20, change: 9.15, changePct: 0.52, dayLow: 1769.50, dayHigh: 1794.00, w52Low: 1480.00, w52High: 1835.00, sub: 'Private Banking' },
      TCS: { name: 'Tata Consultancy Services Ltd', symbol: 'NSE:TCS', price: 4218.50, change: -54.30, changePct: -1.27, dayLow: 4202.00, dayHigh: 4279.00, w52Low: 3690.00, w52High: 4592.00, sub: 'IT Services' },
      INFY: { name: 'Infosys Ltd', symbol: 'NSE:INFY', price: 1912.40, change: -21.60, changePct: -1.12, dayLow: 1901.00, dayHigh: 1940.00, w52Low: 1540.00, w52High: 2010.00, sub: 'IT Services' },
      ICICIBANK: { name: 'ICICI Bank Ltd', symbol: 'NSE:ICICIBANK', price: 1296.50, change: -8.40, changePct: -0.64, dayLow: 1288.00, dayHigh: 1311.00, w52Low: 1045.00, w52High: 1362.00, sub: 'Private Banking' },
      SBIN: { name: 'State Bank of India', symbol: 'NSE:SBIN', price: 836.20, change: -7.10, changePct: -0.84, dayLow: 830.50, dayHigh: 846.80, w52Low: 680.00, w52High: 912.00, sub: 'PSU Banking' },
      ITC: { name: 'ITC Ltd', symbol: 'NSE:ITC', price: 478.90, change: 2.35, changePct: 0.49, dayLow: 475.10, dayHigh: 482.00, w52Low: 399.00, w52High: 528.50, sub: 'FMCG & Consumer' }
    },
    us: {
      SPY: { name: 'SPDR S&P 500 ETF Trust', symbol: 'NYSE:SPY', price: 598.40, change: 4.12, changePct: 0.69, dayLow: 593.10, dayHigh: 599.80, w52Low: 470.00, w52High: 605.00, sub: 'S&P 500 Benchmark' },
      QQQ: { name: 'Invesco QQQ Trust', symbol: 'NASDAQ:QQQ', price: 509.20, change: 5.40, changePct: 1.07, dayLow: 502.50, dayHigh: 511.10, w52Low: 395.00, w52High: 520.00, sub: 'Nasdaq 100 Tech' },
      DIA: { name: 'SPDR Dow Jones Industrial ETF', symbol: 'NYSE:DIA', price: 446.10, change: 1.85, changePct: 0.42, dayLow: 443.20, dayHigh: 447.50, w52Low: 368.00, w52High: 451.00, sub: 'Dow 30 Blue Chips' },
      IWM: { name: 'iShares Russell 2000 ETF', symbol: 'NYSE:IWM', price: 238.90, change: -1.10, changePct: -0.46, dayLow: 236.40, dayHigh: 241.00, w52Low: 189.00, w52High: 245.00, sub: 'U.S. Small Caps' },
      NVDA: { name: 'NVIDIA Corporation', symbol: 'NASDAQ:NVDA', price: 141.25, change: 3.45, changePct: 2.50, dayLow: 137.10, dayHigh: 142.80, w52Low: 66.00, w52High: 152.00, sub: 'AI & Semiconductors' },
      AAPL: { name: 'Apple Inc.', symbol: 'NASDAQ:AAPL', price: 234.80, change: 1.90, changePct: 0.82, dayLow: 232.10, dayHigh: 235.60, w52Low: 164.00, w52High: 238.00, sub: 'Consumer Tech' },
      MSFT: { name: 'Microsoft Corporation', symbol: 'NASDAQ:MSFT', price: 424.50, change: 2.80, changePct: 0.66, dayLow: 420.10, dayHigh: 426.00, w52Low: 366.00, w52High: 468.00, sub: 'Cloud & Enterprise AI' },
      GOOGL: { name: 'Alphabet Inc.', symbol: 'NASDAQ:GOOGL', price: 171.40, change: 1.15, changePct: 0.68, dayLow: 169.50, dayHigh: 172.30, w52Low: 131.00, w52High: 191.00, sub: 'Search & Cloud' },
      AMZN: { name: 'Amazon.com Inc.', symbol: 'NASDAQ:AMZN', price: 207.60, change: 2.40, changePct: 1.17, dayLow: 204.30, dayHigh: 208.90, w52Low: 144.00, w52High: 215.00, sub: 'Cloud & E-Commerce' },
      META: { name: 'Meta Platforms Inc.', symbol: 'NASDAQ:META', price: 574.30, change: 6.10, changePct: 1.07, dayLow: 566.00, dayHigh: 577.20, w52Low: 350.00, w52High: 602.00, sub: 'Social & AI Ads' },
      TSLA: { name: 'Tesla Inc.', symbol: 'NASDAQ:TSLA', price: 338.90, change: -4.20, changePct: -1.22, dayLow: 334.00, dayHigh: 345.00, w52Low: 138.00, w52High: 361.00, sub: 'EV & Autonomy' }
    },
    crypto: {
      BTC: { name: 'Bitcoin (BTC / USD)', symbol: 'BTC / USD', price: 61484, changePct: 1.63, decimals: 0, sub: 'Global Spot (USD)' },
      ETH: { name: 'Ethereum (ETH / USD)', symbol: 'ETH / USD', price: 1728, changePct: 2.34, decimals: 0, sub: 'Global Spot (USD)' },
      SOL: { name: 'Solana (SOL / USD)', symbol: 'SOL / USD', price: 138.40, changePct: 3.12, decimals: 2, sub: 'Global Spot (USD)' },
      BNB: { name: 'BNB (BNB / USD)', symbol: 'BNB / USD', price: 548.20, changePct: 1.15, decimals: 2, sub: 'Global Spot (USD)' },
      XRP: { name: 'XRP (XRP / USD)', symbol: 'XRP / USD', price: 1.42, changePct: 2.88, decimals: 3, sub: 'Global Spot (USD)' },
      DOGE: { name: 'Dogecoin (DOGE / USD)', symbol: 'DOGE / USD', price: 0.194, changePct: 3.74, decimals: 4, sub: 'Global Spot (USD)' },
      ADA: { name: 'Cardano (ADA / USD)', symbol: 'ADA / USD', price: 0.584, changePct: 1.92, decimals: 4, sub: 'Global Spot (USD)' },
      LINK: { name: 'Chainlink (LINK / USD)', symbol: 'LINK / USD', price: 14.85, changePct: 2.45, decimals: 2, sub: 'Global Spot (USD)' }
    },
    commodities: {
      GOLD: { name: 'Gold Spot (XAU / USD)', symbol: 'XAU / USD', price: 3842.50, change: 44.20, changePct: 1.16, decimals: 2, dayLow: 3795, dayHigh: 3856, w52Low: 2540, w52High: 3910, sub: 'USD / Troy Oz' },
      BRENT: { name: 'Brent Crude Oil (BZ=F)', symbol: 'ICE:BRENT', price: 96.45, change: 2.85, changePct: 3.04, decimals: 2, dayLow: 93.40, dayHigh: 97.10, w52Low: 68.50, w52High: 98.80, sub: 'USD / Barrel' },
      WTI: { name: 'WTI Crude Oil (CL=F)', symbol: 'NYMEX:WTI', price: 92.80, change: 2.60, changePct: 2.88, decimals: 2, dayLow: 89.90, dayHigh: 93.50, w52Low: 65.20, w52High: 95.10, sub: 'USD / Barrel' },
      SILVER: { name: 'Silver Spot (XAG / USD)', symbol: 'XAG / USD', price: 44.85, change: 0.72, changePct: 1.63, decimals: 2, dayLow: 43.90, dayHigh: 45.20, w52Low: 28.40, w52High: 46.10, sub: 'USD / Troy Oz' },
      NATGAS: { name: 'Natural Gas (NG=F)', symbol: 'NYMEX:NG', price: 3.68, change: -0.09, changePct: -2.39, decimals: 3, dayLow: 3.61, dayHigh: 3.82, w52Low: 2.05, w52High: 4.45, sub: 'USD / MMBtu' },
      COPPER: { name: 'High Grade Copper (HG=F)', symbol: 'COMEX:HG', price: 4.32, change: 0.03, changePct: 0.70, decimals: 2, dayLow: 4.26, dayHigh: 4.37, w52Low: 3.74, w52High: 5.12, sub: 'USD / Pound' }
    }
  };

  const ASTRO_SIGNS = [
    { key: 'ARIES', glyph: '♈', label: 'Aries (Mesha)' },
    { key: 'TAURUS', glyph: '♉', label: 'Taurus (Vrishabha)' },
    { key: 'GEMINI', glyph: '♊', label: 'Gemini (Mithuna)' },
    { key: 'CANCER', glyph: '♋', label: 'Cancer (Karka)' },
    { key: 'LEO', glyph: '♌', label: 'Leo (Simha)' },
    { key: 'VIRGO', glyph: '♍', label: 'Virgo (Kanya)' },
    { key: 'LIBRA', glyph: '♎', label: 'Libra (Tula)' },
    { key: 'SCORPIO', glyph: '♏', label: 'Scorpio (Vrishchika)' },
    { key: 'SAGITTARIUS', glyph: '♐', label: 'Sagittarius (Dhanu)' },
    { key: 'CAPRICORN', glyph: '♑', label: 'Capricorn (Makara)' },
    { key: 'AQUARIUS', glyph: '♒', label: 'Aquarius (Kumbha)' },
    { key: 'PISCES', glyph: '♓', label: 'Pisces (Meena)' }
  ];

  const FALLBACK_NEWS = [
    { cat: 'WORLD', tag: 'GEOPOLITICS', title: 'Global Energy Corridors & Sovereign Risk Brief', summary: 'Markets track Brent crude volatility and central bank liquidity signals across major hubs.', time: 'Today' },
    { cat: 'US', tag: 'MACRO / FED', title: 'U.S. Yields & Volatility Regime Watch', summary: 'Traders monitor PCE inflation prints, tariff proposals, and mega-cap earnings momentum.', time: 'Today' },
    { cat: 'INDIA', tag: 'MARKETS / RBI', title: 'Domestic Institutional Flows Support Nifty Pivot', summary: 'Banking and energy heavyweights anchor index structure amid global tariff headlines.', time: 'Today' },
    { cat: 'STEM', tag: 'SCIENCE / TECH', title: 'Quantum, Space & AI Infrastructure Milestones', summary: 'Research labs and open-source teams advance next-gen compute and planetary science.', time: 'Today' }
  ];

  let activeFx = 'INR';
  let isLight = false;
  let chartInstance = null;
  let activeTf = '1M';

  function fmtPrice(val, currency, dec = 2) {
    if (currency === 'INR') {
      return `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: dec, maximumFractionDigits: dec })}`;
    }
    return `$${Number(val).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec })}`;
  }

  function regimeInfo(pct) {
    if (pct > 0.35) return { label: '▲ GAIN', cls: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/35' };
    if (pct < -0.35) return { label: '▼ LOSS', cls: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/35' };
    return { label: '◆ MIDDLE', cls: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/35' };
  }

  function generateFallbackCandles(basePrice, symbol, tf) {
    const counts = { '1W': 7, '1M': 22, '3M': 65, '1Y': 90 };
    const count = counts[tf] || 22;
    let seed = 0;
    for (let i = 0; i < symbol.length; i += 1) seed += symbol.charCodeAt(i) * (i + 1);
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    const vol = 0.015;
    let p = basePrice * 0.96;
    const out = [];
    const now = new Date();
    for (let i = count - 1; i >= 0; i -= 1) {
      const d = new Date(now.getTime() - i * 86400000);
      const time = d.toISOString().slice(0, 10);
      const open = p;
      const close = i === 0 ? basePrice : Math.max(basePrice * 0.5, open + (rand() - 0.48) * basePrice * vol);
      const high = Math.max(open, close) + rand() * basePrice * vol * 0.5;
      const low = Math.min(open, close) - rand() * basePrice * vol * 0.5;
      p = close;
      out.push({ time, open: +open.toFixed(2), high: +high.toFixed(2), low: +low.toFixed(2), close: +close.toFixed(2) });
    }
    return out;
  }

  function renderChart(containerId, ohlcId, symbol, basePrice, realCandles) {
    const container = document.getElementById(containerId);
    const ohlcEl = document.getElementById(ohlcId);
    if (!container) return;
    if (chartInstance) {
      try { chartInstance.remove(); } catch {}
      chartInstance = null;
    }
    container.innerHTML = '';

    const sliceMap = { '1W': 7, '1M': 22, '3M': 65, '1Y': 90 };
    const candles = Array.isArray(realCandles) && realCandles.length
      ? realCandles.slice(-(sliceMap[activeTf] || 22))
      : generateFallbackCandles(basePrice, symbol, activeTf);

    const bg = isLight ? '#f0e9db' : '#0c121e';
    const txt = isLight ? '#3d3832' : '#94a3b8';
    const grid = isLight ? 'rgba(61, 56, 50, 0.08)' : 'rgba(148, 163, 184, 0.08)';

    if (window.LightweightCharts && typeof window.LightweightCharts.createChart === 'function') {
      const chart = window.LightweightCharts.createChart(container, {
        width: container.clientWidth || 680,
        height: container.clientHeight || 340,
        layout: { background: { type: 'solid', color: bg }, textColor: txt, fontFamily: 'JetBrains Mono, monospace' },
        grid: { vertLines: { color: grid }, horzLines: { color: grid } },
        rightPriceScale: { borderColor: grid },
        timeScale: { borderColor: grid, timeVisible: false },
        crosshair: { mode: 1 }
      });
      const series = chart.addCandlestickSeries({
        upColor: '#10b981', downColor: '#f43f5e', borderVisible: false, wickUpColor: '#10b981', wickDownColor: '#f43f5e'
      });
      series.setData(candles);
      chart.timeScale().fitContent();
      chart.subscribeCrosshairMove((param) => {
        if (!ohlcEl || !param?.seriesData) return;
        const pt = param.seriesData.get(series);
        if (pt) ohlcEl.textContent = `O ${pt.open}  H ${pt.high}  L ${pt.low}  C ${pt.close}`;
      });
      chartInstance = chart;
    }
  }

  function renderHeader(cardKey) {
    const meta = CARD_META[cardKey] || CARD_META.india;
    document.title = `${meta.title} — Markets Daily Brief`;
    const titleEl = document.getElementById('card-header-title');
    const iconEl = document.getElementById('card-header-icon');
    const hubLink = document.getElementById('card-hub-link');
    if (titleEl) titleEl.textContent = meta.title;
    if (iconEl) iconEl.textContent = meta.icon;
    if (hubLink) hubLink.href = `../index.html?tab=${meta.tab}`;

    const clockEl = document.getElementById('live-clock');
    const updateClock = () => {
      if (!clockEl) return;
      try {
        const fmt = new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Asia/Kolkata', weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
          hour: '2-digit', minute: '2-digit', hour12: false
        });
        clockEl.textContent = `${fmt.format(new Date()).toUpperCase().replace(',', '')} IST`;
      } catch {}
    };
    updateClock();
    setInterval(updateClock, 30000);
  }

  function setupFxAndTheme(onThemeChange) {
    const fxSel = document.getElementById('fx-target-select');
    const fxVal = document.getElementById('fx-rate-value');
    const renderFx = () => {
      const fx = FALLBACK_FX[activeFx];
      if (fxVal && fx) fxVal.textContent = `${fx.prefix}${fx.value.toFixed(fx.decimals)}`;
    };
    if (fxSel) {
      fxSel.addEventListener('change', (e) => { activeFx = e.target.value; renderFx(); });
    }
    renderFx();

    const applyTheme = (light) => {
      isLight = light;
      document.documentElement.classList.toggle('dark', !light);
      document.documentElement.classList.toggle('light-beige', light);
      document.querySelectorAll('.theme-label').forEach((el) => { el.textContent = light ? 'Dark Mode' : 'Light Mode'; });
      document.querySelectorAll('.theme-icon').forEach((el) => { el.textContent = light ? '☾' : '☀'; });
      if (onThemeChange) onThemeChange();
    };
    document.querySelectorAll('.theme-toggle-btn').forEach((btn) => {
      btn.addEventListener('click', () => applyTheme(!isLight));
    });
    return { renderFx };
  }

  window.initStandaloneCard = async function (cardKey) {
    renderHeader(cardKey);
    const params = new URLSearchParams(window.location.search);
    let brief = null;

    const fxTheme = setupFxAndTheme(() => renderCurrent());

    try {
      const res = await fetch('../data/live-brief.json', { cache: 'no-store' });
      if (res.ok) brief = await res.json();
    } catch {}

    if (brief?.forex?.rates) {
      Object.keys(FALLBACK_FX).forEach((c) => {
        if (typeof brief.forex.rates[c] === 'number') FALLBACK_FX[c].value = brief.forex.rates[c];
      });
      fxTheme.renderFx();
    }

    const root = document.getElementById('card-root');
    if (!root) return;

    let currentTicker = (params.get('ticker') || '').toUpperCase();
    let currentSign = (params.get('sign') || 'TAURUS').toUpperCase();
    let currentSys = (params.get('sys') || 'VEDIC').toUpperCase();
    let currentDay = 'TODAY';
    let currentNewsCat = 'ALL';

    function renderCurrent() {
      if (['india', 'us', 'crypto', 'commodities'].includes(cardKey)) {
        const assets = JSON.parse(JSON.stringify(FALLBACK_MARKETS[cardKey]));
        if (cardKey === 'crypto' && brief?.crypto?.assets) {
          Object.keys(assets).forEach((k) => {
            const q = brief.crypto.assets[k];
            if (q?.price) {
              assets[k].price = q.price;
              assets[k].changePct = q.changePct ?? assets[k].changePct;
              assets[k].candles = q.candles;
            }
          });
        } else if (brief?.[cardKey]) {
          Object.keys(assets).forEach((k) => {
            const q = brief[cardKey][k];
            if (q?.price) {
              assets[k].price = q.price;
              assets[k].change = q.change ?? 0;
              assets[k].changePct = q.changePct ?? 0;
              assets[k].dayLow = q.dayLow;
              assets[k].dayHigh = q.dayHigh;
              assets[k].w52Low = q.w52Low;
              assets[k].w52High = q.w52High;
              assets[k].candles = q.candles;
            }
          });
        }

        const keys = Object.keys(assets);
        if (!assets[currentTicker]) currentTicker = keys[0];
        const d = assets[currentTicker];
        const cur = cardKey === 'india' ? 'INR' : 'USD';
        const dec = d.decimals ?? 2;
        const pct = d.changePct ?? 0;
        const isPos = pct >= 0;
        const reg = regimeInfo(pct);
        const changeText = cardKey === 'crypto'
          ? `${isPos ? '+' : ''}${pct.toFixed(2)}%`
          : `${isPos ? '+' : '-'}${cur === 'INR' ? '₹' : '$'}${Math.abs(d.change || 0).toFixed(dec)} (${isPos ? '+' : ''}${pct.toFixed(2)}%)`;

        const bear = fmtPrice(d.price * 0.975, cur, dec);
        const base = fmtPrice(d.price * 1.003, cur, dec);
        const bull = fmtPrice(d.price * 1.025, cur, dec);

        root.innerHTML = `
          <div class="space-y-6">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b divider-line pb-4">
              <div>
                <span class="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">${CARD_META[cardKey].kicker}</span>
                <h2 class="text-lg sm:text-xl font-bold txt-primary mt-0.5">${d.name}</h2>
              </div>
              <div class="flex flex-wrap gap-1.5">
                ${keys.map((k) => `<button type="button" data-tk="${k}" class="ticker-chip ${k === currentTicker ? 'active' : ''} px-3 py-1.5 rounded-lg text-xs font-mono cursor-pointer">${k}</button>`).join('')}
              </div>
            </div>

            <div class="flex flex-wrap items-baseline gap-3">
              <span class="text-3xl sm:text-4xl font-bold font-mono tracking-tight txt-primary tabular-nums">${fmtPrice(d.price, cur, dec)}</span>
              <span class="px-2.5 py-1 rounded-lg text-sm font-mono font-bold tabular-nums border ${isPos ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30' : 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30'}">${changeText}</span>
              <span class="px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase border ${reg.cls}">${reg.label}</span>
            </div>

            <div class="grid grid-cols-3 gap-2 sm:gap-3 font-mono tabular-nums">
              <div class="p-3 sm:p-4 rounded-2xl bg-rose-500/15 border border-rose-500/35 flex items-center justify-between gap-2">
                <div><div class="text-xs text-rose-700 dark:text-rose-400 font-bold uppercase">▼ Loss</div></div>
                <div class="text-base sm:text-xl font-bold text-rose-800 dark:text-rose-300">${bear}</div>
              </div>
              <div class="p-3 sm:p-4 rounded-2xl bg-amber-500/15 border border-amber-500/35 flex items-center justify-between gap-2">
                <div><div class="text-xs text-amber-700 dark:text-amber-400 font-bold uppercase">◆ Middle</div></div>
                <div class="text-base sm:text-xl font-bold text-amber-800 dark:text-amber-300">${base}</div>
              </div>
              <div class="p-3 sm:p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/35 flex items-center justify-between gap-2">
                <div><div class="text-xs text-emerald-700 dark:text-emerald-400 font-bold uppercase">▲ Gain</div></div>
                <div class="text-base sm:text-xl font-bold text-emerald-800 dark:text-emerald-300">${bull}</div>
              </div>
            </div>

            <div class="rounded-2xl inner-panel overflow-hidden">
              <div class="px-4 py-2.5 border-b divider-line flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <div class="flex items-center gap-2">
                  <span class="font-bold txt-primary">${d.symbol}</span>
                  <span id="card-chart-ohlc" class="txt-muted hidden sm:inline">90-Day Daily OHLC</span>
                </div>
                <div class="flex items-center gap-1">
                  ${['1W', '1M', '3M', '1Y'].map((tf) => `<button type="button" data-tf="${tf}" class="seg-btn ${tf === activeTf ? 'active' : ''} px-2.5 py-1 rounded-md cursor-pointer">${tf}</button>`).join('')}
                </div>
              </div>
              <div id="card-chart-container" class="w-full h-[340px]"></div>
            </div>
          </div>
        `;

        root.querySelectorAll('[data-tk]').forEach((b) => {
          b.addEventListener('click', () => { currentTicker = b.getAttribute('data-tk'); renderCurrent(); });
        });
        root.querySelectorAll('[data-tf]').forEach((b) => {
          b.addEventListener('click', () => { activeTf = b.getAttribute('data-tf'); renderCurrent(); });
        });
        renderChart('card-chart-container', 'card-chart-ohlc', d.symbol, d.price, d.candles);
      } else if (cardKey === 'astro') {
        const signObj = ASTRO_SIGNS.find((s) => s.key === currentSign) || ASTRO_SIGNS[1];
        root.innerHTML = `
          <div class="space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b divider-line pb-4">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-2xl inner-panel flex items-center justify-center text-2xl">${signObj.glyph}</div>
                <div>
                  <span class="text-xs font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-semibold">${currentSys} • ${currentDay}</span>
                  <h2 class="text-lg sm:text-xl font-bold txt-primary">${signObj.label}</h2>
                </div>
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <select id="standalone-astro-sign" class="px-3 py-2 rounded-xl text-xs font-mono inner-panel txt-primary">
                  ${ASTRO_SIGNS.map((s) => `<option value="${s.key}" ${s.key === currentSign ? 'selected' : ''} class="text-slate-900">${s.glyph} ${s.label}</option>`).join('')}
                </select>
                <div class="inline-flex rounded-xl pill-track p-1 text-xs font-mono">
                  <button type="button" data-sys="VEDIC" class="seg-btn ${currentSys === 'VEDIC' ? 'active' : ''} px-3 py-1 rounded-lg cursor-pointer">Vedic</button>
                  <button type="button" data-sys="WESTERN" class="seg-btn ${currentSys === 'WESTERN' ? 'active' : ''} px-3 py-1 rounded-lg cursor-pointer">Western</button>
                </div>
                <div class="inline-flex rounded-xl pill-track p-1 text-xs font-mono">
                  <button type="button" data-day="TODAY" class="seg-btn ${currentDay === 'TODAY' ? 'active' : ''} px-3 py-1 rounded-lg cursor-pointer">Today</button>
                  <button type="button" data-day="TOMORROW" class="seg-btn ${currentDay === 'TOMORROW' ? 'active' : ''} px-3 py-1 rounded-lg cursor-pointer">Tomorrow</button>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-5 rounded-2xl inner-panel space-y-2"><h3 class="font-bold txt-primary">Career &amp; Capital</h3><p class="text-sm txt-secondary">Prioritize disciplined execution and structured risk limits over impulsive moves.</p></div>
              <div class="p-5 rounded-2xl inner-panel space-y-2"><h3 class="font-bold txt-primary">Health &amp; Focus</h3><p class="text-sm txt-secondary">Ground your schedule with steady hydration, deep-work blocks, and evening recovery.</p></div>
            </div>
          </div>
        `;
        document.getElementById('standalone-astro-sign')?.addEventListener('change', (e) => { currentSign = e.target.value; renderCurrent(); });
        root.querySelectorAll('[data-sys]').forEach((b) => b.addEventListener('click', () => { currentSys = b.getAttribute('data-sys'); renderCurrent(); }));
        root.querySelectorAll('[data-day]').forEach((b) => b.addEventListener('click', () => { currentDay = b.getAttribute('data-day'); renderCurrent(); }));
      } else if (cardKey === 'news') {
        const allNews = Array.isArray(brief?.news) && brief.news.length ? brief.news : FALLBACK_NEWS;
        const items = currentNewsCat === 'ALL' ? allNews : allNews.filter((n) => n.cat === currentNewsCat);
        root.innerHTML = `
          <div class="space-y-6">
            <div class="flex flex-wrap items-center justify-between gap-3 border-b divider-line pb-4">
              <div>
                <span class="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">${CARD_META.news.kicker}</span>
                <h2 class="text-lg sm:text-xl font-bold txt-primary mt-0.5">Global Headlines (${items.length})</h2>
              </div>
              <div class="inline-flex rounded-xl pill-track p-1 text-xs font-mono">
                ${['ALL', 'WORLD', 'US', 'INDIA', 'STEM'].map((c) => `<button type="button" data-nc="${c}" class="seg-btn ${c === currentNewsCat ? 'active' : ''} px-3 py-1 rounded-lg cursor-pointer">${c}</button>`).join('')}
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              ${items.map((n) => `
                <article class="p-5 rounded-2xl inner-panel space-y-2">
                  <div class="flex items-center justify-between text-[11px] font-mono">
                    <span class="px-2 py-0.5 rounded-md font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">${n.cat} &bull; ${n.tag}</span>
                    <span class="txt-muted">${n.time}</span>
                  </div>
                  <h3 class="text-base font-bold txt-primary leading-snug">${n.link ? `<a href="${n.link}" target="_blank" rel="noopener" class="hover:underline">${n.title}</a>` : n.title}</h3>
                  <p class="text-sm txt-secondary leading-relaxed">${n.summary}</p>
                </article>
              `).join('')}
            </div>
          </div>
        `;
        root.querySelectorAll('[data-nc]').forEach((b) => b.addEventListener('click', () => { currentNewsCat = b.getAttribute('data-nc'); renderCurrent(); }));
      }
    }

    renderCurrent();
    window.addEventListener('resize', () => {
      const el = document.getElementById('card-chart-container');
      if (chartInstance && el && el.clientWidth > 0) {
        try { chartInstance.applyOptions({ width: el.clientWidth }); } catch {}
      }
    });
  };
})();
