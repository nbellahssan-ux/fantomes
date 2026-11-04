import { NextResponse, type NextRequest } from "next/server";
import { COOKIE, tokenValide } from "./app/acces/token";

// Avant d'afficher /audit, on vérifie que le visiteur a payé (cookie signé).
// En local (npm run dev), l'audit reste libre pour pouvoir travailler.
export function proxy(req: NextRequest) {
  if (process.env.NODE_ENV !== "production") return NextResponse.next();
  if (tokenValide(req.cookies.get(COOKIE)?.value)) return NextResponse.next();
  return NextResponse.redirect(new URL("/acces", req.url));
}

export const config = {
  matcher: ["/audit/:path*"],
};
