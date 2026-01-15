# YouShop - Frontend E-Commerce 🛍️

Plateforme e-commerce moderne construite avec Next.js 15+, TypeScript, et Tailwind CSS.

## 🚀 Démarrage Rapide

```bash
# Installation des dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build pour production
npm run build

# Lancer en production
npm start
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📦 Stack Technique

- **Framework**: Next.js 15+ (App Router, Server Components)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + Shadcn/ui
- **État Global**: Zustand (Auth, Cart)
- **Data Fetching**: TanStack Query (React Query)
- **HTTP Client**: Axios (avec intercepteurs JWT)
- **Validation**: Zod
- **Animations**: Framer Motion
- **Notifications**: Sonner
- **Icônes**: Lucide React

## 🏗️ Architecture

```
src/
├── app/                    # App Router (pages Next.js)
│   ├── (public)/          # Routes publiques
│   ├── (auth)/            # Routes authentification
│   ├── admin/             # Routes administration
│   └── layout.tsx         # Layout racine
├── components/            # Composants React
│   ├── ui/               # Composants shadcn/ui
│   ├── layout/           # Header, Footer, etc.
│   ├── product/          # Composants produits
│   ├── cart/             # Composants panier
│   └── forms/            # Formulaires
├── lib/                   # Utilitaires
│   ├── api.ts            # Client Axios
│   ├── utils.ts          # Fonctions utilitaires
│   ├── constants.ts      # Constantes
│   └── validations.ts    # Schémas Zod
├── services/             # Services API
│   ├── auth.service.ts
│   ├── products.service.ts
│   ├── orders.service.ts
│   └── categories.service.ts
├── store/                # Stores Zustand
│   ├── useAuthStore.ts
│   └── useCartStore.ts
├── types/                # Types TypeScript
│   └── api.types.ts
├── hooks/                # Custom hooks
│   ├── useAuth.ts
│   └── useCart.ts
└── middleware.ts         # Middleware Next.js
```

## ✨ Fonctionnalités

### ✅ Infrastructure Complète

- Configuration Next.js 15+ avec App Router
- TypeScript en mode strict
- Tailwind CSS avec design system personnalisé
- Client Axios avec intercepteurs JWT
- Zustand pour la gestion d'état
- React Query pour le data fetching
- Middleware pour la protection des routes

### 🔐 Authentification

- Login / Register
- JWT automatique sur toutes les requêtes
- Redirection automatique en cas d'expiration
- Protection des routes admin
- Store Zustand persistant

### 🛒 Panier

- Ajout/suppression de produits
- Mise à jour des quantités
- Calcul automatique des totaux (HT, TVA, frais de port)
- Livraison gratuite au-dessus de 50€
- Persistance dans localStorage
- Store Zustand avec notifications toast

### 📡 Services API

Tous les services sont prêts et typés :

- **Auth**: login, register, logout, profile
- **Products**: CRUD, recherche, filtres, featured
- **Categories**: CRUD, tree structure
- **Orders**: CRUD, statuts, tracking

### 🎨 Design System

- Couleurs primaires : Blue-600 (primary), Gray-800 (secondary)
- Mode sombre supporté
- Composants shadcn/ui
- Animations Tailwind personnalisées
- Responsive design

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env.local` :

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NODE_ENV=development
```

### API Backend

Le frontend se connecte à l'API backend sur `http://localhost:3000/api`.
Assurez-vous que le backend est démarré avant de lancer le frontend.

## 📝 Scripts Disponibles

```bash
# Développement
npm run dev              # Lancer le serveur de dev

# Production
npm run build           # Build pour production
npm start               # Lancer en production

# Qualité de code
npm run lint            # Linter ESLint
npm run type-check      # Vérification TypeScript
npm run format          # Formater avec Prettier

# Maintenance
npm run clean           # Nettoyer les fichiers de build
```

## 🎯 Prochaines Étapes

L'infrastructure est complète ! Vous pouvez maintenant :

1. **Créer les pages** :

   - Page d'accueil avec produits featured
   - Page de listing produits avec filtres
   - Page de détail produit
   - Pages authentification (login, register)
   - Page panier et checkout
   - Dashboard admin

2. **Développer les composants UI** :

   - Header avec navigation et panier
   - Footer
   - ProductCard et ProductGrid
   - CartDrawer
   - Formulaires avec React Hook Form

3. **Intégrer React Query** :

   - Queries pour les produits
   - Mutations pour les commandes
   - Cache et optimistic updates

4. **Ajouter les animations** :
   - Transitions de page
   - Animations de panier
   - Loading states

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn/ui](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://zustand-demo.pmnd.rs/)

## 🤝 Support

Pour plus d'informations sur l'infrastructure, consultez [INFRASTRUCTURE.md](./INFRASTRUCTURE.md).

---

**Status**: ✅ Infrastructure complète et prête pour le développement des features !
