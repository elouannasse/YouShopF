"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Heart,
  Share2,
  Minus,
  Plus,
  Home,
  ChevronRight as BreadcrumbArrow,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductGrid } from "@/components/product/ProductGrid";
import { useCart } from "@/hooks/useCart";
import { productsService } from "@/services/products.service";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import type { Product } from "@/types/api.types";

/**
 * Product detail page with image gallery, add to cart, and similar products
 */
export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Fetch product data
  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["product", productId],
    queryFn: () => productsService.getProductById(productId),
    enabled: !!productId,
  });

  // Fetch similar products (same category)
  const categoryId =
    typeof product?.category === "object"
      ? product.category._id
      : product?.category;
  const { data: similarProducts = [] } = useQuery<Product[]>({
    queryKey: ["similar-products", productId, categoryId],
    queryFn: async () => {
      if (!categoryId) return [];
      const response = await productsService.getProducts({
        category: categoryId,
        limit: 5,
      });
      // Filter out current product
      return response.products.filter((p) => p._id !== productId).slice(0, 4);
    },
    enabled: !!categoryId,
  });

  // Image carousel
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev();
      setSelectedImageIndex((prev) => Math.max(0, prev - 1));
    }
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext();
      setSelectedImageIndex((prev) =>
        Math.min(product?.images.length! - 1, prev + 1)
      );
    }
  }, [emblaApi, product?.images.length]);

  // Quantity controls
  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Add to cart
  const handleAddToCart = () => {
    if (!product) return;

    if (product.stock === 0) {
      toast.error("Produit en rupture de stock");
      return;
    }

    addItem(product, quantity);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-3/4 bg-gray-200 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded" />
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-6 bg-gray-200 rounded w-1/2" />
              <div className="h-20 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Produit introuvable</h1>
        <Button asChild>
          <Link href="/products">Retour au catalogue</Link>
        </Button>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;
  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.price;
  const categoryName =
    typeof product.category === "object" ? product.category.name : undefined;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary transition-colors">
            <Home className="h-4 w-4" />
          </Link>
          <BreadcrumbArrow className="h-4 w-4" />
          <Link
            href="/products"
            className="hover:text-primary transition-colors"
          >
            Produits
          </Link>
          {categoryName && (
            <>
              <BreadcrumbArrow className="h-4 w-4" />
              <Link
                href={`/products?categoryId=${
                  typeof product.category === "object"
                    ? product.category._id
                    : product.category
                }`}
                className="hover:text-primary transition-colors"
              >
                {categoryName}
              </Link>
            </>
          )}
          <BreadcrumbArrow className="h-4 w-4" />
          <span className="text-foreground font-medium">{product.name}</span>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image Carousel */}
            <div className="relative overflow-hidden rounded-lg" ref={emblaRef}>
              <div className="flex">
                {product.images.map((image, index) => (
                  <div key={index} className="relative flex-[0_0_100%] min-w-0">
                    <div className="relative aspect-square">
                      <Image
                        src={image}
                        alt={`${product.name} - Image ${index + 1}`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                        priority={index === 0}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Buttons */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={scrollPrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                    aria-label="Image précédente"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={scrollNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                    aria-label="Image suivante"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedImageIndex(index);
                      emblaApi?.scrollTo(index);
                    }}
                    aria-label={`Voir l'image ${index + 1}`}
                    className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? "border-primary"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      sizes="(max-width: 1024px) 25vw, 12vw"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category */}
            {categoryName && (
              <div>
                <Link
                  href={`/products?categoryId=${
                    typeof product.category === "object"
                      ? product.category._id
                      : product.category
                  }`}
                  className="text-sm text-primary hover:underline uppercase tracking-wide"
                >
                  {categoryName}
                </Link>
              </div>
            )}

            {/* Product Name */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {product.name}
            </h1>

            {/* Rating & Reviews */}
            {product.rating &&
              product.reviewsCount &&
              product.reviewsCount > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="font-semibold">
                      {product.rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-muted-foreground">
                    ({product.reviewsCount} avis)
                  </span>
                </div>
              )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-2xl text-muted-foreground line-through">
                    {formatPrice(product.compareAtPrice!)}
                  </span>
                  <Badge className="bg-green-500">
                    -
                    {Math.round(
                      ((product.compareAtPrice! - product.price) /
                        product.compareAtPrice!) *
                        100
                    )}
                    %
                  </Badge>
                </>
              )}
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Stock Status */}
            <div>
              {isOutOfStock ? (
                <Badge variant="destructive" className="text-base px-4 py-2">
                  Rupture de stock
                </Badge>
              ) : product.stock < 10 ? (
                <Badge variant="secondary" className="text-base px-4 py-2">
                  Plus que {product.stock} en stock
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-base px-4 py-2">
                  En stock
                </Badge>
              )}
            </div>

            <Separator />

            {/* Quantity Selector & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="font-semibold">Quantité:</label>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={decrementQuantity}
                    disabled={quantity === 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-6 py-2 font-semibold">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  size="lg"
                  className="flex-1 text-lg"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {isOutOfStock ? "Indisponible" : "Ajouter au panier"}
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Additional Info */}
            {product.specifications &&
              Object.keys(product.specifications).length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h2 className="text-lg font-semibold mb-3">
                      Caractéristiques
                    </h2>
                    <dl className="space-y-2">
                      {Object.entries(product.specifications).map(
                        ([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <dt className="text-muted-foreground">{key}:</dt>
                            <dd className="font-medium">{value}</dd>
                          </div>
                        )
                      )}
                    </dl>
                  </div>
                </>
              )}
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Produits similaires</h2>
              {categoryName && (
                <Button asChild variant="outline">
                  <Link
                    href={`/products?categoryId=${
                      typeof product.category === "object"
                        ? product.category._id
                        : product.category
                    }`}
                  >
                    Voir plus
                  </Link>
                </Button>
              )}
            </div>
            <ProductGrid products={similarProducts} isLoading={false} />
          </section>
        )}
      </div>
    </div>
  );
}
