'use client'

import { useGame } from '@/contexts/gamecontext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { Game, Player } from '@/types/game'

export default function Lobby() {
  const context = useGame() as any
  const game = context.game as Game | null
  const currentPlayer = context.currentPlayer as Player | null
  const { startGame, isLoading, error, patchGame } = context
  const router = useRouter()
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    if (game?.status === 'playing') {
      router.push('/game')
    }
  }, [game?.status, router])

  // Redirect to home if no player data
  useEffect(() => {
    if (!isLoading && !currentPlayer) {
      console.error('No current player found, redirecting to home')
      router.push('/')
    }
  }, [currentPlayer, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
        </div>
      </div>
    )
  }

  if (!currentPlayer || !game?.players?.some((p: Player) => (p._id || p.id) === (currentPlayer._id || currentPlayer.id))) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
          <h2 className="text-2xl font-bold mb-4">Player not found</h2>
          <p>Please return to the home page and rejoin</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-purple-700 p-6">
      <div className="bg-white/95 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-full max-w-2xl">
        <h1 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          🎮 Game Lobby
        </h1>
        <div className="mb-8 text-center bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-2xl">
          <span className="font-semibold text-purple-800 text-lg">Party Code:</span>
          <span className="ml-3 text-3xl font-mono font-bold tracking-widest bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {game?.partyCode}
          </span>
        </div>
        <div className="mb-6">
          <h2 className="font-bold text-xl mb-4 text-purple-800">👥 Players:</h2>
          <ul className="space-y-3">
            {(game?.players || []).map((p: Player) => (
              <li
                key={p._id || p.id}
                className={`py-3 px-5 rounded-xl transition-all duration-300 ${ 
                  p._id === currentPlayer?._id 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold shadow-lg transform scale-105' 
                    : 'bg-gray-50 text-gray-800 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">
                  {p.name} {p._id === currentPlayer?._id ? '(You)' : ''} {p.isHost ? '👑' : ''}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 p-5 rounded-2xl">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-lg text-purple-800">⚙️ Game Settings</h3>
            {currentPlayer?.isHost && (
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-purple-600 hover:text-purple-800 font-semibold"
              >
                {showSettings ? '✕ Close' : '✏️ Edit'}
              </button>
            )}
          </div>
          
          {showSettings && currentPlayer?.isHost ? (
            <div className="space-y-3">
              <div>
                <label className="block text-purple-700 font-semibold mb-1">🔄 Rounds:</label>
                <select
                  value={game?.settings?.rounds || 3}
                  onChange={(e) => patchGame({ settings: { ...game?.settings, rounds: parseInt(e.target.value) } } as Partial<Game>)}
                  className="w-full p-2 border border-purple-300 rounded-lg"
                >
                  <option value={1}>1 Round</option>
                  <option value={2}>2 Rounds</option>
                  <option value={3}>3 Rounds</option>
                  <option value={4}>4 Rounds</option>
                  <option value={5}>5 Rounds</option>
                  <option value={10}>10 Rounds</option>
                </select>
              </div>
              <div>
                <label className="block text-purple-700 font-semibold mb-1">⏱️ Drawing Time:</label>
                <select
                  value={game?.settings?.drawingTime || 60}
                  onChange={(e) => patchGame({ settings: { ...game?.settings, drawingTime: parseInt(e.target.value) } } as Partial<Game>)}
                  className="w-full p-2 border border-purple-300 rounded-lg"
                >
                  <option value={30}>30 seconds</option>
                  <option value={45}>45 seconds</option>
                  <option value={60}>60 seconds</option>
                  <option value={90}>90 seconds</option>
                  <option value={120}>2 minutes</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between text-purple-800">
                <span className="font-semibold">🔄 Rounds:</span>
                <span className="font-bold text-lg">{game?.settings?.rounds}</span>
              </div>
              <div className="flex justify-between text-purple-800">
                <span className="font-semibold">⏱️ Drawing Time:</span>
                <span className="font-bold text-lg">{game?.settings?.drawingTime}s</span>
              </div>
            </div>
          )}
        </div>
        {currentPlayer?.isHost ? (
          <button
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg shadow-lg hover:shadow-2xl hover:from-purple-700 hover:to-blue-700 transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            onClick={startGame}
            disabled={isLoading}
          >
            {isLoading ? '🚀 Starting...' : '🎮 Start Game'}
          </button>
        ) : (
          <div className="text-center text-purple-600 text-lg font-semibold bg-purple-50 p-4 rounded-xl animate-pulse">
            ⏳ Waiting for host to start the game...
          </div>
        )}
        {error && (
          <div className="text-red-600 mt-4 text-center bg-red-50 p-3 rounded-xl border-2 border-red-200">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
