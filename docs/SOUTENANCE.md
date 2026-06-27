# AURORE THE CLUB — Script de soutenance

> Démo guidée d'environ **8 à 10 minutes**. Lien à projeter :
> **https://3nqzt.github.io/AURORE-THE-CLUB-BY-FATIMA-DIA/**
> Astuce : ouvre le site sur ton **téléphone** (c'est « mobile-first ») **et** sur l'écran projeté.

---

## 0. Avant de commencer (préparation)
- Ouvre le lien dans un onglet **propre** (idéalement en navigation privée → tu reverras la page d'accueil et le tour de bienvenue « comme un nouveau visiteur »).
- Aie une **photo** prête sur l'appareil (pour la démo du journal et de la carte à partager).
- Repère le bouton **WhatsApp** flottant et le bouton **« Installer l'app »** (ils apparaissent sur la page d'accueil).

## 1. Le pitch (30 s)
> « AURORE THE CLUB, c'est **deux choses en une**. D'abord une **vitrine** qui présente
> la communauté de développement personnel pour les jeunes de Dakar et invite à
> **rejoindre** ou à **devenir partenaire**. Ensuite un **espace membre privé** : un
> journal intime bilingue pour suivre ses humeurs, ses moments et ses intentions —
> **en français et en wolof**, inspiré des couchers de soleil de Dakar. »

Points clés :
- Concept ancré à Dakar, **mobile-first** (pensé pour la réalité du réseau mobile).
- Une **vitrine publique** (acquisition) + un **outil membre** (rétention) dans une seule app.

## 2. La page d'accueil — « vendre le rêve » (75 s)
- **Hero** : le wordmark AURORE, la mission, et **deux portes claires** : *« Rejoindre la communauté »* et *« Devenir partenaire »*.
- Fais défiler : **Le programme** (discipline · créativité · bien-être).
- **Les lieux** : le carrousel met en avant de **vraies photos de Dakar** (toit-terrasse face à l'océan, coucher de soleil sur la Corniche) — touche les vignettes pour changer de lieu.
- **Parcours membre** : bouton *« Postuler via WhatsApp »*.
- **Parcours partenaire** : arguments d'audience + *« Discuter d'un partenariat »* (WhatsApp / e-mail).
- Montre le **bouton WhatsApp flottant** (click-to-chat) → « contact direct, comme attendu à Dakar ».
> « Tout est optimisé mobile : photos compressées, peu d'animations, navigation au pouce. »

## 3. Installer l'app — PWA (30 s)
- Montre **« Installer l'app »** (ou *Ajouter à l'écran d'accueil*) → l'icône AURORE s'installe comme une vraie app, plein écran.
> « C'est une **PWA** : installable et **utilisable hors-ligne** une fois ouverte — utile quand le réseau est faible. »

## 4. Entrer dans l'espace membre — le tour de bienvenue (30 s)
- Touche **« Mon espace »**.
- Au **premier lancement**, un **onboarding** en 4 étapes accueille le membre (Bienvenue · Capture chaque moment · Visualise ton parcours · Protège & sauvegarde).
- Termine le tour → on arrive sur l'accueil de l'app.

## 5. Accueil — l'orbe d'humeur (45 s)
- Choisis ton **humeur du jour** → l'orbe (le « soleil » AURORE) change de couleur.
- Montre l'**affirmation du jour**, la **semaine en humeurs** et les statistiques.
> Astuce : touche le wordmark **AURORE** pour **revenir à la vitrine** à tout moment.

## 6. Journal intime — le cœur de l'app (90 s)
- Touche **+** (ou « Écrire »). Choisis une **humeur**, écris quelques mots.
- **Ajoute une photo**, puis **« Au fil de la journée »** (2-3 humeurs à différentes heures = la timeline).
- **Ajoute un lieu** (touche la carte ou « Ma position »), des **emojis**, puis **Sauvegarder**.
- Montre la **recherche** par date / mot-clé.

## 7. Partager un moment — carte Instagram (45 s) — *effet « waouh »*
- Sur une entrée, touche **⤴ (Partager)**.
- Une **carte verticale 1080×1920** se génère : dégradé coucher de soleil teinté par l'humeur, la photo (ou l'orbe), le texte, la date, le lieu et **@auroretheclub**.
- **Partager** (envoie l'image vers Instagram / WhatsApp) ou **Télécharger**.
> « La carte est dessinée **sur l'appareil** — parfaite pour les stories, et elle fait la promo du club. »

## 8. Calendrier émotionnel (30 s)
- Vue mensuelle : chaque jour porte la couleur de l'humeur ; montre le **bilan du mois**.

## 9. Carte AURORE — « retrace tes pas » (40 s)
- Onglet **Carte** : les moments apparaissent sur Dakar, reliés dans l'ordre ; clique un repère → l'entrée.

## 10. Mur Polaroid + À faire (40 s)
- **Mur** : les moments suspendus comme des polaroids.
- **À faire** : ajoute une intention, priorité, coche-la → la barre de progression avance ; montre les filtres.

## 11. Personnalisation, confidentialité & sauvegarde (75 s) — le moment fort
- **Langue** : bascule **Français → Wolof** → toute l'interface change.
- **Thème** (Plein jour / Crépuscule / Lagon…) et **police**.
- **Rappels** : notification quotidienne ou horaire.
- **Confidentialité** : active un **code PIN**, puis « Verrouiller » → l'écran de verrouillage.
- **Sauvegarde & restauration** : **Exporter** un fichier `.json`, puis **Importer** pour **tout restaurer sur un autre appareil**.
> « Toutes les données restent **sur l'appareil** — rien sur un serveur. L'export/import permet de **déménager** son journal ou de le **récupérer**. »

## 12. La partie technique (60 s)
- **React + Vite**, déployé en continu sur **GitHub Pages** (chaque fusion se publie automatiquement — CI/CD).
- **Architecture** : une **vitrine publique** devant un **espace membre privé**, dans une seule base de code.
- **PWA** : manifest + **service worker** (cache + hors-ligne), installable.
- **Performance (réalité mobile Dakar)** : carte Leaflet **chargée à la demande**, **images compressées** (< 300 Ko), peu d'animations.
- **Accessibilité** : navigation clavier, lecteurs d'écran (`aria-label`), zoom autorisé, respect des préférences de mouvement, bilingue.
- **Qualité** : **ESLint (0 problème) + build** en intégration continue à chaque modification ; **écran de secours** (ErrorBoundary) en cas d'erreur.

## 13. Conclusion (20 s)
> « AURORE THE CLUB attire de nouveaux membres et partenaires par sa vitrine, puis
> accompagne chaque membre au quotidien — un compagnon intime et bilingue qui aide
> les jeunes Dakarois à devenir la meilleure version d'eux-mêmes : **discipline,
> créativité, bien-être**. »

---

## Questions probables du jury — réponses prêtes
- **« Où sont stockées les données ? »** → Localement, dans le navigateur (localStorage) ; rien sur un serveur. Avantage : vie privée, ça marche hors-ligne. Limite : par appareil — d'où l'**export/import** pour sauvegarder et migrer.
- **« Pourquoi une page vitrine ET une app ? »** → Deux objectifs : **acquérir** (membres + partenaires) via la vitrine, et **fidéliser** via l'outil membre. Les deux « portes » séparent clairement les parcours.
- **« C'est une vraie app installable ? »** → Oui, c'est une **PWA** : « Installer l'app » l'ajoute à l'écran d'accueil, plein écran, et le **service worker** la rend utilisable **hors-ligne**.
- **« Le wolof est-il fiable ? »** → Version traduite et relue ; les textes les plus récents sont un **brouillon** (bloc `wo:` dans `src/AuroreApp.jsx`, et `docs/TRADUCTION-WOLOF.md`) qu'un locuteur natif affine facilement.
- **« Les cartes à partager, comment ? »** → Générées **sur l'appareil** (canvas), puis envoyées via le partage natif (Web Share API) — aucun serveur, image prête pour Instagram.
- **« Et les notifications push en arrière-plan ? »** → Les rappels fonctionnent quand l'app est ouverte ; un vrai push en arrière-plan nécessiterait en plus un **serveur de push** (évolution future).
- **« Performance sur réseau lent (Dakar) ? »** → Mobile-first : images compressées (< 300 Ko), carte chargée à la demande, mise en cache hors-ligne, peu d'animations.
- **« Comment ça évolue ? »** → Toute modification fusionnée se **redéploie automatiquement** (CI/CD).

## Évolutions futures (si on te le demande)
- **Comptes + base de données** pour la synchronisation multi-appareils.
- **Notifications push** en arrière-plan (service worker + serveur de push).
- **Déverrouillage biométrique** (Face ID / Touch ID via WebAuthn).
- **Stockage des photos en IndexedDB** pour de plus gros volumes.
- **Formulaire d'adhésion / partenariat** relié à un back-office, et **statistiques d'audience réelles**.

---

## Aide-mémoire — ordre de la démo (à garder sous les yeux)
1. Pitch → 2. Accueil public (2 portes, lieux, WhatsApp) → 3. Installer (PWA) →
4. « Mon espace » + onboarding → 5. Orbe d'humeur → 6. Journal (photo, timeline, lieu) →
7. **Carte Instagram (⤴)** → 8. Calendrier → 9. Carte AURORE → 10. Mur + À faire →
11. Langue FR↔Wolof, PIN, **Export/Import** → 12. Technique → 13. Conclusion.
