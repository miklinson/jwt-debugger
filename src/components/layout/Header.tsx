import { ThemeToggle } from '../ui/ThemeToggle';

export function Header() {
  return (
    <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              JWT Debugger
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Decode and verify JWT tokens securely in your browser
            </p>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
