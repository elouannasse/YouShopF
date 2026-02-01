"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Order } from "@/types/api.types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { formatPrice } from "@/lib/utils";
import { Calendar, Package, ArrowRight } from "lucide-react";

interface OrderDetailsDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Dialog showing complete order details
 * Can be opened from orders list
 */
export function OrderDetailsDialog({
  order,
  open,
  onOpenChange,
}: OrderDetailsDialogProps) {
  const router = useRouter();

  if (!order) return null;

  const handleViewFullDetails = () => {
    onOpenChange(false);
    router.push(`/orders/${order._id}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">
                Commande #{order.orderNumber}
              </DialogTitle>
              <DialogDescription className="flex items-center mt-1">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </DialogDescription>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Order Items */}
          <div>
            <h3 className="font-semibold flex items-center mb-4">
              <Package className="h-5 w-5 mr-2" />
              Articles ({order.items.length})
            </h3>
            <div className="space-y-3">
              {order.items.map((item) => {
                const product =
                  typeof item.product === "string" ? null : item.product;
                const productName = item.name || product?.name || "Produit";
                const productImage = product?.images?.[0] || "/placeholder.png";

                return (
                  <div
                    key={item._id || item.productId}
                    className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="relative h-16 w-16 rounded-md border overflow-hidden flex-shrink-0">
                      <Image
                        src={productImage}
                        alt={productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{productName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(item.price)} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(item.subtotal)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Order Summary */}
          <div>
            <h3 className="font-semibold mb-4">Récapitulatif</h3>
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
                    <span className="text-green-600 font-medium">Gratuite</span>
                  ) : (
                    formatPrice(order.shippingCost)
                  )}
                </span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className="font-semibold mb-2">Adresse de livraison</h3>
            <div className="p-3 bg-muted/50 rounded-lg text-sm">
              <p className="font-medium">
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              </p>
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && (
                <p>{order.shippingAddress.addressLine2}</p>
              )}
              <p>
                {order.shippingAddress.postalCode} {order.shippingAddress.city}
              </p>
              <p>{order.shippingAddress.country}</p>
              <p className="mt-1 text-muted-foreground">
                Tél: {order.shippingAddress.phone}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button className="flex-1" onClick={handleViewFullDetails}>
              Voir la page complète
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
