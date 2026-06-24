# Configurer un nom de domaine personnalisé

Le site est en ligne à l'adresse GitHub Pages :
`https://3nqzt.github.io/AURORE-THE-CLUB-BY-FATIMA-DIA/`

Tu peux le faire pointer vers un domaine à toi (ex. `aurore-theclub.com` ou
`app.aurore-theclub.com`). Bonne nouvelle : **aucune modification de code n'est
nécessaire** — la configuration Vite utilise `base: "./"` (chemins relatifs),
donc le site fonctionne aussi bien sous `/AURORE-THE-CLUB-BY-FATIMA-DIA/` qu'à la
racine d'un domaine.

> ⚠️ Il faut d'abord **acheter un domaine** chez un registraire
> (Namecheap, OVH, Gandi, Google Domains, etc.). Je ne peux pas l'acheter à ta place.

## Étape 1 — Déclarer le domaine sur GitHub
Repo → **Settings → Pages → Custom domain** → saisis ton domaine (ex.
`aurore-theclub.com`) → **Save**.
GitHub ajoute alors un fichier `CNAME` au site. (Je peux aussi l'ajouter au dépôt
dans `public/CNAME` pour qu'il persiste à chaque déploiement — voir Étape 4.)

## Étape 2 — Configurer le DNS (chez ton registraire)

### Option A — Sous-domaine (recommandé, le plus simple) : `app.tondomaine.com`
Ajoute **un enregistrement CNAME** :

| Type  | Nom (hôte) | Valeur            |
|-------|------------|-------------------|
| CNAME | `app`      | `3nqzt.github.io` |

### Option B — Domaine racine (apex) : `tondomaine.com`
Ajoute les **enregistrements A** (IPv4) suivants :

| Type | Nom | Valeur            |
|------|-----|-------------------|
| A    | `@` | `185.199.108.153` |
| A    | `@` | `185.199.109.153` |
| A    | `@` | `185.199.110.153` |
| A    | `@` | `185.199.111.153` |

(Optionnel, IPv6 — enregistrements **AAAA** : `2606:50c0:8000::153`,
`2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`.)

Pour aussi gérer `www`, ajoute un CNAME `www → 3nqzt.github.io`.

## Étape 3 — Forcer le HTTPS
Une fois le DNS propagé (de quelques minutes à ~24 h), reviens dans
**Settings → Pages** et coche **Enforce HTTPS**. Le certificat est gratuit et
automatique.

## Étape 4 — (Je peux le faire) Rendre le domaine permanent
Pour que le domaine survive à chaque déploiement automatique, on ajoute un fichier
`public/CNAME` contenant **uniquement** ton domaine, par ex. :

```
aurore-theclub.com
```

Vite le copie alors à la racine du build à chaque publication.

> Je n'ai pas créé ce fichier maintenant : y mettre un domaine que tu ne possèdes
> pas encore **casserait** le site `github.io` actuel. Dis-moi ton domaine et je
> l'ajoute proprement.

## Vérification
- `https://tondomaine.com` affiche AURORE THE CLUB.
- Le cadenas HTTPS est présent.
- L'ancienne adresse `…github.io/AURORE-THE-CLUB-BY-FATIMA-DIA/` redirige vers le
  nouveau domaine.

## Alternative : Netlify / Vercel
Si tu préfères, connecte le dépôt à **Netlify** ou **Vercel** : déploiement en un
clic, gestion du domaine et du HTTPS très simple, et aperçus automatiques à chaque
modification. (GitHub Pages reste parfait et gratuit pour ce projet.)
