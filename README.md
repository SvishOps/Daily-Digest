# Markets Daily Brief

[![Live Site](https://img.shields.io/badge/GitHub%20Pages-Live-10b981?style=for-the-badge&logo=github)](https://svishops.github.io/markets-daily-brief/)
[![Daily Update](https://github.com/SvishOps/markets-daily-brief/actions/workflows/daily-update.yml/badge.svg)](https://github.com/SvishOps/markets-daily-brief/actions/workflows/daily-update.yml)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-f59e0b?style=for-the-badge)](https://svishops.github.io/markets-daily-brief/)

A fast, zero-API-key, daily-updating multi-asset market intelligence hub hosted on **GitHub Pages** and refreshed automatically by **GitHub Actions**.

**[Open Live Terminal](https://svishops.github.io/markets-daily-brief/)**

---

## Standalone Shareable Cards

Every module has its own dedicated URL that loads live data from `data/live-brief.json` and can be shared or bookmarked independently:

| Module | Standalone Card | Hub Deep Link |
| :--- | :--- | :--- |
| **India Markets** | [Open India Card](https://svishops.github.io/markets-daily-brief/cards/india.html) | [India Tab](https://svishops.github.io/markets-daily-brief/?tab=india) |
| **U.S. Markets** | [Open U.S. Card](https://svishops.github.io/markets-daily-brief/cards/us.html) | [U.S. Tab](https://svishops.github.io/markets-daily-brief/?tab=us) |
| **Crypto Markets** | [Open Crypto Card](https://svishops.github.io/markets-daily-brief/cards/crypto.html) | [BTC Deep Link](https://svishops.github.io/markets-daily-brief/?tab=crypto&ticker=BTC) |
| **Commodities** | [Open Commodities Card](https://svishops.github.io/markets-daily-brief/cards/commodities.html) | [Gold Deep Link](https://svishops.github.io/markets-daily-brief/?tab=commodities&ticker=GOLD) |
| **Astro Daily** | [Open Astro Card](https://svishops.github.io/markets-daily-brief/cards/astro.html) | [Taurus Vedic](https://svishops.github.io/markets-daily-brief/?tab=astro&sign=TAURUS&sys=VEDIC) |
| **World News** | [Open News Card](https://svishops.github.io/markets-daily-brief/cards/news.html) | [News Tab](https://svishops.github.io/markets-daily-brief/?tab=intel) |

> **Tip:** Append `?ticker=SYMBOL` to any market card (e.g. [cards/india.html?ticker=RELIANCE](https://svishops.github.io/markets-daily-brief/cards/india.html?ticker=RELIANCE) or [cards/us.html?ticker=NVDA](https://svishops.github.io/markets-daily-brief/cards/us.html?ticker=NVDA)) to share a specific asset directly.

---

## Automated Daily Data Pipeline

[scripts/fetch-data.mjs](scripts/fetch-data.mjs) runs on **Node.js 20+** with zero paid API keys and writes [data/live-brief.json](data/live-brief.json):

- **India & U.S. Markets & Commodities:** Yahoo Finance quotes + 90-day daily OHLC candles
- **Crypto:** CoinGecko USD spot prices + Alternative.me Fear & Greed Index + 90-day OHLC candles
- **Forex (1 USD base):** `open.er-api.com` (`INR`, `EUR`, `GBP`, `JPY`, `AED`, `CHF`, `CAD`, `AUD`)
- **World News:** Top 4 headlines each for World, U.S., India, and STEM via BBC, Google News RSS, and Hacker News

**Schedule ([daily-update.yml](.github/workflows/daily-update.yml)):** Runs daily at `06:00`, `07:00`, `08:15`, and `19:00` IST (`00:30`, `01:30`, `02:45`, `13:30` UTC), plus manual runs via `workflow_dispatch`.

---

## Install as an App (PWA)

- **iPhone / iPad (Safari):** Open [the live site](https://svishops.github.io/markets-daily-brief/) → tap **Share** → **Add to Home Screen**.
- **Android (Chrome):** Open [the live site](https://svishops.github.io/markets-daily-brief/) → tap **⋮ Menu** → **Install app**.
- **Desktop (Chrome / Edge):** Click the **Install** icon in the right side of the address bar.
