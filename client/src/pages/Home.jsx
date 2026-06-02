import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center mt-32 gap-4">
      <div className="bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs px-4 py-2 rounded-full">
        AI-Powered Log Monitoring Platform
      </div>
      <h1 className="text-5xl font-bold text-white text-center">
        Detect Threats. <span className="text-purple-500">Instantly.</span>
      </h1>
      <p className="text-gray-400 text-lg text-center max-w-lg">
        Upload your server logs — LogSentinel AI detects anomalies, 
        suspicious patterns, and threats in real-time.
      </p>
      <button
        onClick={() => navigate('/dashboard')}
        className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition"
      >
        Get Started →
      </button>
    </div>
  );
};

export default Home;