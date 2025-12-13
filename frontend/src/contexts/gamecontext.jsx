'use client'

// src/contexts/gamecontext.jsx
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || undefined;



const DEFAULT_GAME = {
  status: 'lobby',
  settings: { rounds: 3, customWords: ['apple', 'banana', 'mountain'], drawingTime: 60, maxPlayers: 8 },
  players: [],
  currentRound: 0,
  currentWord: '',
  currentDrawer: null,
  partyCode: null,
  messages: [],
  canvasState: null,
  createdAt: Date.now(),
};

const GameContext = createContext(null);

export const GameProvider = ({ children }) => {
  const [game, setGame] = useState(DEFAULT_GAME);
  const gameRef = useRef(game); gameRef.current = game;

  const [currentPlayer, setCurrentPlayer] = useState(null);
  const currentPlayerRef = useRef(currentPlayer); currentPlayerRef.current = currentPlayer;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const socketRef = useRef(null);
  const timerRef = useRef(null);

  const apiRequest = async (url, method, body) => {
    setIsLoading(true); setError(null);
    try {
      const fullUrl = `${API_BASE}${url}`;
      const res = await fetch(fullUrl, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined
      });
      if (!res.ok) {
        const errorText = await res.text();

        throw new Error(errorText || `Request failed with status ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const advanceTurn = async () => {
    if (!gameRef.current?.partyCode) return;
    try {
      const currentRound = gameRef.current.currentRound || 0;
      const maxRounds = gameRef.current.settings?.rounds || 3;
      const turnOrderLength = gameRef.current.turnOrder?.length || gameRef.current.players?.length || 0;
      const currentDrawerIndex = gameRef.current.turnOrder?.findIndex(
        id => String(id) === String(gameRef.current.currentDrawer?._id || gameRef.current.currentDrawer)
      ) || 0;
      
      // Check if this is the last turn of the last round
      const isLastPlayer = currentDrawerIndex === turnOrderLength - 1;
      const isLastRound = currentRound >= maxRounds;
      
      if (isLastPlayer && isLastRound) {
        // Game is over, navigate to results

        setGame(prev => ({ ...prev, status: 'finished' }));
      } else {
        // Continue to next turn
        await apiRequest(`/api/games/${gameRef.current.partyCode}/next-turn`, 'PATCH');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const connectSocket = (partyCode, player) => {
    if (!partyCode || !player?._id) return;

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    socketRef.current = io(SOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      query: { partyCode, playerId: player._id }
    });

    socketRef.current.on('connect', () => {
      setIsConnected(true);
      try { socketRef.current.emit('request-time-update', partyCode); } catch {}
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
    });

    socketRef.current.on('connect_error', (err) => {
      setError(err.message);
      setIsConnected(false);
    });

    // Server game state (authoritative)
    socketRef.current.on('game:update', (updatedGame) => {
      const me = currentPlayerRef.current?._id || currentPlayerRef.current?.id;
      const drawer = updatedGame?.currentDrawer?._id || updatedGame?.currentDrawer;
      const amDrawer = !!(me && drawer && String(me) === String(drawer));
      const prevDrawer = gameRef.current?.currentDrawer?._id || gameRef.current?.currentDrawer;
      const drawerChanged = String(drawer) !== String(prevDrawer);

      // NEVER update canvasState for the drawer - they own the canvas
      if (amDrawer) {
        const { canvasState, ...gameWithoutCanvas } = updatedGame;
        setGame(prev => ({ ...prev, ...gameWithoutCanvas }));
      } else {
        setGame(updatedGame);
      }

      if (drawerChanged) {
        const newTime = updatedGame?.settings?.drawingTime || 0;
        setTimeLeft(newTime);
      }
    });

    socketRef.current.on('players-updated', (players) => {
      setGame(prev => ({ ...prev, players }));
    });

    socketRef.current.on('chat-message', (message) => {
      setGame(prev => ({
        ...prev,
        messages: [...(prev.messages || []), message].slice(-200)
      }));
    });

    // Drawing updates for viewers only (drawer shouldn't receive their own updates)
    socketRef.current.on('drawing-update', (canvasData) => {
      const drawerNow = (gameRef.current?.currentDrawer?._id || gameRef.current?.currentDrawer);
      const meNow = currentPlayerRef.current?._id || currentPlayerRef.current?.id;

      // Block drawer from receiving their own drawing updates
      if (meNow && drawerNow && String(meNow) === String(drawerNow)) {
        console.log('Blocking drawing update for drawer');
        return;
      }
      console.log('Viewer receiving drawing update');
      setGame(prev => ({ ...prev, canvasState: canvasData }));
    });

    socketRef.current.on('time-update', (t) => {
      setTimeLeft(typeof t === 'number' ? t : (gameRef.current?.settings?.drawingTime || 0));
    });

    socketRef.current.on('correct-guess', (data) => {
      const meNow = currentPlayerRef.current?._id || currentPlayerRef.current?.id;
      const isMe = meNow && String(meNow) === String(data.playerId);
      const text = isMe
        ? `You guessed right! +${data.points} points`
        : `${data.playerName} guessed right! +${data.points} points`;
      setGame(prev => ({
        ...prev,
        messages: [...(prev.messages || []), { senderId: 'system', text, timestamp: Date.now() }].slice(-200)
      }));
    });
  };


  useEffect(() => () => {
    if (socketRef.current) { socketRef.current.disconnect(); socketRef.current = null; }
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  const createParty = async (name) => {
    try {
      const data = await apiRequest('/api/games', 'POST', { player: { name } });
      if (data.game && data.player) {
        setGame(data.game);
        setCurrentPlayer(data.player);
        connectSocket(data.game.partyCode, data.player);
        return data;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const joinParty = async (name, partyCode) => {
    try {
      const data = await apiRequest(`/api/games/${partyCode}/join`, 'POST', { player: { name } });
      setGame(data.game);
      setCurrentPlayer(data.player);
      connectSocket(data.game.partyCode, data.player);
      return data;
    } catch (err) {
      setError(err.message);
    }
  };

  const startGame = async () => {
    try {
      await apiRequest(`/api/games/${gameRef.current.partyCode}/start`, 'PATCH');
    } catch (err) {
      setError(err.message);
    }
  };

  const patchGame = async (updates) => {
    try {
      await apiRequest(`/api/games/${gameRef.current.partyCode}`, 'PATCH', updates);
    } catch (err) {
      setError(err.message);
    }
  };

  const endRound = async () => {
    try {
      await apiRequest(`/api/games/${gameRef.current.partyCode}/end-round`, 'PATCH');
    } catch (err) {
      setError(err.message);
    }
  };

  const sendMessage = (text) => {
    if (!gameRef.current?.partyCode || !currentPlayerRef.current?._id) return;
    const message = { senderId: currentPlayerRef.current._id, text, timestamp: Date.now() };
    if (socketRef.current?.connected) {
      socketRef.current.emit('send-message', {
        partyCode: gameRef.current.partyCode,
        message
      });
    }
  };

  const chooseWord = (word) => {
    if (!gameRef.current?.partyCode || !currentPlayerRef.current?._id) return;
    if (socketRef.current?.connected) {
      socketRef.current.emit('choose-word', {
        partyCode: gameRef.current.partyCode,
        word
      });
    }
  };

  // Do NOT optimistically set state here; server is source of truth.
  const syncCanvas = (canvasJSON) => {
    if (!gameRef.current?.partyCode || !socketRef.current?.connected) {
      return;
    }
    

    
    if (typeof window !== 'undefined' && window.canvasTestLogger) {
      window.canvasTestLogger.logEvent('socket_emit_drawing', {
        objectCount: canvasJSON?.objects?.length || 0
      });
    }
    
    socketRef.current.emit('update-drawing', {
      partyCode: gameRef.current.partyCode,
      canvasData: canvasJSON
    });
  };

  const isPlayerInGame = (playerId) =>
    (game.players || []).some(p => (p._id || p.id) === playerId);

  const value = {
    game, setGame,
    currentPlayer, setCurrentPlayer, player: currentPlayer,
    isLoading, error, isConnected, timeLeft,
    isPlayerInGame,
    createParty, joinParty, startGame, endRound,
    sendMessage, syncCanvas, patchGame,
    chooseWord,
    reconnectSocket: () => {
      if (gameRef.current.partyCode && currentPlayerRef.current) {
        connectSocket(gameRef.current.partyCode, currentPlayerRef.current);
      }
    }
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within a GameProvider');
  return ctx;
};
