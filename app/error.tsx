"use client";

import Link from "next/link";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto max-w-xl px-5 pt-24 text-center">
      <h1 className="titre text-4xl">Oups, quelque chose a coincé.</h1>
      <p className="mt-4 text-lg">
        Ce n&apos;est pas toi, c&apos;est nous. Réessaie, ou reviens à l&apos;accueil.
      </p>
      <button
        onClick={() => reset()}
        className="mt-8 rounded-full bg-[#f2d43d] px-8 py-4 font-bold shadow-[0_4px_0_#1b1a17]"
      >
        Réessayer
      </button>
      <div className="mt-6">
        <Link href="/" className="underline">
          Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}