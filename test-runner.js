#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');

class GameTester {
  constructor() {
    this.results = {
      projectStructure: {},
      dependencies: {},
      servers: {},
      functionality: {},
      issues: []
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      info: '📋',
      success: '✅',
      error: '❌',
      warning: '⚠️',
      test: '🧪'
    }[type];
    
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async analyzeProjectStructure() {
    this.log('Analyzing project structure...', 'test');
    
    const requiredFiles = [
      'backend/package.json',
      'backend/index.js',
      'frontend/package.json',
      'frontend/src/app/page.tsx',
      'frontend/src/contexts/gamecontext.jsx',
      'TESTING_GUIDE.md'
    ];

    const requiredDirs = [
      'backend/models',
      'backend/routes',
      'frontend/src/components/game',
      'frontend/src/components/lobby',
      'frontend/src/utils'
    ];

    let structureScore = 0;
    const totalChecks = requiredFiles.length + requiredDirs.length;

    // Check files
    for (const file of requiredFiles) {
      if (fs.existsSync(file)) {
        this.log(`Found: ${file}`, 'success');
        structureScore++;
      } else {
        this.log(`Missing: ${file}`, 'error');
        this.results.issues.push(`Missing required file: ${file}`);
      }
    }

    // Check directories
    for (const dir of requiredDirs) {
      if (fs.existsSync(dir)) {
        this.log(`Found directory: ${dir}`, 'success');
        structureScore++;
      } else {
        this.log(`Missing directory: ${dir}`, 'error');
        this.results.issues.push(`Missing required directory: ${dir}`);
      }
    }

    this.results.projectStructure = {
      score: `${structureScore}/${totalChecks}`,
      percentage: Math.round((structureScore / totalChecks) * 100)
    };

    this.log(`Project structure: ${this.results.projectStructure.percentage}% complete`, 
      this.results.projectStructure.percentage >= 80 ? 'success' : 'warning');
  }

  async analyzeDependencies() {
    this.log('Analyzing dependencies...', 'test');
    
    try {
      // Backend dependencies
      const backendPkg = JSON.parse(fs.readFileSync('backend/package.json', 'utf8'));
      const requiredBackendDeps = ['express', 'socket.io', 'mongoose', 'cors', 'dotenv'];
      
      let backendScore = 0;
      for (const dep of requiredBackendDeps) {
        if (backendPkg.dependencies && backendPkg.dependencies[dep]) {
          this.log(`Backend has ${dep}: ${backendPkg.dependencies[dep]}`, 'success');
          backendScore++;
        } else {
          this.log(`Backend missing ${dep}`, 'error');
          this.results.issues.push(`Backend missing dependency: ${dep}`);
        }
      }

      // Frontend dependencies
      const frontendPkg = JSON.parse(fs.readFileSync('frontend/package.json', 'utf8'));
      const requiredFrontendDeps = ['react', 'next', 'socket.io-client', 'fabric'];
      
      let frontendScore = 0;
      for (const dep of requiredFrontendDeps) {
        if (frontendPkg.dependencies && frontendPkg.dependencies[dep]) {
          this.log(`Frontend has ${dep}: ${frontendPkg.dependencies[dep]}`, 'success');
          frontendScore++;
        } else {
          this.log(`Frontend missing ${dep}`, 'error');
          this.results.issues.push(`Frontend missing dependency: ${dep}`);
        }
      }

      this.results.dependencies = {
        backend: `${backendScore}/${requiredBackendDeps.length}`,
        frontend: `${frontendScore}/${requiredFrontendDeps.length}`,
        backendPercentage: Math.round((backendScore / requiredBackendDeps.length) * 100),
        frontendPercentage: Math.round((frontendScore / requiredFrontendDeps.length) * 100)
      };

    } catch (error) {
      this.log(`Error analyzing dependencies: ${error.message}`, 'error');
      this.results.issues.push(`Dependency analysis failed: ${error.message}`);
    }
  }

  async checkServerStatus() {
    this.log('Checking server status...', 'test');
    
    return new Promise((resolve) => {
      // Check backend (port 5000)
      exec('netstat -an | findstr :5000', (error, stdout) => {
        const backendRunning = stdout.includes('LISTENING');
        this.results.servers.backend = {
          running: backendRunning,
          port: 5000,
          status: backendRunning ? 'RUNNING' : 'STOPPED'
        };
        
        if (backendRunning) {
          this.log('Backend server is running on port 5000', 'success');
        } else {
          this.log('Backend server is not running', 'warning');
          this.results.issues.push('Backend server not running on port 5000');
        }

        // Check frontend (port 3000)
        exec('netstat -an | findstr :3000', (error, stdout) => {
          const frontendRunning = stdout.includes('LISTENING');
          this.results.servers.frontend = {
            running: frontendRunning,
            port: 3000,
            status: frontendRunning ? 'RUNNING' : 'STOPPED'
          };
          
          if (frontendRunning) {
            this.log('Frontend server is running on port 3000', 'success');
          } else {
            this.log('Frontend server is not running', 'warning');
            this.results.issues.push('Frontend server not running on port 3000');
          }
          
          resolve();
        });
      });
    });
  }

  async analyzeCodeQuality() {
    this.log('Analyzing code quality...', 'test');
    
    const criticalFiles = [
      'backend/index.js',
      'frontend/src/contexts/gamecontext.jsx',
      'frontend/src/components/game/canvastools.jsx',
      'frontend/src/hooks/usecanvas.js'
    ];

    let qualityIssues = [];

    for (const file of criticalFiles) {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        
        // Check for common issues
        if (content.includes('console.log') && !file.includes('test')) {
          qualityIssues.push(`${file}: Contains console.log statements`);
        }
        
        if (content.includes('TODO') || content.includes('FIXME')) {
          qualityIssues.push(`${file}: Contains TODO/FIXME comments`);
        }
        
        if (file.endsWith('.js') || file.endsWith('.jsx')) {
          // Check for basic error handling
          if (!content.includes('try') && !content.includes('catch') && content.length > 1000) {
            qualityIssues.push(`${file}: Large file without error handling`);
          }
        }
      }
    }

    this.results.functionality.codeQuality = {
      issues: qualityIssues,
      score: Math.max(0, 100 - (qualityIssues.length * 10))
    };

    if (qualityIssues.length === 0) {
      this.log('Code quality check passed', 'success');
    } else {
      this.log(`Found ${qualityIssues.length} code quality issues`, 'warning');
      qualityIssues.forEach(issue => this.log(issue, 'warning'));
    }
  }

  async runFunctionalTests() {
    this.log('Running functional tests...', 'test');
    
    const tests = [
      this.testGameContextStructure(),
      this.testSocketConfiguration(),
      this.testCanvasImplementation(),
      this.testDatabaseModels()
    ];

    const results = await Promise.all(tests);
    
    this.results.functionality.tests = results;
    const passedTests = results.filter(r => r.passed).length;
    
    this.log(`Functional tests: ${passedTests}/${results.length} passed`, 
      passedTests === results.length ? 'success' : 'warning');
  }

  async testGameContextStructure() {
    try {
      const contextFile = 'frontend/src/contexts/gamecontext.jsx';
      if (!fs.existsSync(contextFile)) {
        return { name: 'Game Context', passed: false, error: 'File not found' };
      }

      const content = fs.readFileSync(contextFile, 'utf8');
      const hasProvider = content.includes('GameProvider');
      const hasContext = content.includes('GameContext');
      const hasSocket = content.includes('socket');

      return {
        name: 'Game Context Structure',
        passed: hasProvider && hasContext && hasSocket,
        details: { hasProvider, hasContext, hasSocket }
      };
    } catch (error) {
      return { name: 'Game Context', passed: false, error: error.message };
    }
  }

  async testSocketConfiguration() {
    try {
      const socketFile = 'frontend/src/utils/socket.js';
      if (!fs.existsSync(socketFile)) {
        return { name: 'Socket Configuration', passed: false, error: 'File not found' };
      }

      const content = fs.readFileSync(socketFile, 'utf8');
      const hasSocketIO = content.includes('socket.io-client') || content.includes('io(');
      const hasLocalhost = content.includes('localhost') || content.includes('5000');

      return {
        name: 'Socket Configuration',
        passed: hasSocketIO && hasLocalhost,
        details: { hasSocketIO, hasLocalhost }
      };
    } catch (error) {
      return { name: 'Socket Configuration', passed: false, error: error.message };
    }
  }

  async testCanvasImplementation() {
    try {
      const canvasFile = 'frontend/src/hooks/usecanvas.js';
      if (!fs.existsSync(canvasFile)) {
        return { name: 'Canvas Implementation', passed: false, error: 'File not found' };
      }

      const content = fs.readFileSync(canvasFile, 'utf8');
      const hasFabric = content.includes('fabric');
      const hasDrawingLogic = content.includes('drawing') || content.includes('canvas');
      const hasSyncLogic = content.includes('sync') || content.includes('update');

      return {
        name: 'Canvas Implementation',
        passed: hasFabric && hasDrawingLogic && hasSyncLogic,
        details: { hasFabric, hasDrawingLogic, hasSyncLogic }
      };
    } catch (error) {
      return { name: 'Canvas Implementation', passed: false, error: error.message };
    }
  }

  async testDatabaseModels() {
    try {
      const gameModel = 'backend/models/game.js';
      const playerModel = 'backend/models/player.js';
      
      if (!fs.existsSync(gameModel) || !fs.existsSync(playerModel)) {
        return { name: 'Database Models', passed: false, error: 'Model files not found' };
      }

      const gameContent = fs.readFileSync(gameModel, 'utf8');
      const playerContent = fs.readFileSync(playerModel, 'utf8');
      
      const hasMongoose = gameContent.includes('mongoose') && playerContent.includes('mongoose');
      const hasSchema = gameContent.includes('Schema') && playerContent.includes('Schema');

      return {
        name: 'Database Models',
        passed: hasMongoose && hasSchema,
        details: { hasMongoose, hasSchema }
      };
    } catch (error) {
      return { name: 'Database Models', passed: false, error: error.message };
    }
  }

  generateReport() {
    this.log('Generating test report...', 'test');
    
    const report = `
# 🎮 Draw and Guess Game - Test Analysis Report
Generated: ${new Date().toISOString()}

## 📊 Overall Summary
- Project Structure: ${this.results.projectStructure.percentage || 0}%
- Backend Dependencies: ${this.results.dependencies?.backendPercentage || 0}%
- Frontend Dependencies: ${this.results.dependencies?.frontendPercentage || 0}%
- Code Quality Score: ${this.results.functionality?.codeQuality?.score || 0}%

## 🖥️ Server Status
- Backend (Port 5000): ${this.results.servers?.backend?.status || 'UNKNOWN'}
- Frontend (Port 3000): ${this.results.servers?.frontend?.status || 'UNKNOWN'}

## 🧪 Functional Tests
${this.results.functionality?.tests?.map(test => 
  `- ${test.name}: ${test.passed ? '✅ PASS' : '❌ FAIL'}${test.error ? ` (${test.error})` : ''}`
).join('\n') || 'No tests run'}

## ⚠️ Issues Found (${this.results.issues.length})
${this.results.issues.map(issue => `- ${issue}`).join('\n') || 'No issues found'}

## 🔧 Code Quality Issues
${this.results.functionality?.codeQuality?.issues?.map(issue => `- ${issue}`).join('\n') || 'No code quality issues found'}

## 📋 Next Steps
1. ${this.results.servers?.backend?.running ? '✅' : '❌'} Start backend server (npm run dev in backend/)
2. ${this.results.servers?.frontend?.running ? '✅' : '❌'} Start frontend server (npm run dev in frontend/)
3. Open browser to http://localhost:3000
4. Follow TESTING_GUIDE.md for manual testing
5. Test with multiple browser windows/tabs
6. Monitor browser console for debug logs

## 🎯 Critical Test Scenarios
1. **Two Player Drawing Test**: Player 1 draws → Player 2 sees drawing
2. **Turn Rotation Test**: Drawer changes → Canvas clears → New drawer can draw
3. **Timer Synchronization**: Timer doesn't restart on guesses
4. **Scoring System**: Correct points awarded based on guess order
5. **UI/UX Validation**: Gradient theme and animations work

---
Report generated by automated test runner
`;

    fs.writeFileSync('TEST_REPORT.md', report);
    this.log('Test report saved to TEST_REPORT.md', 'success');
    
    return report;
  }

  async runFullAnalysis() {
    this.log('Starting comprehensive game analysis...', 'info');
    
    try {
      await this.analyzeProjectStructure();
      await this.analyzeDependencies();
      await this.checkServerStatus();
      await this.analyzeCodeQuality();
      await this.runFunctionalTests();
      
      const report = this.generateReport();
      
      this.log('Analysis complete!', 'success');
      console.log('\n' + '='.repeat(60));
      console.log(report);
      console.log('='.repeat(60));
      
      // Provide recommendations
      this.provideRecommendations();
      
    } catch (error) {
      this.log(`Analysis failed: ${error.message}`, 'error');
    }
  }

  provideRecommendations() {
    this.log('Providing recommendations...', 'info');
    
    const recommendations = [];
    
    if (!this.results.servers?.backend?.running) {
      recommendations.push('🚀 Start backend server: cd backend && npm run dev');
    }
    
    if (!this.results.servers?.frontend?.running) {
      recommendations.push('🚀 Start frontend server: cd frontend && npm run dev');
    }
    
    if (this.results.issues.length > 0) {
      recommendations.push('🔧 Fix structural issues listed in the report');
    }
    
    if (this.results.functionality?.codeQuality?.score < 80) {
      recommendations.push('🧹 Clean up code quality issues');
    }
    
    recommendations.push('🧪 Run manual tests from TESTING_GUIDE.md');
    recommendations.push('🌐 Test with multiple browser windows');
    recommendations.push('📱 Test on different screen sizes');
    
    console.log('\n📋 RECOMMENDATIONS:');
    recommendations.forEach((rec, i) => console.log(`${i + 1}. ${rec}`));
  }
}

// Run the analysis
if (require.main === module) {
  const tester = new GameTester();
  tester.runFullAnalysis();
}

module.exports = GameTester;