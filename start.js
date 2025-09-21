/**
 * Selenium Grid starter for Zypin Framework
 * Spawns Selenium Grid standalone server using bundled JAR
 * 
 * Debug mode usage (two options):
 * - zypin start --packages selenium --debug
 * - ZYPIN_DEBUG=true zypin start --packages selenium
 * Shows Selenium server output for troubleshooting
 * 
 * TODO:
 * - Check Java availability before starting (java -version >= 11)
 * - Load default config from config/defaults.json
 * - Merge with user-provided config
 * - Auto-download JAR if not exists using config.jarFile and config.jarUrl
 * - Build java command with proper arguments
 * - Spawn java -jar lib/{config.jarFile} standalone
 * - Handle process stdout/stderr appropriately
 * - Return process handle for process manager
 * - Support Windows/Mac/Linux command variations
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const https = require('https');

// Minimal implementation - Phase 2
// Check Java version >= 11
async function checkJava() {
  return new Promise((resolve) => {
    const java = spawn('java', ['-version'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: process.platform === 'win32'
    });

    let version = '';
    java.stderr.on('data', (data) => {
      version += data.toString();
    });

    java.on('error', () => resolve({ valid: false, version: null }));

    java.on('exit', (code) => {
      if (code === 0) {
        // Extract version (handles both "1.8" and "11" formats)
        const match = version.match(/version "(\d+)\.(\d+).*"|version "(\d+)/);
        let majorVersion = 0;

        if (match) {
          if (match[1] === '1') {
            // Old format: 1.8 = Java 8
            majorVersion = parseInt(match[2]);
          } else {
            // New format: 11, 17, etc.
            majorVersion = parseInt(match[1] || match[3]);
          }
        }

        const versionString = version.match(/version "(.+?)"/)?.[1] || 'unknown';

        resolve({
          valid: majorVersion >= 11,
          version: versionString,
          majorVersion: majorVersion
        });
      } else {
        resolve({ valid: false, version: null });
      }
    });
  });
}

// Minimal implementation - Phase 2
async function downloadJar(config) {
  const jarPath = path.join(__dirname, 'lib', config.jarFile);

  // Check if JAR exists
  if (fs.existsSync(jarPath)) {
    return true;
  }

  console.log(`📥 Downloading Selenium JAR...`);

  // Create lib directory if needed
  const libDir = path.join(__dirname, 'lib');
  if (!fs.existsSync(libDir)) {
    fs.mkdirSync(libDir, { recursive: true });
  }

  // Simple download implementation
  return new Promise((resolve) => {
    const file = fs.createWriteStream(jarPath);

    https.get(config.jarUrl, (response) => {
      // Handle redirect
      if (response.statusCode === 302 || response.statusCode === 301) {
        https.get(response.headers.location, (redirectResponse) => {
          redirectResponse.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log('✅ Selenium JAR downloaded');
            resolve(true);
          });
        }).on('error', (err) => {
          console.error(`❌ Download failed: ${err.message}`);
          if (fs.existsSync(jarPath)) {
            fs.unlinkSync(jarPath);
          }
          resolve(false);
        });
      } else {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log('✅ Selenium JAR downloaded');
          resolve(true);
        });
      }
    }).on('error', (err) => {
      console.error(`❌ Download failed: ${err.message}`);
      if (fs.existsSync(jarPath)) {
        fs.unlinkSync(jarPath);
      }
      resolve(false);
    });
  });
}

// Minimal implementation - Phase 2
// Debug mode: ZYPIN_DEBUG=true zypin start --packages selenium
async function start(processManager, config = {}) {
  // Load default config
  const defaultConfig = require('./config/defaults.json');
  const finalConfig = { ...defaultConfig, ...config };

  // Check Java version >= 11
  const javaCheck = await checkJava();
  if (!javaCheck.valid) {
    if (!javaCheck.version) {
      console.error('❌ Java is not installed or not in PATH');
      console.error('Please install Java 11 or higher: https://adoptium.net/');
    } else {
      console.error(`❌ Java ${javaCheck.version} found, but Java 11 or higher is required`);
      console.error('Please upgrade Java: https://adoptium.net/');
    }
    return null;
  }

  console.log(`✓ Java ${javaCheck.version} detected`);

  // Download JAR if needed
  const jarReady = await downloadJar(finalConfig);
  if (!jarReady) {
    console.error('❌ Failed to obtain Selenium JAR');
    return null;
  }

  // Build JAR path
  const jarPath = path.join(__dirname, 'lib', finalConfig.jarFile);

  // Build command arguments
  const args = [
    '-jar', jarPath,
    'standalone',
    '--port', finalConfig.port.toString(),
    '--max-sessions', finalConfig.maxSessions.toString(),
    '--log-level', finalConfig.logLevel
  ];

  console.log(`🚀 Starting Selenium Grid on port ${finalConfig.port}...`);

  // Spawn process
  const seleniumProcess = spawn('java', args, {
    detached: false,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env }
  });

  return await new Promise((resolve, reject) => {
    let resolved = false;
    
    // Set timeout for 120 seconds
    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        seleniumProcess.kill('SIGTERM');
        reject(new Error('Selenium start timeout after 120 seconds'));
      }
    }, 120000);

    // Simple output handling
    seleniumProcess.stdout.on('data', (data) => {
      if (process.env.ZYPIN_DEBUG) {
        console.log(`[Selenium] ${data.toString().trim()}`);
      }
      if (data.toString().trim().includes('Address already in use')) {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeout);
          reject(new Error('Selenium is already running'));
        }
      } else if (data.toString().trim().includes('Started Selenium Standalone')) {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeout);
          resolve(seleniumProcess);
        }
      }
    });

    seleniumProcess.stderr.on('data', (data) => {
      if (process.env.ZYPIN_DEBUG) {
        console.log(`[Selenium] ${data.toString().trim()}`);
      }
    });

    seleniumProcess.on('error', (err) => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        console.error(`Failed to start Selenium: ${err.message}`);
        reject(err);
      }
    });
  });
}

module.exports = { start };
