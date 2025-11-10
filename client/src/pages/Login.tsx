import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Heart } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const [, setLocation] = useLocation();
  const { signInWithGoogle, user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
    }
  };

  // Redirect if already logged in
  if (user && !loading) {
    if (user.role === 'oah' && user.approved) {
      setLocation('/dashboard/oah');
    } else if (user.role === 'volunteer') {
      setLocation('/dashboard/volunteer');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <Link href="/">
              <div className="flex items-center gap-2 hover-elevate active-elevate-2 px-3 py-2 rounded-md transition-all cursor-pointer">
                <Heart className="h-8 w-8 text-primary fill-primary" />
                <span className="text-2xl font-bold">Snehasetu</span>
              </div>
            </Link>
          </div>
          <div className="space-y-2 text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to continue making a difference
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full h-12 text-base"
            onClick={handleGoogleSignIn}
            disabled={isLoading || loading}
            data-testid="button-google-signin"
          >
            <FcGoogle className="h-5 w-5 mr-2" />
            {isLoading ? 'Signing in...' : 'Continue with Google'}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                New to Snehasetu?
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/register">
            <Button variant="ghost" data-testid="link-register">
              Create an account
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
