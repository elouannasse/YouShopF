"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { ordersService } from "@/services/orders.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Mail, Calendar, ShoppingBag, DollarSign, Package } from "lucide-react";
import { formatPrice } from "@/lib/utils";

/**
 * Profile page showing user information and statistics
 */
export default function ProfilePage() {
  const { user } = useAuth();

  // Fetch user's orders for statistics
  const { data: ordersResponse, isLoading } = useQuery({
    queryKey: ["user-orders"],
    queryFn: () => ordersService.getOrders({ page: 1, limit: 100 }),
    enabled: !!user,
  });

  const orders = ordersResponse?.orders || [];
  const totalOrders = orders.length;
  const totalSpent = orders
    .filter((order) => order.status === "PAID")
    .reduce((sum, order) => sum + order.total, 0);
  const lastOrder = orders[0];

  if (!user) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Chargement de votre profil...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Mes informations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Prénom
              </label>
              <p className="text-base font-medium mt-1">{user.firstName}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Nom
              </label>
              <p className="text-base font-medium mt-1">{user.lastName}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center">
                <Mail className="h-4 w-4 mr-1" />
                Email
              </label>
              <p className="text-base text-muted-foreground mt-1">
                {user.email}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Rôle
              </label>
              <div className="mt-1">
                <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                  {user.role === "admin" ? "ADMIN" : "CLIENT"}
                </Badge>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Membre depuis
              </label>
              <p className="text-base mt-1">
                {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingBag className="h-5 w-5 mr-2" />
            Statistiques
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-32" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-3">
              {/* Total Orders */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground flex items-center">
                  <Package className="h-4 w-4 mr-1" />
                  Commandes totales
                </p>
                <p className="text-2xl font-bold">{totalOrders}</p>
              </div>

              {/* Total Spent */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  Montant total dépensé
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {formatPrice(totalSpent)}
                </p>
              </div>

              {/* Last Order */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Dernière commande
                </p>
                {lastOrder ? (
                  <p className="text-base font-medium">
                    {new Date(lastOrder.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                ) : (
                  <p className="text-base text-muted-foreground">
                    Aucune commande
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
