import type { Order, Product } from "@/types/api.types";

/**
 * Analytics Service
 * Calcule les métriques et statistiques pour le dashboard admin
 */

export interface DashboardMetrics {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  productsChange?: number; // % variation
  ordersChange?: number;
  revenueChange?: number;
  pendingChange?: number;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  formattedDate: string; // Pour affichage (ex: "25 Jan")
}

export interface StatusCount {
  status: string;
  count: number;
  color: string;
}

export interface LowStockProduct {
  _id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
}

export const analyticsService = {
  /**
   * Calcule les KPIs du dashboard
   */
  getDashboardMetrics(
    products: Product[],
    orders: Order[]
  ): DashboardMetrics {
    const totalProducts = products.length;
    const totalOrders = orders.length;
    
    // Calculer revenus total (seulement commandes PAID)
    const totalRevenue = orders
      .filter((order) => order.status === "PAID")
      .reduce((sum, order) => sum + (order.total || 0), 0);
    
    // Compter commandes en attente
    const pendingOrders = orders.filter(
      (order) => order.status === "PENDING"
    ).length;

    // TODO: Calculer les variations % vs période précédente
    // Nécessiterait des données historiques ou un filtre de date

    return {
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingOrders,
    };
  },

  /**
   * Agrège les revenus par jour sur X jours
   */
  getRevenueData(orders: Order[], days: number = 7): RevenueDataPoint[] {
    const now = new Date();
    const dataMap = new Map<string, number>();

    // Initialiser tous les jours à 0
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split("T")[0]; // YYYY-MM-DD
      dataMap.set(dateKey, 0);
    }

    // Agréger les revenus des commandes PAID
    orders
      .filter((order) => order.status === "PAID")
      .forEach((order) => {
        const orderDate = new Date(order.createdAt);
        const dateKey = orderDate.toISOString().split("T")[0];
        
        if (dataMap.has(dateKey)) {
          dataMap.set(dateKey, dataMap.get(dateKey)! + (order.total || 0));
        }
      });

    // Convertir en array et formater les dates
    return Array.from(dataMap.entries())
      .map(([date, revenue]) => {
        const dateObj = new Date(date);
        const formattedDate = dateObj.toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "short",
        });
        
        return {
          date,
          revenue,
          formattedDate,
        };
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  },

  /**
   * Compte les commandes par status
   */
  getOrdersByStatus(orders: Order[]): StatusCount[] {
    const statusMap = new Map<string, number>();
    const colorMap: Record<string, string> = {
      PENDING: "#eab308", // yellow-600
      PAID: "#22c55e", // green-600
      CANCELLED: "#ef4444", // red-600
      EXPIRED: "#6b7280", // gray-600
    };

    orders.forEach((order) => {
      const count = statusMap.get(order.status) || 0;
      statusMap.set(order.status, count + 1);
    });

    return Array.from(statusMap.entries()).map(([status, count]) => ({
      status,
      count,
      color: colorMap[status] || "#6b7280",
    }));
  },

  /**
   * Filtre les produits avec stock faible
   */
  getLowStockProducts(
    products: Product[],
    threshold: number = 5
  ): LowStockProduct[] {
    return products
      .filter((product) => product.stock < threshold)
      .map((product) => ({
        _id: product._id,
        name: product.name,
        category: product.category?.name || "Sans catégorie",
        stock: product.stock,
        price: product.price,
      }))
      .sort((a, b) => a.stock - b.stock); // Trier par stock croissant
  },

  /**
   * Obtient les dernières commandes (triées par date DESC)
   */
  getRecentOrders(orders: Order[], limit: number = 10): Order[] {
    return [...orders]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, limit);
  },

  /**
   * Calcule le revenu moyen par commande
   */
  getAverageOrderValue(orders: Order[]): number {
    const paidOrders = orders.filter((order) => order.status === "PAID");
    if (paidOrders.length === 0) return 0;

    const totalRevenue = paidOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    return totalRevenue / paidOrders.length;
  },

  /**
   * Obtient le produit le plus vendu
   */
  getBestSellingProduct(orders: Order[]): { productId: string; quantity: number; name: string } | null {
    const productQuantities = new Map<string, { quantity: number; name: string }>();

    orders
      .filter((order) => order.status === "PAID")
      .forEach((order) => {
        order.items.forEach((item) => {
          const current = productQuantities.get(item.product._id) || { quantity: 0, name: item.product.name };
          productQuantities.set(item.product._id, {
            quantity: current.quantity + item.quantity,
            name: item.product.name,
          });
        });
      });

    if (productQuantities.size === 0) return null;

    const entries = Array.from(productQuantities.entries());
    entries.sort((a, b) => b[1].quantity - a[1].quantity);
    
    const [productId, data] = entries[0];
    return { productId, ...data };
  },
};
