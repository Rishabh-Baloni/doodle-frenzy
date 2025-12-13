'use client'

// Goal 1: Basic Canvas Setup
// Goal 2: Drawing Permissions
// Goal 3: Real-time Canvas Synchronization
import { useRef, useState, useEffect } from 'react';

export default function useCanvas(isCurrentPlayerDrawing = false, mockSyncCanvas = null) {
  // Try to use real game context, fallback to mock for testing
  let syncCanvas = mockSyncCanvas;
  let game = null;
  
  try {
    const { useGame } = require('@/contexts/gamecontext');
    const gameContext = useGame();
    if (!mockSyncCanvas) {
      syncCanvas = gameContext.syncCanvas;
      game = gameContext.game;
    }
  } catch (e) {
    // Game context not available, use mock
  }
  const canvasRef = useRef(null);
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  
  // Use refs to store current brush values so they can be accessed in event handlers
  const brushColorRef = useRef(brushColor);
  const brushSizeRef = useRef(brushSize);
  const lastSyncTime = useRef(0);
  const isDrawerRef = useRef(isCurrentPlayerDrawing);
  const syncCanvasRef = useRef(syncCanvas);
  
  // Update refs when state changes
  useEffect(() => {
    brushColorRef.current = brushColor;
  }, [brushColor]);
  
  useEffect(() => {
    brushSizeRef.current = brushSize;
  }, [brushSize]);

  useEffect(() => {
    isDrawerRef.current = isCurrentPlayerDrawing;
  }, [isCurrentPlayerDrawing]);

  useEffect(() => {
    syncCanvasRef.current = syncCanvas;
  }, [syncCanvas]);

  // Goal 1: Create a simple HTML5 canvas that can draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    // Responsive canvas size based on container, keeping 4:3 aspect ratio
    const container = canvas.parentElement;
    const setSize = () => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const availableW = Math.floor(rect.width - 12);
      const availableH = Math.floor(rect.height - 12);
      // Fill container completely (no forced aspect ratio)
      const width = Math.max(400, availableW);
      const height = Math.max(300, availableH);
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.style.border = '2px solid #ccc';
      canvas.style.borderRadius = '12px';
      canvas.style.backgroundColor = '#ffffff';
    };
    setSize();
    window.addEventListener('resize', setSize);
    
    // Disable image smoothing for crisp pixels
    ctx.imageSmoothingEnabled = false;

    // Drawing functions - use current drawing permission
    const startDrawing = (e) => {
      if (!isDrawerRef.current) {
        console.log('Drawing blocked - not current drawer');
        return;
      }
      console.log('Starting to draw');
      isDrawing = true;
      const rect = canvas.getBoundingClientRect();
      lastX = e.clientX - rect.left;
      lastY = e.clientY - rect.top;
    };

    const draw = (e) => {
      if (!isDrawing || !isDrawerRef.current) return;
      
      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(currentX, currentY);
      ctx.strokeStyle = brushColorRef.current;
      ctx.lineWidth = brushSizeRef.current;
      ctx.lineCap = 'round';
      ctx.stroke();

      lastX = currentX;
      lastY = currentY;
      
      // Goal 3: Sync canvas data
      if (syncCanvasRef.current) {
        const now = Date.now();
        if (now - lastSyncTime.current > 100) {
          const imageData = canvas.toDataURL('image/png', 1.0);
          syncCanvasRef.current({ imageData });
          lastSyncTime.current = now;
        }
      }
    };

    const stopDrawing = () => {
      if (isDrawing) {
        console.log('Stopping draw');
        isDrawing = false;
      }
    };
    
    // Touch event handlers
    const handleTouchStart = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      startDrawing(mouseEvent);
    };
    
    const handleTouchMove = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      draw(mouseEvent);
    };

    // Add event listeners
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', stopDrawing);

    // Cleanup
    return () => {
      window.removeEventListener('resize', setSize);
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseout', stopDrawing);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', stopDrawing);
    };
  }, []);
  

  
  // Goal 3: Receive canvas updates from other players (VIEWERS ONLY)
  useEffect(() => {
    // NEVER update canvas if I'm the drawer
    if (isCurrentPlayerDrawing) {
      return;
    }
    
    if (!game?.canvasState?.imageData) {
      return;
    }
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
    };
    
    img.src = game.canvasState.imageData;
  }, [game?.canvasState?.imageData, isCurrentPlayerDrawing]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !isDrawerRef.current) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Sync clear action
    if (syncCanvasRef.current) {
      const imageData = canvas.toDataURL('image/png', 1.0);
      syncCanvasRef.current({ imageData });
    }
  };

  const changeBrushColor = (color) => {
    setBrushColor(color);
  };

  const changeBrushSize = (size) => {
    setBrushSize(size);
  };

  return {
    canvasRef,
    clearCanvas,
    changeBrushColor,
    changeBrushSize,
    brushColor,
    brushSize
  };
}