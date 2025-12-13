'use client'
// @ts-nocheck

import { useGame } from '@/contexts/gamecontext'
import Leaderboard from '@/components/results/leaderboard'
import Button from '@/components/common/button'

export default function Results() {
  const { game, setGame } = useGame()

  const returnToLobby = () => {
    // @ts-ignore - gamecontext.jsx doesn't have TypeScript types
    setGame(prev => (
      prev ? {
        ...prev,
        status: 'lobby',
        players: (prev.players || []).map((p: any) => ({ ...p, score: 0 }))
      } : prev
    ))
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-purple-700 p-8">
      <div className="text-center mb-8 animate-bounce">
        <h2 className="text-5xl font-bold text-white mb-2">🎉 Game Results 🎉</h2>
        <p className="text-xl text-purple-100">See how everyone did!</p>
      </div>
      
      <div className="w-full max-w-4xl bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8">
        <Leaderboard />
        
        <div className="flex justify-center mt-8 gap-4 flex-wrap">
          <button
            onClick={returnToLobby}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg shadow-lg hover:shadow-2xl hover:from-purple-700 hover:to-blue-700 transform hover:-translate-y-1 transition-all duration-300"
          >
            🔄 Return to Lobby
          </button>
          <button
            onClick={() => {}}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg shadow-lg hover:shadow-2xl hover:from-green-600 hover:to-emerald-700 transform hover:-translate-y-1 transition-all duration-300"
          >
            📤 Share Results
          </button>
        </div>
      </div>
    </div>
  )
}
