import { Heart, Users, Home, TrendingUp } from "lucide-react";

interface StatItemProps {
  icon: React.ReactNode;
  value: string;
  label: string;
}

function StatItem({ icon, value, label }: StatItemProps) {
  return (
    <div className="flex flex-col items-center text-center p-6">
      <div className="mb-4 text-primary">
        {icon}
      </div>
      <div className="text-4xl font-bold mb-2" data-testid={`stat-value-${label.toLowerCase().replace(/\s+/g, '-')}`}>{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

export default function ImpactStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatItem
        icon={<Heart className="h-10 w-10" />}
        value="2,500+"
        label="Needs Fulfilled"
      />
      <StatItem
        icon={<Users className="h-10 w-10" />}
        value="15,000+"
        label="Active Volunteers"
      />
      <StatItem
        icon={<Home className="h-10 w-10" />}
        value="250+"
        label="Registered Homes"
      />
      <StatItem
        icon={<TrendingUp className="h-10 w-10" />}
        value="₹1.2Cr+"
        label="Funds Raised"
      />
    </div>
  );
}
