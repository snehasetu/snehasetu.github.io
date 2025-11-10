import PostNeedDialog from '../PostNeedDialog';
import { Button } from '@/components/ui/button';

export default function PostNeedDialogExample() {
  return (
    <div className="p-4">
      <PostNeedDialog>
        <Button>Post a Need</Button>
      </PostNeedDialog>
    </div>
  );
}
