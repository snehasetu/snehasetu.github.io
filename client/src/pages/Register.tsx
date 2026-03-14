import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/contexts/AuthContext";
import { Heart } from "lucide-react";

type UserRole = 'volunteer' | 'oah';

const initialOahProfile = {
  homeName: '',
  description: '',
  location: '',
  contactPerson: '',
  contactEmail: '',
  contactPhone: '',
  streetAddress: '',
  city: '',
  state: '',
  yearsEstablished: '' as string | number,
};

export default function Register() {
  const [, setLocation] = useLocation();
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("volunteer");
  const [oahProfile, setOahProfile] = useState(initialOahProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      setIsLoading(true);
      if (role === 'oah') {
        await register(email, password, name, role, {
          homeName: oahProfile.homeName,
          description: oahProfile.description || undefined,
          location: oahProfile.location,
          contactPerson: oahProfile.contactPerson,
          contactEmail: oahProfile.contactEmail,
          contactPhone: oahProfile.contactPhone,
          streetAddress: oahProfile.streetAddress,
          city: oahProfile.city,
          state: oahProfile.state,
          yearsEstablished: oahProfile.yearsEstablished ? Number(oahProfile.yearsEstablished) : undefined,
        });
      } else {
        await register(email, password, name, role);
      }
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

  const updateOah = (key: keyof typeof oahProfile, value: string | number) => {
    setOahProfile((p) => ({ ...p, [key]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
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
              <Label htmlFor="name">Your name</Label>
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
              <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                <h3 className="font-semibold">Home details (your public profile)</h3>
                <div className="grid gap-3">
                  <div className="space-y-2">
                    <Label>Home name *</Label>
                    <Input
                      value={oahProfile.homeName}
                      onChange={(e) => updateOah('homeName', e.target.value)}
                      placeholder="e.g. Sunrise Care Home"
                      required={role === 'oah'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Short description</Label>
                    <Textarea
                      value={oahProfile.description}
                      onChange={(e) => updateOah('description', e.target.value)}
                      placeholder="A brief about your home and care services..."
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Location (city/area) *</Label>
                    <Input
                      value={oahProfile.location}
                      onChange={(e) => updateOah('location', e.target.value)}
                      placeholder="e.g. Mumbai, Maharashtra"
                      required={role === 'oah'}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Contact person *</Label>
                      <Input
                        value={oahProfile.contactPerson}
                        onChange={(e) => updateOah('contactPerson', e.target.value)}
                        placeholder="Name"
                        required={role === 'oah'}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Contact email *</Label>
                      <Input
                        type="email"
                        value={oahProfile.contactEmail}
                        onChange={(e) => updateOah('contactEmail', e.target.value)}
                        placeholder="contact@home.org"
                        required={role === 'oah'}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Contact phone *</Label>
                    <Input
                      value={oahProfile.contactPhone}
                      onChange={(e) => updateOah('contactPhone', e.target.value)}
                      placeholder="+91 98765 43210"
                      required={role === 'oah'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Street address *</Label>
                    <Input
                      value={oahProfile.streetAddress}
                      onChange={(e) => updateOah('streetAddress', e.target.value)}
                      placeholder="Building, street"
                      required={role === 'oah'}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>City *</Label>
                      <Input
                        value={oahProfile.city}
                        onChange={(e) => updateOah('city', e.target.value)}
                        placeholder="City"
                        required={role === 'oah'}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>State *</Label>
                      <Input
                        value={oahProfile.state}
                        onChange={(e) => updateOah('state', e.target.value)}
                        placeholder="State"
                        required={role === 'oah'}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Years established</Label>
                    <Input
                      type="number"
                      min={0}
                      value={oahProfile.yearsEstablished}
                      onChange={(e) => updateOah('yearsEstablished', e.target.value)}
                      placeholder="e.g. 2010"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Old Age Home accounts require approval before you can post needs. You’ll get a public profile page once registered.
                </p>
              </div>
            )}

            {role === 'volunteer' && (
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                As a volunteer you can browse needs and contribute right away.
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
