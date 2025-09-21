/**
 * Cucumber BDD execution runner for Zypin Framework
 * Spawns cucumber-js process with proper configuration and handles test results
 * 
 * TODO:
 * - Add support for cucumber configuration files
 * - Implement test result parsing and reporting
 * - Add support for custom cucumber options
 * - Handle parallel execution with cucumber
 * - Add screenshot capture on test failures
 * - Implement test data injection from external sources
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const inputHandler = require('../../utils/input-handler');

/**
 * Execute Cucumber BDD tests with the given configuration
 * @param {string|Array} inputFiles - Feature files or directories to run
 * @param {Object} config - Merged configuration object
 * @returns {Promise<Object>} Test execution result
 */
async function execute(inputFiles, config) {
  console.log(chalk.blue('Running Cucumber BDD tests...'));
  console.log(chalk.gray(`Configuration: browser=${config.browser}, headless=${config.headless}, timeout=${config.timeout}ms`));

  // Process input files using enhanced input handler
  const expandedFiles = inputHandler.processInput(inputFiles, 'cucumber-bdd', {
    verbose: process.env.ZYPIN_DEBUG === 'true',
    maxDepth: 5
  });

  if (expandedFiles.length === 0) {
    throw new Error('No feature files found to execute');
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

  // Build cucumber command arguments
  const cucumberArgs = [
    'cucumber-js',
    '--require', './step-definitions/**/*.js',
    '--require', './support/**/*.js',
    '--format', 'progress',
    '--format', 'json:./cucumber-report.json',
    ...expandedFiles
  ];

  // Add parallel execution if configured
  if (config.parallel && config.parallel > 1) {
    cucumberArgs.push('--parallel', config.parallel.toString());
  }

  console.log(chalk.gray(`Running: npx ${cucumberArgs.join(' ')}`));

  // Execute cucumber tests
  return new Promise((resolve, reject) => {
    const timeout = config.timeout || 30000;
    // Set suite timeout to be at least 2 minutes or 3x the test timeout, whichever is larger
    const suiteTimeout = Math.max(timeout * 3, 120000);
    let testsRun = 0;
    let testsPassed = 0;
    let testsFailed = 0;
    let output = '';

    const cucumber = spawn('npx', cucumberArgs, {
      env,
      stdio: ['ignore', 'pipe', 'pipe'],
      cwd: process.cwd()
    });

    // Set timeout for the entire test suite
    const timeoutId = setTimeout(() => {
      console.log(chalk.yellow(`⚠️ Test suite timeout after ${suiteTimeout}ms, terminating...`));
      cucumber.kill('SIGTERM');
      resolve({
        success: false,
        testsRun,
        testsPassed,
        testsFailed,
        message: `Test suite timeout after ${suiteTimeout}ms`
      });
    }, suiteTimeout);

    cucumber.stdout.on('data', (data) => {
      const outputText = data.toString();
      output += outputText;
      
      if (process.env.ZYPIN_DEBUG) {
        console.log(chalk.gray(`[Cucumber] ${outputText.trim()}`));
      }

      // Parse cucumber output for test counts
      const lines = outputText.split('\n');
      for (const line of lines) {
        if (line.includes('scenarios:')) {
          const match = line.match(/(\d+) scenarios? \(([^)]+)\)/);
          if (match) {
            testsRun = parseInt(match[1]);
            const status = match[2];
            if (status.includes('failed')) {
              const failedMatch = status.match(/(\d+) failed/);
              if (failedMatch) {
                testsFailed = parseInt(failedMatch[1]);
                testsPassed = testsRun - testsFailed;
              }
            } else {
              testsPassed = testsRun;
              testsFailed = 0;
            }
          }
        }
      }
    });

    cucumber.stderr.on('data', (data) => {
      const errorText = data.toString();
      if (process.env.ZYPIN_DEBUG) {
        console.log(chalk.gray(`[Cucumber Error] ${errorText.trim()}`));
      }
    });

    cucumber.on('close', (code) => {
      clearTimeout(timeoutId);
      
      // If we couldn't parse the output, use exit code
      if (testsRun === 0) {
        testsRun = 1;
        if (code === 0) {
          testsPassed = 1;
          testsFailed = 0;
        } else {
          testsPassed = 0;
          testsFailed = 1;
        }
      }

      const success = code === 0 && testsFailed === 0;
      
      // Display results
      console.log(chalk.blue(`\nCucumber Test Results:`));
      console.log(chalk.gray(`  Scenarios run: ${testsRun}`));
      console.log(chalk.green(`  Passed: ${testsPassed}`));
      if (testsFailed > 0) {
        console.log(chalk.red(`  Failed: ${testsFailed}`));
      }

      resolve({
        success,
        testsRun,
        testsPassed,
        testsFailed,
        message: success ? 'All scenarios passed' : `${testsFailed} scenario(s) failed`
      });
    });

    cucumber.on('error', (error) => {
      clearTimeout(timeoutId);
      console.error(chalk.red(`❌ Cucumber process error: ${error.message}`));
      resolve({
        success: false,
        testsRun: 0,
        testsPassed: 0,
        testsFailed: 1,
        message: `Cucumber execution failed: ${error.message}`
      });
    });
  });
}

// Note: findFeatureFiles function removed as it's handled by inputHandler.processInput()

module.exports = { execute };
