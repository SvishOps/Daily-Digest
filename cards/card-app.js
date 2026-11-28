(function () {
  const CARD_META = {
    india: { title: 'Indian Markets', icon: '<svg class="w-5 h-3.5 rounded-[2px] border border-black/15" viewBox="0 0 24 16"><rect width="24" height="5.33" fill="#FF9933"/><rect width="24" height="5.34" y="5.33" fill="#FFF"/><rect width="24" height="5.33" y="10.67" fill="#138808"/><circle cx="12" cy="8" r="2.1" fill="none" stroke="#000080" stroke-width="0.7"/></svg>', tab: 'india', kicker: 'NSE / BSE • INDIAN MARKETS' },
    us: { title: 'U.S. Markets', icon: '<svg class="w-5 h-3.5 rounded-[2px] border border-black/15" viewBox="0 0 24 16"><rect width="24" height="16" fill="#B22234"/><rect width="24" height="2.28" y="2.28" fill="#FFF"/><rect width="24" height="2.28" y="6.85" fill="#FFF"/><rect width="24" height="2.28" y="11.42" fill="#FFF"/><rect width="10.5" height="9.14" fill="#3C3B6E"/></svg>', tab: 'us', kicker: 'NYSE / NASDAQ • U.S. MARKETS' },
    crypto: { title: 'Crypto Markets', icon: '<span class="font-mono font-bold text-amber-500 text-lg">₿</span>', tab: 'crypto', kicker: '24/7 GLOBAL SPOT (USD) • CRYPTO MARKETS' },
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
      NIFTYBEES: { name: 'Nippon India ETF Nifty 50 BeES', symbol: 'NSE:NIFTYBEES', price: 292.00, change: -3.33, changePct: -1.13, dayLow: 291.75, dayHigh: 295.44, w52Low: 251.70, w52High: 302.25, fg: 56, iv: 'INDIA VIX 16.66', vol1d: '±0.87%', vol1w: '±2.31%', drivers: ['Brent crude rebound above $96/bbl weighed on energy importers and PSU financials.', 'Proposed 25% U.S. tariff headlines triggered defensive rotation out of export IT.', 'Domestic institutional dip-buying cushioned Nifty 25,550 index support.'] },
      SENSEXIETF: { name: 'ICICI Prudential BSE Sensex ETF', symbol: 'BSE:SENSEXIETF', price: 955.99, change: -11.41, changePct: -1.18, dayLow: 954.10, dayHigh: 967.20, w52Low: 828.00, w52High: 992.40, fg: 54, iv: 'INDIA VIX 16.66', vol1d: '±0.89%', vol1w: '±2.35%', drivers: ['Private banking heavyweights saw profit-booking after a strong November rally.', 'Reliance Industries and Bharti Airtel provided partial downside cushion.', 'Foreign institutional flows remained net positive despite intraday softness.'] },
      BANKBEES: { name: 'Nippon India ETF Bank BeES', symbol: 'NSE:BANKBEES', price: 538.40, change: -5.80, changePct: -1.07, dayLow: 536.90, dayHigh: 544.50, w52Low: 468.20, w52High: 559.00, fg: 58, iv: 'INDIA VIX 16.66', vol1d: '±1.05%', vol1w: '±2.72%', drivers: ['RBI data confirmed bank bad-loan write-offs declined 8.2% YoY, aiding asset quality.', 'HDFC Bank relative strength offset mild profit-taking in PSU banks.', 'Credit growth stability keeps 52,000 as a strong structural demand zone.'] },
      GOLDBEES: { name: 'Nippon India ETF Gold BeES', symbol: 'NSE:GOLDBEES', price: 102.85, change: 1.18, changePct: 1.16, dayLow: 101.90, dayHigh: 103.20, w52Low: 72.40, w52High: 104.50, fg: 68, iv: 'GOLD IV 18.4', vol1d: '±0.95%', vol1w: '±2.40%', drivers: ['Global spot gold strength combined with USD/INR firmness lifted domestic bullion.', 'Safe-haven hedging accelerated amid geopolitical and tariff uncertainty.', 'Central bank accumulation keeps dip buyers active near ₹101.'] },
      RELIANCE: { name: 'Reliance Industries Ltd', symbol: 'NSE:RELIANCE', price: 1348.60, change: 12.40, changePct: 0.93, dayLow: 1334.00, dayHigh: 1355.80, w52Low: 1195.00, w52High: 1540.00, fg: 62, iv: 'STOCK IV 21.4', vol1d: '±1.12%', vol1w: '±2.85%', drivers: ['Higher refining margins and Jio ARPU expansion drove relative outperformance.', 'New energy gigafactory milestones remain a medium-term re-rating trigger.', 'Institutional accumulation visible above the ₹1,330 pivot.'] },
      HDFCBANK: { name: 'HDFC Bank Ltd', symbol: 'NSE:HDFCBANK', price: 1784.20, change: 9.15, changePct: 0.52, dayLow: 1769.50, dayHigh: 1794.00, w52Low: 1480.00, w52High: 1835.00, fg: 61, iv: 'STOCK IV 18.9', vol1d: '±0.98%', vol1w: '±2.45%', drivers: ['Improving credit-deposit ratio and steady NIMs drew sustained FII inflows.', 'Relative strength leader within Nifty Bank over the past five sessions.', 'Breakout above ₹1,800 opens room toward fresh all-time highs.'] },
      TCS: { name: 'Tata Consultancy Services Ltd', symbol: 'NSE:TCS', price: 4218.50, change: -54.30, changePct: -1.27, dayLow: 4202.00, dayHigh: 4279.00, w52Low: 3690.00, w52High: 4592.00, fg: 44, iv: 'STOCK IV 22.1', vol1d: '±1.16%', vol1w: '±2.95%', drivers: ['U.S. tariff and visa-policy headlines weighed on Indian IT exporter sentiment.', 'Weak rupee near ₹92.96/USD offers partial operating margin cushion.', 'Enterprise AI deal pipeline remains resilient ahead of quarterly updates.'] },
      INFY: { name: 'Infosys Ltd', symbol: 'NSE:INFY', price: 1912.40, change: -21.60, changePct: -1.12, dayLow: 1901.00, dayHigh: 1940.00, w52Low: 1540.00, w52High: 2010.00, fg: 46, iv: 'STOCK IV 23.0', vol1d: '±1.20%', vol1w: '±3.05%', drivers: ['Export-oriented IT stocks faced mild selling on U.S. trade headlines.', 'Discretionary BFSI spend recovery underpins medium-term guidance.', 'Support zone sits at ₹1,885–₹1,900.'] },
      ICICIBANK: { name: 'ICICI Bank Ltd', symbol: 'NSE:ICICIBANK', price: 1296.50, change: -8.40, changePct: -0.64, dayLow: 1288.00, dayHigh: 1311.00, w52Low: 1045.00, w52High: 1362.00, fg: 57, iv: 'STOCK IV 19.6', vol1d: '±1.02%', vol1w: '±2.60%', drivers: ['Consistent RoA and low slippage ratio keep institutional positioning constructive.', 'Consolidating recent gains just below ₹1,320 supply.', 'Key demand floor rests near ₹1,275.'] },
      SBIN: { name: 'State Bank of India', symbol: 'NSE:SBIN', price: 836.20, change: -7.10, changePct: -0.84, dayLow: 830.50, dayHigh: 846.80, w52Low: 680.00, w52High: 912.00, fg: 52, iv: 'STOCK IV 24.5', vol1d: '±1.28%', vol1w: '±3.25%', drivers: ['PSU bank index saw mild profit-taking alongside broader market pullback.', 'Healthy corporate credit pipeline supports FY27 earnings visibility.', 'Immediate support at ₹820, resistance near ₹855.'] },
      ITC: { name: 'ITC Ltd', symbol: 'NSE:ITC', price: 478.90, change: 2.35, changePct: 0.49, dayLow: 475.10, dayHigh: 482.00, w52Low: 399.00, w52High: 528.50, fg: 59, iv: 'STOCK IV 16.2', vol1d: '±0.85%', vol1w: '±2.15%', drivers: ['Defensive FMCG rotation supported ITC amid broader index volatility.', 'Hotels demerger value unlocking and steady dividend yield attract value buyers.', 'Sustaining above ₹475 keeps momentum constructive.'] }
    },
    us: {
      SPY: { name: 'SPDR S&P 500 ETF Trust', symbol: 'NYSE:SPY', price: 598.40, change: 4.12, changePct: 0.69, dayLow: 593.10, dayHigh: 599.80, w52Low: 470.00, w52High: 605.00, fg: 34, iv: 'CBOE VIX 22.10', vol1d: '±1.15%', vol1w: '±2.80%', drivers: ['PCE inflation and Fed rate-path expectations continue to steer index multiples.', 'Mega-cap tech earnings momentum offsets broader cyclical dispersion.', 'Watch 590 support and 605 all-time-high resistance.'] },
      QQQ: { name: 'Invesco QQQ Trust', symbol: 'NASDAQ:QQQ', price: 509.20, change: 5.40, changePct: 1.07, dayLow: 502.50, dayHigh: 511.10, w52Low: 395.00, w52High: 520.00, fg: 42, iv: 'VXN 24.40', vol1d: '±1.38%', vol1w: '±3.40%', drivers: ['AI infrastructure capex keeps semiconductor and hyperscaler leaders bid.', 'Treasury yield swings remain the primary intraday catalyst for growth multiples.', 'Key pivot sits near $505.'] },
      DIA: { name: 'SPDR Dow Jones Industrial ETF', symbol: 'NYSE:DIA', price: 446.10, change: 1.85, changePct: 0.42, dayLow: 443.20, dayHigh: 447.50, w52Low: 368.00, w52High: 451.00, fg: 48, iv: 'VXD 17.80', vol1d: '±0.92%', vol1w: '±2.20%', drivers: ['Industrial and financial blue chips show steady defensive relative strength.', 'Lower beta profile cushions macro volatility spikes.', 'Support at $440, upside target $452.'] },
      IWM: { name: 'iShares Russell 2000 ETF', symbol: 'NYSE:IWM', price: 238.90, change: -1.10, changePct: -0.46, dayLow: 236.40, dayHigh: 241.00, w52Low: 189.00, w52High: 245.00, fg: 39, iv: 'RVX 26.50', vol1d: '±1.55%', vol1w: '±3.85%', drivers: ['Small caps remain highly sensitive to 10-year Treasury yield moves.', 'Domestic manufacturing reshoring themes support selective cyclicals.', 'Range-bound between $234 and $245.'] },
      NVDA: { name: 'NVIDIA Corporation', symbol: 'NASDAQ:NVDA', price: 141.25, change: 3.45, changePct: 2.50, dayLow: 137.10, dayHigh: 142.80, w52Low: 66.00, w52High: 152.00, fg: 64, iv: 'IV 44.20', vol1d: '±2.30%', vol1w: '±5.80%', drivers: ['Hyperscaler Blackwell rack deployments sustain strong data-center demand.', 'Options flow shows concentrated call interest around the $145–$150 strikes.', 'Support rests near $135.'] },
      AAPL: { name: 'Apple Inc.', symbol: 'NASDAQ:AAPL', price: 234.80, change: 1.90, changePct: 0.82, dayLow: 232.10, dayHigh: 235.60, w52Low: 164.00, w52High: 238.00, fg: 58, iv: 'IV 23.10', vol1d: '±1.20%', vol1w: '±2.95%', drivers: ['Services revenue margin expansion underpins defensive mega-cap status.', 'Hardware upgrade cycle commentary remains a key watch item.', 'Breakout above $238 targets $245.'] },
      MSFT: { name: 'Microsoft Corporation', symbol: 'NASDAQ:MSFT', price: 424.50, change: 2.80, changePct: 0.66, dayLow: 420.10, dayHigh: 426.00, w52Low: 366.00, w52High: 468.00, fg: 53, iv: 'IV 22.80', vol1d: '±1.18%', vol1w: '±2.90%', drivers: ['Azure AI workload growth continues to anchor enterprise cloud share.', 'Capex intensity keeps investors focused on near-term free cash flow.', 'Key support at $415.'] },
      GOOGL: { name: 'Alphabet Inc.', symbol: 'NASDAQ:GOOGL', price: 171.40, change: 1.15, changePct: 0.68, dayLow: 169.50, dayHigh: 172.30, w52Low: 131.00, w52High: 191.00, fg: 51, iv: 'IV 26.40', vol1d: '±1.35%', vol1w: '±3.30%', drivers: ['Google Cloud operating leverage and Search AI Overviews drive engagement.', 'Regulatory headlines remain priced into current valuation discount.', 'Pivot zone at $168–$175.'] },
      AMZN: { name: 'Amazon.com Inc.', symbol: 'NASDAQ:AMZN', price: 207.60, change: 2.40, changePct: 1.17, dayLow: 204.30, dayHigh: 208.90, w52Low: 144.00, w52High: 215.00, fg: 60, iv: 'IV 27.90', vol1d: '±1.45%', vol1w: '±3.60%', drivers: ['AWS margin strength and retail fulfillment efficiency lift operating income.', 'High-margin advertising business continues compounding above 20% YoY.', 'Watching $215 breakout level.'] },
      META: { name: 'Meta Platforms Inc.', symbol: 'NASDAQ:META', price: 574.30, change: 6.10, changePct: 1.07, dayLow: 566.00, dayHigh: 577.20, w52Low: 350.00, w52High: 602.00, fg: 57, iv: 'IV 31.20', vol1d: '±1.62%', vol1w: '±4.05%', drivers: ['AI-driven ad targeting lifts monetization across Reels and Advantage+.', 'Open-weights Llama ecosystem strengthens developer mindshare.', 'Support at $560, target $600.'] },
      TSLA: { name: 'Tesla Inc.', symbol: 'NASDAQ:TSLA', price: 338.90, change: -4.20, changePct: -1.22, dayLow: 334.00, dayHigh: 345.00, w52Low: 138.00, w52High: 361.00, fg: 55, iv: 'IV 58.40', vol1d: '±3.05%', vol1w: '±7.60%', drivers: ['High implied volatility reflects autonomous/robotaxi policy catalysts.', 'Energy storage deployments provide an expanding margin buffer.', 'Key support sits near $325.'] }
    },
    crypto: {
      BTC: { name: 'Bitcoin (BTC / USD)', symbol: 'BTC / USD', price: 61484, changePct: 1.63, decimals: 0, fg: 12, iv: 'DVOL 55.45', vol1d: '±2.90%', vol1w: '±7.65%', drivers: ['Technical relief bounce reclaimed $61,000+ despite Extreme Fear sentiment.', 'Spot Bitcoin ETF flow trends continue to cap rallies near $63K–$65K.', 'High BTC dominance (~59%) signals defensive rotation out of altcoins.'] },
      ETH: { name: 'Ethereum (ETH / USD)', symbol: 'ETH / USD', price: 1728, changePct: 2.34, decimals: 0, fg: 18, iv: 'DVOL 64.20', vol1d: '±3.36%', vol1w: '±8.90%', drivers: ['Outperformed BTC on 24h rebound as ETH/BTC bounced off multi-month lows.', 'Layer-2 blob throughput remains elevated while spot ETF flows stay muted.', 'Reclaiming $1,800 is required to neutralize the broader downtrend.'] },
      SOL: { name: 'Solana (SOL / USD)', symbol: 'SOL / USD', price: 138.40, changePct: 3.12, decimals: 2, fg: 28, iv: 'IV 74.50', vol1d: '±3.90%', vol1w: '±10.30%', drivers: ['High on-chain DEX volume and stablecoin inflows keep SOL among top rebounders.', 'High beta to BTC makes $130 a critical near-term structural floor.', 'Breakout above $144 targets the $152–$158 supply pocket.'] },
      BNB: { name: 'BNB (BNB / USD)', symbol: 'BNB / USD', price: 548.20, changePct: 1.15, decimals: 2, fg: 32, iv: 'IV 49.80', vol1d: '±2.60%', vol1w: '±6.90%', drivers: ['Displayed lower drawdown than most large-cap altcoins during macro selloffs.', 'Steady BNB Chain TVL and token burn mechanics support floor near $520.', 'Watch $565 resistance for trend resumption.'] },
      XRP: { name: 'XRP (XRP / USD)', symbol: 'XRP / USD', price: 1.42, changePct: 2.88, decimals: 3, fg: 35, iv: 'IV 68.00', vol1d: '±3.55%', vol1w: '±9.20%', drivers: ['Cross-border settlement flows and regulatory clarity keep spot demand active.', 'Consolidating above $1.35 structural pivot.', 'Break above $1.50 opens momentum toward $1.65.'] },
      DOGE: { name: 'Dogecoin (DOGE / USD)', symbol: 'DOGE / USD', price: 0.194, changePct: 3.74, decimals: 4, fg: 30, iv: 'IV 82.00', vol1d: '±4.28%', vol1w: '±11.40%', drivers: ['High-beta retail sentiment proxy tracking Bitcoin intraday direction.', 'Support holds near $0.180.', 'Resistance cluster sits at $0.210.'] },
      ADA: { name: 'Cardano (ADA / USD)', symbol: 'ADA / USD', price: 0.584, changePct: 1.92, decimals: 4, fg: 26, iv: 'IV 71.00', vol1d: '±3.71%', vol1w: '±9.80%', drivers: ['Governance upgrades and staking participation keep circulating float tight.', 'Tracking broader altcoin liquidity rotation.', 'Key level to reclaim sits at $0.620.'] },
      LINK: { name: 'Chainlink (LINK / USD)', symbol: 'LINK / USD', price: 14.85, changePct: 2.45, decimals: 2, fg: 34, iv: 'IV 66.50', vol1d: '±3.47%', vol1w: '±9.10%', drivers: ['CCIP institutional tokenization integrations underpin fundamental demand.', 'Defending $14.00 demand zone.', 'Upside resistance at $15.80.'] }
    },
    commodities: {
      GOLD: { name: 'Gold Spot (XAU / USD)', symbol: 'XAU / USD', price: 3842.50, change: 44.20, changePct: 1.16, decimals: 2, dayLow: 3795, dayHigh: 3856, w52Low: 2540, w52High: 3910, fg: 72, iv: 'GVZ 18.40', vol1d: '±0.96%', vol1w: '±2.45%', drivers: ['Safe-haven sovereign and central bank buying remains a structural tailwind.', 'Real yield compression and geopolitical risk premium lift spot bullion.', 'Key support at $3,780, upside target $3,900.'] },
      BRENT: { name: 'Brent Crude Oil (BZ=F)', symbol: 'ICE:BRENT', price: 96.45, change: 2.85, changePct: 3.04, decimals: 2, dayLow: 93.40, dayHigh: 97.10, w52Low: 68.50, w52High: 98.80, fg: 66, iv: 'OVX 36.20', vol1d: '±1.89%', vol1w: '±4.75%', drivers: ['Regional supply-corridor risks injected fresh geopolitical risk premium.', 'OPEC+ supply discipline tightens near-term physical balances.', 'Watching $98.50 breakout resistance.'] },
      WTI: { name: 'WTI Crude Oil (CL=F)', symbol: 'NYMEX:WTI', price: 92.80, change: 2.60, changePct: 2.88, decimals: 2, dayLow: 89.90, dayHigh: 93.50, w52Low: 65.20, w52High: 95.10, fg: 64, iv: 'OVX 35.80', vol1d: '±1.87%', vol1w: '±4.68%', drivers: ['U.S. inventory draws and Brent spread dynamics support front-month WTI.', 'Refinery utilization rates remain elevated.', 'Support at $89.50, target $95.00.'] },
      SILVER: { name: 'Silver Spot (XAG / USD)', symbol: 'XAG / USD', price: 44.85, change: 0.72, changePct: 1.63, decimals: 2, dayLow: 43.90, dayHigh: 45.20, w52Low: 28.40, w52High: 46.10, fg: 69, iv: 'VXSLV 29.10', vol1d: '±1.52%', vol1w: '±3.85%', drivers: ['Dual monetary + industrial solar/EV demand keeps silver beta elevated.', 'Gold-silver ratio compression favors silver outperformance on rallies.', 'Support at $43.50.'] },
      NATGAS: { name: 'Natural Gas (NG=F)', symbol: 'NYMEX:NG', price: 3.68, change: -0.09, changePct: -2.39, decimals: 3, dayLow: 3.61, dayHigh: 3.82, w52Low: 2.05, w52High: 4.45, fg: 41, iv: 'IV 62.00', vol1d: '±3.24%', vol1w: '±8.10%', drivers: ['Weather model revisions and LNG feedgas flows drive sharp daily swings.', 'Storage levels remain near 5-year seasonal averages.', 'Key support at $3.50.'] },
      COPPER: { name: 'High Grade Copper (HG=F)', symbol: 'COMEX:HG', price: 4.32, change: 0.03, changePct: 0.70, decimals: 2, dayLow: 4.26, dayHigh: 4.37, w52Low: 3.74, w52High: 5.12, fg: 53, iv: 'IV 22.40', vol1d: '±1.17%', vol1w: '±2.95%', drivers: ['Grid electrification and data-center buildouts anchor long-term copper demand.', 'China stimulus expectations remain the primary near-term swing factor.', 'Consolidating between $4.20 and $4.45.'] }
    }
  };

  const ASTRO_SIGNS = [
    { key: 'ARIES', glyph: '♈', vedic: 'Mesha (Aries)', western: 'Aries' },
    { key: 'TAURUS', glyph: '♉', vedic: 'Vrishabha (Taurus)', western: 'Taurus' },
    { key: 'GEMINI', glyph: '♊', vedic: 'Mithuna (Gemini)', western: 'Gemini' },
    { key: 'CANCER', glyph: '♋', vedic: 'Karka (Cancer)', western: 'Cancer' },
    { key: 'LEO', glyph: '♌', vedic: 'Simha (Leo)', western: 'Leo' },
    { key: 'VIRGO', glyph: '♍', vedic: 'Kanya (Virgo)', western: 'Virgo' },
    { key: 'LIBRA', glyph: '♎', vedic: 'Tula (Libra)', western: 'Libra' },
    { key: 'SCORPIO', glyph: '♏', vedic: 'Vrishchika (Scorpio)', western: 'Scorpio' },
    { key: 'SAGITTARIUS', glyph: '♐', vedic: 'Dhanu (Sagittarius)', western: 'Sagittarius' },
    { key: 'CAPRICORN', glyph: '♑', vedic: 'Makara (Capricorn)', western: 'Capricorn' },
    { key: 'AQUARIUS', glyph: '♒', vedic: 'Kumbha (Aquarius)', western: 'Aquarius' },
    { key: 'PISCES', glyph: '♓', vedic: 'Meena (Pisces)', western: 'Pisces' }
  ];

  const FALLBACK_NEWS = [
    { cat: 'WORLD', tag: 'GEOPOLITICS', title: 'Global Energy Corridors & Sovereign Risk Brief', summary: 'Markets track Brent crude volatility and central bank liquidity signals across major hubs.', time: 'Today' },
    { cat: 'US', tag: 'MACRO / FED', title: 'U.S. Yields & Volatility Regime Watch', summary: 'Traders monitor PCE inflation prints, tariff proposals, and mega-cap earnings momentum.', time: 'Today' },
    { cat: 'INDIA', tag: 'MARKETS / RBI', title: 'Domestic Institutional Flows Support Nifty Pivot', summary: 'Banking and energy heavyweights anchor index structure amid global tariff headlines.', time: 'Today' },
    { cat: 'STEM', tag: 'SCIENCE / TECH', title: 'Quantum, Space & AI Infrastructure Milestones', summary: 'Research labs and open-source teams advance next-gen compute and planetary science.', time: 'Today' }
  ];

  const DRIVER_HEADERS = [
    { label: 'MACRO & FLOWS', cls: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30' },
    { label: 'CATALYST & POLICY', cls: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30' },
    { label: 'TECHNICAL PIVOT', cls: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30' }
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
    if (pct > 0.35) return { label: '▲ BULLISH', cls: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/35' };
    if (pct < -0.35) return { label: '▼ BEARISH', cls: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/35' };
    return { label: '◆ NEUTRAL', cls: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/35' };
  }

  function renderDialSvg(score) {
    const clamped = Math.max(0, Math.min(100, score));
    const angle = -90 + (clamped / 100) * 180;
    const scoreColor = clamped <= 35 ? '#f43f5e' : clamped >= 60 ? '#10b981' : '#f59e0b';
    const label = clamped <= 24 ? 'Extreme Fear' : clamped <= 44 ? 'Fear' : clamped <= 56 ? 'Neutral' : clamped <= 75 ? 'Greed' : 'Extreme Greed';
    return {
      label: `${label} (${clamped}/100)`,
      svg: `
        <svg viewBox="0 0 200 112" class="w-40 h-22 overflow-visible mx-auto">
          <path d="M 20 96 A 80 80 0 0 1 65 24" fill="none" stroke="#f43f5e" stroke-width="12" stroke-linecap="round" opacity="0.85"/>
          <path d="M 71 21 A 80 80 0 0 1 129 21" fill="none" stroke="#f59e0b" stroke-width="12" stroke-linecap="round" opacity="0.85"/>
          <path d="M 135 24 A 80 80 0 0 1 180 96" fill="none" stroke="#10b981" stroke-width="12" stroke-linecap="round" opacity="0.85"/>
          <g transform="translate(100, 96) rotate(${angle})">
            <line x1="0" y1="0" x2="0" y2="-66" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
            <circle cx="0" cy="0" r="5" fill="currentColor" />
          </g>
          <text x="100" y="84" text-anchor="middle" fill="${scoreColor}" font-family="JetBrains Mono, monospace" font-weight="700" font-size="22">${clamped}</text>
        </svg>
      `
    };
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

  function getTradingViewSymbol(cardKey, tickerKey) {
    const indiaMap = {
      NIFTYBEES: 'NSE:NIFTYBEES', SENSEXIETF: 'BSE:SENSEXIETF', BANKBEES: 'NSE:BANKBEES',
      GOLDBEES: 'NSE:GOLDBEES', RELIANCE: 'BSE:RELIANCE', HDFCBANK: 'BSE:HDFCBANK',
      TCS: 'BSE:TCS', INFY: 'BSE:INFY', ICICIBANK: 'BSE:ICICIBANK',
      SBIN: 'BSE:SBIN', ITC: 'BSE:ITC'
    };
    const usMap = {
      SPY: 'AMEX:SPY', QQQ: 'NASDAQ:QQQ', DIA: 'AMEX:DIA', IWM: 'AMEX:IWM',
      NVDA: 'NASDAQ:NVDA', AAPL: 'NASDAQ:AAPL', MSFT: 'NASDAQ:MSFT',
      GOOGL: 'NASDAQ:GOOGL', AMZN: 'NASDAQ:AMZN', META: 'NASDAQ:META', TSLA: 'NASDAQ:TSLA'
    };
    const cryptoMap = {
      BTC: 'BINANCE:BTCUSDT', ETH: 'BINANCE:ETHUSDT', SOL: 'BINANCE:SOLUSDT',
      BNB: 'BINANCE:BNBUSDT', XRP: 'BINANCE:XRPUSDT', DOGE: 'BINANCE:DOGEUSDT',
      ADA: 'BINANCE:ADAUSDT', LINK: 'BINANCE:LINKUSDT'
    };
    const commMap = {
      GOLD: 'OANDA:XAUUSD', SILVER: 'OANDA:XAGUSD'
    };
    if (cardKey === 'us') return usMap[tickerKey] || null;
    if (cardKey === 'crypto') return cryptoMap[tickerKey] || null;
    if (cardKey === 'commodities') return commMap[tickerKey] || null;
    return null;
  }

  function renderTradingViewWidget(container, tvSymbol, tf) {
    const intervalMap = { '1W': '60', '1M': 'D', '3M': 'D', '1Y': 'W' };
    const theme = isLight ? 'light' : 'dark';
    const bg = isLight ? '#f0e9db' : '#0c121e';
    container.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'tradingview-widget-container w-full h-full';
    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget w-full h-full';
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.text = JSON.stringify({
      autosize: true,
      symbol: tvSymbol,
      interval: intervalMap[tf] || 'D',
      timezone: 'Asia/Kolkata',
      theme,
      style: '1',
      locale: 'en',
      backgroundColor: bg,
      gridColor: isLight ? 'rgba(61, 56, 50, 0.08)' : 'rgba(148, 163, 184, 0.08)',
      hide_top_toolbar: false,
      hide_legend: false,
      allow_symbol_change: true,
      save_image: false,
      calendar: false,
      support_host: 'https://www.tradingview.com'
    });
    wrap.appendChild(widgetDiv);
    wrap.appendChild(script);
    container.appendChild(wrap);
  }

  function renderChart(containerId, ohlcId, symbol, basePrice, realCandles, levels, cardKey, tickerKey, useTradingView) {
    const container = document.getElementById(containerId);
    const ohlcEl = document.getElementById(ohlcId);
    if (!container) return;
    if (chartInstance) {
      try { chartInstance.remove(); } catch {}
      chartInstance = null;
    }
    container.innerHTML = '';

    const tvSym = useTradingView ? getTradingViewSymbol(cardKey, tickerKey) : null;
    if (tvSym) {
      if (ohlcEl) ohlcEl.textContent = `${tvSym} • TradingView Live Terminal`;
      renderTradingViewWidget(container, tvSym, activeTf);
      return;
    }

    const sliceMap = { '1W': 10, '1M': 24, '3M': 60, '1Y': 90 };
    const candles = Array.isArray(realCandles) && realCandles.length >= 5
      ? [...realCandles].sort((a, b) => a.time.localeCompare(b.time))
      : generateFallbackCandles(basePrice, symbol, '1Y');
    const visibleCount = sliceMap[activeTf] || 24;

    const bg = isLight ? '#f0e9db' : '#0c121e';
    const txt = isLight ? '#3d3832' : '#94a3b8';
    const grid = isLight ? 'rgba(61, 56, 50, 0.08)' : 'rgba(148, 163, 184, 0.08)';

    if (window.LightweightCharts && typeof window.LightweightCharts.createChart === 'function') {
      const chart = window.LightweightCharts.createChart(container, {
        width: container.clientWidth || 680,
        height: container.clientHeight || 380,
        layout: { background: { type: 'solid', color: bg }, textColor: txt, fontFamily: 'JetBrains Mono, monospace', fontSize: 11 },
        grid: { vertLines: { color: grid }, horzLines: { color: grid } },
        rightPriceScale: { borderColor: grid, scaleMargins: { top: 0.08, bottom: 0.22 } },
        timeScale: { borderColor: grid, timeVisible: false, rightOffset: 2, barSpacing: 12 },
        crosshair: { mode: 1 }
      });

      const areaSeries = chart.addAreaSeries({
        topColor: 'rgba(16, 185, 129, 0.14)',
        bottomColor: 'rgba(16, 185, 129, 0.0)',
        lineColor: 'rgba(16, 185, 129, 0.35)',
        lineWidth: 1,
        priceLineVisible: false,
        lastValueVisible: false
      });
      areaSeries.setData(candles.map((c) => ({ time: c.time, value: c.close })));

      const series = chart.addCandlestickSeries({
        upColor: '#10b981', downColor: '#f43f5e', borderVisible: false, wickUpColor: '#10b981', wickDownColor: '#f43f5e'
      });
      series.setData(candles);

      const lastCandle = candles[candles.length - 1];
      if (levels && lastCandle) {
        const buildProjection = (targetVal) => {
          if (typeof targetVal !== 'number') return null;
          const pts = [{ time: lastCandle.time, value: lastCandle.close }];
          let curDate = new Date(lastCandle.time + 'T00:00:00Z');
          for (let step = 1; step <= 5; step += 1) {
            curDate = new Date(curDate.getTime() + 86400000);
            while (curDate.getUTCDay() === 0 || curDate.getUTCDay() === 6) {
              curDate = new Date(curDate.getTime() + 86400000);
            }
            const t = step / 5;
            pts.push({ time: curDate.toISOString().slice(0, 10), value: Number((lastCandle.close + (targetVal - lastCandle.close) * t).toFixed(2)) });
          }
          return pts;
        };
        const addProjLine = (targetVal, color) => {
          const pts = buildProjection(targetVal);
          if (!pts) return;
          chart.addLineSeries({ color, lineWidth: 2, lineStyle: 2, priceLineVisible: false, lastValueVisible: false }).setData(pts);
        };
        addProjLine(levels.bull, '#10b981');
        addProjLine(levels.base, '#f59e0b');
        addProjLine(levels.bear, '#f43f5e');
      }

      if (candles.length >= 3) {
        const k = 2 / (Math.min(10, candles.length) + 1);
        let ema = candles[0].close;
        const emaSeries = chart.addLineSeries({
          color: '#f59e0b', lineWidth: 1.5, priceLineVisible: false, lastValueVisible: false
        });
        emaSeries.setData(candles.map((c, idx) => {
          ema = idx === 0 ? c.close : c.close * k + ema * (1 - k);
          return { time: c.time, value: Number(ema.toFixed(2)) };
        }));
      }

      const volSeries = chart.addHistogramSeries({
        priceFormat: { type: 'volume' }, priceScaleId: '', scaleMargins: { top: 0.78, bottom: 0 }
      });
      volSeries.setData(candles.map((c) => ({
        time: c.time,
        value: Math.max(0.01, Number(((c.high - c.low) / Math.max(1, c.open) * 1000).toFixed(2))),
        color: c.close >= c.open ? 'rgba(16, 185, 129, 0.28)' : 'rgba(244, 63, 94, 0.28)'
      })));

      chart.timeScale().setVisibleLogicalRange({
        from: Math.max(0, candles.length - visibleCount),
        to: candles.length + 5
      });

      const last = candles[candles.length - 1];
      if (ohlcEl && last) ohlcEl.textContent = `O ${last.open}  H ${last.high}  L ${last.low}  C ${last.close}`;

      chart.subscribeCrosshairMove((param) => {
        if (!ohlcEl || !param?.seriesData) return;
        const pt = param.seriesData.get(series);
        if (pt) ohlcEl.textContent = `O ${pt.open}  H ${pt.high}  L ${pt.low}  C ${pt.close}`;
        else if (last) ohlcEl.textContent = `O ${last.open}  H ${last.high}  L ${last.low}  C ${last.close}`;
      });
      chartInstance = chart;
    }
  }

  function renderHeader(cardKey) {
    const meta = CARD_META[cardKey] || CARD_META.india;
    document.title = `${meta.title} — Daily Digest`;
    const titleEl = document.getElementById('card-header-title');
    const iconEl = document.getElementById('card-header-icon');
    const hubLink = document.getElementById('card-hub-link');
    if (titleEl) titleEl.textContent = meta.title;
    if (iconEl) iconEl.innerHTML = meta.icon;
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
    const tryFetchLiveFx = async () => {
      try {
        const r = await fetch('https://open.er-api.com/v6/latest/USD', { cache: 'no-store' });
        if (r.ok) {
          const d = await r.json();
          if (d?.rates) {
            Object.keys(FALLBACK_FX).forEach((c) => {
              if (typeof d.rates[c] === 'number') FALLBACK_FX[c].value = d.rates[c];
            });
            renderFx();
            return;
          }
        }
      } catch {}
      try {
        const r2 = await fetch('https://api.frankfurter.app/latest?from=USD', { cache: 'no-store' });
        if (r2.ok) {
          const d2 = await r2.json();
          if (d2?.rates) {
            Object.keys(FALLBACK_FX).forEach((c) => {
              if (typeof d2.rates[c] === 'number') FALLBACK_FX[c].value = d2.rates[c];
            });
            renderFx();
          }
        }
      } catch {}
    };
    if (fxSel) fxSel.addEventListener('change', (e) => { activeFx = e.target.value; renderFx(); tryFetchLiveFx(); });
    renderFx();
    tryFetchLiveFx();
    setInterval(tryFetchLiveFx, 60000);

    const getAutoLight = () => {
      const hr = new Date().getHours();
      return hr >= 6 && hr < 18;
    };
    const applyTheme = (light, skipCb = false) => {
      isLight = light;
      document.documentElement.classList.toggle('dark', !light);
      document.documentElement.classList.toggle('light-beige', light);
      document.querySelectorAll('.theme-label').forEach((el) => { el.textContent = light ? 'Dark Mode' : 'Light Mode'; });
      document.querySelectorAll('.theme-icon').forEach((el) => { el.textContent = light ? '☾' : '☀'; });
      if (!skipCb && onThemeChange) onThemeChange();
    };
    const savedTheme = sessionStorage.getItem('dd_theme_override');
    applyTheme(savedTheme ? savedTheme === 'light' : getAutoLight(), true);
    setInterval(() => {
      if (!sessionStorage.getItem('dd_theme_override')) {
        const shouldLight = getAutoLight();
        if (shouldLight !== isLight) applyTheme(shouldLight);
      }
    }, 60000);
    document.querySelectorAll('.theme-toggle-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const next = !isLight;
        sessionStorage.setItem('dd_theme_override', next ? 'light' : 'dark');
        applyTheme(next);
      });
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
              assets[k].dayLow = q.dayLow;
              assets[k].dayHigh = q.dayHigh;
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

        const bearVal = d.price * 0.975;
        const baseVal = d.price * 1.003;
        const bullVal = d.price * 1.025;
        const bear = fmtPrice(bearVal, cur, dec);
        const base = fmtPrice(baseVal, cur, dec);
        const bull = fmtPrice(bullVal, cur, dec);
        const fmtExpPct = (t) => {
          const p = ((t - d.price) / d.price) * 100;
          return `Exp ${p >= 0 ? '+' : ''}${p.toFixed(2)}%`;
        };
        const dayRangeStr = d.dayLow && d.dayHigh ? `${fmtPrice(d.dayLow, cur, dec)} – ${fmtPrice(d.dayHigh, cur, dec)}` : `${fmtPrice(d.price * 0.99, cur, dec)} – ${fmtPrice(d.price * 1.01, cur, dec)}`;
        const w52RangeStr = d.w52Low && d.w52High ? `${fmtPrice(d.w52Low, cur, dec)} – ${fmtPrice(d.w52High, cur, dec)}` : `${fmtPrice(d.price * 0.78, cur, dec)} – ${fmtPrice(d.price * 1.12, cur, dec)}`;
        const fgScore = cardKey === 'crypto' && brief?.crypto?.fearGreed?.value ? brief.crypto.fearGreed.value : (d.fg || 52);
        const dial = renderDialSvg(fgScore);
        const volPct = parseFloat(String(d.vol1d || '').replace(/[^0-9.]/g, '')) || 1.1;
        const volState = volPct >= 1.8
          ? { label: 'HIGH', cls: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/35' }
          : volPct <= 0.95
            ? { label: 'LOW', cls: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/35' }
            : { label: 'FLAT', cls: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/35' };

        root.innerHTML = `
          <div class="space-y-6">
            <div class="space-y-4 pb-5 border-b divider-line">
              <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <span class="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">${CARD_META[cardKey].kicker}</span>
                  <h2 class="text-lg sm:text-xl font-bold txt-primary mt-0.5">${d.name}</h2>
                </div>
                <div class="relative w-full md:w-72" id="standalone-search-wrap">
                  <form id="standalone-search-form" class="flex items-center">
                    <span class="absolute left-3 txt-muted pointer-events-none">🔍</span>
                    <input id="standalone-search-input" type="text" autocomplete="off" placeholder="Search ticker (${keys.slice(0, 3).join(', ')})..." class="w-full pl-9 pr-14 py-2 rounded-xl text-xs font-mono inner-panel txt-primary focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
                    <button type="submit" class="absolute right-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 cursor-pointer">GO</button>
                  </form>
                </div>
              </div>
              <div class="flex flex-wrap gap-1.5">
                ${keys.map((k) => `<button type="button" data-tk="${k}" class="ticker-chip ${k === currentTicker ? 'active' : ''} px-3 py-1.5 rounded-lg text-xs font-mono cursor-pointer">${k}</button>`).join('')}
              </div>
            </div>

            <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
              <div class="flex flex-wrap items-baseline gap-3">
                <span class="text-3xl sm:text-4xl font-bold font-mono tracking-tight txt-primary tabular-nums">${fmtPrice(d.price, cur, dec)}</span>
                <span class="px-2.5 py-1 rounded-lg text-sm font-mono font-bold tabular-nums border ${isPos ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30' : 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30'}">${changeText}</span>
                <span class="px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase border ${reg.cls}">${reg.label}</span>
              </div>
              <div class="flex flex-wrap items-center gap-4 text-xs font-mono txt-muted tabular-nums">
                <span>Day: <strong class="txt-primary">${dayRangeStr}</strong></span>
                <span>52W: <strong class="txt-primary">${w52RangeStr}</strong></span>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
              <div class="lg:col-span-4 p-4 rounded-xl inner-panel flex flex-col items-center justify-between text-center">
                <div class="w-full flex items-center justify-between text-[11px] font-mono">
                  <span class="uppercase tracking-wider txt-muted font-semibold">Market Sentiment</span>
                  <span class="font-bold txt-primary">${dial.label}</span>
                </div>
                ${dial.svg}
              </div>
              <div class="lg:col-span-4 p-4 rounded-xl inner-panel flex flex-col justify-between gap-2">
                <div class="flex items-center justify-between text-[11px] font-mono">
                  <span class="uppercase tracking-wider txt-muted font-semibold">Expected Vol</span>
                  <div class="flex items-center gap-1">
                    <span class="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase border ${volState.cls}">${volState.label}</span>
                    <span class="px-1.5 py-0.5 rounded font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">${d.iv || 'IV 20.0'}</span>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-2 font-mono tabular-nums">
                  <div class="p-2.5 rounded-lg terminal-card">
                    <div class="text-[10px] uppercase txt-muted">1-Day (1σ)</div>
                    <div class="text-base font-bold txt-primary mt-0.5">${d.vol1d || '±1.10%'}</div>
                  </div>
                  <div class="p-2.5 rounded-lg terminal-card">
                    <div class="text-[10px] uppercase txt-muted">1-Week (1σ)</div>
                    <div class="text-base font-bold txt-primary mt-0.5">${d.vol1w || '±2.75%'}</div>
                  </div>
                </div>
                <div class="text-[11px] font-mono txt-muted flex items-center justify-between">
                  <span>Next Band:</span>
                  <strong class="text-amber-700 dark:text-amber-300 tabular-nums">${bandStr}</strong>
                </div>
              </div>
              <div class="lg:col-span-4 grid grid-cols-1 gap-2 font-mono tabular-nums">
                <div class="px-3.5 py-2.5 rounded-xl bg-rose-500/15 border border-rose-500/35 flex items-center justify-between gap-2">
                  <div class="flex items-center gap-2"><span class="text-xs text-rose-700 dark:text-rose-400 font-bold uppercase">▼ Loss</span><span class="text-[11px] text-rose-700/80 dark:text-rose-300/80">${fmtExpPct(bearVal)}</span></div>
                  <span class="text-base sm:text-lg font-bold text-rose-800 dark:text-rose-300">${bear}</span>
                </div>
                <div class="px-3.5 py-2.5 rounded-xl bg-amber-500/15 border border-amber-500/35 flex items-center justify-between gap-2">
                  <div class="flex items-center gap-2"><span class="text-xs text-amber-700 dark:text-amber-400 font-bold uppercase">◆ Base</span><span class="text-[11px] text-amber-700/80 dark:text-amber-300/80">${fmtExpPct(baseVal)}</span></div>
                  <span class="text-base sm:text-lg font-bold text-amber-800 dark:text-amber-300">${base}</span>
                </div>
                <div class="px-3.5 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/35 flex items-center justify-between gap-2">
                  <div class="flex items-center gap-2"><span class="text-xs text-emerald-700 dark:text-emerald-400 font-bold uppercase">▲ Bull</span><span class="text-[11px] text-emerald-700/80 dark:text-emerald-300/80">${fmtExpPct(bullVal)}</span></div>
                  <span class="text-base sm:text-lg font-bold text-emerald-800 dark:text-emerald-300">${bull}</span>
                </div>
              </div>
            </div>

            <div class="pt-4 border-t divider-line space-y-2.5">
              <div class="text-xs font-mono uppercase tracking-wider txt-muted font-bold">Key Market Drivers</div>
              <ul class="grid grid-cols-1 md:grid-cols-3 gap-3">
                ${(d.drivers || []).map((drv, idx) => {
                  const hdr = DRIVER_HEADERS[idx % DRIVER_HEADERS.length];
                  return `
                    <li class="p-4 rounded-xl inner-panel space-y-2">
                      <div class="flex items-center justify-between gap-2">
                        <span class="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase border ${hdr.cls}">${hdr.label}</span>
                        <span class="text-[10px] font-mono txt-muted">0${idx + 1}</span>
                      </div>
                      <p class="text-sm txt-secondary leading-relaxed">${drv}</p>
                    </li>
                  `;
                }).join('')}
              </ul>
            </div>

            ${getTradingViewSymbol(cardKey, currentTicker) ? `
            <div class="rounded-xl inner-panel overflow-hidden">
              <div class="px-4 py-2.5 border-b divider-line flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <div class="flex items-center gap-2">
                  <span class="font-bold txt-primary">${d.symbol}</span>
                  <span id="card-chart-ohlc" class="txt-muted hidden sm:inline">TradingView Live Terminal</span>
                </div>
                <div class="flex items-center gap-1">
                  ${['1W', '1M', '3M', '1Y'].map((tf) => `<button type="button" data-tf="${tf}" class="seg-btn ${tf === activeTf ? 'active' : ''} px-2.5 py-1 rounded-md cursor-pointer">${tf}</button>`).join('')}
                </div>
              </div>
              <div id="card-chart-container" class="w-full h-[380px] sm:h-[420px]"></div>
            </div>
            ` : ''}
          </div>
        `;

        document.getElementById('standalone-search-form')?.addEventListener('submit', (e) => {
          e.preventDefault();
          const val = document.getElementById('standalone-search-input')?.value.trim().toUpperCase();
          if (val && assets[val]) { currentTicker = val; renderCurrent(); }
        });
        root.querySelectorAll('[data-tk]').forEach((b) => {
          b.addEventListener('click', () => { currentTicker = b.getAttribute('data-tk'); renderCurrent(); });
        });
        root.querySelectorAll('[data-tf]').forEach((b) => {
          b.addEventListener('click', () => { activeTf = b.getAttribute('data-tf'); renderCurrent(); });
        });
        if (getTradingViewSymbol(cardKey, currentTicker)) {
          renderChart('card-chart-container', 'card-chart-ohlc', d.symbol, d.price, d.candles, {
            bear: +(d.price * 0.975).toFixed(dec),
            base: +(d.price * 1.003).toFixed(dec),
            bull: +(d.price * 1.025).toFixed(dec)
          }, cardKey, currentTicker, true);
        }
      } else if (cardKey === 'astro') {
        const signObj = ASTRO_SIGNS.find((s) => s.key === currentSign) || ASTRO_SIGNS[1];
        const isVedic = currentSys === 'VEDIC';
        const fmtAstroShort = (offset) => {
          try {
            return new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short' }).format(new Date(Date.now() + offset * 86400000)).toUpperCase();
          } catch { return offset === 0 ? 'TODAY' : 'TOMORROW'; }
        };
        const todayShort = fmtAstroShort(0);
        const tomShort = fmtAstroShort(1);
        root.innerHTML = `
          <div class="space-y-6">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b divider-line pb-4">
              <div class="flex items-center gap-3.5">
                <div class="w-12 h-12 rounded-2xl inner-panel flex items-center justify-center text-2xl">${signObj.glyph}</div>
                <div>
                  <span class="text-xs font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-semibold">${isVedic ? 'VEDIC MOON (CHANDRA RASHI)' : 'WESTERN SUN SIGN'} • ${currentDay === 'TODAY' ? todayShort : tomShort}</span>
                  <h2 class="text-lg sm:text-xl font-bold txt-primary">${isVedic ? signObj.vedic : signObj.western}</h2>
                </div>
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <select id="standalone-astro-sign" class="px-3 py-2 rounded-xl text-xs font-mono inner-panel txt-primary cursor-pointer" style="color-scheme: ${isLight ? 'light' : 'dark'}">
                  ${ASTRO_SIGNS.map((s) => `<option value="${s.key}" ${s.key === currentSign ? 'selected' : ''}>${s.glyph} ${isVedic ? s.vedic : s.western}</option>`).join('')}
                </select>
                <div class="inline-flex rounded-xl pill-track p-1 text-xs font-mono">
                  <button type="button" data-sys="VEDIC" class="seg-btn ${currentSys === 'VEDIC' ? 'active' : ''} px-3 py-1 rounded-lg cursor-pointer">Vedic</button>
                  <button type="button" data-sys="WESTERN" class="seg-btn ${currentSys === 'WESTERN' ? 'active' : ''} px-3 py-1 rounded-lg cursor-pointer">Western</button>
                </div>
                <div class="inline-flex rounded-xl pill-track p-1 text-xs font-mono">
                  <button type="button" data-day="TODAY" class="seg-btn ${currentDay === 'TODAY' ? 'active' : ''} px-3 py-1 rounded-lg cursor-pointer">Today • ${todayShort}</button>
                  <button type="button" data-day="TOMORROW" class="seg-btn ${currentDay === 'TOMORROW' ? 'active' : ''} px-3 py-1 rounded-lg cursor-pointer">Tomorrow • ${tomShort}</button>
                </div>
              </div>
            </div>

            <div class="p-4 rounded-2xl inner-panel grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div><span class="block text-[11px] uppercase txt-muted">Planetary Ruler</span><strong class="txt-primary mt-0.5 block">${isVedic ? 'Shukra (Venus)' : 'Venus / Earth'}</strong></div>
              <div><span class="block text-[11px] uppercase txt-muted">Tithi / Phase</span><strong class="txt-primary mt-0.5 block">${currentDay === 'TODAY' ? 'Krishna Paksha' : 'Shukla Transit'}</strong></div>
              <div><span class="block text-[11px] uppercase txt-muted">Lucky Number</span><strong class="txt-primary mt-0.5 block">${currentDay === 'TODAY' ? '6' : '9'}</strong></div>
              <div><span class="block text-[11px] uppercase txt-muted">Lucky Color</span><strong class="txt-primary mt-0.5 block flex items-center gap-1.5"><span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500"></span>Emerald Green</strong></div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-5 rounded-2xl inner-panel space-y-2"><div class="flex items-center justify-between"><h3 class="font-bold txt-primary">Career &amp; Capital</h3><span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">FAVORABLE</span></div><p class="text-sm txt-secondary leading-relaxed">Prioritize disciplined execution, structured risk limits, and long-horizon compounding over impulsive trades.</p></div>
              <div class="p-5 rounded-2xl inner-panel space-y-2"><div class="flex items-center justify-between"><h3 class="font-bold txt-primary">Relationships &amp; Alignment</h3><span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">BALANCED</span></div><p class="text-sm txt-secondary leading-relaxed">Clear communication and patient listening resolve friction early; evening favors quiet reflection.</p></div>
              <div class="p-5 rounded-2xl inner-panel space-y-2"><div class="flex items-center justify-between"><h3 class="font-bold txt-primary">Health &amp; Focus</h3><span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">STEADY</span></div><p class="text-sm txt-secondary leading-relaxed">Ground your schedule with steady hydration, deep-work blocks, and reduced late-night screen exposure.</p></div>
              <div class="p-5 rounded-2xl inner-panel space-y-2"><div class="flex items-center justify-between"><h3 class="font-bold txt-primary">Key Window &amp; Caution</h3><span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30">WATCH</span></div><p class="text-sm txt-secondary leading-relaxed">Avoid over-leveraging during midday volatility; finalize commitments after double-checking details.</p></div>
            </div>
          </div>
        `;
        document.getElementById('standalone-astro-sign')?.addEventListener('change', (e) => { currentSign = e.target.value; renderCurrent(); });
        root.querySelectorAll('[data-sys]').forEach((b) => b.addEventListener('click', () => { currentSys = b.getAttribute('data-sys'); renderCurrent(); }));
        root.querySelectorAll('[data-day]').forEach((b) => b.addEventListener('click', () => { currentDay = b.getAttribute('data-day'); renderCurrent(); }));
      } else if (cardKey === 'news') {
        const allNews = Array.isArray(brief?.news) && brief.news.length ? brief.news : FALLBACK_NEWS;
        const items = currentNewsCat === 'ALL' ? allNews : allNews.filter((n) => n.cat === currentNewsCat);
        const catColors = {
          WORLD: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30',
          US: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30',
          INDIA: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
          STEM: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
        };
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
                    <span class="px-2 py-0.5 rounded-md font-bold border ${catColors[n.cat] || catColors.STEM}">${n.cat} &bull; ${n.tag}</span>
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
