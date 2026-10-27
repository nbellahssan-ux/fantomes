import Link from "next/link";

const sections = [
  {
    id: "mentions",
    titre: "Mentions légales",
    blocs: [
      ["Éditeur du site", "Nayel Bellahssan, entrepreneur individuel. SIRET : [À COMPLÉTER]. Adresse : 17 rue Adolphe Talazac, 31300 Toulouse. E-mail : nbellahssan@gmail.com."],
      ["Directeur de la publication", "Nayel Bellahssan."],
      ["TVA", "[À CONFIRMER : « TVA non applicable, article 293 B du CGI » si tu es en franchise en base]."],
      ["Hébergeur", "Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis."],
    ],
  },
  {
    id: "cgv",
    titre: "Conditions générales de vente",
    blocs: [
      ["Objet", "Fantômes vend un audit d'abonnements : repérage de prélèvements réguliers à partir de relevés bancaires au format PDF ou CSV, classement par montant annuel et lettres de résiliation prêtes à envoyer."],
      ["Prix", "19 € par audit, paiement unique, sans abonnement. [À CONFIRMER : mention de TVA]."],
      ["Paiement", "Le paiement s'effectue par carte via Stripe. Nous ne voyons ni ne conservons tes données bancaires."],
      ["Livraison", "L'accès à l'outil d'audit est immédiat, en ligne, dès la confirmation du paiement."],
      ["Droit de rétractation", "L'audit est un contenu numérique fourni immédiatement. En validant ton paiement, tu demandes expressément l'accès immédiat à l'audit et tu reconnais perdre ton droit de rétractation de 14 jours dès que cet accès t'est donné. [À FAIRE VALIDER : formulation exacte]."],
      ["Responsabilité", "Fantômes est une aide à la décision. La liste est générée automatiquement et peut comporter des erreurs ou des oublis : vérifie chaque ligne avant de résilier. Nous ne fournissons ni conseil financier ni conseil juridique. C'est toi qui décides de résilier ou non un abonnement."],
      ["Médiation", "En cas de litige, tu peux recourir gratuitement au médiateur de la consommation : [À COMPLÉTER : nom et coordonnées du médiateur]."],
      ["Droit applicable", "Droit français."],
    ],
  },
  {
    id: "confidentialite",
    titre: "Politique de confidentialité",
    blocs: [
      ["Responsable du traitement", "Nayel Bellahssan. Contact : nbellahssan@gmail.com."],
      ["Données collectées", "Ton adresse e-mail et ton nom, transmis lors du paiement via Stripe. Les données de carte sont traitées uniquement par Stripe."],
      ["Relevé bancaire", "Ton relevé est analysé dans ton navigateur, sur ton appareil. Il n'est jamais envoyé à nos serveurs ni enregistré."],
      ["Mesure d'audience", "Nous utilisons Vercel Analytics, une mesure d'audience sans cookies, qui ne t'identifie pas."],
      ["Finalité et durée", "Réaliser ta commande et respecter nos obligations légales. Les données de facturation sont conservées 10 ans, le reste est supprimé sur demande."],
      ["Tes droits", "Accès, rectification, suppression, opposition : écris à nbellahssan@gmail.com. Tu peux aussi saisir la CNIL (cnil.fr)."],
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