// src/pages/lobby.jsx
import { useGame } from '../contexts/gamecontext';
import PlayerList from '../components/lobby/PlayerList';
import SettingsPanel from '../components/lobby/SettingsPanel';

export default function Lobby() {
  const { game, player, startGame } = useGame();

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Game Lobby</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PlayerList />
        <SettingsPanel />
      </div>
      
      {player.isHost && game.players.length > 1 && (
        <div className="mt-6 text-center">
          <button
            onClick={startGame}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-medium"
          >
            Start Game
          </button>
        </div>
      )}
    </div>
  );
}