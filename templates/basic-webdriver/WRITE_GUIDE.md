# How to Use This Template

## Writing Your First Test

Create a simple test file to get started:

```javascript
const { By, until, createDriver } = require('@zypin/selenium/webdriver');

async function runTest() {
  console.log('🚀 Starting test...');
  
  const browser = process.env.BROWSER || 'chrome';
  const headless = process.env.HEADLESS === 'true';
  const gridUrl = process.env.SELENIUM_GRID_URL || 'http://localhost:8422';

  let driver;

  try {
    // Create WebDriver instance
    driver = await createDriver({ browser, headless, gridUrl });

    // Navigate to page
    await driver.get('https://example.com');
    
    // Find and interact with elements
    const title = await driver.getTitle();
    console.log(`Page title: ${title}`);

    console.log('✅ Test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    throw error;
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}

// Run the test
runTest().catch((error) => {
  console.error('💥 Test execution failed:', error.message);
  process.exit(1);
});
```

## Available Step Definitions

This template uses direct WebDriver access, so you have full control over element interactions:

```javascript
// Click elements
const element = await driver.findElement(By.css('#login-button'));
await element.click();

// Enter text
const input = await driver.findElement(By.css('#email'));
await input.clear();
await input.sendKeys('user@example.com');

// Wait for elements
const element = await driver.wait(until.elementLocated(By.css('#dashboard')), 10000);

// Take screenshots
const screenshot = await driver.takeScreenshot();
const fs = require('fs');
fs.writeFileSync('test-screenshot.png', screenshot, 'base64');
```

## Running Tests

```bash
# Run specific test file
zypin run --input test.js

# Run in headless mode
zypin run --input test.js --headless

# Run with different browser
zypin run --input test.js --browser firefox

# Run with custom timeout
zypin run --input test.js --timeout 60000

# Run multiple test files
zypin run --input test1.js,test2.js
```

## Best Practices

### 1. Use Meaningful Selectors
```javascript
// Good - Specific and stable
const loginButton = await driver.findElement(By.css('#login-submit-button'));
const emailField = await driver.findElement(By.css('[data-testid="email-input"]'));

// Avoid - Fragile selectors
const button = await driver.findElement(By.css('.btn-primary'));
```

### 2. Include Proper Error Handling
```javascript
try {
  const element = await driver.wait(until.elementLocated(By.css(selector)), 10000);
  await element.click();
} catch (error) {
  throw new Error(`Element ${selector} not found: ${error.message}`);
}
```

### 3. Use Multiple Selector Types
```javascript
// CSS selectors (default)
const element = await driver.findElement(By.css('#login-button'));

// ID selectors
const element = await driver.findElement(By.id('login-btn'));

// Name selectors
const element = await driver.findElement(By.name('submit'));

// XPath selectors
const element = await driver.findElement(By.xpath("//button[@type='submit']"));
```

### 4. Organize Related Actions
```javascript
async function loginUser(email, password) {
  const emailField = await driver.findElement(By.css('#email'));
  const passwordField = await driver.findElement(By.css('#password'));
  const loginButton = await driver.findElement(By.css('#login-button'));
  
  await emailField.clear();
  await emailField.sendKeys(email);
  
  await passwordField.clear();
  await passwordField.sendKeys(password);
  
  await loginButton.click();
}
```

## Project Structure

```
basic-webdriver-project/
├── test.js              # Main test file
├── runner.js            # Test execution runner
├── package.json         # Dependencies and config
├── node_modules/        # Dependencies
└── README.md            # Project documentation
```

**Key files:**
- `test.js` - Your test implementation
- `package.json` - Configuration and scripts
- `runner.js` - Test execution logic
- Shared libraries in `@zypin/selenium` package
