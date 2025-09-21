/**
 * WebDriver execution runner for basic-webdriver template
 * Spawns test execution with merged configuration
 * 
 * TODO:
 * - Implement execute() function with input files and config
 * - Add environment variable injection for test files
 * - Handle test results and exit codes
 * - Support parallel execution when configured
 * - Add timeout and retry logic
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const inputHandler = require('../../utils/input-handler');

/**
 * Execute WebDriver tests with the given configuration
 * @param {string|Array} inputFiles - Test files or directories to run
 * @param {Object} config - Merged configuration object
 * @returns {Promise<Object>} Test execution result
 */
async function execute(inputFiles, config) {
  console.log(chalk.blue('Running WebDriver tests...'));
  console.log(chalk.gray(`Configuration: browser=${config.browser}, headless=${config.headless}, timeout=${config.timeout}ms`));

  // Process input files using enhanced input handler
  const expandedFiles = inputHandler.processInput(inputFiles, 'basic-webdriver', {
    verbose: process.env.ZYPIN_DEBUG === 'true',
    maxDepth: 5
  });

  if (expandedFiles.length === 0) {
    throw new Error('No test files found to execute');
  }

  // Validate files
  const validation = inputHandler.validateFiles(expandedFiles);
  if (validation.invalid.length > 0) {
    console.log(chalk.yellow(`Warning: ${validation.invalid.length} invalid file(s) found`));
  }

  // Set up environment variables for test files
  const env = {
    ...process.env,
    BROWSER: config.browser,
    HEADLESS: config.headless ? 'true' : 'false',
    SELENIUM_GRID_URL: config.gridUrl || 'http://localhost:8422',
    TIMEOUT: config.timeout.toString(),
    WINDOW_SIZE: config.windowSize || '1920x1080'
  };

  // Execute tests
  let testsRun = 0;
  let testsPassed = 0;
  let testsFailed = 0;

  for (const testFile of expandedFiles) {
    console.log(chalk.gray(`\nRunning: ${testFile}`));
    
    try {
      const result = await runSingleTest(testFile, env, config);
      testsRun++;
      
      if (result.success) {
        testsPassed++;
        console.log(chalk.green(`✓ ${path.basename(testFile)} passed`));
      } else {
        testsFailed++;
        console.log(chalk.red(`✗ ${path.basename(testFile)} failed: ${result.error}`));
      }
    } catch (error) {
      testsRun++;
      testsFailed++;
      console.log(chalk.red(`✗ ${path.basename(testFile)} failed: ${error.message}`));
    }
  }

  // Summary
  console.log(chalk.blue(`\nTest Results:`));
  console.log(chalk.gray(`  Tests run: ${testsRun}`));
  console.log(chalk.green(`  Passed: ${testsPassed}`));
  if (testsFailed > 0) {
    console.log(chalk.red(`  Failed: ${testsFailed}`));
  }

  return {
    success: testsFailed === 0,
    testsRun,
    testsPassed,
    testsFailed,
    message: testsFailed === 0 ? 'All tests passed' : `${testsFailed} test(s) failed`
  };
}

/**
 * Run a single test file
 * @param {string} testFile - Path to test file
 * @param {Object} env - Environment variables
 * @param {Object} config - Test configuration
 * @returns {Promise<Object>} Test result
 */
function runSingleTest(testFile, env, config) {
  return new Promise((resolve) => {
    const timeout = config.timeout || 30000;
    
    const child = spawn('node', [testFile], {
      env,
      stdio: ['ignore', 'pipe', 'pipe'],
      cwd: process.cwd()
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      const output = data.toString();
      stdout += output;
      if (process.env.ZYPIN_DEBUG) {
        console.log(chalk.gray(`[Test] ${output.trim()}`));
      }
    });

    child.stderr.on('data', (data) => {
      const output = data.toString();
      stderr += output;
      if (process.env.ZYPIN_DEBUG) {
        console.log(chalk.gray(`[Test Error] ${output.trim()}`));
      }
    });

    // Set timeout
    const timeoutId = setTimeout(() => {
      child.kill('SIGTERM');
      resolve({
        success: false,
        error: `Test timeout after ${timeout}ms`
      });
    }, timeout);

    child.on('close', (code) => {
      clearTimeout(timeoutId);
      
      if (code === 0) {
        resolve({ success: true });
      } else {
        resolve({
          success: false,
          error: stderr || `Process exited with code ${code}`
        });
      }
    });

    child.on('error', (error) => {
      clearTimeout(timeoutId);
      resolve({
        success: false,
        error: error.message
      });
    });
  });
}

module.exports = { execute };
