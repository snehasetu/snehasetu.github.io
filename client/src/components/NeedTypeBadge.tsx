import { Badge } from "@/components/ui/badge";
import { AlertCircle, Package, Users, TrendingUp } from "lucide-react";
import { type LucideIcon } from "lucide-react";

type NeedType = 'urgent' | 'material' | 'volunteer' | 'campaign';

interface NeedTypeBadgeProps {
  type: NeedType;
  className?: string;
}

const needTypeConfig: Record<NeedType, { 
  label: string; 
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
}> = {
  urgent: {
    label: 'URGENT',
    icon: AlertCircle,
    colorClass: 'text-white',
    bgClass: 'bg-red-600 hover:bg-red-600',
  },
  material: {
    label: 'MATERIAL',
    icon: Package,
    colorClass: 'text-white',
    bgClass: 'bg-blue-600 hover:bg-blue-600',
  },
  volunteer: {
    label: 'VOLUNTEER',
    icon: Users,
    colorClass: 'text-white',
    bgClass: 'bg-green-600 hover:bg-green-600',
  },
  campaign: {
    label: 'CAMPAIGN',
    icon: TrendingUp,
    colorClass: 'text-white',
    bgClass: 'bg-purple-600 hover:bg-purple-600',
  },
};

export default function NeedTypeBadge({ type, className = '' }: NeedTypeBadgeProps) {
  const config = needTypeConfig[type];
  const Icon = config.icon;

  return (
    <Badge 
      className={`${config.bgClass} ${config.colorClass} no-default-hover-elevate flex items-center gap-1 text-xs font-semibold tracking-wide ${className}`}
      data-testid={`badge-need-${type}`}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
