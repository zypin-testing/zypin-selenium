/**
 * WebDriver utilities for Zypin Framework
 * Provides unified driver creation and selenium-webdriver exports
 * 
 * TODO:
 * - Add support for additional browser options
 * - Implement driver pooling for parallel execution
 * - Add screenshot capture utilities
 * - Support for custom capabilities
 */

const { Builder } = require('selenium-webdriver');
const { Options: ChromeOptions } = require('selenium-webdriver/chrome');
const { Options: FirefoxOptions } = require('selenium-webdriver/firefox');
const { Options: EdgeOptions } = require('selenium-webdriver/edge');

/**
 * Create a WebDriver instance with the given configuration
 * @param {Object} config - Driver configuration object
 * @returns {Promise<WebDriver>} Configured WebDriver instance
 */
async function createDriver(config = {}) {
  // Get configuration from environment variables or provided config
  const browser = config.browser || process.env.BROWSER || 'chrome';
  const headless = config.headless !== undefined ? config.headless : process.env.HEADLESS === 'true';
  const gridUrl = config.gridUrl || process.env.SELENIUM_GRID_URL || 'http://localhost:8422';
  const windowSize = config.windowSize || process.env.WINDOW_SIZE || '1920x1080';

  console.log(`🔧 Creating WebDriver: browser=${browser}, headless=${headless}, grid=${gridUrl}`);

  const builder = new Builder()
    .forBrowser(browser)
    .usingServer(gridUrl);

  // Configure browser options
  const browserOptions = getBrowserOptions(browser, headless, windowSize);
  if (browserOptions) {
    if (browser === 'chrome') {
      builder.setChromeOptions(browserOptions);
    } else if (browser === 'firefox') {
      builder.setFirefoxOptions(browserOptions);
    } else if (browser === 'edge') {
      builder.setEdgeOptions(browserOptions);
    }
  }

  try {
    const driver = await builder.build();
    
    // Set window size if not headless
    if (!headless) {
      const [width, height] = windowSize.split('x').map(Number);
      await driver.manage().window().setRect({ width, height });
    }

    // Set implicit wait
    await driver.manage().setTimeouts({ implicit: 5000 });

    console.log('✅ WebDriver created successfully');
    return driver;
  } catch (error) {
    console.error('❌ Failed to create WebDriver:', error.message);
    throw new Error(`WebDriver creation failed: ${error.message}`);
  }
}

/**
 * Get browser-specific options
 * @param {string} browser - Browser name
 * @param {boolean} headless - Whether to run in headless mode
 * @param {string} windowSize - Window size in format "WIDTHxHEIGHT"
 * @returns {Object|null} Browser options object or null
 */
function getBrowserOptions(browser, headless, windowSize) {
  const [width, height] = windowSize.split('x').map(Number);

  switch (browser) {
    case 'chrome':
      const chromeOptions = new ChromeOptions();
      if (headless) {
        chromeOptions.addArguments('--headless');
      }
      chromeOptions.addArguments('--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu');
      chromeOptions.addArguments(`--window-size=${width},${height}`);
      return chromeOptions;

    case 'firefox':
      const firefoxOptions = new FirefoxOptions();
      if (headless) {
        firefoxOptions.addArguments('--headless');
      }
      firefoxOptions.addArguments(`--width=${width}`, `--height=${height}`);
      return firefoxOptions;

    case 'edge':
      const edgeOptions = new EdgeOptions();
      if (headless) {
        edgeOptions.addArguments('--headless');
      }
      edgeOptions.addArguments('--no-sandbox', '--disable-dev-shm-usage');
      edgeOptions.addArguments(`--window-size=${width},${height}`);
      return edgeOptions;

    default:
      console.warn(`⚠️ Unsupported browser: ${browser}. Using default options.`);
      return null;
  }
}

// Export the createDriver function
module.exports.createDriver = createDriver;

// Re-export all selenium-webdriver exports
Object.assign(module.exports, require('selenium-webdriver'));
