import Link from "next/link";

const BOUTON =
  "block w-full rounded-full bg-[#f2d43d] px-6 py-4 text-center text-lg font-bold text-[#1b1a17] shadow-[0_4px_0_#1b1a17] active:translate-y-0.5 active:shadow-none";

export default function Contenu({ erreur }: { erreur?: boolean }) {
  return (
    <main className="mx-auto max-w-xl px-5 pt-20">
      <p className="text-sm font-bold uppercase tracking-widest">Fantômes</p>
      <h1 className="titre mt-8 text-4xl leading-tight">L&apos;audit est réservé aux clients.</h1>
      {erreur ? (
        <p role="alert" className="mt-5 rounded-lg border-l-4 border-[#1b1a17] bg-[#f2d43d]/30 p-3">
          Je n&apos;ai pas pu confirmer ton paiement. Si tu viens de payer, écris-moi à
          nbellahssan@gmail.com avec l&apos;e-mail de ton reçu Stripe : je te réponds vite.
        </p>
      ) : (
        <p className="mt-5 text-lg leading-relaxed">
          Pour ouvrir ton audit d&apos;abonnements, il faut d&apos;abord le régler : 19 €, une seule fois.
        </p>
      )}
      <a href="https://buy.stripe.com/test_8x23cv5us5tngYhgxq3VC00" className={`${BOUTON} mt-8`}>
        Débusquer mes abonnements : 19 €
      </a>
      <p className="mt-6 text-sm leading-relaxed opacity-70">
        Tu as déjà payé et tu as perdu l&apos;accès (autre appareil, autre navigateur) ? Écris à
        nbellahssan@gmail.com avec l&apos;e-mail de ton reçu.
      </p>
      <div className="mt-6">
        <Link href="/" className="underline">
          Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
