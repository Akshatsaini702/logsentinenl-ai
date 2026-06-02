import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="border-b border-gray-800 px-8 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <span className="text-purple-500 text-2xl">🛡️</span>
        <span className="text-xl font-bold text-white">
          LogSentinel <span className="text-purple-500">AI</span>
        </span>
      </Link>
      <div className="flex gap-6 text-gray-400 text-sm">
        <Link to="/" className="hover:text-white transition">Home</Link>
        <Link to="/dashboard" className="hover:text-white transition">Dashboard</Link>
        <Link to="/alerts"className="hover:text-white transition">Alerts</Link>
        <span className="hover:text-white cursor-pointer transition">Settings</span>
      </div>
    </nav>
  );
};

export default Navbar;