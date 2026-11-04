import { createHmac, timingSafeEqual } from "node:crypto";

export const COOKIE = "fantomes_acces";
const DUREE_MS = 30 * 24 * 60 * 60 * 1000; // 30 jours

function signer(exp: string): string {
  const secret = process.env.ACCESS_SECRET ?? "";
  return createHmac("sha256", secret).update(exp).digest("hex");
}

export function creerToken(): string {
  const exp = String(Date.now() + DUREE_MS);
  return `${exp}.${signer(exp)}`;
}

export function tokenValide(token?: string): boolean {
  if (!process.env.ACCESS_SECRET || !token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || !(Number(exp) > Date.now())) return false;
  const a = Buffer.from(sig);
  const b = Buffer.from(signer(exp));
  return a.length === b.length && timingSafeEqual(a, b);
}
