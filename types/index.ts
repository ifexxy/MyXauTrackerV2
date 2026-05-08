export interface GoldPrice {
  price: number;
  open: number;
  high: number;
  low: number;
  bid: number;
  ask: number;
  ch: number;
  chp: number;
  source: string;
  updatedAt?: string;
  fallback?: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  phone?: string;
  createdAt: string;
  trialEndsAt?: string;
  subscriptionStatus: 'trial' | 'active' | 'cancelled' | 'expired';
  currentPeriodEnd?: string;
  manualAccess: boolean;
  manualAccessNote?: string;
  manualAccessExpiresAt?: string;
  lastPaymentAt?: string;
  lastPaymentAmount?: number;
  flutterwaveTxRef?: string;
  flutterwaveTxId?: string;
  role?: 'admin' | 'user';
}

export interface Post {
  id: string;
  title: string;
  body: string;
  imageUrl?: string;
  link?: string;
  category: string;
  readTime?: string;
  published: boolean;
  tags?: string[];
  createdAt: any;
  updatedAt?: any;
}

export interface ChatMessage {
  id: string;
  uid: string;
  username: string;
  photoURL?: string;
  text: string;
  createdAt: any;
}

export interface ChatProfile {
  uid: string;
  username: string;
  photoURL?: string;
  createdAt: any;
}

export interface Prediction {
  target: number;
  bandLow: number;
  bandHigh: number;
  conf: number;
  sigma: number;
}

export interface PredictionResult {
  atr: number;
  session: SessionInfo;
  mrStrength: number;
  effectiveDrift: number;
  f5m: Prediction;
  f10m: Prediction;
  f15m: Prediction;
  f1h: Prediction;
  f6h: Prediction;
  f24h: Prediction;
}

export interface SessionInfo {
  asian: boolean;
  london: boolean;
  ny: boolean;
  overlap: boolean;
  sessionMultiplier: number;
  sessionLabel: string;
  volLabel: string;
}

export interface AccessStatus {
  hasAccess: boolean;
  trialActive: boolean;
  subscriptionActive: boolean;
  manualActive: boolean;
  trialEndsAt?: Date;
  subscriptionEndsAt?: Date;
  manualEndsAt?: Date;
}
