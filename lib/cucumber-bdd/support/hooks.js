/**
 * Cucumber hooks for Zypin Framework
 * Handles setup and teardown operations for test scenarios
 * 
 * TODO:
 * - Add database setup and cleanup hooks
 * - Implement test data seeding and cleanup
 * - Add performance monitoring hooks
 * - Support for test environment configuration
 * - Add custom reporting hooks
 */

const { Before, After, BeforeAll, AfterAll } = require('@cucumber/cucumber');

/**
 * Before all scenarios - global setup
 */
BeforeAll(async function() {
  console.log('🚀 Starting Cucumber test suite...');
  
  // Set up test environment variables
  process.env.TEST_ENV = process.env.TEST_ENV || 'test';
  process.env.LOG_LEVEL = process.env.LOG_LEVEL || 'info';
  
  console.log(`📋 Test Environment: ${process.env.TEST_ENV}`);
  console.log(`📋 Browser: ${process.env.BROWSER || 'chrome'}`);
  console.log(`📋 Headless: ${process.env.HEADLESS || 'false'}`);
  console.log(`📋 Grid URL: ${process.env.SELENIUM_GRID_URL || 'http://localhost:8422'}`);
});

/**
 * Before each scenario - setup WebDriver
 */
Before(async function() {
  console.log('\n🔧 Setting up test scenario...');
  
  // Initialize WebDriver
  await this.initializeDriver();
  
  // Clear any shared data from previous scenarios
  this.clearSharedData();
  
  console.log('✅ Test scenario setup complete');
});

/**
 * After each scenario - cleanup and screenshot on failure
 */
After(async function(scenario) {
  console.log('\n🧹 Cleaning up test scenario...');
  
  // Take screenshot if scenario failed
  if (scenario.result.status === 'FAILED') {
    console.log('📸 Taking screenshot due to test failure...');
    await this.takeScreenshot(`failed-${scenario.pickle.name.replace(/\s+/g, '-')}`);
  }
  
  // Clean up WebDriver
  await this.cleanupDriver();
  
  // Log scenario result
  const status = scenario.result.status;
  const duration = scenario.result.duration ? `${scenario.result.duration / 1000}s` : 'unknown';
  
  if (status === 'PASSED') {
    console.log(`✅ Scenario passed: ${scenario.pickle.name} (${duration})`);
  } else if (status === 'FAILED') {
    console.log(`❌ Scenario failed: ${scenario.pickle.name} (${duration})`);
    if (scenario.result.message) {
      console.log(`   Error: ${scenario.result.message}`);
    }
  } else {
    console.log(`⚠️ Scenario ${status.toLowerCase()}: ${scenario.pickle.name} (${duration})`);
  }
});

/**
 * After all scenarios - global cleanup
 */
AfterAll(async function() {
  console.log('\n🏁 Cucumber test suite completed');
  
  // Clean up any global resources
  // This is where you would clean up databases, test data, etc.
  
  console.log('✅ Global cleanup complete');
});

/**
 * Custom hook for handling specific scenarios
 * This can be used to add scenario-specific setup/teardown
 */
Before({ tags: '@login' }, async function() {
  console.log('🔐 Login scenario detected - setting up authentication...');
  // Add any login-specific setup here
});

Before({ tags: '@search' }, async function() {
  console.log('🔍 Search scenario detected - setting up search data...');
  // Add any search-specific setup here
});

Before({ tags: '@slow' }, async function() {
  console.log('⏳ Slow scenario detected - increasing timeout...');
  this.timeout = 60000; // Increase timeout for slow scenarios
});

After({ tags: '@cleanup' }, async function() {
  console.log('🧽 Cleanup scenario detected - performing additional cleanup...');
  // Add any additional cleanup for specific scenarios
});
