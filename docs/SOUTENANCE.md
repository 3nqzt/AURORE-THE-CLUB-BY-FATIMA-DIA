# AURORE THE CLUB — Script de soutenance

> Démo guidée d'environ **5 à 7 minutes**. Lien à projeter :
> **https://3nqzt.github.io/AURORE-THE-CLUB-BY-FATIMA-DIA/**
> Astuce : ouvre l'app sur ton téléphone **et** sur l'écran projeté.

---

## 0. Avant de commencer (préparation)
- Ouvre le lien dans un onglet propre (idéalement sur mobile : c'est une app « mobile-first »).
- Va dans **Réglages** une fois avant la démo pour vérifier le thème et la langue.
- Prépare une photo sur l'appareil (pour la démo du journal).

## 1. Le pitch (30 s)
> « AURORE THE CLUB est une application web de développement personnel pensée pour
> les jeunes de Dakar. Elle accompagne leur **bien-être mental et physique** :
> un petit monde à eux pour exprimer leurs émotions, suivre leurs humeurs et
> garder le cap sur leurs intentions — **en français et en wolof**. »

Points clés à mentionner :
- Inspirée de l'app « EMMO – Life Record », mais **bilingue** et ancrée à Dakar.
- Esthétique inspirée des **couchers de soleil de Dakar**.

## 2. Accueil — l'orbe d'humeur (45 s)
- Montre l'**écran d'ouverture** (le soleil/orbe sur l'horizon — rappel du logo AURORE).
- Sur l'accueil : choisis ton **humeur du jour** → l'orbe change de couleur.
- Montre l'**affirmation du jour**, la **semaine en humeurs** et les statistiques.

## 3. Journal intime — le cœur de l'app (90 s)
- Touche **+** (ou « Écrire »).
- Choisis une **humeur**, écris quelques mots.
- **Ajoute une photo** (ta création / ton moment).
- **« Au fil de la journée »** : ajoute 2-3 humeurs à différentes heures (la timeline).
- **Ajoute un lieu** : touche la carte ou « Ma position ».
- Ajoute des **emojis**, puis **Sauvegarder**.
- Montre la nouvelle entrée : photo, humeur, timeline, emojis.
- Montre la **recherche par date / mot-clé** en haut.

## 4. Calendrier émotionnel (30 s)
- Vue mensuelle : chaque jour porte la couleur de l'humeur.
- Montre le **bilan du mois** (humeur dominante).

## 5. Carte AURORE — « retrace tes pas » (45 s)
- Ouvre l'onglet **Carte** : les moments apparaissent sur Dakar, reliés dans l'ordre.
- Clique un repère → l'entrée correspondante.
> « C'est la carte de ton parcours émotionnel dans la ville. »

## 6. Mur Polaroid (20 s)
- Tes moments suspendus comme des polaroids (photos incluses).

## 7. À faire (30 s)
- Ajoute une **intention**, choisis la priorité, coche-la → la barre de progression avance.
- Montre les filtres (En attente / Aujourd'hui / Faites).

## 8. Personnalisation & confidentialité (60 s) — le moment fort
- **Langue** : bascule **Français → Wolof**. Toute l'interface change.
- **Thème** : passe de « Plein jour » (clair) à un thème sombre (Crépuscule, Lagon…).
- **Police** : change la typographie.
- **Rappels** : active une notification quotidienne ou horaire.
- **Confidentialité** : active un **code PIN**, puis « Verrouiller » → montre l'écran de verrouillage.
- **Export** : montre l'export `.txt` (journal) et `.json` (données).
> « Toutes les données restent **sur l'appareil** de l'utilisateur — rien n'est envoyé sur un serveur. »

## 9. La partie technique (45 s)
- **React + Vite**, déployé en continu sur **GitHub Pages** (chaque mise à jour se publie automatiquement).
- **Accessibilité** : navigation clavier, lecteurs d'écran (`aria-label`), zoom autorisé, respect des préférences de mouvement, bilingue.
- **Performance** : la carte (Leaflet) est chargée à la demande → page initiale plus légère.
- **Qualité** : intégration continue (ESLint + build) à chaque modification ; écran de secours en cas d'erreur.

## 10. Conclusion (20 s)
> « AURORE THE CLUB, c'est un compagnon quotidien, intime et bilingue, qui aide
> les jeunes Dakarois à devenir la meilleure version d'eux-mêmes — avec discipline,
> créativité et bien-être. »

---

## Questions probables du jury — réponses prêtes
- **« Où sont stockées les données ? »** → Localement, dans le navigateur (localStorage) ; rien sur un serveur. Avantage : vie privée. Limite : par appareil.
- **« Le wolof est-il fiable ? »** → C'est une première version traduite, relue (voir `docs/TRADUCTION-WOLOF.md`) ; un locuteur natif peut l'affiner facilement.
- **« Et les rappels en arrière-plan ? »** → Ils fonctionnent quand l'app est ouverte ; une vraie notification « push » en arrière-plan nécessiterait un service worker + serveur (évolution future).
- **« Comment ça évolue ? »** → Toute modification fusionnée se redéploie automatiquement (CI/CD).
- **« Est-ce accessible / responsive ? »** → Oui : mobile-first, navigable au clavier et compatible lecteurs d'écran.

## Évolutions futures (si on te le demande)
- Synchronisation multi-appareils (compte + base de données).
- Notifications push en arrière-plan (service worker).
- Déverrouillage biométrique (Face ID / Touch ID via WebAuthn).
- Stockage des photos en IndexedDB pour de plus gros volumes.
