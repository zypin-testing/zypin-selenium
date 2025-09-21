/**
 * Selenium Grid health check for Zypin Framework
 * Checks if Selenium Grid is running and ready to accept sessions
 * 
 * TODO:
 * - Check Java availability and version
 * - Make HTTP request to Grid status endpoint
 * - Parse Grid status response
 * - Check if Grid is ready
 * - Extract version and node information
 * - Handle connection errors gracefully
 * - Support custom ports from config
 * - Add timeout handling
 * - Return structured health status with Java info
 */

const http = require('http');
const { spawn } = require('child_process');

// Check Java availability
async function getJavaInfo() {
  return new Promise((resolve) => {
    const java = spawn('java', ['-version'], { 
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: process.platform === 'win32'
    });
    
    let version = '';
    java.stderr.on('data', (data) => {
      version += data.toString();
    });
    
    java.on('error', () => {
      resolve({ installed: false, version: null });
    });
    
    java.on('exit', (code) => {
      if (code === 0) {
        // Extract version from output
        const match = version.match(/version "(.+?)"/);
        resolve({ 
          installed: true, 
          version: match ? match[1] : 'unknown' 
        });
      } else {
        resolve({ installed: false, version: null });
      }
    });
  });
}

// Minimal implementation - Phase 2
function checkHealth(config = {}) {
  const port = config.port || 8422;
  const timeout = config.timeout || 5000;
  
  return new Promise(async (resolve) => {
    // Get Java info
    const javaInfo = await getJavaInfo();
    
    // Build display output
    const formatDisplay = (result) => {
      let display = [];
      
      // Java status
      if (javaInfo.installed) {
        display.push(`     Java: ✓ ${javaInfo.version}`);
      } else {
        display.push(`     Java: ✗ not installed`);
      }
      
      // Grid status
      if (result.healthy) {
        display.push(`     Status: ${result.status}`);
        display.push(`     ${result.message}`);
        if (result.version && result.version !== 'unknown') {
          display.push(`     Grid version: ${result.version}`);
        }
      } else {
        display.push(`     Status: ${result.status}`);
        display.push(`     ${result.message}`);
      }
      
      return display.join('\n');
    };
    
    // Make HTTP request to Grid
    const options = {
      hostname: 'localhost',
      port: port,
      path: '/wd/hub/status',
      method: 'GET',
      timeout: timeout
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const status = JSON.parse(data);
          const ready = status.value?.ready || false;
          
          const result = {
            healthy: res.statusCode === 200 && ready,
            status: ready ? 'ready' : 'starting',
            message: ready ? 'Grid is ready' : 'Grid is starting',
            version: status.value?.nodes?.[0]?.version || 'unknown',
            nodes: status.value?.nodes || [],
            javaInfo: javaInfo
          };
          
          result.display = formatDisplay(result);
          resolve(result);
        } catch (e) {
          const result = {
            healthy: false,
            status: 'error',
            message: 'Invalid response from Grid',
            javaInfo: javaInfo
          };
          result.display = formatDisplay(result);
          resolve(result);
        }
      });
    });
    
    req.on('error', (err) => {
      let result;
      if (!javaInfo.installed) {
        result = {
          healthy: false,
          status: 'java-missing',
          message: 'Java is not installed. Install from https://adoptium.net/',
          javaInfo: javaInfo
        };
      } else {
        result = {
          healthy: false,
          status: 'unreachable',
          message: `Grid not running on port ${port}`,
          javaInfo: javaInfo
        };
      }
      result.display = formatDisplay(result);
      resolve(result);
    });
    
    req.on('timeout', () => {
      req.destroy();
      const result = {
        healthy: false,
        status: 'timeout',
        message: 'Health check timed out',
        javaInfo: javaInfo
      };
      result.display = formatDisplay(result);
      resolve(result);
    });
    
    req.end();
  });
}

module.exports = { checkHealth };
