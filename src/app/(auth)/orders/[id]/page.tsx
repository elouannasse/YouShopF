"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersService } from "@/services/orders.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Loader2,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  ArrowLeft,
  Calendar,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { OrderStatus } from "@/types/api.types";

/**
 * Order detail page with payment and cancel actions
 * Shows order items, status, countdown timer for PENDING orders
 */
export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  // Fetch order details
  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["order", resolvedParams.id],
    queryFn: () => ordersService.getOrderById(resolvedParams.id),
    refetchInterval: (query) => {
      // Refetch every 5 seconds if order is PENDING
      const data = query.state.data;
      return data?.status === "PENDING" ? 5000 : false;
    },
  });

  // Calculate time remaining for PENDING orders
  useEffect(() => {
    if (!order || order.status !== "PENDING") {
      setTimeRemaining(null);
      return;
    }

    const calculateTimeRemaining = () => {
      const expirationTime = new Date(order.expiresAt).getTime();
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((expirationTime - now) / 1000));
      setTimeRemaining(remaining);

      // Refresh query when timer expires
      if (remaining === 0) {
        queryClient.invalidateQueries({
          queryKey: ["order", resolvedParams.id],
        });
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [order, queryClient, resolvedParams.id]);

  // Pay order mutation
  const payMutation = useMutation({
    mutationFn: () => ordersService.payOrder(resolvedParams.id),
    onSuccess: () => {
      toast.success("Paiement effectué avec succès ! 🎉");
      queryClient.invalidateQueries({ queryKey: ["order", resolvedParams.id] });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Erreur lors du paiement";
      toast.error(errorMessage);
    },
  });

  // Cancel order mutation
  const cancelMutation = useMutation({
    mutationFn: () => ordersService.cancelOrder(resolvedParams.id),
    onSuccess: () => {
      toast.success("Commande annulée");
      queryClient.invalidateQueries({ queryKey: ["order", resolvedParams.id] });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Erreur lors de l'annulation";
      toast.error(errorMessage);
    },
  });

  // Format time remaining
  const formatTimeRemaining = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  // Get status badge variant and icon
  const getStatusDisplay = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return {
          variant: "secondary" as const,
          icon: <Clock className="h-4 w-4" />,
          label: "En attente de paiement",
        };
      case "PAID":
        return {
          variant: "default" as const,
          icon: <CheckCircle className="h-4 w-4" />,
          label: "Payée",
        };
      case "CANCELLED":
        return {
          variant: "destructive" as const,
          icon: <XCircle className="h-4 w-4" />,
          label: "Annulée",
        };
      default:
        return {
          variant: "outline" as const,
          icon: null,
          label: status,
        };
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">
              Chargement de la commande...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <XCircle className="h-12 w-12 text-destructive" />
                <h2 className="text-2xl font-bold">Commande introuvable</h2>
                <p className="text-muted-foreground">
                  La commande demandée n&apos;existe pas ou vous n&apos;avez pas
                  accès à celle-ci.
                </p>
                <Button asChild>
                  <Link href="/orders">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voir mes commandes
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const statusDisplay = getStatusDisplay(order.status);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Commande #{order.orderNumber}
              </h1>
              <div className="flex items-center text-sm text-muted-foreground space-x-4">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            <Badge
              variant={statusDisplay.variant}
              className="text-sm px-3 py-1"
            >
              <span className="flex items-center space-x-1">
                {statusDisplay.icon}
                <span>{statusDisplay.label}</span>
              </span>
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Order items and details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Countdown timer for PENDING orders */}
            {order.status === "PENDING" && timeRemaining !== null && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-yellow-900 mb-1">
                        Temps restant pour payer
                      </h3>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-bold text-yellow-900">
                          {formatTimeRemaining(timeRemaining)}
                        </span>
                        <span className="text-sm text-yellow-800">minutes</span>
                      </div>
                      <p className="text-sm text-yellow-800 mt-2">
                        Votre commande sera annulée automatiquement si le
                        paiement n&apos;est pas effectué avant l&apos;expiration
                        du délai.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Success message for PAID orders */}
            {order.status === "PAID" && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-green-900 mb-1">
                        Paiement confirmé
                      </h3>
                      <p className="text-sm text-green-800">
                        Votre commande a été payée avec succès et est en cours
                        de préparation. Vous recevrez un email de confirmation
                        sous peu.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Cancelled message */}
            {order.status === "CANCELLED" && (
              <Card className="border-destructive bg-red-50">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-red-900 mb-1">
                        Commande annulée
                      </h3>
                      <p className="text-sm text-red-800">
                        Cette commande a été annulée. Les articles ne sont plus
                        réservés.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Order items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Articles commandés ({order.items.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item) => {
                  const product =
                    typeof item.product === "string" ? null : item.product;
                  const productName = item.name || product?.name || "Produit";
                  const productImage =
                    product?.images?.[0] || "/placeholder.png";

                  return (
                    <div
                      key={item.productId}
                      className="flex items-center space-x-4"
                    >
                      <div className="relative h-20 w-20 rounded-md border overflow-hidden flex-shrink-0">
                        <Image
                          src={productImage}
                          alt={productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{productName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatPrice(item.price)} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatPrice(item.subtotal)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Order summary and actions */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Récapitulatif</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">TVA (20%)</span>
                    <span>{formatPrice(order.tax)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Livraison</span>
                    <span>
                      {order.shippingCost === 0 ? (
                        <span className="text-green-600 font-medium">
                          Gratuite
                        </span>
                      ) : (
                        formatPrice(order.shippingCost)
                      )}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>

                {/* Actions for PENDING orders */}
                {order.status === "PENDING" && (
                  <div className="space-y-2 pt-4">
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={() => payMutation.mutate()}
                      disabled={
                        payMutation.isPending ||
                        cancelMutation.isPending ||
                        timeRemaining === 0
                      }
                    >
                      {payMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Paiement en cours...
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-2 h-4 w-4" />
                          Payer maintenant
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => cancelMutation.mutate()}
                      disabled={
                        payMutation.isPending || cancelMutation.isPending
                      }
                    >
                      {cancelMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Annulation...
                        </>
                      ) : (
                        <>
                          <XCircle className="mr-2 h-4 w-4" />
                          Annuler la commande
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {/* Button for PAID/CANCELLED orders */}
                {order.status !== "PENDING" && (
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/products">
                      <Package className="mr-2 h-4 w-4" />
                      Continuer mes achats
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
