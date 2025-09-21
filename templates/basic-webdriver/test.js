/**
 * Hello World WebDriver test for Zypin Framework
 * Simple test that navigates to example.com
 */

const { By, until, createDriver } = require('@zypin/selenium/webdriver');

async function runTest() {
  console.log('🚀 Starting Hello World test...');
  
  // Get configuration from environment variables
  const browser = process.env.BROWSER || 'chrome';
  const headless = process.env.HEADLESS === 'true';
  const gridUrl = process.env.SELENIUM_GRID_URL || 'http://localhost:8422';

  let driver;

  try {
    // Create WebDriver instance
    driver = await createDriver({
      browser,
      headless,
      gridUrl
    });

    if (!driver) {
      throw new Error('Failed to create WebDriver instance');
    }

    // Navigate to example.com
    console.log('🌐 Navigating to example.com...');
    await driver.get('https://example.com');
    console.log('✅ Navigation completed');
    
    // Get page title
    const pageTitle = await driver.getTitle();
    console.log(`📄 Page title: ${pageTitle}`);

    // Simple verification
    console.log('✅ Hello World test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    throw error;
  } finally {
    if (driver) {
      console.log('🧹 Cleaning up WebDriver...');
      await driver.quit();
    }
  }
}

// Run the test
runTest().catch((error) => {
  console.error('💥 Test execution failed:', error.message);
  process.exit(1);
});
