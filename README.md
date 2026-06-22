# AURORE — THE CLUB

> Espace personnel de **journal intime**, **suivi d'humeurs** et **intentions** — _Projet de Marketing Digital par Fatima Dia._

AURORE THE CLUB est une application web (mobile-first) pour capter ses moments,
suivre son humeur jour après jour et garder le cap sur ses intentions. Elle
s'inscrit dans l'univers d'Aurore, le centre de coaching et la communauté
holistique basés à Dakar.

## ✨ Fonctionnalités

- **Accueil** — humeur du jour, affirmation quotidienne, semaine en humeurs et statistiques.
- **Journal intime** — écriture de moments avec humeur, heure et emojis ; export `.txt`.
- **Calendrier émotionnel** — vue mensuelle des humeurs et bilan du mois.
- **Mur Polaroid** — tes moments en polaroids inclinés.
- **À faire** — gestion d'intentions avec priorités, filtres et barre de progression.
- **Réglages** — 4 thèmes, 3 polices, rappel quotidien, verrouillage par code PIN, export JSON.

> Note : les données sont conservées en mémoire pendant la session (état React) ;
> il n'y a pas encore de persistance entre les visites.

## 🛠️ Stack technique

- [React 18](https://react.dev/)
- [Vite 5](https://vitejs.dev/)
- Styles en ligne (inline styles) — aucune dépendance CSS externe.

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
