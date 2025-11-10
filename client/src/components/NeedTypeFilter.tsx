import { Button } from "@/components/ui/button";
import { AlertCircle, Package, Users, TrendingUp } from "lucide-react";
import { type LucideIcon } from "lucide-react";

type NeedType = 'all' | 'urgent' | 'material' | 'volunteer' | 'campaign';

interface NeedTypeFilterProps {
  selected: NeedType;
  onSelect: (type: NeedType) => void;
}

const filterOptions: { type: NeedType; label: string; icon?: LucideIcon; colorClass: string }[] = [
  { type: 'all', label: 'All Needs', colorClass: 'border-primary text-primary data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground' },
  { type: 'urgent', label: 'Urgent', icon: AlertCircle, colorClass: 'border-red-600 text-red-600 data-[selected=true]:bg-red-600 data-[selected=true]:text-white' },
  { type: 'material', label: 'Material', icon: Package, colorClass: 'border-blue-600 text-blue-600 data-[selected=true]:bg-blue-600 data-[selected=true]:text-white' },
  { type: 'volunteer', label: 'Volunteer', icon: Users, colorClass: 'border-green-600 text-green-600 data-[selected=true]:bg-green-600 data-[selected=true]:text-white' },
  { type: 'campaign', label: 'Campaign', icon: TrendingUp, colorClass: 'border-purple-600 text-purple-600 data-[selected=true]:bg-purple-600 data-[selected=true]:text-white' },
];

export default function NeedTypeFilter({ selected, onSelect }: NeedTypeFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {filterOptions.map(({ type, label, icon: Icon, colorClass }) => (
        <Button
          key={type}
          variant="outline"
          size="sm"
          data-selected={selected === type}
          className={`rounded-full border-2 font-semibold whitespace-nowrap no-default-hover-elevate ${colorClass}`}
          onClick={() => onSelect(type)}
          data-testid={`filter-${type}`}
        >
          {Icon && <Icon className="h-4 w-4 mr-1" />}
          {label}
        </Button>
      ))}
    </div>
  );
}
