'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Info } from 'lucide-react';
import { clsx } from 'clsx';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const colors = {
  success: 'border-accent-500/30 bg-accent-500/10 text-accent-400',
  error: 'border-red-500/30 bg-red-500/10 text-red-400',
  info: 'border-brand-500/30 bg-brand-500/10 text-brand-400',
};

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
  const Icon = icons[toast.type];

  useEffect(() => {
    const timer = setTimeout(onRemove, 3000);
    return () => clearTimeout(timer);
  }, [onRemove]);

  return (
    <div className={clsx('flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm animate-slide-in', colors[toast.type])}>
      <Icon className="w-4 h-4 shrink-0" />
      <p className="text-sm font-medium">{toast.message}</p>
    </div>
  );
}

let toastListeners: ((toast: Toast) => void)[] = [];

export function addToast(message: string, type: Toast['type'] = 'info') {
  const toast: Toast = { id: Date.now().toString(), message, type };
  toastListeners.forEach(fn => fn(toast));
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (toast: Toast) => setToasts(prev => [...prev, toast]);
    toastListeners.push(listener);
    return () => { toastListeners = toastListeners.filter(l => l !== listener); };
  }, []);

  const remove = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] space-y-2 max-w-sm">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={() => remove(toast.id)} />
      ))}
    </div>
  );
}
