/**
 * Basit paylaşımlı şifre + imzalı oturum çerezi.
 *
 * Web Crypto API (crypto.subtle) kullanılıyor çünkü hem middleware
 * (Edge runtime) hem de API route'lar (Node runtime) içinde çalışması
 * gerekiyor — Node'un `crypto` modülü Edge runtime'da yok.
 */

export const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 gün

function getPassword(): string {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) throw new Error("ADMIN_PASSWORD ortam değişkeni tanımlı değil.");
  return password;
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmac(message: string, key: string): Promise<string> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(message));
  return toHex(signature);
}

function timingSafeStringEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export function verifyPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return timingSafeStringEqual(candidate, expected);
}

/** "<timestamp>.<hmac>" biçiminde imzalı bir oturum çerezi değeri üretir. */
export async function createSessionValue(): Promise<string> {
  const issuedAt = Date.now().toString();
  return `${issuedAt}.${await hmac(issuedAt, getPassword())}`;
}

export async function isSessionValid(value: string | undefined): Promise<boolean> {
  if (!value) return false;
  const [issuedAt, signature] = value.split(".");
  if (!issuedAt || !signature) return false;
  let expected: string;
  try {
    expected = await hmac(issuedAt, getPassword());
  } catch {
    return false;
  }
  if (!timingSafeStringEqual(signature, expected)) return false;
  const age = Date.now() - Number(issuedAt);
  return age >= 0 && age <= SESSION_MAX_AGE_MS;
}
