"use client";

import { useMemo, useState } from "react";
import { detect, letter, parseStatement, readText, type Sub } from "./lib";

const eur = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);

const BOUTON =
  "rounded-full bg-[#f2d43d] px-6 py-3 text-center font-bold text-[#1b1a17] shadow-[0_4px_0_#1b1a17] active:translate-y-0.5 active:shadow-none";

export default function Audit() {
  const [subs, setSubs] = useState<Sub[] | null>(null);
  const [error, setError] = useState("");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState<string | null>(null);
  const [who, setWho] = useState("");
  const [address, setAddress] = useState("");
  const [copied, setCopied] = useState(false);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setError("");
    setSubs(null);
    setChecked({});
    setOpen(null);
    if (f.size > 5_000_000) {
      setError("Ce fichier est trop gros. Exporte seulement les 3 derniers mois.");
      return;
    }
    try {
      const tx = parseStatement(await readText(f));
      if (tx.length === 0) {
        setError(
          "Je n'ai pas réussi à lire ce fichier. Vérifie que c'est bien un export CSV avec une date, un libellé et un montant."
        );
        return;
      }
      setSubs(detect(tx));
    } catch {
      setError("Impossible d'ouvrir ce fichier. Essaie un autre export CSV.");
    }
  }

  const total = useMemo(() => (subs ?? []).reduce((n, s) => n + s.annual, 0), [subs]);
  const saved = useMemo(
    () => (subs ?? []).filter((s) => checked[s.key]).reduce((n, s) => n + s.annual, 0),
    [subs, checked]
  );

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* l'utilisateur peut copier à la main */
    }
  }

  return (
    <main className="mx-auto max-w-xl px-5 pb-16 pt-10">
      <p className="text-sm font-bold uppercase tracking-widest">Fantômes</p>
      <h1 className="titre mt-6 text-3xl leading-tight">Ton audit d&apos;abonnements</h1>

      {subs === null && (
        <section className="mt-6">
          <p className="text-lg leading-relaxed">
            Dépose ton relevé bancaire (CSV). Il est analysé sur ton appareil :{" "}
            <strong>il n&apos;est jamais envoyé ni enregistré.</strong>
          </p>

          <label className={`${BOUTON} mt-6 block cursor-pointer text-lg`}>
            Choisir mon fichier CSV
            <input type="file" accept=".csv,.txt,text/csv" onChange={onFile} className="sr-only" />
          </label>

          {error && (
            <p role="alert" className="mt-4 rounded-lg border-l-4 border-[#1b1a17] bg-[#f2d43d]/30 p-3">
              {error}
            </p>
          )}

          <details className="mt-8">
            <summary className="cursor-pointer font-bold">Où trouver mon fichier ?</summary>
            <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed">
              <li>Connecte-toi à ta banque en ligne, sur ordinateur (c&apos;est plus simple).</li>
              <li>Ouvre ton compte courant, rubrique « Opérations » ou « Relevés ».</li>
              <li>Cherche « Exporter » ou « Télécharger », puis choisis le format CSV.</li>
              <li>Prends au moins 2 à 3 mois : un abonnement se repère quand il revient.</li>
            </ol>
          </details>

          <p className="mt-6 text-sm opacity-70">
            Pour essayer sans ton vrai relevé :{" "}
            <a href="/exemple.csv" download className="underline">
              télécharger un fichier d&apos;exemple
            </a>
            .
          </p>
        </section>
      )}

      {subs !== null && subs.length === 0 && (
        <section className="mt-6">
          <p className="text-lg leading-relaxed">
            Aucun prélèvement régulier repéré. Essaie avec 2 à 3 mois de relevé : un abonnement ne se voit
            que lorsqu&apos;il revient.
          </p>
          <button onClick={() => setSubs(null)} className={`${BOUTON} mt-6`}>
            Réessayer avec un autre fichier
          </button>
        </section>
      )}

      {subs !== null && subs.length > 0 && (
        <section className="mt-6">
          <div className="rounded-2xl bg-[#1b1a17] p-5 text-[#faf6ea]">
            <p className="text-sm uppercase tracking-widest text-[#f2d43d]">Repéré par an</p>
            <p className="titre mt-1 text-4xl">{eur(total)}</p>
            <p className="mt-4 text-sm uppercase tracking-widest text-[#f2d43d]">
              Tu économises si tu résilies les cochés
            </p>
            <p className="titre mt-1 text-3xl">{eur(saved)}</p>
          </div>

          <p className="mt-6 text-sm opacity-70">
            Classés du plus cher au moins cher, par an. Coche ceux que tu veux résilier, puis ouvre la lettre.
          </p>

          <ul className="mt-4 space-y-4">
            {subs.map((s) => (
              <li key={s.key} className="rounded-xl border-2 border-[#1b1a17] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="titre text-xl">{s.name}</h2>
                    <p className="text-sm opacity-70">
                      {eur(s.amount)} {s.period === "an" ? "par an" : "par mois"}
                      {s.period === "estimé" && " (1 seul passage : à vérifier)"}
                    </p>
                  </div>
                  <p className="titre text-xl">{eur(s.annual)}/an</p>
                </div>

                <label className="mt-3 flex items-center gap-3 py-1">
                  <input
                    type="checkbox"
                    className="h-6 w-6 accent-[#1b1a17]"
                    checked={!!checked[s.key]}
                    onChange={(e) => setChecked({ ...checked, [s.key]: e.target.checked })}
                  />
                  Je veux résilier
                </label>

                <button
                  onClick={() => setOpen(open === s.key ? null : s.key)}
                  className="mt-2 font-bold underline"
                >
                  {open === s.key ? "Masquer la lettre" : "Voir la lettre de résiliation"}
                </button>

                {open === s.key && (
                  <div className="mt-4 space-y-3">
                    <input
                      value={who}
                      onChange={(e) => setWho(e.target.value)}
                      placeholder="Ton prénom et nom"
                      className="w-full rounded-lg border-2 border-[#1b1a17] bg-white p-3"
                    />
                    <input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Ton adresse postale"
                      className="w-full rounded-lg border-2 border-[#1b1a17] bg-white p-3"
                    />
                    <textarea
                      readOnly
                      value={letter(s, who, address)}
                      rows={16}
                      className="w-full rounded-lg border-2 border-[#1b1a17] bg-white p-3 text-sm"
                    />
                    <button onClick={() => copy(letter(s, who, address))} className={`${BOUTON} w-full`}>
                      {copied ? "Copié !" : "Copier la lettre"}
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>

          <p className="mt-6 text-sm opacity-70">
            Cette liste est une aide : vérifie chaque ligne avant de résilier. C&apos;est toi qui décides.
          </p>
          <button onClick={() => setSubs(null)} className="mt-4 underline">
            Analyser un autre fichier
          </button>
        </section>
      )}
    </main>
  );
}