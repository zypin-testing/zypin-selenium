/**
 * Cucumber world setup for Zypin Framework
 * Manages WebDriver instance and shared state between test steps
 * 
 * TODO:
 * - Add support for multiple browser instances
 * - Implement test data management and cleanup
 * - Add screenshot capture on test failures
 * - Support for parallel test execution
 * - Add custom assertions and utilities
 */

const { setWorldConstructor, setDefaultTimeout } = require('@cucumber/cucumber');
const { By, until, createDriver } = require('../../webdriver');

// Set default timeout for all steps
setDefaultTimeout(30000);

/**
 * Zypin World class for Cucumber tests
 * Provides WebDriver instance and shared state management
 */
class ZypinWorld {
  constructor() {
    this.driver = null;
    this.timeout = parseInt(process.env.TIMEOUT) || 30000;
    this.sharedData = {};
  }

  /**
   * Initialize WebDriver instance
   */
  async initializeDriver() {
    if (this.driver) {
      return; // Already initialized
    }

    try {
      this.driver = await createDriver();
      console.log('✅ WebDriver initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize WebDriver:', error.message);
      // Ensure driver is null on failure
      this.driver = null;
      throw new Error(`WebDriver initialization failed: ${error.message}`);
    }
  }


  /**
   * Clean up WebDriver instance
   */
  async cleanupDriver() {
    if (this.driver) {
      try {
        await this.driver.quit();
        console.log('🧹 WebDriver cleaned up');
      } catch (error) {
        console.error('⚠️ Error during WebDriver cleanup:', error.message);
      } finally {
        this.driver = null;
      }
    }
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(name = 'screenshot') {
    if (this.driver) {
      try {
        const screenshot = await this.driver.takeScreenshot();
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `screenshot-${name}-${timestamp}.png`;
        
        // Save screenshot to current directory
        const fs = require('fs');
        fs.writeFileSync(filename, screenshot, 'base64');
        console.log(`📸 Screenshot saved: ${filename}`);
        return filename;
      } catch (error) {
        console.error('❌ Failed to take screenshot:', error.message);
        return null;
      }
    }
  }

  /**
   * Set shared data
   */
  setSharedData(key, value) {
    this.sharedData[key] = value;
  }

  /**
   * Get shared data
   */
  getSharedData(key) {
    return this.sharedData[key];
  }

  /**
   * Clear shared data
   */
  clearSharedData() {
    this.sharedData = {};
  }

  /**
   * Wait for element with custom timeout
   */
  async waitForElement(selector, timeout = null) {
    const waitTimeout = timeout || this.timeout;
    return await this.driver.wait(until.elementLocated(By.css(selector)), waitTimeout);
  }

  /**
   * Wait for element to be visible
   */
  async waitForElementVisible(selector, timeout = null) {
    const waitTimeout = timeout || this.timeout;
    const element = await this.waitForElement(selector, waitTimeout);
    return await this.driver.wait(until.elementIsVisible(element), waitTimeout);
  }

  /**
   * Wait for element to be clickable
   */
  async waitForElementClickable(selector, timeout = null) {
    const waitTimeout = timeout || this.timeout;
    const element = await this.waitForElement(selector, waitTimeout);
    return await this.driver.wait(until.elementIsEnabled(element), waitTimeout);
  }

  /**
   * Scroll to element
   */
  async scrollToElement(selector) {
    const element = await this.driver.findElement(By.css(selector));
    await this.driver.executeScript('arguments[0].scrollIntoView(true);', element);
  }

  /**
   * Get current URL
   */
  async getCurrentUrl() {
    return await this.driver.getCurrentUrl();
  }

  /**
   * Get page title
   */
  async getPageTitle() {
    return await this.driver.getTitle();
  }
}

// Set the Zypin world constructor
setWorldConstructor(ZypinWorld);
