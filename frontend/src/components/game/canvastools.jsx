'use client'

import React from 'react';
import './canvastools.css';

export default function CanvasTools({
  onClear,
  onChangeColor,
  activeColor = '#000000'
}) {
  const handleClear = () => {
    try {
      onClear?.();
    } catch (error) {
      console.error('Error clearing canvas:', error);
    }
  };

  const handleColorChange = (color) => {
    try {
      onChangeColor?.(color);
    } catch (error) {
      console.error('Error changing color:', error);
    }
  };

  const handleSizeChange = () => {};
  const colors = [
    '#000000', '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#ff00ff', '#00ffff', '#ffffff',
    '#ff9500', '#a020f0', '#964B00', '#808080'
  ];
  const sizes = [];

  const styles = {};

  return (
    <div className="canvas-tools">
      <div className="color-palette horizontal">
        {colors.map(color => (
          <button
            key={color}
            onClick={() => handleColorChange(color)}
            className={`color-btn ${activeColor === color ? 'active' : ''}`}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>

      <button onClick={handleClear} className="clear-btn thin">Clear</button>
    </div>
  );
}