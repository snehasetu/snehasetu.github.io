import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/contexts/AuthContext";
import { Heart } from "lucide-react";

type UserRole = 'volunteer' | 'oah';

export default function Register() {
  const [, setLocation] = useLocation();
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("volunteer");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      setIsLoading(true);
      await register(email, password, name, role);
      if (role === 'oah') {
        setLocation('/dashboard/oah');
      } else {
        setLocation('/dashboard/volunteer');
      }
    } catch (err: any) {
      setError(err?.message || "Registration failed");
    } finally {
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
            <CardDescription>Create an account to get started</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-sm text-destructive bg-destructive/10 p-2 rounded-md">{error}</p>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="space-y-4">
              <Label className="text-base font-semibold">I want to register as:</Label>
              <RadioGroup value={role} onValueChange={(v) => setRole(v as UserRole)}>
                <div className="flex items-start space-x-3 p-4 border rounded-md hover-elevate cursor-pointer">
                  <RadioGroupItem value="volunteer" id="volunteer" />
                  <Label htmlFor="volunteer" className="cursor-pointer flex-1">
                    <div className="font-semibold">Volunteer / Donor</div>
                    <div className="text-sm text-muted-foreground">
                      Help old age homes by volunteering or donating
                    </div>
                  </Label>
                </div>
                <div className="flex items-start space-x-3 p-4 border rounded-md hover-elevate cursor-pointer">
                  <RadioGroupItem value="oah" id="oah" />
                  <Label htmlFor="oah" className="cursor-pointer flex-1">
                    <div className="font-semibold">Old Age Home</div>
                    <div className="text-sm text-muted-foreground">
                      Post needs and connect with volunteers and donors
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            {role === 'oah' && (
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                Old Age Home accounts require approval. You can browse immediately; posting needs will be enabled after review.
              </p>
            )}
            <Button type="submit" className="w-full h-12" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <span className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login">
              <Button variant="ghost" className="p-0 h-auto">Sign in</Button>
            </Link>
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}
