"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ordersService } from "@/services/orders.service";
import { Order, OrderStatus } from "@/types/api.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrdersList } from "@/components/orders/OrdersList";
import { OrderDetailsDialog } from "@/components/orders/OrderDetailsDialog";
import { Filter } from "lucide-react";

type FilterStatus = "all" | OrderStatus;

/**
 * Orders history page with filtering and details dialog
 */
export default function OrdersHistoryPage() {
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch all user orders
  const {
    data: ordersResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user-orders"],
    queryFn: () => ordersService.getOrders({ page: 1, limit: 100 }),
    staleTime: 60000, // Cache for 1 minute
  });

  const allOrders = ordersResponse?.orders || [];

  // Filter orders by status
  const filteredOrders = useMemo(() => {
    if (selectedStatus === "all") {
      return allOrders;
    }
    return allOrders.filter((order) => order.status === selectedStatus);
  }, [allOrders, selectedStatus]);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header with Filter */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="flex items-center">
              Mes commandes
              {filteredOrders.length > 0 && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({filteredOrders.length} commande
                  {filteredOrders.length > 1 ? "s" : ""})
                </span>
              )}
            </CardTitle>

            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={selectedStatus}
                onValueChange={(value: FilterStatus) => setSelectedStatus(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="PENDING">En attente</SelectItem>
                  <SelectItem value="PAID">Payées</SelectItem>
                  <SelectItem value="CANCELLED">Annulées</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-center text-destructive">
              Erreur lors du chargement des commandes
            </p>
          ) : (
            <OrdersList
              orders={filteredOrders}
              isLoading={isLoading}
              emptyMessage={
                selectedStatus === "all"
                  ? "Vous n'avez pas encore passé de commande"
                  : `Aucune commande ${
                      selectedStatus === "PENDING"
                        ? "en attente"
                        : selectedStatus === "PAID"
                        ? "payée"
                        : "annulée"
                    }`
              }
              onViewDetails={handleViewDetails}
            />
          )}
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <OrderDetailsDialog
        order={selectedOrder}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
