import { Card, CardContent } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";

interface DashboardStatsCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  description?: string;
  iconColor?: string;
}

export default function DashboardStatsCard({
  icon: Icon,
  title,
  value,
  description,
  iconColor = 'text-primary',
}: DashboardStatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full bg-muted ${iconColor}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold" data-testid={`stat-${title.toLowerCase().replace(/\s+/g, '-')}`}>{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
