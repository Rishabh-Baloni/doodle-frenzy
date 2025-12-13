'use client'
// @ts-nocheck

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGame } from '@/contexts/gamecontext'

export default function Home() {
  const [name, setName] = useState('')
  const [partyCode, setPartyCode] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()
  // @ts-ignore - gamecontext.jsx doesn't have TypeScript types
  const { createParty, joinParty, isLoading, error } = useGame()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    if (!name.trim()) {
      setErrorMsg('Please enter your name.')
      return
    }
    try {
      if (partyCode.trim() === '') {
        console.log('Creating new party for:', name.trim())
        // @ts-ignore - gamecontext.jsx doesn't have TypeScript types
        const result = await createParty(name.trim())
        console.log('Party created:', result)
        if (result?.game && result?.player) {
          router.push('/lobby')
        } else {
          setErrorMsg('Failed to create party. Please try again.')
        }
      } else {
        console.log('Joining party:', partyCode.trim())
        // @ts-ignore - gamecontext.jsx doesn't have TypeScript types
        const result = await joinParty(name.trim(), partyCode.trim().toUpperCase())
        console.log('Joined party:', result)
        if (result?.game && result?.player) {
          router.push('/lobby')
        } else {
          setErrorMsg('Failed to join party. Please try again.')
        }
      }
    } catch (err: any) {
      console.error('Error in handleSubmit:', err)
      setErrorMsg(error || err.message || 'Something went wrong.')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-purple-700">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-extrabold mb-3 bg-gradient-to-r from-purple-200 to-white bg-clip-text text-transparent drop-shadow-2xl">🎨 Doodle Frenzy</h1>
        <p className="text-lg text-purple-100">Draw, Guess & Win</p>
      </div>
      <form
        className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl flex flex-col gap-4 w-full max-w-sm transform hover:scale-[1.01] transition-all duration-300 border border-white/20"
        onSubmit={handleSubmit}
      >
        <input
          className="border-2 border-purple-300 rounded-xl px-4 py-2 focus:border-purple-600 focus:ring-4 focus:ring-purple-200 outline-none transition-all text-base"
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={e => setName(e.target.value)}
          autoFocus
        />
        <input
          className="border-2 border-purple-300 rounded-xl px-4 py-2 focus:border-purple-600 focus:ring-4 focus:ring-purple-200 outline-none transition-all text-base"
          type="text"
          placeholder="Party code (leave blank to create)"
          value={partyCode}
          onChange={e => setPartyCode(e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase())}
          maxLength={8}
        />
        <button
          type="submit"
          className={`w-full py-3 rounded-2xl text-white font-bold text-base shadow-lg transform transition-all duration-300 ${
            partyCode.trim() === '' 
              ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:shadow-2xl hover:-translate-y-1' 
              : 'bg-gradient-to-r from-gray-700 to-gray-900 hover:shadow-2xl hover:-translate-y-1'
          }`}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </span>
          ) : (
            partyCode.trim() === '' ? '🚀 Create New Game' : '🎮 Join Game'
          )}
        </button>
        {errorMsg && (
          <div className="text-red-600 text-center bg-red-50 p-3 rounded-xl border-2 border-red-200 animate-shake">
            {errorMsg}
          </div>
        )}
      </form>
    </div>
  )
}
