'use client'

// src/components/game/chat.jsx
import { useState, useRef, useEffect } from 'react';
import { useGame } from '../../contexts/gamecontext';
import './chat-new.css';

export default function Chat() {
  const { game, sendMessage, currentPlayer } = useGame();
  const [message, setMessage] = useState('');
  const messagesRef = useRef(null);

  const meId = currentPlayer?._id || currentPlayer?.id;
  const drawerId = game?.currentDrawer?._id || game?.currentDrawer;
  const isDrawer = !!(meId && drawerId && String(meId) === String(drawerId));
  
  // Check if current player has guessed correctly
  const hasGuessed = game.guessedPlayers?.some(
    id => String(id) === String(meId)
  );

  const handleSend = () => {
    const text = message.trim();
    if (!text || !(currentPlayer?._id || currentPlayer?.id)) return;
    if (isDrawer) return; // drawer cannot chat in their turn

    try {
      sendMessage(text); // server will broadcast back to everyone
      setMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  // auto-scroll to bottom on new messages
  useEffect(() => {
    const el = messagesRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [game?.messages?.length]);

  const messages = game?.messages || [];

  return (
    <div className="chat-container">
      {hasGuessed && !isDrawer && (
        <div style={{ padding: '8px', background: '#4caf50', color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
          ✓ You guessed correctly! Wait for others...
        </div>
      )}
      <div className="messages" ref={messagesRef}>
        {messages.map((msg, i) => {
          const isCurrentUser = msg.senderId === meId;
          const sender = msg.senderId === 'system'
            ? 'System'
            : (isCurrentUser
                ? 'You'
                : (game.players || []).find(p => (p._id || p.id) === msg.senderId)?.name || 'Player');
          return (
            <div key={i} className={`message ${isCurrentUser ? 'own-message' : ''}`}>
              <span className="sender">{sender}:</span>
              <span className="text">{msg.text}</span>
            </div>
          );
        })}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={isDrawer ? "You can't chat while drawing" : hasGuessed ? "You already guessed!" : "Type your guess..."}
          disabled={isDrawer || hasGuessed}
        />
        <button onClick={handleSend} disabled={!message.trim() || isDrawer || hasGuessed || !currentPlayer}>
          Send
        </button>
      </div>
    </div>
  );
}
