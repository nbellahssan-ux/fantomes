const BOUTON =
  "block w-full rounded-full bg-[#f2d43d] px-6 py-4 text-center text-lg font-bold text-[#1b1a17] shadow-[0_4px_0_#1b1a17] active:translate-y-0.5 active:shadow-none";

const benefices = [
  {
    titre: "Classés par montant annuel",
    texte: "Les petits prélèvements deviennent des grosses sommes. Tu vois d'abord ceux qui coûtent le plus par an.",
  },
  {
    titre: "Une lettre prête pour chacun",
    texte: "Pour chaque abonnement oublié, une lettre de résiliation déjà rédigée. Tu n'as plus qu'à l'envoyer.",
  },
  {
    titre: "Le total que tu récupères",
    texte: "Un chiffre clair : ce que tu économises sur l'année, mis à jour à chaque résiliation.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-xl px-5 pb-32 pt-10">
      <p className="text-sm font-bold uppercase tracking-widest">Fantômes</p>

      <h1 className="titre mt-8 text-4xl leading-tight">
        Tu paies peut-être 300&nbsp;€ par an pour rien.
      </h1>
      <p className="mt-5 text-lg leading-relaxed">
        Un essai jamais résilié, un service remplacé, une option activée une
        fois : ces petits prélèvements sont invisibles sur ton relevé. On les
        débusque pour toi.
      </p>
      <p className="mt-2 text-sm opacity-60">
        300&nbsp;€ : un ordre de grandeur, pas une statistique officielle.
      </p>

      <a href="#" className={`${BOUTON} mt-8`}>
        Débusquer mes abonnements : 19&nbsp;€
      </a>
      <p className="mt-3 text-center text-sm opacity-70">
        Paiement unique, sans abonnement.
      </p>

      <ul className="mt-14 space-y-8">
        {benefices.map((b) => (
          <li key={b.titre} className="border-l-4 border-[#f2d43d] pl-4">
            <h2 className="titre text-xl">{b.titre}</h2>
            <p className="mt-1 leading-relaxed">{b.texte}</p>
          </li>
        ))}
      </ul>

      <div className="fixed inset-x-0 bottom-0 bg-[#1b1a17] p-4">
        <a href="#" className={`${BOUTON} mx-auto max-w-xl`}>
          Payer 19&nbsp;€
        </a>
      </div>
    </main>
  );
}