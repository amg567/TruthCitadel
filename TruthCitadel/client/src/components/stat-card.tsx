import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendColor?: "green" | "yellow" | "red";
}

export function StatCard({ title, value, icon: Icon, trend, trendColor = "green" }: StatCardProps) {
  const trendColorClass = {
    green: "text-green-400",
    yellow: "text-yellow-400",
    red: "text-red-400",
  }[trendColor];

  return (
    <Card className="bg-academia-brown/30 border-academia-gold/20 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-academia-beige/70 text-sm">{title}</p>
            <p className="text-2xl font-bold text-academia-gold">{value}</p>
          </div>
          <Icon className="w-8 h-8 text-academia-gold/50" />
        </div>
        {trend && (
          <div className="mt-4">
            <span className={`text-sm ${trendColorClass}`}>{trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
