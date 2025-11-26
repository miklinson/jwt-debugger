import type { ReactNode } from 'react';

interface SplitPaneProps {
  left: ReactNode;
  right: ReactNode;
}

export function SplitPane({ left, right }: SplitPaneProps) {
  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-88px)]">
      {/* Left Pane */}
      <div className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
        <div className="p-4 sm:p-6">
          {left}
        </div>
      </div>

      {/* Right Pane */}
      <div className="w-full lg:w-1/2 overflow-y-auto">
        <div className="p-4 sm:p-6">
          {right}
        </div>
      </div>
    </div>
  );
}
