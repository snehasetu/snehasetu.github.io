import NeedTypeBadge from '../NeedTypeBadge';

export default function NeedTypeBadgeExample() {
  return (
    <div className="flex flex-wrap gap-2 p-4">
      <NeedTypeBadge type="urgent" />
      <NeedTypeBadge type="material" />
      <NeedTypeBadge type="volunteer" />
      <NeedTypeBadge type="campaign" />
    </div>
  );
}
