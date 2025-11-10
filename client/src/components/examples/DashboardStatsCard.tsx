import DashboardStatsCard from '../DashboardStatsCard';
import { Heart, Clock, Users, TrendingUp } from 'lucide-react';

export default function DashboardStatsCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      <DashboardStatsCard
        icon={Heart}
        title="Total Contributions"
        value={24}
        description="Lifetime contributions"
      />
      <DashboardStatsCard
        icon={Clock}
        title="Volunteer Hours"
        value={156}
        description="This year"
      />
      <DashboardStatsCard
        icon={Users}
        title="Events Attended"
        value={12}
        description="Past 6 months"
      />
      <DashboardStatsCard
        icon={TrendingUp}
        title="Impact Score"
        value={850}
        description="Community ranking"
      />
    </div>
  );
}
