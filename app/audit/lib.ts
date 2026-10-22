export type Tx = { date: Date; label: string; amount: number };
export type Sub = {
  key: string;
  name: string;
  raw: string;
  amount: number;
  period: "mois" | "an" | "estimé";
  annual: number;
  count: number;
  sure: boolean;
};

export async function readText(f: File): Promise<string> {
  const buf = await f.arrayBuffer();
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(buf);
  } catch {
    return new TextDecoder("windows-1252").decode(buf);
  }
}

function splitCsv(text: string): string[][] {
  const clean = text.replace(/^\uFEFF/, "");
  const lines = clean.split(/\r?\n/).filter((l) => l.trim());
  const sample = lines.slice(0, 15).join("\n");
  const count = (c: string) => sample.split(c).length - 1;
  const delim = [";", "\t", ","].sort((a, b) => count(b) - count(a))[0];
  return lines.map((line) => {
    const out: string[] = [];
    let cur = "";
    let q = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (q && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else q = !q;
      } else if (ch === delim && !q) {
        out.push(cur.trim());
        cur = "";
      } else cur += ch;
    }
    out.push(cur.trim());
    return out;
  });
}

export function parseNumber(s: string): number | null {
  let t = (s ?? "").replace(/[\u00a0\s€$]/g, "");
  if (!t || !/\d/.test(t)) return null;
  if (t.includes(",") && t.includes(".")) {
    t =
      t.lastIndexOf(",") > t.lastIndexOf(".")
        ? t.replace(/\./g, "").replace(",", ".")
        : t.replace(/,/g, "");
  } else if (t.includes(",")) t = t.replace(",", ".");
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function parseDate(s: string): Date | null {
  const t = (s ?? "").trim();
  let m = t.match(/^(\d{4})-(\d{2})-(\d{2})/);
  let y: number, mo: number, d: number;
  if (m) {
    y = +m[1];
    mo = +m[2];
    d = +m[3];
  } else {
    m = t.match(/^(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{2,4})/);
    if (!m) return null;
    d = +m[1];
    mo = +m[2];
    y = +m[3];
    if (y < 100) y += 2000;
  }
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  return new Date(Date.UTC(y, mo - 1, d));
}

export function parseStatement(text: string): Tx[] {
  const rows = splitCsv(text);
  const h = rows.findIndex(
    (r) =>
      r.some((c) => /date/i.test(c)) &&
      r.some((c) => /libell|label|descr|intitul|d[ée]tail|op[ée]ration|montant|amount|d[ée]bit/i.test(c))
  );
  let iDate = -1, iLabel = -1, iAmt = -1, iDeb = -1, iCred = -1;
  if (h >= 0) {
    rows[h].forEach((c, i) => {
      const x = c.toLowerCase();
      if (iDate < 0 && /date/.test(x) && !/valeur/.test(x)) iDate = i;
      else if (/date/.test(x)) return;
      else if (iLabel < 0 && /libell|label|descr|intitul|d[ée]tail|op[ée]ration|objet/.test(x)) iLabel = i;
      else if (/d[ée]bit/.test(x)) iDeb = i;
      else if (/cr[ée]dit/.test(x)) iCred = i;
      else if (iAmt < 0 && /montant|amount|somme/.test(x)) iAmt = i;
    });
  }
  const data = rows.slice(h >= 0 ? h + 1 : 0);
  if (iDate < 0 || (iAmt < 0 && iDeb < 0) || iLabel < 0) {
    const width = Math.max(...data.map((r) => r.length), 0);
    const ratio = (i: number, fn: (s: string) => unknown) =>
      data.filter((r) => fn(r[i] ?? "")).length / Math.max(data.length, 1);
    const cols = Array.from({ length: width }, (_, i) => i);
    if (iDate < 0) iDate = cols.sort((a, b) => ratio(b, parseDate) - ratio(a, parseDate))[0] ?? -1;
    if (iAmt < 0 && iDeb < 0) {
      iAmt =
        cols
          .filter((i) => i !== iDate)
          .sort((a, b) => ratio(b, parseNumber) - ratio(a, parseNumber))[0] ?? -1;
    }
    if (iLabel < 0) {
      const avg = (i: number) =>
        data.reduce((n, r) => n + ((r[i] ?? "").match(/[a-zA-Z]/g)?.length ?? 0), 0);
      iLabel =
        cols
          .filter((i) => i !== iDate && i !== iAmt && i !== iDeb && i !== iCred)
          .sort((a, b) => avg(b) - avg(a))[0] ?? -1;
    }
  }
  if (iDate < 0 || iLabel < 0 || (iAmt < 0 && iDeb < 0)) return [];
  const tx: Tx[] = [];
  for (const r of data) {
    const date = parseDate(r[iDate] ?? "");
    const label = (r[iLabel] ?? "").trim();
    if (!date || !label) continue;
    let amount: number | null;
    if (iAmt >= 0) amount = parseNumber(r[iAmt] ?? "");
    else {
      const d = parseNumber(r[iDeb] ?? "") ?? 0;
      const c = iCred >= 0 ? parseNumber(r[iCred] ?? "") ?? 0 : 0;
      amount = d === 0 && c === 0 ? null : c - Math.abs(d);
    }
    if (amount === null || amount === 0) continue;
    tx.push({ date, label, amount });
  }
  // Certaines banques exportent les dépenses en positif.
  if (iAmt >= 0 && tx.length && !tx.some((t) => t.amount < 0)) {
    tx.forEach((t) => (t.amount = -t.amount));
  }
  return tx;
}

const BRUIT =
  /\b(PRLV|PRELEVEMENT|SEPA|PAIEMENT|PMT|CB|CARTE|FACTURE|FACT|VIR|VIREMENT|ACHAT|ECHEANCE|REF|MANDAT|DU|DE|LE|LA|PAR|SUR|PAYMENT|DEBIT|DIRECT|PRELEV|ABONNEMENT|ABO|COTISATION)\b/g;

export function normalize(label: string): string {
  return label
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z ]/g, " ")
    .replace(BRUIT, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1)
    .slice(0, 3)
    .join(" ");
}

const CONNUS = [
  "NETFLIX", "SPOTIFY", "DISNEY", "PRIME VIDEO", "AMAZON PRIME", "CANAL", "DEEZER", "APPLE", "ICLOUD",
  "YOUTUBE", "ADOBE", "MICROSOFT", "DROPBOX", "GOOGLE ONE", "BASIC FIT", "BASICFIT", "FITNESS",
  "CRUNCHYROLL", "AUDIBLE", "OPENAI", "CHATGPT", "NORDVPN", "LINKEDIN", "TINDER", "MYCANAL",
  "PARAMOUNT", "DAZN", "TWITCH", "PLAYSTATION", "XBOX", "NINTENDO", "STRAVA", "DUOLINGO",
];

const COMMERCES = [
  "CARREFOUR", "LECLERC", "AUCHAN", "LIDL", "INTERMARCHE", "MONOPRIX", "FRANPRIX", "ALDI", "CASINO",
  "BOULANGERIE", "TOTAL", "ESSO", "SNCF", "UBER", "MCDO", "MCDONALD", "PHARMACIE", "TABAC",
  "RESTAURANT", "DECATHLON", "RETRAIT", "DAB", "PAYPAL", "LYDIA",
];

const median = (a: number[]) => {
  const s = [...a].sort((x, y) => x - y);
  return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2;
};

const titre = (s: string) =>
  s.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());

export function detect(tx: Tx[]): Sub[] {
  const groups = new Map<string, Tx[]>();
  for (const t of tx) {
    if (t.amount >= 0) continue;
    const key = normalize(t.label);
    if (!key) continue;
    groups.set(key, [...(groups.get(key) ?? []), t]);
  }
  const subs: Sub[] = [];
  for (const [key, list] of groups) {
    list.sort((a, b) => a.date.getTime() - b.date.getTime());
    const amounts = list.map((t) => Math.abs(t.amount));
    const med = median(amounts);
    const connu = CONNUS.some((k) => key.includes(k));
    if (!connu && COMMERCES.some((k) => key.includes(k))) continue;
    const tol = connu ? 0.25 : 0.05;
    const close = list.filter((t) => Math.abs(Math.abs(t.amount) - med) <= med * tol);
    const raw = list[list.length - 1].label.slice(0, 60);
    let found = false;
    if (close.length >= 2) {
      const gaps = close
        .slice(1)
        .map((t, i) => (t.date.getTime() - close[i].date.getTime()) / 86400000);
      const gap = median(gaps);
      if (gap >= 24 && gap <= 38) {
        const m = median(close.map((t) => Math.abs(t.amount)));
        subs.push({ key, name: titre(key), raw, amount: m, period: "mois", annual: m * 12, count: close.length, sure: true });
        found = true;
      } else if (gap >= 350 && gap <= 380) {
        const m = median(close.map((t) => Math.abs(t.amount)));
        subs.push({ key, name: titre(key), raw, amount: m, period: "an", annual: m, count: close.length, sure: true });
        found = true;
      }
    }
    if (!found && connu) {
      subs.push({ key, name: titre(key), raw, amount: med, period: "estimé", annual: med * 12, count: list.length, sure: false });
    }
  }
  return subs.sort((a, b) => b.annual - a.annual);
}

export function letter(sub: Sub, who: string, address: string): string {
  const date = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  return `${who || "[Prénom et nom]"}
${address || "[Adresse postale]"}

${sub.name}
Service résiliation

Fait le ${date}

Objet : résiliation de mon abonnement

Madame, Monsieur,

Je vous informe par la présente de ma décision de résilier mon abonnement auprès de votre service (prélèvements de ${sub.amount.toFixed(2).replace(".", ",")} € ${sub.period === "an" ? "par an" : "par mois"}, libellé bancaire : « ${sub.raw} »).

Cette résiliation prend effet à la réception de ce courrier ou, à défaut, à la prochaine échéance contractuelle. Je vous demande de ne plus procéder à aucun prélèvement à compter de cette date.

Merci de me confirmer la résiliation par écrit ou par e-mail, avec la date de fin effective, ainsi que de supprimer mes données personnelles qui ne sont plus nécessaires.

Numéro de client ou de contrat : [à compléter]

Je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées.

${who || "[Prénom et nom]"}`;
}