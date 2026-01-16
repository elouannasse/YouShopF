"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Tag, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductGrid } from "@/components/product/ProductGrid";
import { productsService } from "@/services/products.service";
import { categoriesService } from "@/services/categories.service";
import type { Product, Category } from "@/types/api.types";

/**
 * HomePage - Landing page with Hero, Featured Products, and Popular Categories
 */
export default function HomePage() {
  // Fetch featured products (8 products)
  const { data: featuredProducts = [], isLoading: productsLoading } = useQuery<
    Product[]
  >({
    queryKey: ["featured-products"],
    queryFn: () => productsService.getFeaturedProducts(8),
  });

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery<
    Category[]
  >({
    queryKey: ["categories"],
    queryFn: categoriesService.getCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get top 6 categories for display
  const topCategories = categories.slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-primary/10 via-primary/5 to-background py-20 px-4"
      >
        <div className="container mx-auto max-w-6xl text-center space-y-6">
          <div className="flex justify-center mb-4">
            <ShoppingBag className="h-20 w-20 text-primary" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
            Bienvenue sur <span className="text-primary">YouShop</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez des milliers de produits de qualité à des prix imbattables
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/products">
                Découvrir le catalogue
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Featured Products Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="h-8 w-8 text-primary" />
                  Produits mis en avant
                </h2>
                <p className="text-gray-600 mt-2">
                  Notre sélection des meilleurs produits du moment
                </p>
              </div>
              <Button asChild variant="outline">
                <Link href="/products">
                  Voir tout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <ProductGrid
              products={featuredProducts}
              isLoading={productsLoading}
              priority={true}
            />
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
                <Tag className="h-8 w-8 text-primary" />
                Catégories populaires
              </h2>
              <p className="text-gray-600 mt-2">
                Explorez nos différentes catégories de produits
              </p>
            </div>

            {categoriesLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="aspect-square bg-gray-200 animate-pulse" />
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {topCategories.map((category, index) => (
                  <motion.div
                    key={category._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Link href={`/products?categoryId=${category._id}`}>
                      <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer">
                        <div className="relative aspect-square bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                          {category.image ? (
                            <Image
                              src={category.image}
                              alt={category.name}
                              fill
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <Tag className="h-12 w-12 text-primary" />
                          )}
                        </div>
                        <CardContent className="p-4 text-center">
                          <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                            {category.name}
                          </h3>
                          {category.productsCount !== undefined && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {category.productsCount} produits
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

            {categories.length > 6 && (
              <div className="text-center mt-8">
                <Button asChild variant="outline" size="lg">
                  <Link href="/products">
                    Voir toutes les catégories
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h2 className="text-4xl font-bold">
            Prêt à découvrir nos produits ?
          </h2>
          <p className="text-lg opacity-90">
            Des milliers de produits vous attendent sur YouShop
          </p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="text-lg px-8"
          >
            <Link href="/products">
              Commencer maintenant
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
