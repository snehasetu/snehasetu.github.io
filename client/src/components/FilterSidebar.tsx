import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface FilterSidebarProps {
  selectedTypes: string[];
  onTypesChange: (types: string[]) => void;
  location: string;
  onLocationChange: (location: string) => void;
  showFulfilled: boolean;
  onShowFulfilledChange: (show: boolean) => void;
}

const needTypes = [
  { id: 'urgent', label: 'Urgent' },
  { id: 'material', label: 'Material' },
  { id: 'volunteer', label: 'Volunteer' },
  { id: 'campaign', label: 'Campaign' },
];

const locations = [
  'All Locations',
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Chennai',
  'Kolkata',
  'Pune',
];

export default function FilterSidebar({
  selectedTypes,
  onTypesChange,
  location,
  onLocationChange,
  showFulfilled,
  onShowFulfilledChange,
}: FilterSidebarProps) {
  const handleTypeToggle = (typeId: string) => {
    if (selectedTypes.includes(typeId)) {
      onTypesChange(selectedTypes.filter(t => t !== typeId));
    } else {
      onTypesChange([...selectedTypes, typeId]);
    }
  };

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="text-base font-semibold">Need Type</Label>
          {needTypes.map((type) => (
            <div key={type.id} className="flex items-center space-x-2">
              <Checkbox
                id={type.id}
                checked={selectedTypes.includes(type.id)}
                onCheckedChange={() => handleTypeToggle(type.id)}
                data-testid={`checkbox-filter-${type.id}`}
              />
              <Label
                htmlFor={type.id}
                className="text-sm font-normal cursor-pointer"
              >
                {type.label}
              </Label>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Label className="text-base font-semibold">Location</Label>
          <Select value={location} onValueChange={onLocationChange}>
            <SelectTrigger data-testid="select-location">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="show-fulfilled" className="text-base font-semibold cursor-pointer">
            Show Fulfilled
          </Label>
          <Switch
            id="show-fulfilled"
            checked={showFulfilled}
            onCheckedChange={onShowFulfilledChange}
            data-testid="switch-show-fulfilled"
          />
        </div>
      </CardContent>
    </Card>
  );
}
