# AURORE THE CLUB — Discours de soutenance

> Texte à lire / mémoriser. Durée : **~7–9 minutes**, à dérouler **en parallèle de la démo**
> (voir `SOUTENANCE.md` pour l'ordre des manipulations et `docs/` pour les Q&A).
> Les passages entre **[ ]** sont des indications de geste, pas à lire à voix haute.

---

## 1. Accroche (30 s)
« Bonjour à toutes et à tous. Madame, Monsieur les membres du jury, merci de votre présence.

Imaginez un instant : il est 19 heures à Dakar, le soleil se couche sur la Corniche, et une jeune femme rentre chez elle après une longue journée. Elle a besoin d'un espace pour souffler, poser ses émotions, et garder le cap sur ses objectifs. Cet espace, je l'ai conçu et développé. Il s'appelle **AURORE THE CLUB**. »

## 2. Contexte & problématique (60 s)
« La santé mentale des jeunes reste un sujet tabou, et l'accompagnement psychologique demeure peu accessible : coûteux, intimidant, parfois tout simplement absent. Une testeuse m'a d'ailleurs confié : *« À défaut d'aller chez le psy, ça aide vraiment. »*

En parallèle, la plupart des outils de bien-être sont pensés ailleurs, en anglais, déconnectés de notre culture et de notre quotidien.

Ma problématique était donc la suivante : **comment proposer un outil de développement personnel à la fois accessible, intime et profondément ancré à Dakar — dans nos langues, nos lieux et notre esthétique ?** »

## 3. Le concept (60 s)
« AURORE THE CLUB, c'est **deux choses en une**.

D'abord, une **vitrine publique** qui présente la communauté et ouvre **deux portes claires** : *rejoindre la communauté*, ou *devenir partenaire*.

Ensuite, un **espace membre privé** : un journal intime **bilingue — français et wolof** — pour suivre ses humeurs, capturer ses moments et garder ses intentions.

Le fil conducteur, c'est l'esthétique des **couchers de soleil de Dakar** : des couleurs chaudes et douces — *« cozy »*, comme me l'ont dit plusieurs testeurs. »

## 4. Le public & le besoin (40 s)
« Ma cible : les **jeunes de Dakar** — connectés, créatifs, en quête de sens et de discipline.

Leur besoin : un compagnon quotidien, discret, qui respecte leur vie privée et qui fonctionne **même quand le réseau est faible**. C'est pourquoi chaque décision a été pensée *« mobile-first »* et pour la réalité du terrain. »

## 5. La démonstration (≈ 2 min 30) — [LANCER LA DÉMO]
« Laissez-moi vous montrer.

- On arrive sur la **page d'accueil** : la mission, et les **deux portes** — rejoindre ou devenir partenaire. Je fais défiler : le **programme** hebdomadaire — discipline, créativité, bien-être — puis une **galerie** qui met en avant de vrais lieux de Dakar.
- Plus bas, les **témoignages** de la communauté ; et pour les partenaires, nos **premiers chiffres** : 507 vues, 33 interactions.
- D'un geste, **j'installe l'application** [montrer « Installer l'app »] : c'est une application **installable**, qui fonctionne **même hors-ligne**.
- J'entre dans **« Mon espace »**. Au premier lancement, un court **tour de bienvenue** accueille le nouveau membre.
- Sur l'accueil, je choisis mon **humeur du jour** : l'**orbe** — le soleil d'AURORE — change de couleur.
- J'**écris une entrée** : une humeur, quelques mots, une photo, un lieu sur la carte, des émojis.
- Et voici ma fonctionnalité préférée : je transforme ce moment en une **carte à partager sur Instagram**, générée directement sur le téléphone.
- Le **calendrier émotionnel** colore chaque jour selon l'humeur ; la **carte AURORE** retrace mes pas dans la ville ; le **mur polaroid** affiche mes souvenirs.
- Enfin, je peux tout **personnaliser** : la langue — français ou wolof —, le thème, un **code PIN** pour protéger mon journal, et surtout **exporter puis réimporter** mes données pour les sauvegarder. »

## 6. Les choix techniques (60 s)
« Côté technique, l'application est développée en **React** avec **Vite**, et **déployée en continu** sur GitHub Pages : chaque modification validée se publie automatiquement.

C'est une **Progressive Web App** : installable, et utilisable hors-ligne grâce à un **service worker**.

J'ai veillé à trois exigences :
- l'**accessibilité** (navigation clavier, lecteurs d'écran, interface bilingue) ;
- la **performance** (images compressées, carte chargée à la demande — essentiel pour la 3G dakaroise) ;
- la **qualité** (vérification automatique du code à chaque modification, et écran de secours en cas d'erreur).

Point essentiel : **toutes les données restent sur l'appareil** de l'utilisateur. Rien n'est envoyé sur un serveur. La vie privée est un **choix de conception**. »

## 7. Difficultés rencontrées & solutions (40 s)
« J'ai relevé plusieurs défis.

Le **bilinguisme français-wolof** : j'ai construit l'interface autour d'un système de traduction, relu et encore perfectible.

Le **stockage des photos sans serveur** : je les compresse automatiquement pour ne pas saturer la mémoire de l'appareil.

Et la **portabilité des données** : la fonction d'export / import permet de déménager son journal d'un appareil à l'autre, ou de le récupérer. »

## 8. Résultats & retours (30 s)
« Les premiers retours sont encourageants : *« le site est moderne, clean, bien organisé »*, *« un bon mix entre professionnel et casual »*, *« ça donne envie de boire un cocktail face à la mer au coucher du soleil »*.

Mais au-delà des compliments, ce qui me touche le plus, c'est quand on me dit que l'outil **aide vraiment**. »

## 9. Perspectives (30 s)
« Pour la suite : des **comptes utilisateurs** pour synchroniser entre appareils, de vraies **notifications push**, le **déverrouillage biométrique**, et un **formulaire d'adhésion** relié à un back-office pour faire grandir la communauté et les partenariats. »

## 10. Conclusion & remerciements (20 s)
« AURORE THE CLUB, c'est plus qu'un projet de marketing digital : c'est une **invitation**, pour la jeunesse de Dakar, à devenir la meilleure version d'elle-même — avec **discipline, créativité et bien-être**.

Merci de votre attention. Je suis à votre disposition pour vos questions. »

---

### Repères de minutage
| Partie | Durée | Cumul |
|---|---|---|
| 1. Accroche | 0:30 | 0:30 |
| 2. Contexte | 1:00 | 1:30 |
| 3. Concept | 1:00 | 2:30 |
| 4. Public | 0:40 | 3:10 |
| 5. Démo | 2:30 | 5:40 |
| 6. Technique | 1:00 | 6:40 |
| 7. Difficultés | 0:40 | 7:20 |
| 8. Retours | 0:30 | 7:50 |
| 9. Perspectives | 0:30 | 8:20 |
| 10. Conclusion | 0:20 | 8:40 |

> Astuce : si le temps presse, raccourcis les parties 7 et 9 — l'essentiel est la **démo** (partie 5).
> Pour les questions du jury, garde sous les yeux la section *« Questions probables »* de `SOUTENANCE.md`.
