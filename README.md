# AURORE — THE CLUB

> Espace personnel de **journal intime**, **suivi d'humeurs** et **intentions** — _Projet de Marketing Digital par Fatima Dia._

AURORE THE CLUB est une application web (mobile-first) pour capter ses moments,
suivre son humeur jour après jour et garder le cap sur ses intentions. Elle
s'inscrit dans l'univers d'Aurore, le centre de coaching et la communauté
holistique basés à Dakar.

## ✨ Fonctionnalités

- **Bilingue Français / Wolof** — bascule de toute l'interface depuis les Réglages.
  *(La traduction wolof est une première version à faire relire — voir
  [`docs/TRADUCTION-WOLOF.md`](docs/TRADUCTION-WOLOF.md).)*
- **Accueil** — humeur du jour, affirmation quotidienne, semaine en humeurs et statistiques.
- **Journal intime** — écriture de moments avec humeur, heure, emojis et **photo / création** ;
  **timeline intra-journée** (plusieurs humeurs dans la journée) ; **recherche par date ou mot-clé** ; export `.txt`.
- **Calendrier émotionnel** — vue mensuelle des humeurs et bilan du mois.
- **Carte AURORE** — situe tes moments sur une carte de Dakar (Leaflet / OpenStreetMap)
  et retrace ton parcours dans le temps.
- **Mur Polaroid** — tes moments (et tes photos) en polaroids inclinés.
- **À faire** — gestion d'intentions avec priorités, filtres et barre de progression.
- **Rappels** — notifications du navigateur, quotidiennes (à une heure choisie) ou horaires.
- **Réglages** — langue, 5 thèmes (dont un thème clair « Plein jour »), 3 polices, rappels, verrouillage par code PIN, export JSON.

> **Persistance locale** : les entrées, tâches, le thème, la police, l'humeur du
> jour et le code PIN sont sauvegardés dans le `localStorage` du navigateur, et
> restaurés à la prochaine visite. Si un code PIN est défini, l'application
> s'ouvre verrouillée. Les données restent sur l'appareil — rien n'est envoyé
> vers un serveur.

## 🎨 Direction artistique

L'esthétique s'inspire des **couchers de soleil de Dakar** et de la vie au bord
de l'océan : tons corail et pêche chauds, bleus profonds de la mer, blush et
sable. L'identité reste **minimaliste, jeune et lumineuse**.

- **Palette** — noir chaud `#0E0A09`, corail `#E0764A`, pêche/blush `#F2B488`,
  blanc chaud `#F7EEE4` ; 3 ambiances sombres (Crépuscule, Sahara, Lagon) **et un
  thème clair « Plein jour »** (lumière dorée sur le sable) pour la journée.
- **Signature** — l'orbe lumineux (soleil/lune) qui change de couleur selon
  l'humeur, posé sur une ligne d'horizon à l'ouverture.
- **Lueur de coucher de soleil** — un dégradé doux et discret en haut de
  l'écran, rappelant l'horizon, derrière chaque page.
- **Typographie** — *Fraunces* (serif éditorial) pour les titres et le logotype,
  *Inter* (sans moderne) pour le corps du texte.

## 🛠️ Stack technique

- [React 18](https://react.dev/)
- [Vite 5](https://vitejs.dev/)
- [Leaflet](https://leafletjs.com/) + tuiles [OpenStreetMap](https://www.openstreetmap.org/) pour la carte (sans clé API).
- Styles en ligne (inline styles) pour l'interface.

## 🚀 Démarrage local

Prérequis : [Node.js](https://nodejs.org/) 18 ou plus récent.

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Générer la version de production (dossier dist/)
npm run build

# Prévisualiser la version de production
npm run preview
```

## 🌍 Déploiement (GitHub Pages)

Le déploiement est automatisé via GitHub Actions
(`.github/workflows/deploy.yml`). À chaque `push` sur la branche `main`, le site
est construit et publié.

Pour l'activer (une seule fois) :

1. Aller dans **Settings → Pages** du dépôt.
2. Sous **Build and deployment → Source**, choisir **GitHub Actions**.
3. Fusionner cette branche dans `main` (ou lancer le workflow manuellement depuis
   l'onglet **Actions → Deploy to GitHub Pages → Run workflow**).

Le site sera ensuite disponible à l'adresse
`https://<utilisateur>.github.io/<nom-du-depot>/`.

> La configuration Vite utilise `base: "./"` (chemins relatifs), donc le build
> fonctionne quel que soit le nom du dépôt.

## 📁 Structure

```
.
├── index.html              # Point d'entrée HTML
├── package.json
├── vite.config.js          # Config Vite (base relative pour Pages)
├── src/
│   ├── main.jsx            # Montage React
│   └── AuroreApp.jsx       # Application complète
└── .github/workflows/
    └── deploy.yml          # CI/CD GitHub Pages
```

---

_AURORE · THE CLUB · v1.0_
