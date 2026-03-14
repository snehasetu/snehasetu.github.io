import { useState, useEffect } from "react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OAHCard from "@/components/OAHCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { placeholderImages } from "@/lib/placeholders";

const getApiBase = () => import.meta.env.VITE_API_URL || '';

interface HomeRow {
  id: string;
  name: string;
  location: string;
  description: string | null;
  activeNeedsCount: number;
  yearsEstablished: number | null;
  imageUrl: string | null;
}

export default function OAHHomes() {
  const [searchQuery, setSearchQuery] = useState('');
  const [homes, setHomes] = useState<HomeRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const base = getApiBase();
    fetch(`${base}/api/homes`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setHomes(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const filteredHomes = homes.filter((home) => {
    const query = searchQuery.toLowerCase();
    return (
      home.name.toLowerCase().includes(query) ||
      home.location.toLowerCase().includes(query) ||
      (home.description || '').toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h1 className="text-4xl font-bold">Old Age Homes</h1>
            <Link href="/register">
              <Button data-testid="button-register-home">
                Register Your Home
              </Button>
            </Link>
          </div>

          <div className="mb-8">
            <div className="relative max-w-2xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, location, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-homes"
              />
            </div>
          </div>

          {loading ? (
            <p className="text-center py-16 text-muted-foreground">Loading homes...</p>
          ) : filteredHomes.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No old age homes found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHomes.map((home) => (
                <OAHCard
                  key={home.id}
                  id={home.id}
                  name={home.name}
                  location={home.location}
                  description={home.description || ''}
                  activeNeedsCount={home.activeNeedsCount}
                  yearsEstablished={home.yearsEstablished ?? undefined}
                  imageUrl={home.imageUrl || placeholderImages.oahExterior}
                  profileHref={`/homes/${home.id}`}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
