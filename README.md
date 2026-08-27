# Ro Hub

Marketplace Next.js pour acheter et vendre des assets Roblox.

## Installation

```bash
npm install
```

## Variables d'environnement

Copie `.env.example` vers `.env.local`, puis renseigne tes clés Supabase et Stripe :

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

Ne publie jamais `.env.local` sur GitHub.

## Développement

```bash
npm run dev
```

Ouvre ensuite [http://localhost:3000](http://localhost:3000).

## Build de production

```bash
npm run build
npm start
```

## Déploiement Vercel

1. Envoie le projet sur GitHub.
2. Importe le dépôt dans Vercel.
3. Ajoute les variables d'environnement dans les paramètres Vercel.
4. Lance le déploiement.

Vercel détecte automatiquement Next.js et utilise `npm run build`.
