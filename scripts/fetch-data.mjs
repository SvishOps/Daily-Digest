#!/usr/bin/env node
/**
 * Daily Live Data Engine for Markets Daily Brief
 * Zero paid API keys. Runs on Node.js 20+ (and Bun).
 * Fetches quotes, 90-day OHLC candles, Forex, Crypto F&G, and World News RSS,
 * and writes data/live-brief.json.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const OUT_FILE = path.join(ROOT_DIR, 'data', 'live-brief.json');

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

const INDIA_SYMBOLS = [
  { key: 'NIFTYBEES', symbol: 'NIFTYBEES.NS' },
  { key: 'SENSEXIETF', symbol: 'SENSEXIETF.BO' },
  { key: 'BANKBEES', symbol: 'BANKBEES.NS' },
  { key: 'GOLDBEES', symbol: 'GOLDBEES.NS' },
  { key: 'RELIANCE', symbol: 'RELIANCE.NS' },
  { key: 'HDFCBANK', symbol: 'HDFCBANK.NS' },
  { key: 'TCS', symbol: 'TCS.NS' },
  { key: 'INFY', symbol: 'INFY.NS' },
  { key: 'ICICIBANK', symbol: 'ICICIBANK.NS' },
  { key: 'SBIN', symbol: 'SBIN.NS' },
  { key: 'ITC', symbol: 'ITC.NS' },
  { key: 'NIFTY50', symbol: '^NSEI', isIndex: true },
  { key: 'SENSEX', symbol: '^BSESN', isIndex: true },
  { key: 'INDIAVIX', symbol: '^INDIAVIX', isIndex: true },
];

const US_SYMBOLS = [
  { key: 'SPY', symbol: 'SPY' },
  { key: 'QQQ', symbol: 'QQQ' },
  { key: 'DIA', symbol: 'DIA' },
  { key: 'IWM', symbol: 'IWM' },
  { key: 'NVDA', symbol: 'NVDA' },
  { key: 'AAPL', symbol: 'AAPL' },
  { key: 'MSFT', symbol: 'MSFT' },
  { key: 'GOOGL', symbol: 'GOOGL' },
  { key: 'AMZN', symbol: 'AMZN' },
  { key: 'META', symbol: 'META' },
  { key: 'TSLA', symbol: 'TSLA' },
  { key: 'SP500', symbol: '^GSPC', isIndex: true },
  { key: 'VIX', symbol: '^VIX', isIndex: true },
];

const COMMODITY_SYMBOLS = [
  { key: 'GOLD', symbol: 'GC=F' },
  { key: 'BRENT', symbol: 'BZ=F' },
  { key: 'WTI', symbol: 'CL=F' },
  { key: 'SILVER', symbol: 'SI=F' },
  { key: 'NATGAS', symbol: 'NG=F' },
  { key: 'COPPER', symbol: 'HG=F' },
];

const CRYPTO_COINS = [
  { key: 'BTC', id: 'bitcoin', yahoo: 'BTC-USD' },
  { key: 'ETH', id: 'ethereum', yahoo: 'ETH-USD' },
  { key: 'SOL', id: 'solana', yahoo: 'SOL-USD' },
  { key: 'BNB', id: 'binancecoin', yahoo: 'BNB-USD' },
  { key: 'XRP', id: 'ripple', yahoo: 'XRP-USD' },
  { key: 'DOGE', id: 'dogecoin', yahoo: 'DOGE-USD' },
  { key: 'ADA', id: 'cardano', yahoo: 'ADA-USD' },
  { key: 'LINK', id: 'chainlink', yahoo: 'LINK-USD' },
];

const FX_CODES = ['INR', 'EUR', 'GBP', 'JPY', 'AED', 'CHF', 'CAD', 'AUD'];

async function fetchJson(url, timeoutMs = 12000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'application/json, text/plain, */*',
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

async function fetchText(url, timeoutMs = 12000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'application/rss+xml, application/xml, text/xml, */*',
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

function roundNum(n, decimals = 2) {
  if (typeof n !== 'number' || !Number.isFinite(n)) return null;
  const factor = 10 ** decimals;
  return Math.round(n * factor) / factor;
}

function formatDateYmd(unixSeconds) {
  const d = new Date(unixSeconds * 1000);
  return d.toISOString().slice(0, 10);
}

/**
 * Fetch Yahoo Finance 90-day daily chart + quote metadata.
 */
async function fetchYahooChart(symbol, decimals = 2) {
  const encoded = encodeURIComponent(symbol);
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encoded}?range=3mo&interval=1d&includePrePost=false`;
  const data = await fetchJson(url);
  const result = data?.chart?.result?.[0];
  if (!result) throw new Error(`Empty Yahoo chart result for ${symbol}`);

  const meta = result.meta || {};
  const timestamps = result.timestamp || [];
  const quote = result.indicators?.quote?.[0] || {};
  const opens = quote.open || [];
  const highs = quote.high || [];
  const lows = quote.low || [];
  const closes = quote.close || [];
  const volumes = quote.volume || [];

  const candlesMap = new Map();
  for (let i = 0; i < timestamps.length; i += 1) {
    const o = opens[i];
    const h = highs[i];
    const l = lows[i];
    const c = closes[i];
    if (
      typeof o !== 'number' ||
      typeof h !== 'number' ||
      typeof l !== 'number' ||
      typeof c !== 'number'
    ) {
      continue;
    }
    const time = formatDateYmd(timestamps[i]);
    candlesMap.set(time, {
      time,
      open: roundNum(o, decimals),
      high: roundNum(h, decimals),
      low: roundNum(l, decimals),
      close: roundNum(c, decimals),
    });
  }

  const candles = Array.from(candlesMap.values()).slice(-90);
  const lastCandle = candles[candles.length - 1];
  const prevCandle = candles[candles.length - 2];

  const price =
    typeof meta.regularMarketPrice === 'number'
      ? meta.regularMarketPrice
      : lastCandle?.close ?? null;
  const prevClose =
    typeof meta.chartPreviousClose === 'number' && candles.length <= 1
      ? meta.chartPreviousClose
      : typeof meta.previousClose === 'number'
        ? meta.previousClose
        : prevCandle?.close ?? price;

  const change = price !== null && prevClose !== null ? price - prevClose : 0;
  const changePct =
    prevClose && prevClose !== 0 ? (change / prevClose) * 100 : 0;

  const dayLow =
    typeof meta.regularMarketDayLow === 'number'
      ? meta.regularMarketDayLow
      : lastCandle?.low ?? price;
  const dayHigh =
    typeof meta.regularMarketDayHigh === 'number'
      ? meta.regularMarketDayHigh
      : lastCandle?.high ?? price;

  const w52Low =
    typeof meta.fiftyTwoWeekLow === 'number'
      ? meta.fiftyTwoWeekLow
      : candles.length
        ? Math.min(...candles.map((c) => c.low))
        : price;
  const w52High =
    typeof meta.fiftyTwoWeekHigh === 'number'
      ? meta.fiftyTwoWeekHigh
      : candles.length
        ? Math.max(...candles.map((c) => c.high))
        : price;

  const lastVol = volumes.filter((v) => typeof v === 'number').slice(-1)[0] ?? null;

  return {
    symbol,
    currency: meta.currency || 'USD',
    price: roundNum(price, decimals),
    prevClose: roundNum(prevClose, decimals),
    change: roundNum(change, decimals),
    changePct: roundNum(changePct, 2),
    dayLow: roundNum(dayLow, decimals),
    dayHigh: roundNum(dayHigh, decimals),
    w52Low: roundNum(w52Low, decimals),
    w52High: roundNum(w52High, decimals),
    volume: lastVol,
    marketTime: meta.regularMarketTime
      ? new Date(meta.regularMarketTime * 1000).toISOString()
      : null,
    candles,
  };
}

async function fetchYahooBatch(items, decimalsFn = () => 2) {
  const out = {};
  const results = await Promise.allSettled(
    items.map(async (item) => {
      const dec = decimalsFn(item.key);
      const quote = await fetchYahooChart(item.symbol, dec);
      return { item, quote };
    })
  );

  for (const r of results) {
    if (r.status === 'fulfilled') {
      out[r.value.item.key] = {
        ...r.value.quote,
        isIndex: Boolean(r.value.item.isIndex),
      };
    } else {
      console.warn(`[warn] Yahoo fetch failed: ${r.reason?.message || r.reason}`);
    }
  }

  // If SENSEXIETF.BO has sparse candles (< 10), scale ^BSESN candles to SENSEXIETF price
  if (out.SENSEXIETF && out.SENSEXIETF.candles.length < 10 && out.SENSEX && out.SENSEX.candles.length >= 10 && out.SENSEX.price) {
    const ratio = out.SENSEXIETF.price / out.SENSEX.price;
    out.SENSEXIETF.candles = out.SENSEX.candles.map((c) => ({
      time: c.time,
      open: roundNum(c.open * ratio, 2),
      high: roundNum(c.high * ratio, 2),
      low: roundNum(c.low * ratio, 2),
      close: roundNum(c.close * ratio, 2),
    }));
  }
  return out;
}

async function fetchCrypto() {
  const result = {
    assets: {},
    fearGreed: null,
  };

  // 1. CoinGecko spot prices
  try {
    const ids = CRYPTO_COINS.map((c) => c.id).join(',');
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`;
    const cg = await fetchJson(url);
    for (const coin of CRYPTO_COINS) {
      const row = cg[coin.id];
      if (row && typeof row.usd === 'number') {
        const decimals = row.usd >= 100 ? 2 : row.usd >= 1 ? 3 : 4;
        result.assets[coin.key] = {
          id: coin.id,
          symbol: coin.yahoo,
          price: roundNum(row.usd, decimals),
          changePct: roundNum(row.usd_24h_change ?? 0, 2),
          marketCap: row.usd_market_cap ?? null,
          volume24h: row.usd_24h_vol ?? null,
          candles: [],
        };
      }
    }
  } catch (err) {
    console.warn(`[warn] CoinGecko spot failed: ${err.message}`);
  }

  // 2. 90-day OHLC candles from Yahoo Finance (*-USD) so we don't hit CoinGecko rate limits
  const candleResults = await Promise.allSettled(
    CRYPTO_COINS.map(async (coin) => {
      const dec = ['DOGE', 'ADA', 'XRP'].includes(coin.key) ? 4 : 2;
      const q = await fetchYahooChart(coin.yahoo, dec);
      return { coin, q };
    })
  );

  for (const r of candleResults) {
    if (r.status === 'fulfilled') {
      const { coin, q } = r.value;
      if (!result.assets[coin.key]) {
        result.assets[coin.key] = {
          id: coin.id,
          symbol: coin.yahoo,
          price: q.price,
          changePct: q.changePct,
          candles: q.candles,
        };
      } else {
        result.assets[coin.key].candles = q.candles;
        result.assets[coin.key].dayLow = q.dayLow;
        result.assets[coin.key].dayHigh = q.dayHigh;
      }
    }
  }

  // 3. Crypto Fear & Greed Index
  try {
    const fng = await fetchJson('https://api.alternative.me/fng/?limit=1');
    const row = fng?.data?.[0];
    if (row) {
      result.fearGreed = {
        value: parseInt(row.value, 10),
        classification: row.value_classification,
        timestamp: row.timestamp ? new Date(Number(row.timestamp) * 1000).toISOString() : null,
      };
    }
  } catch (err) {
    console.warn(`[warn] Fear & Greed fetch failed: ${err.message}`);
  }

  return result;
}

async function fetchForex() {
  try {
    const data = await fetchJson('https://open.er-api.com/v6/latest/USD');
    if (data?.rates) {
      const rates = {};
      for (const code of FX_CODES) {
        if (typeof data.rates[code] === 'number') {
          rates[code] = data.rates[code];
        }
      }
      return {
        base: 'USD',
        updatedUtc: data.time_last_update_utc || new Date().toUTCString(),
        rates,
      };
    }
  } catch (err) {
    console.warn(`[warn] Forex fetch failed: ${err.message}`);
  }
  return null;
}

function decodeXmlEntities(str = '') {
  return str
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function relativeTimeLabel(pubDateStr) {
  if (!pubDateStr) return 'Today';
  const ts = Date.parse(pubDateStr);
  if (Number.isNaN(ts)) return 'Today';
  const diffMin = Math.max(1, Math.round((Date.now() - ts) / 60000));
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.round(diffHr / 24);
  return `${diffDays}d ago`;
}

function isEnglishText(str = '') {
  // Reject strings containing non-Latin scripts (Devanagari, Arabic, CJK, Cyrillic, Tamil, etc.)
  return !/[\u0400-\u04FF\u0600-\u06FF\u0900-\u0D7F\u3040-\u30FF\u4E00-\u9FFF\uAC00-\uD7AF]/.test(str);
}

function parseRssItems(xmlText, cat, defaultTag, limit = 4) {
  const items = [];
  const itemMatches = xmlText.match(/<item\b[\s\S]*?<\/item>/gi) || [];
  for (const raw of itemMatches) {
    if (items.length >= limit) break;
    const titleRaw = raw.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '';
    const descRaw = raw.match(/<description\b[^>]*>([\s\S]*?)<\/description>/i)?.[1] || '';
    const linkRaw = raw.match(/<link\b[^>]*>([\s\S]*?)<\/link>/i)?.[1] || '';
    const pubRaw = raw.match(/<pubDate\b[^>]*>([\s\S]*?)<\/pubDate>/i)?.[1] || '';
    const sourceRaw = raw.match(/<source\b[^>]*>([\s\S]*?)<\/source>/i)?.[1] || '';

    let title = decodeXmlEntities(titleRaw);
    if (!title || !isEnglishText(title)) continue;
    const tag = decodeXmlEntities(sourceRaw).toUpperCase() || defaultTag;
    let summary = decodeXmlEntities(descRaw);
    if (!summary || summary === title || !isEnglishText(summary)) {
      summary = `${tag} briefing: ${title}`;
    }
    if (summary.length > 200) {
      summary = `${summary.slice(0, 197).trim()}...`;
    }

    items.push({
      cat,
      tag: tag.slice(0, 22),
      title,
      summary,
      time: relativeTimeLabel(decodeXmlEntities(pubRaw)),
      link: decodeXmlEntities(linkRaw),
    });
  }
  return items;
}

const BREAKTHROUGH_RE = /\b(breakthrough|discover|quantum|fusion|ai|model|nasa|space|orbit|telescope|vaccine|crispr|gene|cancer|battery|semiconductor|chip|robot|physics|climate|solar|launch|moon|mars|neural|superconduct)\b/i;

async function fetchNews() {
  const feeds = [
    {
      cat: 'WORLD',
      tag: 'BBC WORLD',
      url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
      fallbackUrl: 'https://feeds.npr.org/1004/rss.xml',
    },
    {
      cat: 'US',
      tag: 'NPR / BBC US',
      url: 'https://feeds.npr.org/1003/rss.xml',
      fallbackUrl: 'https://feeds.bbci.co.uk/news/world/us_and_canada/rss.xml',
    },
    {
      cat: 'INDIA',
      tag: 'INDIA',
      url: 'https://feeds.bbci.co.uk/news/world/asia/india/rss.xml',
      fallbackUrl: 'https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en',
    },
  ];

  const allItems = [];

  for (const f of feeds) {
    let loaded = [];
    for (const u of [f.url, f.fallbackUrl]) {
      try {
        const xml = await fetchText(u);
        loaded = parseRssItems(xml, f.cat, f.tag, 4);
        if (loaded.length > 0) break;
      } catch (err) {
        console.warn(`[warn] RSS fetch failed (${u}): ${err.message}`);
      }
    }
    allItems.push(...loaded);
  }

  // STEM: MIT News Research, NASA Breaking News, Ars Technica Science, Nature
  const stemFeeds = [
    { tag: 'MIT RESEARCH', url: 'https://news.mit.edu/rss/research' },
    { tag: 'NASA', url: 'https://www.nasa.gov/rss/dyn/breaking_news.rss' },
    { tag: 'ARS SCIENCE', url: 'https://feeds.arstechnica.com/arstechnica/science' },
    { tag: 'SCIENCEDAILY', url: 'https://www.sciencedaily.com/rss/top/technology.xml' },
  ];
  const stemPool = [];
  for (const sf of stemFeeds) {
    try {
      const xml = await fetchText(sf.url);
      stemPool.push(...parseRssItems(xml, 'STEM', sf.tag, 5));
    } catch (err) {
      console.warn(`[warn] STEM RSS fetch failed (${sf.url}): ${err.message}`);
    }
  }
  // Prioritize breakthroughs & major scientific advancements
  stemPool.sort((a, b) => {
    const sa = BREAKTHROUGH_RE.test(`${a.title} ${a.summary}`) ? 1 : 0;
    const sb = BREAKTHROUGH_RE.test(`${b.title} ${b.summary}`) ? 1 : 0;
    return sb - sa;
  });
  const seenStem = new Set();
  const stemItems = [];
  for (const item of stemPool) {
    if (stemItems.length >= 4) break;
    if (seenStem.has(item.title)) continue;
    seenStem.add(item.title);
    stemItems.push(item);
  }

  allItems.push(...stemItems);
  return allItems;
}

async function readExistingBrief() {
  try {
    const raw = await readFile(OUT_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function main() {
  console.log('Fetching live markets, crypto, forex, and news...');
  const prev = await readExistingBrief();

  const [india, us, commodities, crypto, forex, news] = await Promise.all([
    fetchYahooBatch(INDIA_SYMBOLS, () => 2),
    fetchYahooBatch(US_SYMBOLS, () => 2),
    fetchYahooBatch(COMMODITY_SYMBOLS, (k) => (k === 'NATGAS' ? 3 : 2)),
    fetchCrypto(),
    fetchForex(),
    fetchNews(),
  ]);

  const payload = {
    generatedAt: new Date().toISOString(),
    india: Object.keys(india).length ? india : prev?.india || {},
    us: Object.keys(us).length ? us : prev?.us || {},
    commodities: Object.keys(commodities).length ? commodities : prev?.commodities || {},
    crypto: Object.keys(crypto.assets).length
      ? crypto
      : prev?.crypto || { assets: {}, fearGreed: null },
    forex: forex || prev?.forex || null,
    news: news.length ? news : prev?.news || [],
  };

  await mkdir(path.dirname(OUT_FILE), { recursive: true });
  await writeFile(OUT_FILE, JSON.stringify(payload, null, 2) + '\n', 'utf8');

  console.log(
    `Wrote ${OUT_FILE} — India: ${Object.keys(payload.india).length}, US: ${Object.keys(payload.us).length}, Commodities: ${Object.keys(payload.commodities).length}, Crypto: ${Object.keys(payload.crypto.assets).length}, News: ${payload.news.length}`
  );
}

main().catch((err) => {
  console.error('Fatal error in fetch-data.mjs:', err);
  process.exit(1);
});
