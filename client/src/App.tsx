import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";

function RedirectToLogin() {
  const [, setLocation] = useLocation();
  useEffect(() => setLocation('/login'), [setLocation]);
  return null;
}
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "@/pages/Home";
import DiscoverNeeds from "@/pages/DiscoverNeeds";
import OAHHomes from "@/pages/OAHHomes";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import OAHDashboard from "@/pages/OAHDashboard";
import VolunteerDashboard from "@/pages/VolunteerDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/needs" component={DiscoverNeeds} />
      <Route path="/homes" component={OAHHomes} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/auth/callback" component={RedirectToLogin} />
      <Route path="/dashboard/admin">
        <ProtectedRoute requireRole="admin">
          <AdminDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard/oah">
        <ProtectedRoute requireRole="oah" requireApproved={true}>
          <OAHDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard/volunteer">
        <ProtectedRoute requireRole="volunteer">
          <VolunteerDashboard />
        </ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
