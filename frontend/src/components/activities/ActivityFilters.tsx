import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface Props {
  search: string;
  setSearch: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  subjectFilter: string;
  setSubjectFilter: (value: string) => void;
  subjects: string[];
}

export function ActivityFilters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  subjectFilter,
  setSubjectFilter,
  subjects,
}: Props) {
  return (
    <div className="glass rounded-xl p-4 border border-white/10">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search activities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground/50 focus:border-[#c97a57]/50 focus:ring-[#c97a57]/20 rounded-lg"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => v && setStatusFilter(v)}>
          <SelectTrigger className="w-full sm:w-[160px] bg-white/5 border-white/10 text-foreground rounded-lg focus:border-[#c97a57]/50 focus:ring-[#c97a57]/20">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="glass border-white/10">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
        <Select value={subjectFilter} onValueChange={(v) => v && setSubjectFilter(v)}>
          <SelectTrigger className="w-full sm:w-[160px] bg-white/5 border-white/10 text-foreground rounded-lg focus:border-[#c97a57]/50 focus:ring-[#c97a57]/20">
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent className="glass border-white/10">
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}