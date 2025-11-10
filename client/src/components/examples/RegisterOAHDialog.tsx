import RegisterOAHDialog from '../RegisterOAHDialog';
import { Button } from '@/components/ui/button';

export default function RegisterOAHDialogExample() {
  return (
    <div className="p-4">
      <RegisterOAHDialog>
        <Button>Register Your Home</Button>
      </RegisterOAHDialog>
    </div>
  );
}
