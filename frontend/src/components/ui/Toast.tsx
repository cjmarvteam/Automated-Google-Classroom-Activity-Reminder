// src/components/ui/Toast.tsx
import { Toaster as SonnerToaster } from 'sonner';

export function Toast() {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        className: 'border border-[rgba(44,36,30,0.08)] rounded-lg shadow-none',
        duration: 4000,
      }}
    />
  );
}