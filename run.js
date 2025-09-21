/**
 * Selenium test runner for Zypin Framework
 * Executes tests using templates and WebDriver
 * 
 * TODO:
 * - Add support for parallel execution
 * - Implement retry logic for failed tests
 * - Add test result reporting and summaries
 * - Support for test data files and fixtures
 * - Add screenshot capture on test failures
 * - Implement test result caching and comparison
 */

const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

/**
 * Run Selenium tests using specified template
 * @param {String|Array} inputFiles - Test files or directories to run
 * @param {Object} cliParams - CLI parameters for configuration override
 * @returns {Promise<Object>} Test execution result
 */
async function run(inputFiles, cliParams = {}) {
  try {
    console.log(chalk.blue('🔍 Detecting template...'));

    // Read user's package.json to detect template
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error('No package.json found in current directory. Make sure you are in a Zypin project directory.');
    }

    const userPackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const templateType = userPackageJson.zypin?.template || 'basic-webdriver';

    console.log(chalk.gray(`Template detected: ${templateType}`));

    // Load template runner from plugin templates directory
    const templateRunnerPath = path.join(__dirname, 'templates', templateType, 'runner.js');
    
    if (!fs.existsSync(templateRunnerPath)) {
      throw new Error(`Template runner not found: ${templateType}. Available templates: basic-webdriver, cucumber-bdd`);
    }

    const templateRunner = require(templateRunnerPath);

    // Build 3-tier configuration
    console.log(chalk.gray('🔧 Merging configuration...'));
    
    // Tier 1: Package defaults
    const defaults = require('./config/defaults.json');
    
    // Tier 2: User project config
    const userConfig = userPackageJson.zypin?.config || {};
    
    // Tier 3: CLI parameters (highest priority)
    const finalConfig = {
      ...defaults,
      ...userConfig,
      ...cliParams
    };

    // Validate and normalize configuration
    const validatedConfig = validateAndNormalizeConfig(finalConfig);
    
    if (process.env.ZYPIN_DEBUG) {
      console.log(chalk.gray(`Final configuration: ${JSON.stringify(validatedConfig, null, 2)}`));
    }

    // Execute template runner
    console.log(chalk.blue('🚀 Executing tests...'));
    const result = await templateRunner.execute(inputFiles, validatedConfig);

    return result;

  } catch (error) {
    console.log(chalk.red(`❌ Test execution failed: ${error.message}`));
    return {
      success: false,
      message: error.message,
      testsRun: 0,
      testsPassed: 0,
      testsFailed: 0
    };
  }
}

/**
 * Validate and normalize configuration
 * @param {Object} config - Configuration object to validate
 * @returns {Object} Validated and normalized configuration
 */
function validateAndNormalizeConfig(config) {
  const validated = { ...config };

  // Validate browser
  const validBrowsers = ['chrome', 'firefox', 'safari', 'edge'];
  if (!validBrowsers.includes(validated.browser)) {
    console.log(chalk.yellow(`Warning: Invalid browser '${validated.browser}', defaulting to 'chrome'`));
    validated.browser = 'chrome';
  }

  // Validate timeout
  if (typeof validated.timeout !== 'number' || validated.timeout < 1000) {
    validated.timeout = 30000;
  }

  // Validate parallel
  if (typeof validated.parallel !== 'number' || validated.parallel < 1) {
    validated.parallel = 1;
  }

  // Validate retries
  if (typeof validated.retries !== 'number' || validated.retries < 0) {
    validated.retries = 0;
  }

  // Validate headless
  if (typeof validated.headless !== 'boolean') {
    validated.headless = false;
  }

  // Validate window size
  if (!validated.windowSize || !/^\d+x\d+$/.test(validated.windowSize)) {
    validated.windowSize = '1920x1080';
  }

  return validated;
}

module.exports = { run };
