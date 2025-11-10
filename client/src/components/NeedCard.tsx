import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MapPin } from "lucide-react";
import NeedTypeBadge from "./NeedTypeBadge";

type NeedType = 'urgent' | 'material' | 'volunteer' | 'campaign';

interface NeedCardProps {
  id: string;
  type: NeedType;
  title: string;
  description: string;
  oahName: string;
  location: string;
  imageUrl: string;
  targetAmount?: number;
  raisedAmount?: number;
  onRespond?: () => void;
}

export default function NeedCard({
  id,
  type,
  title,
  description,
  oahName,
  location,
  imageUrl,
  targetAmount,
  raisedAmount,
  onRespond,
}: NeedCardProps) {
  const isCampaign = type === 'campaign' && targetAmount && raisedAmount !== undefined;
  const progress = isCampaign ? (raisedAmount / targetAmount) * 100 : 0;

  return (
    <Card className="overflow-hidden hover-elevate transition-all duration-200 flex flex-col" data-testid={`card-need-${id}`}>
      <CardHeader className="p-0 space-y-0">
        <div className="relative aspect-video overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3">
            <NeedTypeBadge type={type} />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-6 space-y-3">
        <h3 className="text-xl font-semibold line-clamp-2">{title}</h3>
        <p className="text-muted-foreground text-sm line-clamp-2">{description}</p>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{oahName}</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{location}</span>
          </div>
        </div>

        {isCampaign && (
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Raised</span>
              <span className="font-semibold">₹{raisedAmount.toLocaleString()} / ₹{targetAmount.toLocaleString()}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button 
          className="w-full" 
          onClick={onRespond}
          data-testid={`button-respond-${id}`}
        >
          Respond
        </Button>
      </CardFooter>
    </Card>
  );
}
