// Debug Helper for Canvas Synchronization Testing
// Add this script to your HTML or run in browser console

window.CanvasDebugHelper = {
  // Enable/disable debug modes
  enableDebug() {
    window.CANVAS_DEBUG = true;
    window.SOCKET_DEBUG = true;
    console.log('🔍 Canvas debug mode enabled');
  },

  disableDebug() {
    window.CANVAS_DEBUG = false;
    window.SOCKET_DEBUG = false;
    console.log('🔇 Canvas debug mode disabled');
  },

  // Monitor canvas events
  monitorEvents() {
    const canvas = document.querySelector('canvas');
    if (!canvas) return console.error('Canvas not found');

    ['mousedown', 'mousemove', 'mouseup'].forEach(event => {
      canvas.addEventListener(event, (e) => {
        console.log(`📍 ${event}:`, {
          x: e.offsetX,
          y: e.offsetY,
          timestamp: Date.now()
        });
      });
    });
  },

  // Check sync performance
  measureSyncLatency() {
    const startTime = performance.now();
    window.syncLatencyStart = startTime;
    console.log('⏱️ Sync latency measurement started');
  },

  // Simulate network issues
  simulateNetworkDelay(ms = 100) {
    const originalEmit = window.socket?.emit;
    if (!originalEmit) return console.error('Socket not found');

    window.socket.emit = function(...args) {
      setTimeout(() => originalEmit.apply(this, args), ms);
    };
    console.log(`🌐 Network delay simulation: ${ms}ms`);
  },

  // Reset to normal
  resetNetworkDelay() {
    if (window.originalSocketEmit) {
      window.socket.emit = window.originalSocketEmit;
      console.log('🔄 Network delay reset');
    }
  },

  // Generate test drawing pattern
  generateTestPattern() {
    console.log('🎨 Generating test drawing pattern...');
    // This would trigger programmatic drawing for testing
    return {
      type: 'test_pattern',
      pattern: 'circle',
      timestamp: Date.now()
    };
  }
};

// Auto-enable debug on load
if (typeof window !== 'undefined') {
  window.CanvasDebugHelper.enableDebug();
  console.log('🚀 Canvas Debug Helper loaded. Use window.CanvasDebugHelper for testing.');
}