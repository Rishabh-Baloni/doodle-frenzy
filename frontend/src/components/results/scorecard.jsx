'use client'

// src/components/results/ScoreCard.jsx
export default function ScoreCard({ player, position }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow mb-2">
      <div className="flex items-center gap-3">
        <span className="font-bold w-6">{position}.</span>
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
          {player.name.charAt(0)}
        </div>
        <span>{player.name}</span>
      </div>
      <span className="font-bold text-lg">{player.score} pts</span>
    </div>
  );
}