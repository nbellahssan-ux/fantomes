import type { Tx } from "./lib";

type Item = { str: string; x: number; w: number };
export type Line = { items: Item[]; text: string };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function extractLines(pdfjs: any, data: ArrayBuffer) {
  const doc = await pdfjs.getDocument({ data: new Uint8Array(data) }).promise;
  const lines: Line[] = [];
  let chars = 0;
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();
    const rows: { y: number; items: Item[] }[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const it of content.items as any[]) {
      if (!it.str || !it.str.trim()) continue;
      chars += it.str.length;
      const x = it.transform[4] as number;
      const y = it.transform[5] as number;
      let row = rows.find((r) => Math.abs(r.y - y) < 3);
      if (!row) {
        row = { y, items: [] };
        rows.push(row);
      }
      row.items.push({ str: it.str, x, w: it.width as number });
    }
    rows.sort((a, b) => b.y - a.y);
    for (const r of rows) {
      r.items.sort((a, b) => a.x - b.x);
      while (r.items.length > 1 && /^[^A-Za-z0-9\u00C0-\u00FF]{1,3}$/.test(r.items[r.items.length - 1].str.trim())) r.items.pop();
      lines.push({ items: r.items, text: r.items.map((i) => i.str.trim()).join(" ").replace(/\s+/g, " ") });
    }
  }
  return { lines, chars };
}

const DATE_START = /^(\d{1,2})[/.](\d{1,2})(?:[/.](\d{2,4}))?\s+/;
const AMOUNT_END = /(?:^|\s)([+-]?\s?\d{1,3}(?:[ .\u00a0]\d{3})*,\d{2})\s*(?:€|EUR)?\s*$/;
const IGNORE = /SOLDE|TOTAL|REPORT|ANCIEN|NOUVEAU|PAGE\s+\d/i;
const CREDIT_WORDS =
  /\b(SALAIRE|PAIE|REMISE|REMBT|REMBOURSEMENT|AVOIR|VERSEMENT|VIR(?:EMENT)?\s+(?:SEPA\s+|INST\s+)?(?:RECU|DE\b|INST))/i;

function toNumber(s: string): number {
  const t = s.replace(/[+\-\s\u00a0]/g, "").replace(/\.(?=\d{3})/g, "").replace(",", ".");
  return Number(t);
}

export function linesToTx(lines: Line[]): Tx[] {
  // Année du relevé, utile quand les dates sont écrites « 05/09 ».
  let year = new Date().getFullYear();
  for (const l of lines) {
    const m = l.text.match(/\b(20\d{2})\b/);
    if (m) {
      year = +m[1];
      break;
    }
  }
  // Colonnes « Débit » / « Crédit » quand le relevé en a.
  let debitX: number | null = null;
  let creditX: number | null = null;
  for (const l of lines) {
    const d = l.items.find((i) => /^d[ée]bit/i.test(i.str.trim()));
    const c = l.items.find((i) => /^cr[ée]dit/i.test(i.str.trim()));
    if (d && c) {
      debitX = d.x + d.w / 2;
      creditX = c.x + c.w / 2;
      break;
    }
  }
  const hasMinus = lines.some((l) => {
    const m = l.text.match(AMOUNT_END);
    return !!m && /^\s?-/.test(m[1]) && DATE_START.test(l.text);
  });

  const tx: Tx[] = [];
  for (const l of lines) {
    const d = l.text.match(DATE_START);
    if (!d) continue;
    const a = l.text.match(AMOUNT_END);
    if (!a) continue;
    let y = d[3] ? +d[3] : year;
    if (y < 100) y += 2000;
    const mo = +d[2];
    const day = +d[1];
    if (mo < 1 || mo > 12 || day < 1 || day > 31) continue;

    let label = l.text.slice(d[0].length, l.text.length - a[0].length).trim();
    label = label.replace(/^\d{1,2}[/.]\d{1,2}(?:[/.]\d{2,4})?\s+/, "").trim();
    if (label.length < 3 || IGNORE.test(label)) continue;

    const abs = Math.abs(toNumber(a[1]));
    if (!abs) continue;
    const raw = a[1].trim();
    let credit: boolean;
    if (raw.startsWith("-")) credit = false;
    else if (raw.startsWith("+")) credit = true;
    else if (debitX !== null && creditX !== null) {
      const last = l.items[l.items.length - 1];
      const cx = last.x + last.w / 2;
      credit = Math.abs(cx - creditX) < Math.abs(cx - debitX);
    } else if (hasMinus) credit = true;
    else credit = CREDIT_WORDS.test(label);

    tx.push({ date: new Date(Date.UTC(y, mo - 1, day)), label, amount: credit ? abs : -abs });
  }
  return tx;
}

export async function readPdf(file: File): Promise<Tx[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfjs: any = await import("pdfjs-dist/legacy/build/pdf.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();
  const { lines, chars } = await extractLines(pdfjs, await file.arrayBuffer());
  if (chars < 50) throw new Error("PDF_IMAGE");
  const tx = linesToTx(lines);
  const datees = lines.filter((l) => DATE_START.test(l.text));
  console.log("DIAG_PDF", {
    lignes: lines.length,
    lignesAvecDate: datees.length,
    operationsLues: tx.length,
    nonLues: datees.filter((l) => !AMOUNT_END.test(l.text)).slice(0, 15).map((l) => l.text),
    echantillonPage2: lines.slice(70, 110).map((l) => l.text),
  });
  return tx;
}