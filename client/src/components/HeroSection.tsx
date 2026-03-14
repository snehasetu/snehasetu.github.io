import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { placeholderImages } from "@/lib/placeholders";

export default function HeroSection() {
  return (
    <div className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${placeholderImages.hero})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/40" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center text-white">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Connect Hearts,<br />Transform Lives
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
          Join our community of compassionate volunteers and donors helping old age homes across India
        </p>
        <Link href="/needs">
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 backdrop-blur-md bg-white/20 hover:bg-white/30 border-2 border-white/40 text-white no-default-hover-elevate"
            data-testid="button-find-ways-to-help"
          >
            Find Ways to Help
          </Button>
        </Link>
      </div>
    </div>
  );
}
