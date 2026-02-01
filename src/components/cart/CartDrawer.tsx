"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CartItem } from "./CartItem";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

/**
 * CartDrawer component
 * Lateral drawer showing cart items, summary, and checkout button
 */
export const CartDrawer: React.FC = () => {
  const router = useRouter();
  const [showClearDialog, setShowClearDialog] = useState(false);

  const {
    items,
    subtotal,
    tax,
    shippingCost,
    total,
    isOpen,
    updateQuantity,
    removeItem,
    clearCart,
    closeCart,
    getTotalItems,
  } = useCartStore();

  const totalItems = getTotalItems();
  const isEmpty = items.length === 0;

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    updateQuantity(productId, quantity);
    toast.success("Quantité mise à jour");
  };

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
    toast.success("Produit retiré du panier");
  };

  const handleClearCart = () => {
    clearCart();
    setShowClearDialog(false);
    toast.success("Panier vidé");
  };

  const handleCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs animate-bounce"
              >
                {totalItems}
              </Badge>
            )}
            <span className="sr-only">Panier ({totalItems} articles)</span>
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col">
          <SheetHeader>
            <SheetTitle>Panier ({totalItems} articles)</SheetTitle>
            <SheetDescription>
              {isEmpty
                ? "Votre panier est vide"
                : "Gérez vos articles avant de passer commande"}
            </SheetDescription>
          </SheetHeader>

          {/* Cart Items */}
          {isEmpty ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Votre panier est vide</p>
              <p className="text-sm text-muted-foreground mb-4">
                Découvrez nos produits et ajoutez-les à votre panier
              </p>
              <Button asChild onClick={closeCart}>
                <Link href="/products">Découvrir le catalogue</Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Scrollable Items List */}
              <div className="flex-1 overflow-y-auto py-4">
                {items.map((item) => (
                  <CartItem
                    key={
                      typeof item.product === "string"
                        ? item.product
                        : item.product.id
                    }
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </div>

              {/* Summary */}
              <div className="space-y-4 pt-4 border-t">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Taxes (20%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Livraison</span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-green-600 font-medium">
                          Gratuite
                        </span>
                      ) : (
                        formatPrice(shippingCost)
                      )}
                    </span>
                  </div>

                  {subtotal < 50 && (
                    <p className="text-xs text-muted-foreground">
                      Livraison gratuite à partir de {formatPrice(50)}
                    </p>
                  )}

                  <Separator />

                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button
                    onClick={handleCheckout}
                    className="w-full"
                    size="lg"
                    disabled={isEmpty}
                  >
                    Valider la commande
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setShowClearDialog(true)}
                    className="w-full"
                    size="sm"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Vider le panier
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Clear Cart Confirmation Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Vider le panier ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprimera tous les articles de votre panier. Cette
              action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearCart}>
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
