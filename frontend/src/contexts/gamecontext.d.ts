// Type definitions for gamecontext.jsx
import type { Game, Player, GameSettings } from '../types/game';

export interface GameContextValue {
  game: Game | null;
  setGame: (value: Game | null | ((prev: Game | null) => Game | null)) => void;
  currentPlayer: Player | null;
  setCurrentPlayer: (value: Player | null) => void;
  player: Player | null;
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
  timeLeft: number;
  isPlayerInGame: (playerId: string) => boolean;
  createParty: (playerName: string) => Promise<any>;
  joinParty: (playerName: string, partyCode: string) => Promise<any>;
  startGame: () => Promise<void>;
  endRound: () => Promise<void>;
  sendMessage: (text: string) => void;
  syncCanvas: (canvasJSON: any) => void;
  chooseWord: (word: string) => void;
  patchGame: (updates: Partial<Game>) => Promise<void>;
  reconnectSocket: () => void;
}

export function useGame(): GameContextValue;
export function GameProvider({ children }: { children: React.ReactNode }): JSX.Element;
