import NeedCard from '../NeedCard';
import heroImage from '@assets/generated_images/Volunteer_reading_to_elderly_fa0f3cb6.png';

export default function NeedCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 max-w-4xl">
      <NeedCard
        id="1"
        type="urgent"
        title="Urgent Medical Supplies Needed"
        description="We need immediate medical supplies including first aid kits and basic medicines for our residents."
        oahName="Sunrise Care Home"
        location="Mumbai"
        imageUrl={heroImage}
        onRespond={() => console.log('Respond clicked')}
      />
      <NeedCard
        id="2"
        type="campaign"
        title="Winter Clothing Fund"
        description="Help us provide warm clothing for all our 50 residents this winter season."
        oahName="Golden Years Home"
        location="Delhi"
        imageUrl={heroImage}
        targetAmount={50000}
        raisedAmount={32000}
        onRespond={() => console.log('Respond clicked')}
      />
    </div>
  );
}
