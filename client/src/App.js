function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      
      {/* Navbar */}
      <nav className="border-b border-gray-800 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-purple-500 text-2xl">🛡️</span>
          <span className="text-xl font-bold text-white">LogSentinel <span className="text-purple-500">AI</span></span>
        </div>
        <div className="flex gap-6 text-gray-400 text-sm">
          <span className="hover:text-white cursor-pointer">Dashboard</span>
          <span className="hover:text-white cursor-pointer">Alerts</span>
          <span className="hover:text-white cursor-pointer">Settings</span>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex flex-col items-center justify-center mt-32 gap-4">
        <h1 className="text-5xl font-bold text-white">
          Detect Threats. <span className="text-purple-500">Instantly.</span>
        </h1>
        <p className="text-gray-400 text-lg text-center max-w-lg">
          Upload your server logs — LogSentinel AI detects anomalies, suspicious patterns, and threats in real-time.
        </p>
        <button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition">
          Upload Logs
        </button>
      </div>

    </div>
  );
}

export default App;