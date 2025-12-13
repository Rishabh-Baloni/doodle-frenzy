'use client'

import React, { useEffect, forwardRef, memo } from 'react'
import { useGame } from '@/contexts/gamecontext'
import { useRouter } from 'next/navigation'
import useCanvas from '@/hooks/usecanvas'
import CanvasTools from '@/components/game/canvastools'
import PlayerScore from '@/components/game/playerscore'
import Chat from '@/components/game/chat'
import '@/components/game/game.css'
import type { Game, Player } from '@/types/game'

const CanvasSurface = memo(
  forwardRef<HTMLCanvasElement, {}>(function CanvasSurface(_props, ref) {
    return (
      <canvas
        ref={ref}
        className="drawing-canvas"
        style={{ display: 'block' }}
      />
    )
  })
)

export default function Game() {
  const PlayerScoreComp: any = PlayerScore
  const { game, currentPlayer, isLoading, error, timeLeft, chooseWord } = useGame()
  const router = useRouter()

  const isCurrentPlayerDrawing = (() => {
    const playerId = currentPlayer?._id || currentPlayer?.id
    const drawerId = typeof game?.currentDrawer === 'object' ? game?.currentDrawer?._id : game?.currentDrawer
    const isDrawing = !!(playerId && drawerId && String(playerId) === String(drawerId))
    console.log('Drawing check:', { playerId, drawerId, isDrawing })
    return isDrawing
  })()

  const canDraw = isCurrentPlayerDrawing && (game?.phase === 'drawing')
  const {
    canvasRef,
    clearCanvas,
    changeBrushColor,
    changeBrushSize,
    brushColor,
    brushSize
  } = useCanvas(canDraw)

  // Navigate to results when game is finished
  useEffect(() => {
    if (game?.status === 'finished') {
      router.push('/results')
    }
  }, [game?.status, router])

  useEffect(() => {
    if (!currentPlayer) return
    const list = game?.players || []
    const found = list.some((p: any) => (p._id || p.id) === (currentPlayer._id || currentPlayer.id))
    if (!found) router.push('/')
  }, [currentPlayer, game?.players, router])

  if (isLoading) {
    return (
      <div className="game-waiting">
        <h2>Loading game data...</h2>
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="game-waiting error">
        <h2>Error loading game</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Refresh Page</button>
      </div>
    )
  }

  if (!currentPlayer) {
    return (
      <div className="game-waiting">
        <h2>Player not found</h2>
        <p>Please return to the lobby and rejoin</p>
      </div>
    )
  }



  return (
    <div className="game-container">
      <div className="game-sidebar left-sidebar">
        <PlayerScoreComp
          players={(game?.players as Player[]) || []}
          currentPlayerId={currentPlayer?._id || currentPlayer?.id}
          currentDrawerId={typeof game?.currentDrawer === 'object' ? game?.currentDrawer?._id : game?.currentDrawer}
        />
      </div>

      <div className="game-main">
        <div className="game-info">
          <h3>Round {game?.currentRound ?? 0} of {game?.settings?.rounds ?? 0}</h3>
          <div className="timer">Time left: {timeLeft}s</div>
          {game?.currentDrawer && (
            <div className="current-word">
              {game?.phase === 'choosing' && isCurrentPlayerDrawing ? 'Pick a word to start the turn' :
               game?.phase === 'choosing' ? `Waiting for ${(game?.players||[]).find(p=> (p._id||p.id)=== (typeof game?.currentDrawer==='object'?game?.currentDrawer?._id:game?.currentDrawer))?.name || 'player'} to choose a word…` :
               (isCurrentPlayerDrawing ? `You are drawing: ${game?.currentWord}` : `Drawing by ${(game?.players||[]).find(p=> (p._id||p.id)=== (typeof game?.currentDrawer==='object'?game?.currentDrawer?._id:game?.currentDrawer))?.name || 'Player'}`)}
            </div>
          )}

          {/* Word choices for drawer */}
          {game?.phase === 'choosing' && isCurrentPlayerDrawing && Array.isArray(game?.wordChoices) && (
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '8px' }}>
              {(game?.wordChoices || []).map((w: string) => (
                <button
                  key={w}
                  onClick={() => chooseWord(w)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 10,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    boxShadow: '0 4px 14px rgba(102, 126, 234, 0.35)',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '0.9rem'
                  }}
                >
                  {w}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="canvas-container">
          <div className="canvas-stage">
            <CanvasSurface ref={canvasRef} />
            {game?.phase === 'drawing' && isCurrentPlayerDrawing && (
              <CanvasTools
                onClear={clearCanvas}
                onChangeColor={changeBrushColor}
                activeColor={brushColor}
              />
            )}
            {(!isCurrentPlayerDrawing || game?.phase !== 'drawing') && (
              <div className="viewer-overlay">
                <div className="viewer-overlay-content">
                  {game?.phase === 'choosing' && isCurrentPlayerDrawing ? 'Choose a word to begin drawing' :
                   game?.phase === 'choosing' ? 'Waiting for drawer to choose a word' :
                   'Waiting for your turn… Only the current drawer can draw.'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="game-sidebar right-sidebar">
        <Chat />
      </div>
    </div>
  )
}
