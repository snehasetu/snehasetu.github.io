import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FilterSidebar from "@/components/FilterSidebar";
import NeedCard from "@/components/NeedCard";
import { placeholderImages } from "@/lib/placeholders";

// TODO: Remove mock data - replace with real API data
const mockNeeds = [
  {
    id: '1',
    type: 'urgent' as const,
    title: 'Urgent Medical Supplies Needed',
    description: 'We need immediate medical supplies including first aid kits and basic medicines for our residents.',
    oahName: 'Sunrise Care Home',
    location: 'Mumbai',
    imageUrl: placeholderImages.medical,
    status: 'active',
  },
  {
    id: '2',
    type: 'material' as const,
    title: 'Winter Blankets Required',
    description: 'With winter approaching, we need warm blankets for all 40 of our elderly residents.',
    oahName: 'Golden Years Home',
    location: 'Delhi',
    imageUrl: placeholderImages.blankets,
    status: 'active',
  },
  {
    id: '3',
    type: 'volunteer' as const,
    title: 'Reading Volunteers Needed',
    description: 'Looking for volunteers to spend time reading to our residents every weekend.',
    oahName: 'Peaceful Haven',
    location: 'Bangalore',
    imageUrl: placeholderImages.volunteer,
    status: 'active',
  },
  {
    id: '4',
    type: 'campaign' as const,
    title: 'Medical Equipment Fund',
    description: 'Fundraising campaign to purchase essential medical equipment for better healthcare.',
    oahName: 'Serene Sunset Home',
    location: 'Chennai',
    imageUrl: placeholderImages.fundraising,
    targetAmount: 80000,
    raisedAmount: 45000,
    status: 'active',
  },
  {
    id: '5',
    type: 'material' as const,
    title: 'Kitchen Equipment Donation',
    description: 'Seeking donations of cooking utensils and kitchen equipment for our community kitchen.',
    oahName: 'Harmony Home',
    location: 'Pune',
    imageUrl: placeholderImages.medical,
    status: 'fulfilled',
  },
  {
    id: '6',
    type: 'volunteer' as const,
    title: 'Fitness Instructors Wanted',
    description: 'We need fitness instructors to conduct light exercise sessions for our senior residents.',
    oahName: 'Sunrise Care Home',
    location: 'Mumbai',
    imageUrl: placeholderImages.volunteer,
    status: 'active',
  },
  {
    id: '7',
    type: 'campaign' as const,
    title: 'Building Renovation Fund',
    description: 'Help us renovate our facilities to make them more accessible and comfortable for our residents.',
    oahName: 'Golden Years Home',
    location: 'Delhi',
    imageUrl: placeholderImages.fundraising,
    targetAmount: 150000,
    raisedAmount: 95000,
    status: 'active',
  },
  {
    id: '8',
    type: 'urgent' as const,
    title: 'Emergency Generator Needed',
    description: 'We urgently need a backup generator to ensure continuous power supply for medical equipment.',
    oahName: 'Peaceful Haven',
    location: 'Bangalore',
    imageUrl: placeholderImages.medical,
    status: 'active',
  },
];

export default function DiscoverNeeds() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [location, setLocation] = useState('All Locations');
  const [showFulfilled, setShowFulfilled] = useState(false);

  // TODO: Remove mock filtering logic - will be done server-side
  const filteredNeeds = mockNeeds.filter(need => {
    if (selectedTypes.length > 0 && !selectedTypes.includes(need.type)) return false;
    if (location !== 'All Locations' && !need.location.includes(location)) return false;
    if (!showFulfilled && need.status === 'fulfilled') return false;
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-4xl font-bold mb-8">Discover Needs</h1>

          <div className="flex gap-8">
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <FilterSidebar
                selectedTypes={selectedTypes}
                onTypesChange={setSelectedTypes}
                location={location}
                onLocationChange={setLocation}
                showFulfilled={showFulfilled}
                onShowFulfilledChange={setShowFulfilled}
              />
            </aside>

            <div className="flex-1">
              {filteredNeeds.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground text-lg">No needs found matching your filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredNeeds.map((need) => (
                    <NeedCard
                      key={need.id}
                      {...need}
                      onRespond={() => console.log('Respond to need:', need.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
