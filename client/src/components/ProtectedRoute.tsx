import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: 'volunteer' | 'oah' | 'admin';
  requireApproved?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  requireRole, 
  requireApproved = false 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        setLocation('/login');
      } else if (requireRole && user.role !== requireRole) {
        if (user.role === 'admin') setLocation('/dashboard/admin');
        else setLocation('/');
      } else if (requireApproved && !user.approved) {
        setLocation('/');
      }
    }
  }, [user, loading, requireRole, requireApproved, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requireRole && user.role !== requireRole) {
    return null;
  }

  if (requireApproved && !user.approved) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Account Pending Approval</h1>
          <p className="text-muted-foreground">
            Your Old Age Home account is currently under review. 
            You'll be able to access the dashboard and post needs once your account is approved.
            This typically takes 3-5 business days.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
