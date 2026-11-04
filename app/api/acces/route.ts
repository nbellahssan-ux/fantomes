import { NextResponse, type NextRequest } from "next/server";
import { COOKIE, creerToken } from "../../acces/token";

// Stripe renvoie le client ici après le paiement, avec ?session_id=cs_...
// On vérifie auprès de Stripe que le paiement est bien réglé, puis on donne un accès.
export async function GET(req: NextRequest) {
  const refus = NextResponse.redirect(new URL("/acces/erreur", req.url));
  const id = req.nextUrl.searchParams.get("session_id") ?? "";
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || !/^cs_(test|live)_[A-Za-z0-9]+$/.test(id)) return refus;

  try {
    const r = await fetch(`https://api.stripe.com/v1/checkout/sessions/${id}`, {
      headers: { Authorization: `Bearer ${key}` },
      cache: "no-store",
    });
    if (!r.ok) return refus;
    const s = await r.json();
    if (s.payment_status !== "paid") return refus;
  } catch {
    return refus;
  }

  const res = NextResponse.redirect(new URL("/merci", req.url));
  res.cookies.set(COOKIE, creerToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
