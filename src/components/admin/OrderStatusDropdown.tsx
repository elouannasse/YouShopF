"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { toast } from "sonner";
import { ordersService } from "@/services/orders.service";
import type { OrderStatus } from "@/types/api.types";

interface OrderStatusDropdownProps {
  orderId: string;
  currentStatus: OrderStatus;
  disabled?: boolean;
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "En attente",
  PAID: "Payée",
  CANCELLED: "Annulée",
  EXPIRED: "Expirée",
};

export function OrderStatusDropdown({
  orderId,
  currentStatus,
  disabled = false,
}: OrderStatusDropdownProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: (status: OrderStatus) =>
      ordersService.updateOrderStatus(orderId, status as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      toast.success("Statut de la commande mis à jour");
      setShowConfirmDialog(false);
      setSelectedStatus(null);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Erreur lors de la mise à jour du statut"
      );
      setShowConfirmDialog(false);
      setSelectedStatus(null);
    },
  });

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status as OrderStatus);
    setShowConfirmDialog(true);
  };

  const handleConfirm = () => {
    if (selectedStatus) {
      updateStatusMutation.mutate(selectedStatus);
    }
  };

  return (
    <>
      <Select
        value={currentStatus}
        onValueChange={handleStatusChange}
        disabled={disabled || updateStatusMutation.isPending}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(STATUS_LABELS).map(([status, label]) => (
            <SelectItem key={status} value={status}>
              <div className="flex items-center gap-2">
                {status === currentStatus && <Check className="h-4 w-4" />}
                {label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer le changement de statut</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir changer le statut de cette commande vers{" "}
              <strong>
                {selectedStatus ? STATUS_LABELS[selectedStatus] : ""}
              </strong>{" "}
              ?
              <br />
              <br />
              Cette action est irréversible et peut affecter le suivi de la
              commande.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
