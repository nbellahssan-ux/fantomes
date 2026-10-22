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
        Tu vas recevoir un e-mail de confirmation de Stripe. Ton audit est prêt :
        il te faut juste ton relevé bancaire.
      </p>
      <ol className="mt-8 space-y-4">
        <li className="border-l-4 border-[#f2d43d] pl-4">
          <strong>1.</strong> Télécharge ton relevé bancaire au format CSV (3 mois
          de préférence).
        </li>
        <li className="border-l-4 border-[#f2d43d] pl-4">
          <strong>2.</strong> Ouvre ton audit et dépose le fichier : il reste sur
          ton appareil.
        </li>
        <li className="border-l-4 border-[#f2d43d] pl-4">
          <strong>3.</strong> Tu obtiens ta liste d&apos;abonnements et tes
          lettres de résiliation.
        </li>
      </ol>
      <Link
        href="/audit"
        className="mt-10 block rounded-full bg-[#f2d43d] px-8 py-4 text-center font-bold shadow-[0_4px_0_#1b1a17]"
      >
        Ouvrir mon audit
      </Link>
      <div className="mt-6 text-center">
        <Link href="/" className="underline">
          Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}