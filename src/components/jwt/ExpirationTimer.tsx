import { useState, useEffect } from 'react';
import { formatDuration } from '../../utils/claims.utils';

interface ExpirationTimerProps {
  expirationTime: number; // Seconds until expiration
}

export function ExpirationTimer({ expirationTime }: ExpirationTimerProps) {
  const [timeLeft, setTimeLeft] = useState(expirationTime);

  useEffect(() => {
    // Reset when expirationTime changes
    setTimeLeft(expirationTime);

    // Update every second
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [expirationTime]);

  if (timeLeft <= 0) {
    return (
      <div className="text-sm text-red-700 dark:text-red-300 font-medium">
        Token has expired
      </div>
    );
  }

  // Determine color based on time left
  const getColorClass = () => {
    if (timeLeft < 300) return 'text-red-700 dark:text-red-300'; // < 5 minutes
    if (timeLeft < 1800) return 'text-yellow-700 dark:text-yellow-300'; // < 30 minutes
    return 'text-green-700 dark:text-green-300';
  };

  return (
    <div className={`text-sm font-medium ${getColorClass()}`}>
      <span className="font-mono">{formatDuration(timeLeft)}</span> until expiration
    </div>
  );
}
