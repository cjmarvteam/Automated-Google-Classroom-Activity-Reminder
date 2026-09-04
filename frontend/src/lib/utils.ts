import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isWithinQuietHours(start: string, end: string): boolean {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [startHour, startMinute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  if (startMinutes < endMinutes) {
    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  } else {
    return currentMinutes >= startMinutes || currentMinutes < endMinutes;
  }
}

export function getDueStatus(dueDate: string, status: string): string {
  if (status === 'completed') return 'Completed';
  if (status === 'in_progress') return 'In Progress';

  const now = new Date();
  const due = new Date(dueDate);
  const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'Overdue';
  if (diffDays === 0) return 'Due Today';
  if (diffDays === 1) return 'Due Tomorrow';
  if (diffDays <= 3) return 'Due Soon';
  return 'Upcoming';
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    'Overdue': 'bg-[#c0392b]/10 text-[#c0392b] border-[#c0392b]/20',
    'Due Today': 'bg-[#c4845a]/10 text-[#c4845a] border-[#c4845a]/20',
    'Due Tomorrow': 'bg-[#d4a77a]/10 text-[#b8875a] border-[#d4a77a]/20',
    'Due Soon': 'bg-[#d4a77a]/10 text-[#b8875a] border-[#d4a77a]/20',
    'Upcoming': 'bg-[rgba(44,36,30,0.04)] text-[rgba(44,36,30,0.5)] border-[rgba(44,36,30,0.08)]',
    'Completed': 'bg-[#27ae60]/10 text-[#27ae60] border-[#27ae60]/20',
    'In Progress': 'bg-[#2980b9]/10 text-[#2980b9] border-[#2980b9]/20',
  };
  return map[status] || 'bg-[rgba(44,36,30,0.04)] text-[rgba(44,36,30,0.5)] border-[rgba(44,36,30,0.08)]';
}