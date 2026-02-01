"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  Package,
  ShoppingCart,
  DollarSign,
  Clock,
  Eye,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { MetricCard } from "@/components/admin/MetricCard";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { StatusPieChart } from "@/components/admin/StatusPieChart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { productsService } from "@/services/products.service";
import { ordersService } from "@/services/orders.service";
import { analyticsService } from "@/services/analytics.service";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types/api.types";

export default function AdminDashboardPage() {
  const [revenuePeriod, setRevenuePeriod] = useState<7 | 30 | 90>(7);

  // Fetch products
  const { data: productsResponse, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => productsService.getProducts({ page: 1, limit: 1000 }),
    staleTime: 30000, // 30 secondes
    refetchInterval: 30000, // Refresh auto toutes les 30s
  });

  // Fetch orders
  const { data: ordersResponse, isLoading: isLoadingOrders } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => ordersService.getOrders({ page: 1, limit: 1000 }),
    staleTime: 30000,
    refetchInterval: 30000,
  });

  const products = productsResponse?.products || [];
  const orders = ordersResponse?.orders || [];

  // Calculer les métriques
  const metrics = useMemo(
    () => analyticsService.getDashboardMetrics(products, orders),
    [products, orders]
  );

  // Données pour les graphiques
  const revenueData = useMemo(
    () => analyticsService.getRevenueData(orders, revenuePeriod),
    [orders, revenuePeriod]
  );

  const statusData = useMemo(
    () => analyticsService.getOrdersByStatus(orders),
    [orders]
  );

  // Dernières commandes
  const recentOrders = useMemo(
    () => analyticsService.getRecentOrders(orders, 10),
    [orders]
  );

  // Produits critiques (stock < 5)
  const lowStockProducts = useMemo(
    () => analyticsService.getLowStockProducts(products, 5),
    [products]
  );

  const isLoading = isLoadingProducts || isLoadingOrders;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-slate-600 mt-2 text-lg">
              Vue d'ensemble de votre boutique
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-slate-500">Dernière mise à jour</p>
              <p className="text-sm font-medium text-slate-700">
                {new Date().toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {isLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-[160px] bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl" />
              </div>
            ))}
          </>
        ) : (
          <>
            <MetricCard
              title="Total Produits"
              value={metrics.totalProducts}
              icon={Package}
              color="blue"
            />
            <MetricCard
              title="Total Commandes"
              value={metrics.totalOrders}
              icon={ShoppingCart}
              color="purple"
            />
            <MetricCard
              title="Revenus Total"
              value={formatPrice(metrics.totalRevenue)}
              icon={DollarSign}
              color="green"
            />
            <MetricCard
              title="Commandes en attente"
              value={metrics.pendingOrders}
              icon={Clock}
              color="yellow"
            />
          </>
        )}
      </div>

      {/* Graphiques */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Revenus */}
        <Card className="p-6 border-0 shadow-lg bg-white">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-slate-200 rounded w-1/3" />
              <div className="h-[300px] bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Revenus des {revenuePeriod} derniers jours
                  </h3>
                  <p className="text-sm text-slate-500">Évolution du chiffre d'affaires</p>
                </div>
                <Select
                  value={revenuePeriod.toString()}
                  onValueChange={(value) =>
                    setRevenuePeriod(Number(value) as 7 | 30 | 90)
                  }
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 jours</SelectItem>
                    <SelectItem value="30">30 jours</SelectItem>
                    <SelectItem value="90">90 jours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <RevenueChart data={revenueData} title="" />
            </div>
          )}
        </Card>

        {/* Status des commandes */}
        <Card className="p-6 border-0 shadow-lg bg-white">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-slate-200 rounded w-1/2" />
              <div className="h-[300px] bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg" />
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Statut des commandes</h3>
                <p className="text-sm text-slate-500">Répartition par statut</p>
              </div>
              <StatusPieChart data={statusData} />
            </div>
          )}
        </Card>
      </div>

      {/* Dernières Commandes */}
      <Card className="p-6 border-0 shadow-lg bg-white mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Dernières Commandes</h3>
            <p className="text-sm text-slate-500 mt-1">
              Les 10 commandes les plus récentes
            </p>
          </div>
          <Button variant="outline" asChild className="hover:bg-slate-50">
            <Link href="/admin/orders">Voir toutes</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Aucune commande</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Numéro</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order: Order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">
                      #{order.orderNumber}
                    </TableCell>
                    <TableCell>{order.user.email}</TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatPrice(order.totalAmount)}
                    </TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/orders/${order._id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Produits Critiques (Stock Faible) */}
      <Card className="p-6 border-0 shadow-lg bg-white">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-red-600 text-white">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Produits Critiques</h3>
            <p className="text-sm text-slate-500">
              Stock inférieur à 5 unités
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        ) : lowStockProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <TrendingUp className="h-12 w-12 text-green-600 mb-4" />
            <p className="text-muted-foreground">
              Tous les produits ont un stock suffisant
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Prix</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStockProducts.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-right">
                      <span className="text-destructive font-semibold">
                        {product.stock}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPrice(product.price)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/products/${product._id}`}>
                          Modifier
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}
