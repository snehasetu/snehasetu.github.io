import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const getApiBase = () => import.meta.env.VITE_API_URL || '';

interface PostNeedDialogProps {
  children: React.ReactNode;
  onSuccess?: () => void;
}

type NeedType = 'urgent' | 'material' | 'volunteer' | 'campaign';

export default function PostNeedDialog({ children, onSuccess }: PostNeedDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const [needType, setNeedType] = useState<NeedType>('material');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    quantity: '',
    targetAmount: '',
    eventDate: '',
    location: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('snehasetu_token');
    if (!token) {
      toast({ title: 'Please sign in', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      const base = getApiBase();
      const res = await fetch(`${base}/api/needs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: needType,
          title: formData.title,
          description: formData.description,
          quantity: formData.quantity || undefined,
          targetAmount: formData.targetAmount ? Number(formData.targetAmount) : undefined,
          eventDate: formData.eventDate || undefined,
          location: formData.location || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to post need');
      toast({
        title: "Need Posted Successfully",
        description: "Your need has been published and is now visible to volunteers and donors.",
      });
      setOpen(false);
      setFormData({ title: '', description: '', quantity: '', targetAmount: '', eventDate: '', location: '' });
      onSuccess?.();
    } catch (err: any) {
      toast({ title: 'Error', description: err?.message || 'Failed to post need', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Post a New Need</DialogTitle>
          <DialogDescription>
            Share what your old age home needs. Be specific to help volunteers and donors respond effectively.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="type">Need Type *</Label>
              <Select value={needType} onValueChange={(value) => setNeedType(value as NeedType)}>
                <SelectTrigger data-testid="select-need-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="material">Material</SelectItem>
                  <SelectItem value="volunteer">Volunteer</SelectItem>
                  <SelectItem value="campaign">Campaign</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Winter Blankets Needed"
                data-testid="input-need-title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide details about what you need and why..."
                rows={4}
                data-testid="input-need-description"
              />
            </div>

            {(needType === 'material' || needType === 'urgent') && (
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="e.g., 50 blankets"
                  data-testid="input-quantity"
                />
              </div>
            )}

            {needType === 'campaign' && (
              <div className="space-y-2">
                <Label htmlFor="targetAmount">Target Amount (₹) *</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  required={needType === 'campaign'}
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  placeholder="e.g., 50000"
                  data-testid="input-target-amount"
                />
              </div>
            )}

            {needType === 'volunteer' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="eventDate">Event Date</Label>
                  <Input
                    id="eventDate"
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    data-testid="input-event-date"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Event location"
                    data-testid="input-location"
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" data-testid="button-submit-need" disabled={submitting}>
              {submitting ? 'Posting...' : 'Post Need'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
