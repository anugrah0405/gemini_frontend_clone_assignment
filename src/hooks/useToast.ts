import { useCallback } from 'react';
import hottoast from 'react-hot-toast';

export const useToast = () => {
  const toast = useCallback(({ title, description, type, duration }: { title: string; description?: string; type: string; duration?: number }) => {
    const message = description ? `${title} — ${description}` : title;
    const opts: any = {};
    if (typeof duration === 'number') opts.duration = duration;
    switch (type) {
      case 'success':
        return hottoast.success(message, opts);
      case 'error':
        return hottoast.error(message, opts);
      case 'warning':
        return hottoast(message, { ...opts });
      default:
        return hottoast(message, { ...opts });
    }
  }, []);

  return {
    toast,
    success: (title: string, description?: string, duration?: number) =>
      toast({ title, description, type: 'success', duration }),
    error: (title: string, description?: string, duration?: number) =>
      toast({ title, description, type: 'error', duration }),
    warning: (title: string, description?: string, duration?: number) =>
      toast({ title, description, type: 'warning', duration }),
    info: (title: string, description?: string, duration?: number) =>
      toast({ title, description, type: 'info', duration }),
  };
};