'use client'

// src/components/game/PlayerScore.jsx
export default function PlayerScore({ players = [], currentPlayerId, currentDrawerId }) {
  return (
    <div className="player-list">
      <div className="player-list-header">Players</div>
      <ul>
        {players.map(p => {
          const id = p._id || p.id;
          const you = id === currentPlayerId;
          const isDrawer = currentDrawerId && String(currentDrawerId) === String(id);
          const itemClass = `player-item${you ? ' you' : ''}${isDrawer ? ' drawer' : ''}`;
          return (
            <li key={id} className={itemClass}>
              <span className="player-name">
                {p.name} {you ? '(You)' : ''} {isDrawer ? '✏️ Drawer' : ''}
              </span>
              {p.score != null && (
                <span className="player-score">{p.score}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
