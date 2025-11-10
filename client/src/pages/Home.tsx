import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ImpactStats from "@/components/ImpactStats";
import NeedTypeFilter from "@/components/NeedTypeFilter";
import NeedCard from "@/components/NeedCard";
import HowItWorksSection from "@/components/HowItWorksSection";
import TestimonialCard from "@/components/TestimonialCard";
import blanketsImg from '@assets/generated_images/Warm_blankets_stack_9eef9f63.png';
import medicalImg from '@assets/generated_images/Medical_supplies_arrangement_b6b94094.png';
import volunteerImg from '@assets/generated_images/Volunteer_reading_to_elderly_fa0f3cb6.png';
import fundraisingImg from '@assets/generated_images/Fundraising_campaign_volunteers_76a67cfe.png';
import avatar1 from '@assets/generated_images/Female_testimonial_portrait_32f4bc95.png';
import avatar2 from '@assets/generated_images/Male_testimonial_portrait_8c57bf74.png';

// TODO: Remove mock data - replace with real API data
const mockNeeds = [
  {
    id: '1',
    type: 'urgent' as const,
    title: 'Urgent Medical Supplies Needed',
    description: 'We need immediate medical supplies including first aid kits and basic medicines for our residents.',
    oahName: 'Sunrise Care Home',
    location: 'Mumbai',
    imageUrl: medicalImg,
  },
  {
    id: '2',
    type: 'material' as const,
    title: 'Winter Blankets Required',
    description: 'With winter approaching, we need warm blankets for all 40 of our elderly residents.',
    oahName: 'Golden Years Home',
    location: 'Delhi',
    imageUrl: blanketsImg,
  },
  {
    id: '3',
    type: 'volunteer' as const,
    title: 'Reading Volunteers Needed',
    description: 'Looking for volunteers to spend time reading to our residents every weekend.',
    oahName: 'Peaceful Haven',
    location: 'Bangalore',
    imageUrl: volunteerImg,
  },
  {
    id: '4',
    type: 'campaign' as const,
    title: 'Medical Equipment Fund',
    description: 'Fundraising campaign to purchase essential medical equipment for better healthcare.',
    oahName: 'Serene Sunset Home',
    location: 'Chennai',
    imageUrl: fundraisingImg,
    targetAmount: 80000,
    raisedAmount: 45000,
  },
  {
    id: '5',
    type: 'material' as const,
    title: 'Kitchen Equipment Donation',
    description: 'Seeking donations of cooking utensils and kitchen equipment for our community kitchen.',
    oahName: 'Harmony Home',
    location: 'Pune',
    imageUrl: medicalImg,
  },
  {
    id: '6',
    type: 'volunteer' as const,
    title: 'Fitness Instructors Wanted',
    description: 'We need fitness instructors to conduct light exercise sessions for our senior residents.',
    oahName: 'Sunrise Care Home',
    location: 'Mumbai',
    imageUrl: volunteerImg,
  },
];

export default function Home() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'urgent' | 'material' | 'volunteer' | 'campaign'>('all');

  // TODO: Remove mock filtering logic - will be done server-side
  const filteredNeeds = selectedFilter === 'all' 
    ? mockNeeds 
    : mockNeeds.filter(need => need.type === selectedFilter);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />

        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <ImpactStats />
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="mb-6">
            <h2 className="text-4xl font-bold mb-6">Active Needs</h2>
            <NeedTypeFilter selected={selectedFilter} onSelect={setSelectedFilter} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {filteredNeeds.slice(0, 6).map((need) => (
              <NeedCard
                key={need.id}
                {...need}
                onRespond={() => console.log('Respond to need:', need.id)}
              />
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6">
          <HowItWorksSection />
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">What People Say</h2>
            <p className="text-muted-foreground text-lg">
              Hear from our community of volunteers and donors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TestimonialCard
              quote="Volunteering at Sunrise Care Home has been one of the most rewarding experiences. The platform made it so easy to find opportunities and make a real difference."
              name="Priya Sharma"
              role="Volunteer"
              avatarUrl={avatar1}
            />
            <TestimonialCard
              quote="As a donor, I appreciate the transparency and ease of contributing. Knowing exactly where my donations go gives me peace of mind."
              name="Rajesh Kumar"
              role="Donor"
              avatarUrl={avatar2}
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
