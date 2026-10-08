import Link from "next/link";

const sections = [
  {
    id: "mentions",
    titre: "Mentions légales",
    blocs: [
      ["Éditeur du site", "[À COMPLÉTER : prénom et nom], entrepreneur individuel. SIRET : [À COMPLÉTER]. Adresse : [À COMPLÉTER]. E-mail : [À COMPLÉTER]."],
      ["Directeur de la publication", "[À COMPLÉTER : prénom et nom]."],
      ["TVA", "[À CONFIRMER : TVA non applicable, article 293 B du CGI, si tu es en franchise de base]."],
      ["Hébergeur", "Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis."],
    ],
  },
  {
    id: "cgv",
    titre: "Conditions générales de vente",
    blocs: [
      ["Objet", "Fantômes vend un audit d'abonnements : repérage de prélèvements réguliers à partir d'un relevé bancaire, classement par montant annuel et lettres de résiliation."],
      ["Prix", "19 € TTC, paiement unique. [À CONFIRMER : mention de TVA]."],
      ["Paiement", "Le paiement s'effectue par carte via Stripe. Nous ne voyons ni ne conservons tes données bancaires."],
      ["Livraison", "L'audit est livré par e-mail ou en ligne sous [À COMPLÉTER : délai, ex. 48 h] après le paiement."],
      ["Droit de rétractation", "Tu disposes de 14 jours pour te rétracter. Si tu demandes que l'audit commence avant la fin de ce délai, tu renonces à ce droit une fois l'audit entièrement réalisé. [À FAIRE VALIDER : formulation exacte]."],
      ["Responsabilité", "Fantômes est une aide à la décision. Nous ne fournissons ni conseil financier ni conseil juridique. C'est toi qui décides de résilier ou non un abonnement."],
      ["Médiation", "En cas de litige, tu peux recourir gratuitement au médiateur de la consommation : [À COMPLÉTER : nom et coordonnées du médiateur]."],
      ["Droit applicable", "Droit français."],
    ],
  },
  {
    id: "confidentialite",
    titre: "Politique de confidentialité",
    blocs: [
      ["Responsable du traitement", "[À COMPLÉTER : prénom, nom, e-mail de contact]."],
      ["Données collectées", "Ton adresse e-mail et ton nom, transmis lors du paiement. Les données de carte sont traitées uniquement par Stripe."],
      ["Relevé bancaire", "[À COMPLÉTER selon le fonctionnement réel : analysé dans ton navigateur sans être envoyé, OU reçu par e-mail puis supprimé sous X jours]."],
      ["Finalité et durée", "Réaliser ta commande et respecter nos obligations légales. Données de facturation conservées 10 ans, le reste supprimé sur demande."],
      ["Tes droits", "Accès, rectification, suppression, opposition : écris à [À COMPLÉTER : e-mail]. Tu peux aussi saisir la CNIL (cnil.fr)."],
    ],
  },
];

export const metadata = { title: "Informations légales · Fantômes" };

export default function Legal() {
  return (
    <main className="mx-auto max-w-xl px-5 pb-16 pt-10">
      <Link href="/" className="text-sm font-bold underline">← Retour à l&apos;accueil</Link>
      {sections.map((s) => (
        <section key={s.id} id={s.id} className="mt-12">
          <h1 className="titre text-3xl">{s.titre}</h1>
          {s.blocs.map(([t, texte]) => (
            <div key={t} className="mt-5">
              <h2 className="font-bold">{t}</h2>
              <p className="mt-1 leading-relaxed">{texte}</p>
            </div>
          ))}
        </section>
      ))}
    </main>
  );
}