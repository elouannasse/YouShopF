import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "blue" | "green" | "yellow" | "red" | "purple";
  className?: string;
}

const colorVariants = {
  blue: {
    gradient: "from-blue-500 to-blue-600",
    bg: "bg-blue-50",
    shadow: "shadow-blue-500/20",
  },
  purple: {
    gradient: "from-purple-500 to-purple-600",
    bg: "bg-purple-50",
    shadow: "shadow-purple-500/20",
  },
  green: {
    gradient: "from-green-500 to-green-600",
    bg: "bg-green-50",
    shadow: "shadow-green-500/20",
  },
  yellow: {
    gradient: "from-yellow-500 to-yellow-600",
    bg: "bg-yellow-50",
    shadow: "shadow-yellow-500/20",
  },
  red: {
    gradient: "from-red-500 to-red-600",
    bg: "bg-red-50",
    shadow: "shadow-red-500/20",
  },
};

export function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  color = "blue",
  className,
}: MetricCardProps) {
  const variant = colorVariants[color];

  return (
    <Card
      className={cn(
        "relative overflow-hidden border-0 bg-white p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl",
        variant.shadow,
        className,
      )}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50" />
      <div
        className={cn(
          "absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full opacity-10 bg-gradient-to-br",
          variant.gradient,
        )}
      />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg",
              variant.gradient,
            )}
          >
            <Icon className="h-6 w-6" />
          </div>

          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
                trend.isPositive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700",
              )}
            >
              <span>{trend.isPositive ? "↗" : "↘"}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
        </div>
      </div>
    </Card>
  );
}
