import { Link } from "wouter";
import { Heart, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-5 w-5 text-primary fill-primary" />
              <span className="text-lg font-bold">Snehasetu</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Connecting old age homes with compassionate volunteers and donors to create a caring community.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-home">Home</Link></li>
              <li><Link href="/needs" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-needs">Discover Needs</Link></li>
              <li><Link href="/homes" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-homes">Old Age Homes</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">For Organizations</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/homes" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-register">Register Your Home</Link></li>
              <li><Link href="/dashboard/oah" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-dashboard">OAH Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>contact@snehasetu.org</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+91 123 456 7890</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Mumbai, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Snehasetu. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
