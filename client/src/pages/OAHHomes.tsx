import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OAHCard from "@/components/OAHCard";
import RegisterOAHDialog from "@/components/RegisterOAHDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import oahImg1 from '@assets/generated_images/Old_age_home_exterior_9a571869.png';
import oahImg2 from '@assets/generated_images/Modern_home_exterior_ac582349.png';
import oahImg3 from '@assets/generated_images/Traditional_home_exterior_f506f881.png';

// TODO: Remove mock data - replace with real API data
const mockHomes = [
  {
    id: '1',
    name: 'Sunrise Care Home',
    location: 'Mumbai, Maharashtra',
    description: 'A warm and caring home for senior citizens, providing 24/7 medical care and engaging activities. Our staff is dedicated to ensuring the wellbeing and happiness of all residents.',
    activeNeedsCount: 5,
    yearsEstablished: 2010,
    imageUrl: oahImg1,
  },
  {
    id: '2',
    name: 'Golden Years Home',
    location: 'Delhi, NCR',
    description: 'Dedicated to providing comfort and dignity to our elderly residents with modern facilities and compassionate care.',
    activeNeedsCount: 3,
    yearsEstablished: 2015,
    imageUrl: oahImg2,
  },
  {
    id: '3',
    name: 'Peaceful Haven',
    location: 'Bangalore, Karnataka',
    description: 'A serene retirement home with beautiful gardens and comprehensive care services for our cherished elders.',
    activeNeedsCount: 7,
    yearsEstablished: 2008,
    imageUrl: oahImg3,
  },
  {
    id: '4',
    name: 'Serene Sunset Home',
    location: 'Chennai, Tamil Nadu',
    description: 'Providing holistic care with a focus on physical, mental, and spiritual wellbeing of our senior residents.',
    activeNeedsCount: 4,
    yearsEstablished: 2012,
    imageUrl: oahImg1,
  },
  {
    id: '5',
    name: 'Harmony Home',
    location: 'Pune, Maharashtra',
    description: 'A community-focused home offering personalized care and numerous recreational activities for seniors.',
    activeNeedsCount: 2,
    yearsEstablished: 2018,
    imageUrl: oahImg2,
  },
  {
    id: '6',
    name: 'Grace Manor',
    location: 'Kolkata, West Bengal',
    description: 'Traditional values meet modern healthcare in our facility dedicated to senior care excellence.',
    activeNeedsCount: 6,
    yearsEstablished: 2005,
    imageUrl: oahImg3,
  },
];

export default function OAHHomes() {
  const [searchQuery, setSearchQuery] = useState('');

  // TODO: Remove mock search logic - will be done server-side
  const filteredHomes = mockHomes.filter(home => {
    const query = searchQuery.toLowerCase();
    return (
      home.name.toLowerCase().includes(query) ||
      home.location.toLowerCase().includes(query) ||
      home.description.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h1 className="text-4xl font-bold">Old Age Homes</h1>
            <RegisterOAHDialog>
              <Button data-testid="button-register-home">
                Register Your Home
              </Button>
            </RegisterOAHDialog>
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

          {filteredHomes.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No old age homes found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHomes.map((home) => (
                <OAHCard
                  key={home.id}
                  {...home}
                  onViewProfile={() => console.log('View profile:', home.id)}
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
