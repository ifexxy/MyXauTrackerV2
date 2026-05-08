import type { Prediction, PredictionResult, SessionInfo } from '@/types';

export function getSessionInfo(): SessionInfo {
  const h = new Date().getUTCHours();
  const asian = h >= 0 && h < 8;
  const london = h >= 7 && h < 16;
  const ny = h >= 13 && h < 21;
  const overlap = london && ny;

  if (overlap) {
    return { asian, london, ny, overlap, sessionMultiplier: 1.35, sessionLabel: 'London + NY Overlap', volLabel: 'PEAK' };
  } else if (ny) {
    return { asian, london, ny, overlap, sessionMultiplier: 1.20, sessionLabel: 'New York', volLabel: 'HIGH' };
  } else if (london) {
    return { asian, london, ny, overlap, sessionMultiplier: 1.10, sessionLabel: 'London', volLabel: 'MEDIUM' };
  } else if (asian) {
    return { asian, london, ny, overlap, sessionMultiplier: 0.70, sessionLabel: 'Asian', volLabel: 'LOW' };
  } else {
    return { asian, london, ny, overlap, sessionMultiplier: 0.55, sessionLabel: 'Off-Hours', volLabel: 'MINIMAL' };
  }
}

export function estimateATR(high: number, low: number, price: number, chp: number): number {
  const intradayRange = high - low;
  const changeRange = Math.abs(chp / 100 * price) * 2;
  const rawATR = Math.max(intradayRange, changeRange);
  return Math.min(Math.max(rawATR, 10), 80);
}

export function buildPredictions(price: number, chp: number, high: number, low: number): PredictionResult {
  const atr = estimateATR(high, low, price, chp);
  const session = getSessionInfo();

  const dailyMomentumDollar = (chp / 100) * price;
  const hourlyDrift = dailyMomentumDollar / 24;
  const movePct = Math.abs(chp);
  const mrStrength = Math.min(movePct / 3.0, 0.80);
  const effectiveDrift = hourlyDrift * (1 - mrStrength * 0.6);

  function sigma(minutes: number): number {
    return atr * Math.sqrt(minutes / 1440) * session.sessionMultiplier;
  }

  function forecast(minutes: number): Prediction {
    const s = sigma(minutes);
    const driftFrac = minutes / 60;
    const drift = effectiveDrift * driftFrac;
    const noise = s * (Math.random() * 0.5 - 0.25);
    const target = parseFloat((price + drift + noise).toFixed(2));
    const bandLow = parseFloat((target - s).toFixed(2));
    const bandHigh = parseFloat((target + s).toFixed(2));
    const baseConf = Math.max(30, 96 - (minutes / 1440) * 55);
    const volPenalty = Math.min((atr - 20) / 2, 15);
    const conf = Math.round(Math.max(28, baseConf - volPenalty));
    return { target, bandLow, bandHigh, conf, sigma: s };
  }

  return {
    atr,
    session,
    mrStrength,
    effectiveDrift,
    f5m: forecast(5),
    f10m: forecast(10),
    f15m: forecast(15),
    f1h: forecast(60),
    f6h: forecast(360),
    f24h: forecast(1440),
  };
}

export function computeKeyLevels(high: number, low: number, price: number) {
  const pivot = (high + low + price) / 3;
  return {
    r2: pivot + (high - low),
    r1: 2 * pivot - low,
    current: price,
    s1: 2 * pivot - high,
    s2: pivot - (high - low),
  };
}

export function computeSignals(chp: number, ch: number) {
  const isUp = ch >= 0;
  const extendedMove = Math.abs(chp) > 1.5;
  const rng = 0.3 + Math.random() * 0.4;

  let buy: number, hold: number, sell: number;

  if (extendedMove) {
    if (isUp) { buy = Math.round(30 + rng * 15); sell = Math.round(20 + rng * 15); }
    else { sell = Math.round(30 + rng * 15); buy = Math.round(20 + rng * 15); }
    hold = 100 - buy! - sell!;
  } else {
    if (isUp) { buy = Math.round(45 + rng * 20); hold = Math.round((100 - buy) * 0.55); sell = 100 - buy - hold; }
    else { sell = Math.round(45 + rng * 20); hold = Math.round((100 - sell) * 0.55); buy = 100 - sell - hold; }
  }

  buy = Math.max(buy!, 5);
  sell = Math.max(sell!, 5);
  hold = Math.max(100 - buy - sell, 5);

  const score = buy - sell;
  let emoji: string, label: string;

  if (score > 25) { emoji = '🟢'; label = 'BULLISH'; }
  else if (score > 10) { emoji = '🔼'; label = 'MILDLY BULLISH'; }
  else if (score > -10) { emoji = '⚖️'; label = 'NEUTRAL'; }
  else if (score > -25) { emoji = '🔽'; label = 'MILDLY BEARISH'; }
  else { emoji = '🔴'; label = 'BEARISH'; }

  return { buy, hold, sell, emoji, label };
}
