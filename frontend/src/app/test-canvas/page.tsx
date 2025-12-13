'use client'

import React, { useState, useRef } from 'react';
import useCanvas from '@/hooks/usecanvas';
import CanvasTools from '@/components/game/canvastools';



export default function TestCanvas() {
  const [canDrawing, setCanDrawing] = useState(true);
  const [syncEnabled, setSyncEnabled] = useState(true);
  
  // Mock sync function for testing
  const mockSyncCanvas = syncEnabled ? (data: any) => {
    console.log('📡 MOCK: Canvas sync called!', {
      imageDataLength: data.imageData?.length || 0,
      timestamp: new Date().toLocaleTimeString()
    });
  } : null;
  
  const {
    canvasRef,
    clearCanvas,
    changeBrushColor,
    changeBrushSize,
    brushColor,
    brushSize
  } = useCanvas(canDrawing, mockSyncCanvas as any);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      padding: '20px',
      minHeight: '100vh',
      backgroundColor: '#f0f0f0'
    }}>
      <h1 style={{ marginBottom: '20px', color: '#333' }}>
        🎨 Canvas Test - Goals 1, 2, 3 & 4
      </h1>
      
      <div style={{ 
        marginBottom: '20px',
        backgroundColor: 'white',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3>🎯 Goals 2, 3 & 4: Permissions, Sync & Touch Test</h3>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <button 
            onClick={() => setCanDrawing(!canDrawing)}
            style={{
              padding: '10px 20px',
              backgroundColor: canDrawing ? '#ff4444' : '#44ff44',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {canDrawing ? '🚫 Disable Drawing' : '✅ Enable Drawing'}
          </button>
          <button 
            onClick={() => setSyncEnabled(!syncEnabled)}
            style={{
              padding: '10px 20px',
              backgroundColor: syncEnabled ? '#4444ff' : '#888888',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {syncEnabled ? '📡 Sync ON' : '📡 Sync OFF'}
          </button>
        </div>
        <p style={{ margin: '5px 0', fontSize: '14px' }}>
          <strong>Drawing:</strong> {canDrawing ? '✅ ENABLED' : '🚫 DISABLED'} | 
          <strong>Sync:</strong> {syncEnabled ? '📡 ON' : '📡 OFF'}
        </p>
      </div>
      
      <div style={{ 
        position: 'relative',
        marginBottom: '20px'
      }}>
        <canvas ref={canvasRef} />
        
        <CanvasTools
          onClear={clearCanvas}
          onChangeColor={changeBrushColor}
          activeColor={brushColor}
        />
      </div>
      
      <div style={{ 
        textAlign: 'center',
        backgroundColor: 'white',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3>📋 Test Instructions:</h3>
        <p><strong>Goal 1:</strong> Change colors/brush size - drawing should persist</p>
        <p><strong>Goal 2:</strong> Toggle drawing permissions - only draw when enabled</p>
        <p><strong>Goal 3:</strong> Enable sync & draw - check console (F12) for sync calls</p>
        <p><strong>Goal 4:</strong> Test on mobile/tablet - touch drawing should work</p>
        <p><strong>Current Color:</strong> {brushColor} | <strong>Size:</strong> {brushSize}px</p>
      </div>
    </div>
  );
}