import { useState } from 'react';
import { usePreferencesStore } from '../store/preferencesStore';
import { getPreferences, updatePreferences } from '../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { Moon, Bell, Zap, Save, Sparkles, Timer, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function Settings() {
  const prefs = usePreferencesStore();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);

  const { data: backendPrefs } = useQuery({
    queryKey: ['preferences'],
    queryFn: getPreferences,
  });

  const saveMutation = useMutation({
    mutationFn: updatePreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preferences'] });
      toast.success('Preferences saved successfully!', { description: 'Your study settings have been updated.' });
    },
    onError: () => {
      toast.error('Failed to save preferences');
    },
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveMutation.mutateAsync({
        emailNotifications: backendPrefs?.emailNotifications ?? true,
        studyReminders: backendPrefs?.studyReminders ?? true,
        reminderTime: `${String(Math.floor(prefs.reminderTiming / 60)).padStart(2, '0')}:${String(prefs.reminderTiming % 60).padStart(2, '0')}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        reminderDaysBefore: Math.max(1, Math.ceil(prefs.reminderTiming / 1440)),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTechniqueChange = (value: string) => {
    if (value === 'pomodoro') {
      prefs.setFocusTechnique({ name: 'pomodoro', studyDuration: 25, breakDuration: 5, longBreakDuration: 15, sessionsBeforeLongBreak: 4 });
    } else if (value === 'deep-work') {
      prefs.setFocusTechnique({ name: 'deep-work', studyDuration: 52, breakDuration: 17, longBreakDuration: 30, sessionsBeforeLongBreak: 2 });
    } else {
      prefs.setFocusTechnique({ ...prefs.focusTechnique, name: 'custom' });
    }
  };

  const isCustom = prefs.focusTechnique.name === 'custom';

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Study Preferences</h1>
        <p className="text-muted-foreground">Customize your focus techniques, reminders, and notification settings.</p>
      </div>

      <Card className="glass glass-hover rounded-xl border border-white/10 overflow-hidden transition-all duration-300">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#c97a57] via-[#dca77a] to-[#c97a57]" />
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2.5 text-lg font-semibold">
            <div className="rounded-lg bg-[#c97a57]/10 p-2 text-[#c97a57]"><Zap className="h-5 w-5" /></div>
            Focus Technique
          </CardTitle>
          <CardDescription className="text-muted-foreground">Choose a study technique that works best for you.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup value={prefs.focusTechnique.name} onValueChange={handleTechniqueChange} className="space-y-2.5">
            <div className={cn('flex items-center space-x-3 rounded-xl border p-4 transition-all duration-200 cursor-pointer', prefs.focusTechnique.name === 'pomodoro' ? 'border-[#c97a57]/50 bg-[#c97a57]/5 shadow-sm' : 'border-white/10 hover:bg-white/5')} onClick={() => handleTechniqueChange('pomodoro')}>
              <RadioGroupItem value="pomodoro" id="pomodoro" className="mt-0.5" />
              <Label htmlFor="pomodoro" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2"><Timer className="h-4 w-4 text-[#c97a57]" /><span className="font-medium">Pomodoro</span></div>
                <span className="block text-xs text-muted-foreground mt-0.5">25 min study / 5 min break - 4 sessions before long break</span>
              </Label>
            </div>
            <div className={cn('flex items-center space-x-3 rounded-xl border p-4 transition-all duration-200 cursor-pointer', prefs.focusTechnique.name === 'deep-work' ? 'border-[#c97a57]/50 bg-[#c97a57]/5 shadow-sm' : 'border-white/10 hover:bg-white/5')} onClick={() => handleTechniqueChange('deep-work')}>
              <RadioGroupItem value="deep-work" id="deep-work" className="mt-0.5" />
              <Label htmlFor="deep-work" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2"><Brain className="h-4 w-4 text-[#dca77a]" /><span className="font-medium">52/17 Deep Work</span></div>
                <span className="block text-xs text-muted-foreground mt-0.5">52 min study / 17 min break - 2 sessions before long break</span>
              </Label>
            </div>
            <div className={cn('flex items-center space-x-3 rounded-xl border p-4 transition-all duration-200 cursor-pointer', isCustom ? 'border-[#c97a57]/50 bg-[#c97a57]/5 shadow-sm' : 'border-white/10 hover:bg-white/5')} onClick={() => handleTechniqueChange('custom')}>
              <RadioGroupItem value="custom" id="custom" className="mt-0.5" />
              <Label htmlFor="custom" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-[#a66245]" /><span className="font-medium">Custom Timer</span></div>
                <span className="block text-xs text-muted-foreground mt-0.5">Set your own study and break durations</span>
              </Label>
            </div>
          </RadioGroup>
          {isCustom && (
            <div className="grid grid-cols-2 gap-4 pt-2 pl-7 animate-in slide-in-from-top-2 duration-200">
              <div>
                <Label htmlFor="studyDuration" className="text-sm font-medium">Study Duration (min)</Label>
                <Input id="studyDuration" type="number" min={1} max={120} value={prefs.focusTechnique.studyDuration}
                  onChange={(e) => prefs.setFocusTechnique({ ...prefs.focusTechnique, studyDuration: Number(e.target.value) })}
                  className="mt-1.5 bg-white/5 border-white/10 focus:border-[#c97a57]/50 focus:ring-[#c97a57]/20 rounded-lg" />
              </div>
              <div>
                <Label htmlFor="breakDuration" className="text-sm font-medium">Break Duration (min)</Label>
                <Input id="breakDuration" type="number" min={1} max={30} value={prefs.focusTechnique.breakDuration}
                  onChange={(e) => prefs.setFocusTechnique({ ...prefs.focusTechnique, breakDuration: Number(e.target.value) })}
                  className="mt-1.5 bg-white/5 border-white/10 focus:border-[#c97a57]/50 focus:ring-[#c97a57]/20 rounded-lg" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="glass glass-hover rounded-xl border border-white/10 overflow-hidden transition-all duration-300">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#dca77a] to-[#c9916a]" />
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2.5 text-lg font-semibold">
            <div className="rounded-lg bg-[#dca77a]/10 p-2 text-[#dca77a]"><Bell className="h-5 w-5" /></div>
            Reminder Settings
          </CardTitle>
          <CardDescription className="text-muted-foreground">Configure when you want to be reminded about upcoming deadlines.</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="reminderTiming" className="text-sm font-medium">Remind me before deadline</Label>
            <div className="flex items-center gap-3 mt-1.5">
              <Input id="reminderTiming" type="number" min={5} step={5} value={prefs.reminderTiming}
                onChange={(e) => prefs.setReminderTiming(Number(e.target.value))}
                className="w-32 bg-white/5 border-white/10 focus:border-[#c97a57]/50 focus:ring-[#c97a57]/20 rounded-lg" />
              <span className="text-sm text-muted-foreground">minutes before due date</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass glass-hover rounded-xl border border-white/10 overflow-hidden transition-all duration-300">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#c97a57] to-[#a66245]" />
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2.5 text-lg font-semibold">
            <div className="rounded-lg bg-[#c97a57]/10 p-2 text-[#c97a57]"><Moon className="h-5 w-5" /></div>
            Quiet Hours & Deep Work
          </CardTitle>
          <CardDescription className="text-muted-foreground">Suppress notifications during specific times or when in deep work mode.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="quietHours" className="font-medium">Quiet Hours</Label>
              <p className="text-xs text-muted-foreground">Disable notifications during this period</p>
            </div>
            <Switch id="quietHours" checked={prefs.quietHours.enabled} onCheckedChange={(checked) => prefs.setQuietHours(checked)} className="data-[state=checked]:bg-[#c97a57]" />
          </div>
          {prefs.quietHours.enabled && (
            <div className="grid grid-cols-2 gap-4 pl-0 animate-in slide-in-from-top-2 duration-200">
              <div>
                <Label htmlFor="quietStart" className="text-sm font-medium">Start Time</Label>
                <Input id="quietStart" type="time" value={prefs.quietHours.start}
                  onChange={(e) => prefs.setQuietHours(true, e.target.value, prefs.quietHours.end)}
                  className="mt-1.5 bg-white/5 border-white/10 focus:border-[#c97a57]/50 focus:ring-[#c97a57]/20 rounded-lg" />
              </div>
              <div>
                <Label htmlFor="quietEnd" className="text-sm font-medium">End Time</Label>
                <Input id="quietEnd" type="time" value={prefs.quietHours.end}
                  onChange={(e) => prefs.setQuietHours(true, prefs.quietHours.start, e.target.value)}
                  className="mt-1.5 bg-white/5 border-white/10 focus:border-[#c97a57]/50 focus:ring-[#c97a57]/20 rounded-lg" />
              </div>
            </div>
          )}
          <div className="border-t border-white/5" />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="deepWork" className="font-medium">Deep Work Mode</Label>
              <p className="text-xs text-muted-foreground">Suppress all popup notifications</p>
            </div>
            <Switch id="deepWork" checked={prefs.deepWorkMode} onCheckedChange={prefs.toggleDeepWorkMode} className="data-[state=checked]:bg-[#c97a57]" />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving}
        className="btn-primary w-full sm:w-auto gap-2 rounded-xl shadow-lg shadow-[#c97a57]/25 text-white font-medium py-6 px-8 text-base">
        <Save className="h-5 w-5" />
        {saving ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  );
}
