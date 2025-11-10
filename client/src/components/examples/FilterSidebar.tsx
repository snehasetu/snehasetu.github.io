import { useState } from 'react';
import FilterSidebar from '../FilterSidebar';

export default function FilterSidebarExample() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['urgent']);
  const [location, setLocation] = useState('All Locations');
  const [showFulfilled, setShowFulfilled] = useState(false);

  return (
    <div className="p-4 max-w-xs">
      <FilterSidebar
        selectedTypes={selectedTypes}
        onTypesChange={setSelectedTypes}
        location={location}
        onLocationChange={setLocation}
        showFulfilled={showFulfilled}
        onShowFulfilledChange={setShowFulfilled}
      />
    </div>
  );
}
