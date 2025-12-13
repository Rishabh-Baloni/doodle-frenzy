// src/components/testing/TestControls.jsx
import { useGame } from '../../contexts/gamecontext';

export default function TestControls() {
  const { game, setGame } = useGame();

  const testActions = {
    nextRound: () => {
      setGame(prev => ({
        ...prev,
        currentRound: prev.currentRound + 1,
        currentWord: ['apple', 'banana', 'mountain'][prev.currentRound % 3]
      }));
    },
    botGuess: () => {
      setGame(prev => ({
        ...prev,
        players: prev.players.map(p => 
          p.id === 'bot1' ? { ...p, score: p.score + 100 } : p
        )
      }));
    },
    resetGame: () => {
      setGame(prev => ({
        ...prev,
        status: 'lobby',
        currentRound: 1
      }));
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-xl shadow-lg z-50">
      <h3 className="font-bold mb-2">Test Controls</h3>
      <div className="flex gap-2 flex-wrap">
        <button 
          onClick={testActions.nextRound}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
        >
          Next Round
        </button>
        <button 
          onClick={testActions.botGuess}
          className="px-3 py-1 bg-green-500 text-white rounded text-sm"
        >
          Bot Guesses
        </button>
        <button 
          onClick={testActions.resetGame}
          className="px-3 py-1 bg-red-500 text-white rounded text-sm"
        >
          Reset Game
        </button>
      </div>
    </div>
  );
}