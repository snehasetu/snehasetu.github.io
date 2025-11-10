import DashboardStatsCard from "@/components/DashboardStatsCard";
import NeedTypeBadge from "@/components/NeedTypeBadge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Heart, Clock, Users, TrendingUp, Calendar } from "lucide-react";

// TODO: Remove mock data - replace with real API data
const mockStats = {
  contributions: 24,
  hours: 156,
  events: 12,
  impactScore: 850,
};

const mockUpcomingEvents = [
  { id: '1', title: 'Reading Session at Sunrise Home', date: '2024-11-15', time: '10:00 AM' },
  { id: '2', title: 'Fitness Class at Golden Years', date: '2024-11-18', time: '3:00 PM' },
  { id: '3', title: 'Music Performance at Peaceful Haven', date: '2024-11-22', time: '2:00 PM' },
];

const mockContributions = [
  { id: '1', type: 'volunteer' as const, title: 'Reading Volunteers', date: '2024-11-10', home: 'Sunrise Care Home' },
  { id: '2', type: 'material' as const, title: 'Winter Blankets', date: '2024-11-08', home: 'Golden Years Home' },
  { id: '3', type: 'campaign' as const, title: 'Medical Equipment Fund', date: '2024-11-05', home: 'Serene Sunset Home' },
  { id: '4', type: 'urgent' as const, title: 'Medical Supplies', date: '2024-11-02', home: 'Peaceful Haven' },
];

export default function VolunteerDashboard() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-4xl font-bold mb-8">Volunteer Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <DashboardStatsCard
              icon={Heart}
              title="Total Contributions"
              value={mockStats.contributions}
              description="Lifetime contributions"
            />
            <DashboardStatsCard
              icon={Clock}
              title="Volunteer Hours"
              value={mockStats.hours}
              description="This year"
            />
            <DashboardStatsCard
              icon={Users}
              title="Events Attended"
              value={mockStats.events}
              description="Past 6 months"
            />
            <DashboardStatsCard
              icon={TrendingUp}
              title="Impact Score"
              value={mockStats.impactScore}
              description="Community ranking"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
              <div className="space-y-3">
                {mockUpcomingEvents.map((event) => (
                  <div key={event.id} className="p-4 border rounded-md hover-elevate">
                    <h3 className="font-semibold mb-2">{event.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{event.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Contribution History</h2>
              <div className="space-y-3">
                {mockContributions.map((contribution) => (
                  <div key={contribution.id} className="p-4 border rounded-md">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">{contribution.title}</h3>
                      <NeedTypeBadge type={contribution.type} />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{contribution.home}</span>
                      <span>•</span>
                      <span>{contribution.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
