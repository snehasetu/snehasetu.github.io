import TestimonialCard from '../TestimonialCard';
import avatar1 from '@assets/generated_images/Female_testimonial_portrait_32f4bc95.png';
import avatar2 from '@assets/generated_images/Male_testimonial_portrait_8c57bf74.png';

export default function TestimonialCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 max-w-5xl">
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
  );
}
