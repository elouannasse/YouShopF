"use client";

import { Card } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import type { StatusCount } from "@/services/analytics.service";

interface StatusPieChartProps {
  data: StatusCount[];
  title?: string;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  PAID: "Payées",
  CANCELLED: "Annulées",
  EXPIRED: "Expirées",
};

export function StatusPieChart({
  data,
  title = "Commandes par status",
}: StatusPieChartProps) {
  // Transformer les données pour Recharts
  const chartData = data.map((item) => ({
    name: STATUS_LABELS[item.status] || item.status,
    value: item.count,
    color: item.color,
  }));

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>

      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-[300px] text-muted-foreground">
          Aucune donnée disponible
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background border rounded-lg shadow-lg p-3">
                      <p className="text-sm font-medium">{payload[0].name}</p>
                      <p className="text-lg font-bold">
                        {payload[0].value} commande
                        {(payload[0].value as number) > 1 ? "s" : ""}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value) => (
                <span className="text-sm text-muted-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
