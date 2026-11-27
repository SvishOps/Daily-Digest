<div align="center">

# Daily Digest

**Multi-Asset Market Terminal, Commodities, Crypto, Astro & World News**

[![Live on GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-10b981?style=for-the-badge&logo=github)](https://svishops.github.io/markets-daily-brief/)
[![Daily Data Refresh](https://github.com/SvishOps/markets-daily-brief/actions/workflows/daily-update.yml/badge.svg)](https://github.com/SvishOps/markets-daily-brief/actions/workflows/daily-update.yml)
[![Zero API Keys](https://img.shields.io/badge/API%20Keys-Zero%20Required-0ea5e9?style=for-the-badge)](#data-pipeline)
[![PWA Installable](https://img.shields.io/badge/PWA-Installable-f59e0b?style=for-the-badge)](#install-as-an-app)

**[Launch Daily Digest →](https://svishops.github.io/markets-daily-brief/)**

</div>

---

## Standalone Shareable Cards

Each module has its own dedicated URL powered by [`data/live-brief.json`](data/live-brief.json), TradingView Lightweight Charts (90-day OHLC + EMA-10 + Volume), Fear & Greed gauges, Expected Volatility bands, and Key Market Drivers:

| Module | Standalone Card | Deep-Link Example |
| :--- | :--- | :--- |
| 🇮🇳 **Indian Markets** | [cards/india.html](https://svishops.github.io/markets-daily-brief/cards/india.html) | [Reliance Industries](https://svishops.github.io/markets-daily-brief/?tab=india&ticker=RELIANCE) |
| 🇺🇸 **U.S. Markets** | [cards/us.html](https://svishops.github.io/markets-daily-brief/cards/us.html) | [NVIDIA (NVDA)](https://svishops.github.io/markets-daily-brief/?tab=us&ticker=NVDA) |
| ₿ **Crypto Markets** | [cards/crypto.html](https://svishops.github.io/markets-daily-brief/cards/crypto.html) | [Bitcoin (BTC)](https://svishops.github.io/markets-daily-brief/?tab=crypto&ticker=BTC) |
| 🛢️ **Commodities** | [cards/commodities.html](https://svishops.github.io/markets-daily-brief/cards/commodities.html) | [Gold Spot (XAU)](https://svishops.github.io/markets-daily-brief/?tab=commodities&ticker=GOLD) |
| ♉ **Astro Daily** | [cards/astro.html](https://svishops.github.io/markets-daily-brief/cards/astro.html) | [Taurus · Vedic](https://svishops.github.io/markets-daily-brief/?tab=astro&sign=TAURUS&sys=VEDIC) |
| 🌐 **World News** | [cards/news.html](https://svishops.github.io/markets-daily-brief/cards/news.html) | [All Headlines](https://svishops.github.io/markets-daily-brief/?tab=intel) |

> **Tip:** Append `?ticker=SYMBOL` to any standalone card URL (for example, [`cards/india.html?ticker=HDFCBANK`](https://svishops.github.io/markets-daily-brief/cards/india.html?ticker=HDFCBANK)) to share a specific ticker directly.

---

## Data Pipeline

[`scripts/fetch-data.mjs`](scripts/fetch-data.mjs) runs on **Node.js 20+** with zero npm dependencies and zero paid API keys:

| Feed | Source | Coverage |
| :--- | :--- | :--- |
| **Indian Equities & Indices** | Yahoo Finance | `NIFTYBEES.NS`, `SENSEXIETF.BO`, `BANKBEES.NS`, `GOLDBEES.NS`, `RELIANCE.NS`, `HDFCBANK.NS`, `TCS.NS`, `INFY.NS`, `ICICIBANK.NS`, `SBIN.NS`, `ITC.NS`, `^NSEI`, `^BSESN`, `^INDIAVIX` |
| **U.S. Equities & Indices** | Yahoo Finance | `SPY`, `QQQ`, `DIA`, `IWM`, `NVDA`, `AAPL`, `MSFT`, `GOOGL`, `AMZN`, `META`, `TSLA`, `^GSPC`, `^VIX` |
| **Commodities** | Yahoo Finance | `GC=F` (Gold), `BZ=F` (Brent), `CL=F` (WTI), `SI=F` (Silver), `NG=F` (NatGas), `HG=F` (Copper) |
| **Crypto & Sentiment** | CoinGecko + Alternative.me | `BTC`, `ETH`, `SOL`, `BNB`, `XRP`, `DOGE`, `ADA`, `LINK` + Crypto Fear & Greed Index |
| **Forex (1 USD Base)** | Open ER-API | `INR`, `EUR`, `GBP`, `JPY`, `AED`, `CHF`, `CAD`, `AUD` |
| **World News** | BBC, Google News, Hacker News | Top 4 headlines each across World, U.S., India, and STEM |

**Schedule:** [`.github/workflows/daily-update.yml`](.github/workflows/daily-update.yml) refreshes [`data/live-brief.json`](data/live-brief.json) automatically at **06:00, 07:00, 08:15, and 19:00 IST** (`00:30`, `01:30`, `02:45`, and `13:30` UTC) and supports manual runs via `workflow_dispatch`.

---

## Install as an App

- **iPhone / iPad (Safari):** Open [Daily Digest](https://svishops.github.io/markets-daily-brief/) → tap **Share** → **Add to Home Screen**.
- **Android (Chrome):** Open [Daily Digest](https://svishops.github.io/markets-daily-brief/) → tap **⋮ Menu** → **Install app**.
- **Desktop (Chrome / Edge):** Click the **Install** icon in the address bar.
