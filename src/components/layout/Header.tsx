export function Header() {
  return (
    <header className="border-b border-gray-700 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            JWT Debugger
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Decode and verify JWT tokens securely in your browser
          </p>
        </div>
      </div>
    </header>
  );
}
