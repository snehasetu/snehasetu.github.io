import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Heart } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

type UserRole = 'volunteer' | 'oah';

export default function Register() {
  const { signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const [role, setRole] = useState<UserRole>('volunteer');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setIsLoading(true);

      // Store role preference in localStorage for after OAuth redirect
      localStorage.setItem('pendingRole', role);

      // Show message for OAH users about approval process
      if (role === 'oah') {
        toast({
          title: "OAH Registration",
          description: "After signing in with Google, your account will be reviewed for approval within 3-5 business days.",
          duration: 6000,
        });
      }

      await signInWithGoogle();
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
    }
  };

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
            <CardTitle className="text-2xl">Join Snehasetu</CardTitle>
            <CardDescription>
              Choose how you'd like to contribute
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label className="text-base font-semibold">I want to register as:</Label>
            <RadioGroup value={role} onValueChange={(value) => setRole(value as UserRole)}>
              <div className="flex items-start space-x-3 p-4 border rounded-md hover-elevate cursor-pointer">
                <RadioGroupItem value="volunteer" id="volunteer" data-testid="radio-volunteer" />
                <Label htmlFor="volunteer" className="cursor-pointer flex-1 space-y-1">
                  <div className="font-semibold">Volunteer / Donor</div>
                  <div className="text-sm text-muted-foreground">
                    Help old age homes by volunteering time or donating resources
                  </div>
                </Label>
              </div>
              <div className="flex items-start space-x-3 p-4 border rounded-md hover-elevate cursor-pointer">
                <RadioGroupItem value="oah" id="oah" data-testid="radio-oah" />
                <Label htmlFor="oah" className="cursor-pointer flex-1 space-y-1">
                  <div className="font-semibold">Old Age Home</div>
                  <div className="text-sm text-muted-foreground">
                    Post needs and connect with volunteers and donors
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {role === 'oah' && (
            <div className="p-4 bg-muted rounded-md">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> Old Age Home accounts require manual verification. 
                You'll be able to browse but not post needs until your account is approved (typically 3-5 business days).
              </p>
            </div>
          )}

          <Button
            className="w-full h-12 text-base"
            onClick={handleRegister}
            disabled={isLoading}
            data-testid="button-register-google"
          >
            <FcGoogle className="h-5 w-5 mr-2" />
            {isLoading ? 'Redirecting...' : 'Continue with Google'}
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login">
              <Button variant="ghost" className="p-0 h-auto" data-testid="link-login">
                Sign in
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
