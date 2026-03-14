import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import NeedCard from "@/components/NeedCard";
import { placeholderImages } from "@/lib/placeholders";
import { MapPin, Phone, Mail, Calendar, ArrowLeft } from "lucide-react";

const getApiBase = () => import.meta.env.VITE_API_URL || '';

interface OAHProfile {
  id: string;
  name: string;
  description: string | null;
  location: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  streetAddress: string;
  city: string;
  state: string;
  yearsEstablished: number | null;
  imageUrl: string | null;
  activeNeedsCount?: number;
}

interface Need {
  id: string;
  type: string;
  title: string;
  description: string;
  status: string;
  targetAmount?: number;
  raisedAmount?: number;
  location?: string;
}

export default function OAHProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<OAHProfile | null>(null);
  const [needs, setNeeds] = useState<Need[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const base = getApiBase();
    Promise.all([
      fetch(`${base}/api/homes/${id}`).then((r) => (r.ok ? r.json() : null)),
      fetch(`${base}/api/needs?oahId=${id}`).then((r) => (r.ok ? r.json() : [])),
    ]).then(([p, n]) => {
      setProfile(p);
      setNeeds(Array.isArray(n) ? n : []);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center">Home not found.</p>
              <Link href="/homes">
                <Button variant="outline" className="w-full mt-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Old Age Homes
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const imageUrl = profile.imageUrl || placeholderImages.oahExterior;
  const locationStr = [profile.city, profile.state].filter(Boolean).join(', ') || profile.location;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <Link href="/homes">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Old Age Homes
            </Button>
          </Link>

          <Card className="overflow-hidden mb-8">
            <div className="relative h-48 sm:h-64 bg-muted">
              <img
                src={imageUrl}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <h1 className="text-3xl font-bold">{profile.name}</h1>
              {locationStr && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{locationStr}</span>
                </div>
              )}
              {profile.yearsEstablished != null && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Est. {profile.yearsEstablished}</span>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {profile.description && (
                <p className="text-muted-foreground whitespace-pre-wrap">{profile.description}</p>
              )}
              <div className="grid gap-4">
                <h3 className="font-semibold">Contact</h3>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <a href={`mailto:${profile.contactEmail}`} className="text-primary hover:underline">
                      {profile.contactEmail}
                    </a>
                  </span>
                  <span className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <a href={`tel:${profile.contactPhone}`} className="text-primary hover:underline">
                      {profile.contactPhone}
                    </a>
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong>{profile.contactPerson}</strong>
                  {profile.streetAddress && (
                    <> · {profile.streetAddress}, {profile.city}, {profile.state}</>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              Active Needs ({needs.filter((n) => n.status === 'active').length})
            </h2>
            {needs.filter((n) => n.status === 'active').length === 0 ? (
              <p className="text-muted-foreground">No active needs at the moment.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {needs.filter((n) => n.status === 'active').map((need) => (
                  <NeedCard
                    key={need.id}
                    id={need.id}
                    type={need.type as any}
                    title={need.title}
                    description={need.description}
                    oahName={profile.name}
                    location={need.location || profile.location}
                    imageUrl={placeholderImages.medical}
                    targetAmount={need.targetAmount}
                    raisedAmount={need.raisedAmount}
                    onRespond={() => {}}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
