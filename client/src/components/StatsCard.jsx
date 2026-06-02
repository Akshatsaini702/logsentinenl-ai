const StatsCard = ({ title, value, icon, color }) => {
  return (
    <div className={`bg-gray-900 border border-gray-800 rounded-xl p-6 flex items-center gap-4 hover:border-${color}-500 transition-all duration-300`}>
      <div className={`text-${color}-500 text-3xl`}>{icon}</div>
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-white text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;