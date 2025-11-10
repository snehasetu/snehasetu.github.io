import OAHCard from '../OAHCard';
import oahImage from '@assets/generated_images/Old_age_home_exterior_9a571869.png';

export default function OAHCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
      <OAHCard
        id="1"
        name="Sunrise Care Home"
        location="Mumbai, Maharashtra"
        description="A warm and caring home for senior citizens, providing 24/7 medical care and engaging activities."
        activeNeedsCount={5}
        yearsEstablished={2010}
        imageUrl={oahImage}
        onViewProfile={() => console.log('View profile clicked')}
      />
      <OAHCard
        id="2"
        name="Golden Years Home"
        location="Delhi, NCR"
        description="Dedicated to providing comfort and dignity to our elderly residents with modern facilities."
        activeNeedsCount={3}
        yearsEstablished={2015}
        imageUrl={oahImage}
        onViewProfile={() => console.log('View profile clicked')}
      />
      <OAHCard
        id="3"
        name="Peaceful Haven"
        location="Bangalore, Karnataka"
        description="A serene retirement home with beautiful gardens and comprehensive care services."
        activeNeedsCount={7}
        yearsEstablished={2008}
        imageUrl={oahImage}
        onViewProfile={() => console.log('View profile clicked')}
      />
    </div>
  );
}
