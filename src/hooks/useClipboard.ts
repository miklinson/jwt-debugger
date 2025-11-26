import { useState, useCallback } from 'react';

interface UseClipboardReturn {
  copied: boolean;
  copy: (text: string) => Promise<void>;
}

/**
 * Hook to copy text to clipboard
 * Returns a copy function and a copied state
 */
export function useClipboard(resetDelay: number = 2000): UseClipboardReturn {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);

        // Reset after delay
        setTimeout(() => {
          setCopied(false);
        }, resetDelay);
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        setCopied(false);
      }
    },
    [resetDelay]
  );

  return { copied, copy };
}
