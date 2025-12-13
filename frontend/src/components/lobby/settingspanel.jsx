// src/components/lobby/settingspanel.jsx
import { useState } from 'react';
import { useGame } from '../../contexts/gamecontext';

export default function SettingsPanel() {
  const ctx = useGame();
  const { game, setGame } = ctx || {};
  const [newWord, setNewWord] = useState('');
  const [importExportOpen, setImportExportOpen] = useState(false);
  const [wordsText, setWordsText] = useState('');

  // defensive guards
  if (!game || !game.settings) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold mb-2">Game Settings</h3>
        <p className="text-gray-500 text-sm">Loading settings…</p>
      </div>
    );
  }

  const handleSettingChange = (setting, value) => {
    if (!setGame) return; // extra safety
    setGame(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [setting]: value
      }
    }));
  };

  const handleImportWords = () => {
    const words = wordsText
      .split('\n')
      .map(w => w.trim())
      .filter(Boolean);

    if (words.length === 0 || !setGame) return;

    setGame(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        customWords: [...new Set([...(prev.settings.customWords || []), ...words])]
      }
    }));
    setWordsText('');
    setImportExportOpen(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-xl font-bold mb-4">Game Settings</h3>

      <div className="space-y-6">
        {/* Custom Words Section */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-gray-700">Custom Words</h4>
            <button
              onClick={() => setImportExportOpen(!importExportOpen)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {importExportOpen ? 'Close' : 'Import/Export'}
            </button>
          </div>

          {importExportOpen ? (
            <div className="space-y-3 mb-4">
              <textarea
                value={wordsText}
                onChange={(e) => setWordsText(e.target.value)}
                placeholder="Enter one word per line"
                className="w-full h-32 p-3 border rounded-lg"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleImportWords}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Import Words
                </button>
                <button
                  onClick={() => {
                    setWordsText((game.settings.customWords || []).join('\n'));
                  }}
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
                >
                  Export Words
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                {(game.settings.customWords || []).map((word) => (
                  <div key={word} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                    <span className="font-medium capitalize">{word.toLowerCase()}</span>
                    <button
                      onClick={() => {
                        if (!setGame) return;
                        setGame(prev => ({
                          ...prev,
                          settings: {
                            ...prev.settings,
                            customWords: (prev.settings.customWords || []).filter(w => w !== word)
                          }
                        }));
                      }}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newWord.trim() && setGame) {
                      setGame(prev => ({
                        ...prev,
                        settings: {
                          ...prev.settings,
                          customWords: [...new Set([...(prev.settings.customWords || []), newWord.trim()])]
                        }
                      }));
                      setNewWord('');
                    }
                  }}
                  placeholder="Add new word"
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => {
                    if (newWord.trim() && setGame) {
                      setGame(prev => ({
                        ...prev,
                        settings: {
                          ...prev.settings,
                          customWords: [...new Set([...(prev.settings.customWords || []), newWord.trim()])]
                        }
                      }));
                      setNewWord('');
                    }
                  }}
                  disabled={!newWord.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
            </>
          )}
        </div>

        {/* Game Configuration */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Drawing Time</label>
              <select
                value={game.settings.drawingTime}
                onChange={(e) => handleSettingChange('drawingTime', parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {[30, 60, 90, 120].map(time => (
                  <option key={time} value={time}>{time} seconds</option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Rounds</label>
              <select
                value={game.settings.rounds}
                onChange={(e) => handleSettingChange('rounds', parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {[1, 2, 3, 5, 7].map(round => (
                  <option key={round} value={round}>{round}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Players</label>
            <select
              value={game.settings.maxPlayers}
              onChange={(e) => handleSettingChange('maxPlayers', parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg"
            >
              {[4, 6, 8, 10, 12].map(max => (
                <option key={max} value={max}>{max}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
