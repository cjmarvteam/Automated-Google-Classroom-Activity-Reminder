import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createActivity } from '@/services/api';
import { Classroom } from '@/types';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
  classrooms: Classroom[];
  defaultClassroomId?: string;
}

export function CreateActivityDialog({ open, onOpenChange, onCreated, classrooms, defaultClassroomId }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [classroomId, setClassroomId] = useState(defaultClassroomId || '');
  const [type, setType] = useState('ASSIGNMENT');
  const [dueDate, setDueDate] = useState('');
  const [maxPoints, setMaxPoints] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Activity title is required');
      return;
    }
    if (!classroomId) {
      toast.error('Please select a classroom');
      return;
    }
    setLoading(true);
    try {
      await createActivity({
        classroomId,
        title: title.trim(),
        description: description.trim() || undefined,
        type,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        maxPoints: maxPoints ? parseInt(maxPoints) : undefined,
      });
      toast.success('Activity created!');
      setTitle('');
      setDescription('');
      setClassroomId(defaultClassroomId || '');
      setType('ASSIGNMENT');
      setDueDate('');
      setMaxPoints('');
      onOpenChange(false);
      onCreated();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create activity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Activity</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="activity-title">Title *</Label>
            <Input
              id="activity-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Problem Set 1"
            />
          </div>
          <div className="space-y-2">
            <Label>Classroom *</Label>
            <Select value={classroomId} onValueChange={(v) => v && setClassroomId(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a classroom" />
              </SelectTrigger>
              <SelectContent>
                {classrooms.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}{c.section ? ` - ${c.section}` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={type} onValueChange={(v) => v && setType(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ASSIGNMENT">Assignment</SelectItem>
                <SelectItem value="QUIZ">Quiz</SelectItem>
                <SelectItem value="QUESTION">Question</SelectItem>
                <SelectItem value="MATERIAL">Material</SelectItem>
                <SelectItem value="TOPIC">Topic</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="due-date">Due Date</Label>
              <Input
                id="due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-points">Max Points</Label>
              <Input
                id="max-points"
                type="number"
                value={maxPoints}
                onChange={(e) => setMaxPoints(e.target.value)}
                placeholder="100"
                min="1"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="activity-desc">Description</Label>
            <Input
              id="activity-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Activity
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
