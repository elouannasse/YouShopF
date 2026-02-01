"use client";

import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/types/api.types";
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

/**
 * Badge component with color and icon for order status
 */
export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const config = {
    PENDING: {
      label: "En attente",
      variant: "secondary" as const,
      className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      icon: Clock,
    },
    PAID: {
      label: "Payée",
      variant: "default" as const,
      className: "bg-green-100 text-green-800 hover:bg-green-100",
      icon: CheckCircle,
    },
    CANCELLED: {
      label: "Annulée",
      variant: "destructive" as const,
      className: "bg-red-100 text-red-800 hover:bg-red-100",
      icon: XCircle,
    },
    EXPIRED: {
      label: "Expirée",
      variant: "outline" as const,
      className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
      icon: AlertCircle,
    },
  };

  const statusConfig = config[status] || config.PENDING;
  const Icon = statusConfig.icon;

  return (
    <Badge
      variant={statusConfig.variant}
      className={cn(statusConfig.className, className)}
    >
      <Icon className="h-3 w-3 mr-1" />
      {statusConfig.label}
    </Badge>
  );
}
