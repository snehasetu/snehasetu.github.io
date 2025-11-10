import { useEffect } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export default function AuthCallback() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        if (!supabase) {
          throw new Error('Supabase is not configured');
        }

        // Get the session from the URL
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (session?.user) {
          // Get the pending role from localStorage
          const pendingRole = localStorage.getItem('pendingRole') || 'volunteer';
          localStorage.removeItem('pendingRole');

          // Create or update user in our database
          const response = await fetch('/api/users/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              supabaseId: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata.full_name || session.user.email?.split('@')[0],
              avatarUrl: session.user.user_metadata.avatar_url,
              role: pendingRole,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to sync user data');
          }

          const userData = await response.json();

          // Show approval message for OAH users
          if (pendingRole === 'oah' && !userData.approved) {
            toast({
              title: "Account Under Review",
              description: "Your Old Age Home account is pending approval. You'll be notified within 3-5 business days.",
              duration: 6000,
            });
          }

          // Redirect based on role
          if (pendingRole === 'oah' && userData.approved) {
            setLocation('/dashboard/oah');
          } else if (pendingRole === 'volunteer') {
            setLocation('/dashboard/volunteer');
          } else {
            setLocation('/');
          }
        } else {
          setLocation('/login');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        toast({
          title: "Authentication Error",
          description: "There was a problem signing you in. Please try again.",
          variant: "destructive",
        });
        setLocation('/login');
      }
    };

    handleCallback();
  }, [setLocation, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
}
