# 🛍️ Catalogue Produits - Frontend YouShop

Interface publique du catalogue produits avec filtrage avancé et optimisations de performance.

## 📦 Composants Créés

### 🎨 Composants UI (Shadcn/ui)

- ✅ **Skeleton** - Loaders pour chargement
- ✅ **Slider** - Range slider pour filtres de prix
- ✅ **Select** - Sélecteur de catégories
- ✅ **Sheet** - Drawer mobile pour filtres

### 🛒 Composants Produits

#### **ProductCard** (`src/components/product/ProductCard.tsx`)

- Image optimisée avec Next.js `<Image />` et placeholder blur
- Prix formaté avec helper `formatPrice()`
- Badges conditionnels :
  - "Rupture de stock" (stock = 0)
  - Discount badge (si compareAtPrice existe)
  - "Mis en avant" (si featured = true)
- Hover effects (scale + shadow)
- Bouton "Ajouter au panier" (désactivé si stock = 0)
- Warning si stock < 10
- Rating + reviews count
- **Optimisations** : React.memo, priority prop pour images above-the-fold

#### **ProductGrid** (`src/components/product/ProductGrid.tsx`)

- Grille responsive : 1 col (mobile), 2 cols (tablet), 3 cols (md), 4 cols (desktop)
- Skeleton loaders pendant chargement (8 cartes)
- Message "Aucun produit trouvé" si résultats vides
- Priority pour les 4 premiers produits (above the fold)

#### **SearchBar** (`src/components/product/SearchBar.tsx`)

- Input avec icône de recherche
- **Debounce 300ms** avant appel API (optimisation performance)
- Loader pendant recherche
- Bouton "Clear" si texte saisi
- Utilise useEffect pour debounce automatique

#### **ProductFilters** (`src/components/product/ProductFilters.tsx`)

- **Desktop** : Sidebar fixe (sticky top-4)
- **Mobile** : Drawer (Sheet) avec bouton toggle
- **Filtres disponibles** :
  - Catégorie (Select avec données API)
  - Prix (Range Slider min/max)
  - "En stock uniquement" (Checkbox)
  - Tri (Select : newest, price-asc, price-desc, popular, rating)
- Bouton "Réinitialiser les filtres"
- Indicateur visuel si filtres actifs
- **Cache** : Categories avec React Query (staleTime: 5 minutes)

## 📄 Pages Créées

### **Page d'accueil** (`src/app/page.tsx`)

#### Sections :

1. **Hero Section**

   - Gradient background
   - Animation Framer Motion (fade-in)
   - CTA "Découvrir le catalogue"

2. **Produits mis en avant**

   - Fetch 8 produits featured depuis API
   - ProductGrid avec priority={true}
   - Animation on scroll (whileInView)

3. **Catégories populaires**

   - Grid responsive 2/3/6 colonnes
   - Cards avec images catégories
   - Compteur de produits par catégorie
   - Animation staggered (delay par index)
   - Gradient placeholder si pas d'image

4. **CTA Section**
   - Background primary
   - Call-to-action final

### **Page Catalogue** (`src/app/products/page.tsx`)

#### Features :

- **Layout** : Sidebar (desktop) + FilterDrawer (mobile)
- **SearchBar** en haut de page
- **Compteur** : "X produits trouvés"
- **ProductGrid** avec résultats
- **Pagination** :
  - Boutons Précédent/Suivant
  - Numéros de pages avec ellipsis (...)
  - Logic : affiche page 1, dernière page, page actuelle ± 2
  - Scroll to top on page change
- **URL Params** :
  - Tous les filtres stockés dans searchParams
  - useSearchParams + useRouter pour sync
  - Reset page à 1 quand filtres changent
- **React Query** :
  - Cache automatique
  - Invalidation lors du changement de filtres
  - Loading states

### **Page Détail Produit** (`src/app/products/[id]/page.tsx`)

#### Layout 2 colonnes :

**Colonne Gauche - Galerie Images** :

- **Carrousel Embla** (swipe touch, navigation buttons)
- Navigation prev/next avec icônes
- **Thumbnails** en bas (grid 4 colonnes)
- Selection thumbnail met à jour le carrousel
- Border highlight sur thumbnail sélectionné
- aria-labels sur boutons

**Colonne Droite - Informations** :

- **Breadcrumb** : Accueil > Produits > [Catégorie] > [Nom]
- Catégorie cliquable (filtre par catégorie)
- Nom du produit (h1)
- Rating + Reviews count
- **Prix** :
  - Prix actuel (grande taille, primary color)
  - Prix barré si discount
  - Badge % de réduction
- Description complète
- **Stock status** : Badges conditionnels
- **Sélecteur quantité** : Buttons +/- avec Input
- **Boutons actions** :
  - Ajouter au panier (principal)
  - Favori (Heart icon)
  - Partager (Share2 icon)
- **Caractéristiques** (si specifications existe)

**Section Produits Similaires** :

- Fetch produits de même catégorie (limit 4)
- Exclusion du produit actuel
- ProductGrid
- Bouton "Voir plus" vers catalogue filtré

## 🔧 Services

### **categoriesService** (`src/services/categories.service.ts`)

```typescript
getCategories() // Retourne Category[]
getCategoryById(id: string)
```

- Cache React Query avec staleTime: 5 minutes
- Error handling avec messages français

### **productsService** (`src/services/products.service.ts`)

```typescript
getProducts(filters: FilterProductDto) // Retourne ProductsResponse
getProductById(id: string) // Retourne Product
getFeaturedProducts(limit: number) // Utilise getProducts avec featured=true
```

- Construction dynamique des query params
- Mapping des filtres vers API backend
- Console.log pour debugging

## ⚡ Optimisations Performance

### 1. **Images Next.js**

- `<Image />` partout avec fill ou width/height
- `priority={true}` sur images above-the-fold (hero, 4 premiers produits)
- `placeholder="blur"` avec blurDataURL pour skeleton loading
- `sizes` responsive pour optimisation

### 2. **React Optimization**

- `React.memo` sur ProductCard (évite re-renders inutiles)
- `useMemo` pour calcul de filtres depuis URL params
- `useCallback` pour handlers de filtres/search/pagination

### 3. **TanStack Query**

- Cache automatique des requêtes API
- `staleTime: 5 minutes` pour categories
- Query keys avec dépendances (invalidation auto)
- Prefetching possible avec `useQueryClient().prefetchQuery()`

### 4. **Lazy Loading**

- ProductGrid load en différé (via React Query)
- Skeleton loaders pendant fetch
- Images lazy par défaut (sauf priority)

### 5. **Debouncing**

- SearchBar debounce 300ms (évite spam API)
- Slider price debounce avec onValueCommit

### 6. **Code Splitting**

- Composants organisés par feature
- Import dynamique possible avec `next/dynamic`
- Embla carousel chargé seulement sur page détail

## 🎯 Workflow Utilisateur

### Navigation Catalogue

1. User arrive sur homepage → voit Hero + 8 produits featured
2. Clique "Découvrir le catalogue" → /products
3. Utilise SearchBar pour chercher (debounce 300ms)
4. Applique filtres (catégorie, prix, stock)
5. Résultats mis à jour + URL params sync
6. Pagination si > 12 produits
7. Clique sur ProductCard → /products/[id]

### Page Détail

1. Voir galerie images (swipe mobile, click thumbnails)
2. Lire description + specs
3. Vérifier stock
4. Sélectionner quantité
5. Ajouter au panier → Toast confirmation
6. Découvrir produits similaires

## 📱 Mobile-First

Tous les composants testés sur mobile d'abord :

- ProductGrid : 1 colonne mobile, 4 desktop
- ProductFilters : Drawer mobile, Sidebar desktop
- SearchBar : Pleine largeur mobile
- ProductCard : Touch-friendly
- Carrousel : Swipe natif avec Embla
- Pagination : Compact sur mobile

## 🔄 State Management

- **URL Params** : Source de vérité pour filtres/search/page
- **React Query** : Cache des données API
- **Zustand** : useCart pour panier (déjà existant)
- **Local State** : Quantité, selectedImage, etc.

## 📦 Packages Installés

```bash
npm install @radix-ui/react-slider
npm install @radix-ui/react-select
npm install @radix-ui/react-dialog  # Pour Sheet
npm install embla-carousel-react    # Pour carrousel images
```

## 🚀 Lancement

Le dev server Next.js doit être en cours :

```bash
cd frontend
npm run dev
```

Pages accessibles :

- http://localhost:3000 - Homepage
- http://localhost:3000/products - Catalogue
- http://localhost:3000/products/[id] - Détail produit

## ✅ Checklist Complète

- [x] Types TypeScript (Product, Category, FilterProductDto)
- [x] TanStack Query Provider configuré
- [x] Service categories avec cache
- [x] Service products avec filtres avancés
- [x] Composants UI Shadcn (Skeleton, Slider, Select, Sheet)
- [x] ProductCard avec optimisations
- [x] ProductGrid responsive + skeleton
- [x] SearchBar avec debounce
- [x] ProductFilters (desktop/mobile)
- [x] Page d'accueil (Hero + Featured + Categories)
- [x] Page catalogue (/products)
- [x] Page détail produit (/products/[id])
- [x] Pagination avec ellipsis
- [x] Images optimisées (priority, blur, sizes)
- [x] React.memo, useMemo, useCallback
- [x] Animations Framer Motion
- [x] Mobile-first responsive
- [x] Breadcrumb navigation
- [x] Error handling + Toast notifications

## 🎨 Design System

- **Colors** : Utilise variables Tailwind (primary, muted, etc.)
- **Spacing** : Cohérent (gap-4, space-y-6, etc.)
- **Typography** : text-3xl (headings), text-sm/base (body)
- **Shadows** : hover:shadow-lg sur cards
- **Transitions** : duration-300 partout
- **Borders** : rounded-lg/md/full
- **Icons** : Lucide React (ShoppingCart, Search, Filter, etc.)

## 📝 Notes Backend

API Endpoints utilisés :

```
GET /products?page=1&limit=12&category=xxx&minPrice=0&maxPrice=1000&search=xxx&isActive=true
GET /products/:id
GET /categories
```

Format de réponse attendu :

```typescript
// Products
{
  success: true,
  products: Product[],
  pagination: {
    page: 1,
    limit: 12,
    total: 150,
    pages: 13
  }
}

// Categories
{
  success: true,
  categories: Category[]
}
```

---

**Développé avec** : Next.js 16, React 19, TanStack Query, Shadcn/ui, Framer Motion, Embla Carousel
