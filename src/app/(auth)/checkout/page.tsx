"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";
import { ordersService } from "@/services/orders.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, ShoppingBag, Clock, Package, CreditCard } from "lucide-react";
import { formatPrice } from "@/lib/utils";

/**
 * Checkout page with order summary and confirmation
 * Protected route that validates cart and creates order
 */
export default function CheckoutPage() {
  const router = useRouter();
  const { items, getOrderItems, clearCart } = useCartStore();

  const [isValidating, setIsValidating] = useState(true);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [calculatedSummary, setCalculatedSummary] = useState<{
    subtotal: number;
    tax: number;
    shippingCost: number;
    total: number;
  } | null>(null);

  // Validate cart and calculate order summary on mount
  useEffect(() => {
    const validateAndCalculate = async () => {
      // Redirect if cart is empty
      if (items.length === 0) {
        toast.error("Votre panier est vide");
        router.push("/products");
        return;
      }

      try {
        // Call backend to validate stock and calculate totals
        const orderItems = getOrderItems();
        const summary = await ordersService.calculateOrderSummary({
          items: orderItems,
        });

        setCalculatedSummary(summary);
      } catch (error: any) {
        console.error("Error calculating order:", error);
        const errorMessage =
          error.response?.data?.message ||
          "Erreur lors du calcul de la commande";
        toast.error(errorMessage);

        // If stock error, redirect to cart to fix quantities
        if (
          errorMessage.includes("stock") ||
          errorMessage.includes("disponible")
        ) {
          router.push("/products");
        }
      } finally {
        setIsValidating(false);
      }
    };

    validateAndCalculate();
  }, [items, getOrderItems, router]);

  const handleConfirmOrder = async () => {
    if (!calculatedSummary) return;

    setIsCreatingOrder(true);

    try {
      const orderItems = getOrderItems();
      const order = await ordersService.createOrder({
        items: orderItems,
        shippingAddress: {
          firstName: "Client",
          lastName: "Demo",
          addressLine1: "123 Rue Example",
          city: "Paris",
          postalCode: "75001",
          country: "France",
          phone: "+33123456789",
        },
        paymentMethod: "card",
      });

      toast.success("Commande créée avec succès !", {
        description: `Numéro de commande: ${order.orderNumber}`,
      });

      // Clear cart and redirect to order detail
      clearCart();
      router.push(`/orders/${order._id}`);
    } catch (error: any) {
      console.error("Error creating order:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Erreur lors de la création de la commande";
      toast.error(errorMessage);

      // If stock error, redirect to products to fix cart
      if (
        errorMessage.includes("stock") ||
        errorMessage.includes("disponible")
      ) {
        router.push("/products");
      }
    } finally {
      setIsCreatingOrder(false);
    }
  };

  // Loading state
  if (isValidating) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">
              Validation de votre panier...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If validation failed, don't render anything (redirect will happen)
  if (!calculatedSummary) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Confirmation de commande</h1>
          <p className="text-muted-foreground">
            Vérifiez votre commande avant de confirmer
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Order items */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Articles commandés ({items.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => {
                  const product =
                    typeof item.product === "string" ? null : item.product;
                  const productName = item.name || product?.name || "Produit";
                  const productImage =
                    item.image || product?.images?.[0] || "/placeholder.png";
                  const productPrice = item.price || product?.price || 0;

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
                          {formatPrice(productPrice)} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatPrice(item.subtotal || 0)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Reservation notice */}
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-yellow-900 mb-1">
                      Réservation de 30 minutes
                    </h3>
                    <p className="text-sm text-yellow-800">
                      Vos articles sont réservés pendant 30 minutes. Passé ce
                      délai, votre commande sera automatiquement annulée si elle
                      n&apos;est pas payée.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Récapitulatif</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span>{formatPrice(calculatedSummary.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">TVA (20%)</span>
                    <span>{formatPrice(calculatedSummary.tax)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Livraison</span>
                    <span>
                      {calculatedSummary.shippingCost === 0 ? (
                        <span className="text-green-600 font-medium">
                          Gratuite
                        </span>
                      ) : (
                        formatPrice(calculatedSummary.shippingCost)
                      )}
                    </span>
                  </div>

                  {calculatedSummary.shippingCost === 0 &&
                    calculatedSummary.subtotal >= 50 && (
                      <p className="text-xs text-green-600">
                        🎉 Livraison gratuite à partir de 50€
                      </p>
                    )}
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(calculatedSummary.total)}</span>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleConfirmOrder}
                  disabled={isCreatingOrder}
                >
                  {isCreatingOrder ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Création en cours...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Confirmer la commande
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push("/products")}
                  disabled={isCreatingOrder}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Continuer mes achats
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
