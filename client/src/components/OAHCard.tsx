import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar } from "lucide-react";

interface OAHCardProps {
  id: string;
  name: string;
  location: string;
  description: string;
  activeNeedsCount: number;
  yearsEstablished?: number;
  imageUrl: string;
  onViewProfile?: () => void;
}

export default function OAHCard({
  id,
  name,
  location,
  description,
  activeNeedsCount,
  yearsEstablished,
  imageUrl,
  onViewProfile,
}: OAHCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate transition-all duration-200 flex flex-col" data-testid={`card-oah-${id}`}>
      <CardHeader className="p-0 space-y-0">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img 
            src={imageUrl} 
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-6 space-y-3">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{name}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{location}</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>

        <div className="flex items-center gap-3 text-sm pt-2">
          <Badge variant="secondary" className="no-default-hover-elevate">
            {activeNeedsCount} Active {activeNeedsCount === 1 ? 'Need' : 'Needs'}
          </Badge>
          {yearsEstablished && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Est. {yearsEstablished}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onViewProfile}
          data-testid={`button-view-profile-${id}`}
        >
          View Profile
        </Button>
      </CardFooter>
    </Card>
  );
}
