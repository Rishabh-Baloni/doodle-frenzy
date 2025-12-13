// Test Logger for Canvas Synchronization
class TestLogger {
  constructor() {
    this.testResults = [];
    this.currentTest = null;
  }

  startTest(testName, expected) {
    this.currentTest = {
      name: testName,
      expected,
      actual: [],
      startTime: Date.now(),
      status: 'running'
    };
    console.log(`🧪 TEST START: ${testName}`);
    console.log(`📋 EXPECTED: ${expected}`);
  }

  logEvent(event, data) {
    if (this.currentTest) {
      this.currentTest.actual.push({
        event,
        data,
        timestamp: Date.now()
      });
      console.log(`📊 TEST EVENT: ${event}`, data);
    }
  }

  endTest(result) {
    if (this.currentTest) {
      this.currentTest.status = result;
      this.currentTest.endTime = Date.now();
      this.currentTest.duration = this.currentTest.endTime - this.currentTest.startTime;
      
      console.log(`🏁 TEST END: ${this.currentTest.name} - ${result.toUpperCase()}`);
      console.log(`⏱️ Duration: ${this.currentTest.duration}ms`);
      
      if (result === 'pass') {
        console.log('✅ Test passed!');
      } else {
        console.log('❌ Test failed!');
        console.log('Expected:', this.currentTest.expected);
        console.log('Actual events:', this.currentTest.actual);
      }
      
      this.testResults.push(this.currentTest);
      this.currentTest = null;
    }
  }

  getResults() {
    return this.testResults;
  }

  // Test Scenarios
  testDrawerDrawsViewerSees() {
    this.startTest(
      'Drawer draws, viewer sees drawing',
      'Drawer: path created → sync to server → Viewer: receives canvas update → displays drawing'
    );
  }

  testViewerCannotDraw() {
    this.startTest(
      'Viewer cannot draw',
      'Viewer: attempts to draw → path removed immediately → no sync to server'
    );
  }

  testTurnChange() {
    this.startTest(
      'Turn changes, canvas clears for new drawer',
      'Turn change → old drawer becomes viewer → new drawer gets clean canvas → viewers see clean canvas'
    );
  }

  testDrawingPersistence() {
    this.startTest(
      'Drawer\'s drawing persists during their turn',
      'Drawer: draws → canvas syncs → drawing stays on drawer\'s canvas → no overwrite from remote updates'
    );
  }
}

// Global test logger instance
window.canvasTestLogger = new TestLogger();

export default window.canvasTestLogger;