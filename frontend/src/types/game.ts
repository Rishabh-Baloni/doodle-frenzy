export interface Player {
  _id: string
  id?: string
  name: string
  isHost: boolean
  score: number
}

export interface GameSettings {
  rounds: number
  drawingTime: number
  customWords: string[]
  maxPlayers: number
}

export interface Game {
  _id: string
  partyCode: string
  players: Player[]
  status: 'lobby' | 'playing' | 'finished'
  settings: GameSettings
  currentRound: number
  currentWord: string
  currentDrawer: Player | string | null
  phase?: 'choosing' | 'drawing'
  wordChoices?: string[]
}

export interface GameContextType {
  game: Game | null
  currentPlayer: Player | null
  startGame: () => Promise<void>
  isLoading: boolean
  error: string | null
  patchGame: (updates: Partial<Game>) => Promise<void>
}