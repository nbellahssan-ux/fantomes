import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-5 pt-24 text-center">
      <h1 className="titre text-4xl">Cette page a disparu.</h1>
      <p className="mt-4 text-lg">Comme un abonnement bien résilié.</p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-[#f2d43d] px-8 py-4 font-bold shadow-[0_4px_0_#1b1a17]"
      >
        Retour à l&apos;accueil
      </Link>
    </main>
  );
}