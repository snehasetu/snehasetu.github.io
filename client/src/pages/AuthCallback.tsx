import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const getApiBase = () => import.meta.env.VITE_API_URL || '';

export default function AuthCallback() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const handled = useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      if (handled.current) return;
      try {
        if (!supabase) {
          throw new Error('Supabase is not configured');
        }

        // Wait for Supabase to process OAuth redirect (session may not be ready immediately)
        let session = (await supabase.auth.getSession()).data.session;
        for (let i = 0; i < 15 && !session; i++) {
          await new Promise((r) => setTimeout(r, 200));
          session = (await supabase.auth.getSession()).data.session;
        }

        if (!session?.user) {
          setLocation('/login');
          return;
        }

        handled.current = true;
        const pendingRole = localStorage.getItem('pendingRole') || 'volunteer';
        localStorage.removeItem('pendingRole');

        const base = getApiBase();
        const response = await fetch(`${base}/api/users/sync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            supabaseId: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            avatarUrl: session.user.user_metadata?.avatar_url,
            role: pendingRole,
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(errText || 'Failed to sync user data');
        }

        const userData = await response.json();

        if (pendingRole === 'oah' && !userData.approved) {
          toast({
            title: "Account Under Review",
            description: "Your Old Age Home account is pending approval. You'll be notified within 3-5 business days.",
            duration: 6000,
          });
        }

        if (pendingRole === 'oah' && userData.approved) {
          setLocation('/dashboard/oah');
        } else if (pendingRole === 'volunteer') {
          setLocation('/dashboard/volunteer');
        } else {
          setLocation('/');
        }
      } catch (err) {
        if (handled.current) return;
        console.error('Auth callback error:', err);
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
