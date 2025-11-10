import { useState } from 'react';
import NeedTypeFilter from '../NeedTypeFilter';

export default function NeedTypeFilterExample() {
  const [selected, setSelected] = useState<'all' | 'urgent' | 'material' | 'volunteer' | 'campaign'>('all');

  return (
    <div className="p-4">
      <NeedTypeFilter selected={selected} onSelect={setSelected} />
    </div>
  );
}
