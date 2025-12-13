import { useState } from 'react';
import { useGame } from '../../contexts/gamecontext';

export default function PlayerList() {
  const { game, player, setGame } = useGame();
  const [newPlayerName, setNewPlayerName] = useState('');

  // Safely get player ID or default value
  const getSafeId = (id) => {
    if (!id) return '----';
    if (typeof id !== 'string') return String(id).slice(0, 4);
    return id.slice(0, 4);
  };

  const handleKickPlayer = (playerId) => {
    if (window.confirm('Remove this player?')) {
      setGame(prev => ({
        ...prev,
        players: prev.players.filter(p => p.id !== playerId)
      }));
    }
  };

  const handlePromoteHost = (playerId) => {
    setGame(prev => ({
      ...prev,
      players: prev.players.map(p => ({
        ...p,
        isHost: p.id === playerId
      }))
    }));
  };

  // Safely get players array
  const players = Array.isArray(game?.players) ? game.players : [];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Players ({players.length}/8)</h3>
        {player?.isHost && (
          <button 
            onClick={() => navigator.clipboard.writeText(window.location.href)}
            className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded"
          >
            Copy Invite Link
          </button>
        )}
      </div>

      <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
        {players.map(p => (
          <div key={p.id || Math.random()} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              p.isHost ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {p.isHost ? '👑' : '👤'}
            </div>
            <div className="flex-1">
              <p className={`font-medium ${p.id === player?.id ? 'text-blue-600' : ''}`}>
                {p.name || 'Anonymous'} {p.id === player?.id && '(You)'}
              </p>
              <div className="flex gap-2 text-sm">
                <span className="text-gray-500">Score: {p.score || 0}</span>
                <span className="text-gray-400">ID: {getSafeId(p.id)}</span>
              </div>
            </div>
            {player?.isHost && !p.isHost && (
              <div className="flex gap-2">
                <button 
                  onClick={() => handlePromoteHost(p.id)}
                  className="text-xs bg-gray-100 hover:bg-gray-200 p-1 rounded"
                  title="Make host"
                >
                  👑
                </button>
                <button 
                  onClick={() => handleKickPlayer(p.id)}
                  className="text-xs bg-red-100 hover:bg-red-200 text-red-500 p-1 rounded"
                  title="Remove player"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {!player?.id && (
        <div className="border-t pt-4">
          <p className="text-sm text-gray-600 mb-2">Join the game</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder="Your name"
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
              Join
            </button>
          </div>
        </div>
      )}
    </div>
  );
}