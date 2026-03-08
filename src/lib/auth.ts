// Auth & Trial system (localStorage-based for static site)

export interface User {
  email: string;
  name: string;
  createdAt: string;
}

const STORAGE_KEYS = {
  user: "fitflow:auth:user",
  firstVisit: "fitflow:auth:firstVisit",
};

const TRIAL_DAYS = 7;

// --- First visit tracking ---
export function getFirstVisit(): string {
  if (typeof window === "undefined") return new Date().toISOString();
  const saved = localStorage.getItem(STORAGE_KEYS.firstVisit);
  if (saved) return saved;
  const now = new Date().toISOString();
  localStorage.setItem(STORAGE_KEYS.firstVisit, now);
  return now;
}

export function getTrialDaysLeft(): number {
  const first = new Date(getFirstVisit());
  const now = new Date();
  const elapsed = Math.floor((now.getTime() - first.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, TRIAL_DAYS - elapsed);
}

export function isTrialExpired(): boolean {
  return getTrialDaysLeft() <= 0;
}

// --- User auth (localStorage) ---
export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.user);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function signup(email: string, name: string, password: string): { ok: boolean; error?: string } {
  if (!email || !email.includes("@")) return { ok: false, error: "유효한 이메일을 입력하세요." };
  if (!name || name.length < 1) return { ok: false, error: "이름을 입력하세요." };
  if (!password || password.length < 4) return { ok: false, error: "비밀번호는 4자 이상이어야 합니다." };

  // Check if already registered
  const accounts = getAccounts();
  if (accounts[email]) return { ok: false, error: "이미 가입된 이메일입니다." };

  // Save account
  accounts[email] = { name, passwordHash: simpleHash(password), createdAt: new Date().toISOString() };
  localStorage.setItem("fitflow:auth:accounts", JSON.stringify(accounts));

  // Auto-login
  const user: User = { email, name, createdAt: accounts[email].createdAt };
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));

  return { ok: true };
}

export function login(email: string, password: string): { ok: boolean; error?: string } {
  const accounts = getAccounts();
  const account = accounts[email];
  if (!account) return { ok: false, error: "등록되지 않은 이메일입니다." };
  if (account.passwordHash !== simpleHash(password)) return { ok: false, error: "비밀번호가 일치하지 않습니다." };

  const user: User = { email, name: account.name, createdAt: account.createdAt };
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  return { ok: true };
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEYS.user);
}

export function isLoggedIn(): boolean {
  return getUser() !== null;
}

// Need access? Either logged in or trial still valid
export function hasAccess(): boolean {
  return isLoggedIn() || !isTrialExpired();
}

// --- Helpers ---
function getAccounts(): Record<string, { name: string; passwordHash: string; createdAt: string }> {
  try {
    return JSON.parse(localStorage.getItem("fitflow:auth:accounts") || "{}");
  } catch {
    return {};
  }
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return "h_" + Math.abs(hash).toString(36);
}
