import { useEffect } from 'react';
import type { ReactNode } from 'react';

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Always apply dark mode
    document.documentElement.classList.add('dark');
  }, []);

  return <>{children}</>;
}
