import Link from "next/link";

export const metadata = { title: "Merci · Fantômes" };

export default function Merci() {
  return (
    <main className="mx-auto max-w-xl px-5 pt-20">
      <p className="text-sm font-bold uppercase tracking-widest">Fantômes</p>
      <h1 className="titre mt-8 text-4xl leading-tight">
        Merci, ton paiement est bien reçu.
      </h1>
      <p className="mt-5 text-lg leading-relaxed">
        Voici la suite : tu vas recevoir un e-mail de confirmation de Stripe,
        puis nous te contactons pour réaliser ton audit.
      </p>
      <ol className="mt-8 space-y-4">
        <li className="border-l-4 border-[#f2d43d] pl-4">
          <strong>1.</strong> Surveille ta boîte mail (pense aux courriers
          indésirables).
        </li>
        <li className="border-l-4 border-[#f2d43d] pl-4">
          <strong>2.</strong> Réponds à l&apos;e-mail de confirmation en joignant
          ton relevé bancaire en PDF.
        </li>
        <li className="border-l-4 border-[#f2d43d] pl-4">
          <strong>3.</strong> Tu reçois ta liste d&apos;abonnements et tes
          lettres de résiliation.
        </li>
      </ol>
      <Link
        href="/"
        className="mt-10 inline-block rounded-full bg-[#f2d43d] px-8 py-4 font-bold shadow-[0_4px_0_#1b1a17]"
      >
        Retour à l&apos;accueil
      </Link>
    </main>
  );
}