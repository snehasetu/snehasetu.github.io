import { useState } from "react";
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DashboardStatsCard from "@/components/DashboardStatsCard";
import NeedTypeBadge from "@/components/NeedTypeBadge";
import PostNeedDialog from "@/components/PostNeedDialog";
import { LayoutDashboard, ListChecks, Settings, Plus } from "lucide-react";

// TODO: Remove mock data - replace with real API data
const mockStats = {
  activeNeeds: 5,
  totalResponses: 23,
  fulfilled: 12,
  donations: 45000,
};

const mockNeeds = [
  { id: '1', type: 'urgent' as const, title: 'Medical Supplies', responses: 8, status: 'active' },
  { id: '2', type: 'material' as const, title: 'Winter Blankets', responses: 5, status: 'active' },
  { id: '3', type: 'volunteer' as const, title: 'Reading Volunteers', responses: 3, status: 'active' },
  { id: '4', type: 'campaign' as const, title: 'Equipment Fund', responses: 7, status: 'active' },
  { id: '5', type: 'material' as const, title: 'Kitchen Equipment', responses: 0, status: 'fulfilled' },
];

export default function OAHDashboard() {
  const [activeView, setActiveView] = useState<'dashboard' | 'needs' | 'settings'>('dashboard');

  const style = {
    "--sidebar-width": "16rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <div className="px-4 py-4 border-b">
                <h2 className="text-lg font-bold">OAH Dashboard</h2>
              </div>
              <SidebarGroupContent className="mt-4">
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveView('dashboard')}
                      data-active={activeView === 'dashboard'}
                      className="data-[active=true]:bg-sidebar-accent"
                      data-testid="nav-dashboard"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveView('needs')}
                      data-active={activeView === 'needs'}
                      className="data-[active=true]:bg-sidebar-accent"
                      data-testid="nav-needs"
                    >
                      <ListChecks className="h-4 w-4" />
                      <span>My Needs</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveView('settings')}
                      data-active={activeView === 'settings'}
                      className="data-[active=true]:bg-sidebar-accent"
                      data-testid="nav-settings"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="border-b p-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">
                {activeView === 'dashboard' && 'Dashboard Overview'}
                {activeView === 'needs' && 'Manage Needs'}
                {activeView === 'settings' && 'Settings'}
              </h1>
              {activeView === 'needs' && (
                <PostNeedDialog>
                  <Button data-testid="button-post-need">
                    <Plus className="h-4 w-4 mr-2" />
                    Post a Need
                  </Button>
                </PostNeedDialog>
              )}
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6">
            {activeView === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <DashboardStatsCard
                    icon={ListChecks}
                    title="Active Needs"
                    value={mockStats.activeNeeds}
                  />
                  <DashboardStatsCard
                    icon={Plus}
                    title="Total Responses"
                    value={mockStats.totalResponses}
                  />
                  <DashboardStatsCard
                    icon={Settings}
                    title="Fulfilled Needs"
                    value={mockStats.fulfilled}
                  />
                  <DashboardStatsCard
                    icon={Plus}
                    title="Donations Received"
                    value={`₹${mockStats.donations.toLocaleString()}`}
                  />
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                  <div className="space-y-3">
                    <div className="p-4 border rounded-md">
                      <p className="text-sm">New response received for "Medical Supplies"</p>
                      <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                    </div>
                    <div className="p-4 border rounded-md">
                      <p className="text-sm">Winter Blankets need was fulfilled</p>
                      <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                    </div>
                    <div className="p-4 border rounded-md">
                      <p className="text-sm">₹5,000 donation received for Equipment Fund</p>
                      <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeView === 'needs' && (
              <div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Responses</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockNeeds.map((need) => (
                      <TableRow key={need.id}>
                        <TableCell>
                          <NeedTypeBadge type={need.type} />
                        </TableCell>
                        <TableCell className="font-medium">{need.title}</TableCell>
                        <TableCell>{need.responses}</TableCell>
                        <TableCell>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            need.status === 'active' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {need.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          {need.status === 'active' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => console.log('Mark fulfilled:', need.id)}
                              data-testid={`button-mark-fulfilled-${need.id}`}
                            >
                              Mark Fulfilled
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {activeView === 'settings' && (
              <div className="max-w-2xl space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
                  <p className="text-muted-foreground">Manage your old age home profile and contact information.</p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
