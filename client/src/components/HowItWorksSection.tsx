import { Card, CardContent } from "@/components/ui/card";
import { Search, Heart, Smile } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Discover Needs",
    description: "Browse through verified needs posted by old age homes in your area or across India.",
  },
  {
    icon: Heart,
    title: "Respond & Help",
    description: "Choose how you want to contribute - donate, volunteer your time, or provide materials.",
  },
  {
    icon: Smile,
    title: "Make an Impact",
    description: "Track your contributions and see the direct impact you're making in seniors' lives.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">How It Works</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Making a difference is simple. Follow these three easy steps to start helping today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <Card key={index} className="relative">
            <CardContent className="p-8 text-center">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold">
                {index + 1}
              </div>
              <div className="mb-4 flex justify-center text-primary mt-4">
                <step.icon className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
