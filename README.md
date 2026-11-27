# Markets Daily Brief

A clean, shareable, daily-updating multi-asset market intelligence web app hosted on GitHub Pages, powered by zero-key public APIs and GitHub Actions.

## Live URLs

- **Main 6-Tab Hub**: `https://svishops.github.io/markets-daily-brief/`
- **Standalone Shareable Cards**:
  - India Markets: `https://svishops.github.io/markets-daily-brief/cards/india.html`
  - U.S. Markets: `https://svishops.github.io/markets-daily-brief/cards/us.html`
  - Crypto Markets: `https://svishops.github.io/markets-daily-brief/cards/crypto.html`
  - Commodities: `https://svishops.github.io/markets-daily-brief/cards/commodities.html`
  - Astro Daily: `https://svishops.github.io/markets-daily-brief/cards/astro.html`
  - World News: `https://svishops.github.io/markets-daily-brief/cards/news.html`

## Deep-Link Query Parameters

Open any tab, ticker, or astro sign directly via URL parameters:

- `?tab=crypto&ticker=BTC`
- `?tab=india&ticker=RELIANCE`
- `?tab=us&ticker=NVDA`
- `?tab=commodities&ticker=GOLD`
- `?tab=astro&sign=TAURUS&sys=VEDIC`

Standalone cards also support `?ticker=BTC` or `?sign=TAURUS&sys=VEDIC`.

## Daily Live Data Engine

`scripts/fetch-data.mjs` (Node.js 20+, zero external dependencies, zero paid API keys) refreshes `data/live-brief.json` with:

- **India Markets**: Yahoo Finance quotes & 90-day OHLC candles (`NIFTYBEES.NS`, `SENSEXIETF.BO`, `BANKBEES.NS`, `GOLDBEES.NS`, `RELIANCE.NS`, `HDFCBANK.NS`, `TCS.NS`, `INFY.NS`, `ICICIBANK.NS`, `SBIN.NS`, `ITC.NS`, `^NSEI`, `^BSESN`, `^INDIAVIX`)
- **U.S. Markets**: Yahoo Finance quotes & 90-day OHLC candles (`SPY`, `QQQ`, `DIA`, `IWM`, `NVDA`, `AAPL`, `MSFT`, `GOOGL`, `AMZN`, `META`, `TSLA`, `^GSPC`, `^VIX`)
- **Commodities**: Yahoo Finance quotes & 90-day OHLC candles (`GC=F`, `BZ=F`, `CL=F`, `SI=F`, `NG=F`, `HG=F`)
- **Crypto**: CoinGecko USD spot prices + Alternative.me Fear & Greed Index + 90-day OHLC candles
- **Forex (1 USD base)**: `open.er-api.com` (`INR`, `EUR`, `GBP`, `JPY`, `AED`, `CHF`, `CAD`, `AUD`)
- **World News**: Top 4 headlines each for World, U.S., India, and STEM from BBC, Google News RSS, and Hacker News

GitHub Actions (`.github/workflows/daily-update.yml`) runs automatically at `00:30`, `01:30`, `02:45`, and `13:30` UTC (`06:00`, `07:00`, `08:15`, and `19:00` IST) and supports manual `workflow_dispatch`.

## Mobile & Desktop PWA Install Guide

### iPhone / iPad (Safari)
1. Open `https://svishops.github.io/markets-daily-brief/` in **Safari**.
2. Tap the **Share** button (square with upward arrow).
3. Scroll down and tap **Add to Home Screen**.
4. Tap **Add** to launch Markets Brief as a full-screen app.

### Android (Chrome / Edge / Brave)
1. Open `https://svishops.github.io/markets-daily-brief/` in **Chrome**.
2. Tap the **three-dot menu** (top-right).
3. Tap **Install app** (or **Add to Home screen**).

### Desktop (Chrome / Edge)
1. Open the site in Chrome or Edge.
2. Click the **Install** icon in the right side of the address bar.
