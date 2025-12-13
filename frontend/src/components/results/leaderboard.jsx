'use client'
// src/components/results/Leaderboard.jsx
import { useGame } from '../../contexts/gamecontext';

export default function Leaderboard() {
  const { game } = useGame();
  
  // Sort players by score (descending)
  const sortedPlayers = [...game.players].sort((a, b) => b.score - a.score);

  const getMedalEmoji = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '🎮';
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        🏆 Final Scores 🏆
      </h3>
      
      {/* Podium - Top 3 players */}
      <div className="flex justify-center items-end gap-6 mb-10">
        {sortedPlayers.slice(0, 3).map((player, index) => {
          const heights = ['h-32', 'h-28', 'h-20'];
          const bgColors = [
            'bg-gradient-to-br from-yellow-400 to-yellow-600',
            'bg-gradient-to-br from-gray-300 to-gray-500', 
            'bg-gradient-to-br from-amber-600 to-amber-800'
          ];
          const order = index === 0 ? 'order-2' : index === 1 ? 'order-1' : 'order-3';
          
          return (
            <div 
              key={player.id}
              className={`flex flex-col items-center ${order} transition-all duration-300 hover:scale-105`}
            >
              <div className="text-5xl mb-2 animate-bounce">{getMedalEmoji(index)}</div>
              <div className={`${heights[index]} ${bgColors[index]} w-28 rounded-t-2xl shadow-xl flex flex-col items-center justify-center text-white font-bold transition-all duration-300`}>
                <div className="text-4xl mb-2">#{index + 1}</div>
                <div className="text-2xl">{player.score}</div>
                <div className="text-sm">points</div>
              </div>
              <div className="mt-3 font-bold text-lg text-gray-800">{player.name}</div>
            </div>
          );
        })}
      </div>

      {/* Full leaderboard list */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6">
        <ul className="space-y-3">
          {sortedPlayers.map((player, index) => (
            <li 
              key={player.id} 
              className={`py-4 px-5 flex justify-between items-center rounded-xl transition-all duration-300 ${
                index < 3 
                  ? 'bg-gradient-to-r from-purple-100 to-blue-100 shadow-md transform hover:scale-102' 
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{getMedalEmoji(index)}</span>
                <span className="w-8 text-center font-bold text-xl text-purple-600">#{index + 1}</span>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                  index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                  index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-600' :
                  index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-800' :
                  'bg-gradient-to-br from-purple-500 to-blue-500'
                }`}>
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold text-lg text-gray-800">{player.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-2xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {player.score}
                </span>
                <span className="text-gray-600 font-medium">pts</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}