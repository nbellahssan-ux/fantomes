import { ImageResponse } from "next/og";

export const alt = "Fantômes : débusque les abonnements que tu paies sans t'en servir";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#1b1a17",
          color: "#faf6ea",
          padding: 80,
        }}
      >
        <div style={{ fontSize: 36, letterSpacing: 8, color: "#f2d43d" }}>
          FANTÔMES
        </div>
        <div style={{ fontSize: 88, fontWeight: 800, lineHeight: 1.05 }}>
          Tu paies peut-être 300 € par an pour rien.
        </div>
        <div style={{ fontSize: 36 }}>Audit complet : 19 €</div>
      </div>
    ),
    size
  );
}