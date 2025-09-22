# Zypin Step Definitions Guide

A comprehensive guide to writing and using reusable step definitions with Zypin's Cucumber framework.

## Table of Contents

1. [Introduction to Reusable Step Definitions](#introduction-to-reusable-step-definitions)
2. [Core Reusable Patterns](#core-reusable-patterns)
3. [Selector Flexibility](#selector-flexibility)
4. [Data-Driven Reusability](#data-driven-reusability)
5. [Advanced Reusable Patterns](#advanced-reusable-patterns)
6. [Best Practices for Reusability](#best-practices-for-reusability)
7. [Extending Reusable Steps](#extending-reusable-steps)
8. [Advanced: Writing Tests Without Step Definitions](#advanced-writing-tests-without-step-definitions)

---

## Introduction to Reusable Step Definitions

### What Makes a Step Definition Reusable?

A reusable step definition is one that can be used across multiple scenarios and features without modification. The key characteristics are:

- **Parameterized**: Uses placeholders like `{string}`, `{int}`, or data tables
- **Generic**: Works with different values and contexts
- **Consistent**: Follows naming conventions and patterns
- **Flexible**: Supports multiple selector types and interaction methods

### Benefits of Reusable Steps

- **DRY Principle**: Don't Repeat Yourself - write once, use everywhere
- **Maintainability**: Update logic in one place, affects all usage
- **Consistency**: Same behavior across all tests
- **Efficiency**: Faster test development and maintenance

### Zypin's Unified Approach

Zypin provides a comprehensive set of pre-built reusable step definitions that cover:
- Navigation and page interactions
- Form filling and submission
- Element verification and assertions
- Multiple selector types (CSS, ID, Name, XPath, Link Text)
- Data-driven testing with tables
- Advanced browser operations

---

## Core Reusable Patterns

### Navigation Steps

#### Basic Navigation
```gherkin
Given I navigate to "https://app.example.com/login"
When I go back to the previous page
When I go forward to the next page
When I reload the page
```

**Implementation**: These steps use parameterized URLs and browser navigation methods, making them work with any website.

#### URL Verification
```gherkin
Then I should see the current URL is "https://app.example.com/dashboard"
Then I should see the current URL contains "dashboard"
```

**Reusability**: Works with any URL pattern, supports both exact matches and partial matches.

### Interaction Steps

#### Click Actions
```gherkin
When I click on "#login-button"
When I click on ".submit-btn"
When I click on "button[type='submit']"
```

**Reusability**: Accepts any CSS selector, works with buttons, links, or any clickable element.

#### Text Input
```gherkin
When I enter "john@example.com" in "#email"
When I enter "password123" in "#password"
When I clear "#email"
```

**Reusability**: Works with any input field using any CSS selector, includes clear functionality.

#### Form Submission
```gherkin
When I submit the form "#login-form"
When I press Enter in "#password"
```

**Reusability**: Supports any form selector and keyboard interactions.

### Verification Steps

#### Text Verification
```gherkin
Then I should see "Welcome, John!" in ".welcome-message"
Then I should not see "Error" in ".error-container"
```

**Reusability**: Works with any text content and any element selector.

#### Element Existence
```gherkin
Then I should see element "#dashboard"
Then I should not see element ".loading-spinner"
```

**Reusability**: Verifies presence or absence of any element using any selector.

#### Page Title Verification
```gherkin
Then I should see the page title is "Dashboard - My App"
Then I should see the page title contains "Dashboard"
```

**Reusability**: Supports exact title matches and partial matches.

### Wait Steps

#### Element Visibility
```gherkin
When I wait for "#loading-complete" to be visible
When I wait for ".success-message" to be visible
```

**Reusability**: Waits for any element to become visible using any selector.

#### Time-based Waits
```gherkin
When I wait for "3" seconds
When I wait for "10" seconds
```

**Reusability**: Accepts any number of seconds for fixed delays.

---

## Selector Flexibility

Zypin provides multiple selector types for maximum flexibility and reusability:

### CSS Selectors (Default)
```gherkin
When I click on "#login-button"
When I enter "text" in ".input-field"
Then I should see element "[data-testid='submit']"
```

**Use Cases**: Most common selectors, works with IDs, classes, attributes, and complex selectors.

### Name Selectors
```gherkin
When I click on element with name "submit"
When I enter "text" in field with name "username"
Then I should see element with name "status"
```

**Use Cases**: Form elements with name attributes, legacy HTML forms.

### ID Selectors
```gherkin
When I click on element with id "login-btn"
When I enter "text" in field with id "email"
Then I should see element with id "dashboard"
```

**Use Cases**: Elements with unique IDs, when you need explicit ID targeting.

### XPath Selectors
```gherkin
When I click on element with xpath "//button[contains(text(), 'Submit')]"
When I enter "text" in field with xpath "//input[@placeholder='Email']"
Then I should see element with xpath "//div[@class='success']"
```

**Use Cases**: Complex element selection, text-based selection, when CSS selectors are insufficient.

### Link Text Selectors
```gherkin
When I click on link with text "Sign In"
When I click on link containing text "Forgot Password"
Then I should see link with text "Dashboard"
Then I should see link containing text "Profile"
```

**Use Cases**: Navigation links, text-based link selection, user-friendly link identification.

### Dropdown Selection
```gherkin
When I select "United States" from "#country"
When I select "Premium Plan" from ".plan-selector"
```

**Reusability**: Works with any dropdown using any selector, selects by visible text.

---

## Data-Driven Reusability

### Form Filling with Data Tables
```gherkin
When I fill the form with:
  | field        | value              |
  | #email       | john@example.com   |
  | #password    | password123        |
  | #first-name  | John               |
  | #last-name   | Doe                |
```

**Reusability**: 
- Works with any number of fields
- Accepts any CSS selector for fields
- Supports any text values
- Can be reused across different forms

### Scenario Outlines with Parameters
```gherkin
Scenario Outline: Login with different users
  Given I navigate to "https://app.example.com/login"
  When I enter "<email>" in "#email"
  And I enter "<password>" in "#password"
  And I click on "#login-button"
  Then I should see "<expected_message>" in ".message"

  Examples:
    | email              | password   | expected_message |
    | admin@example.com  | admin123   | Welcome, Admin!  |
    | user@example.com   | user123    | Welcome, User!   |
    | guest@example.com  | guest123   | Welcome, Guest!  |
```

**Reusability**: Same step definitions work with different data sets, making tests scalable and maintainable.

### Dynamic Content Handling
```gherkin
When I get the text from "#user-name"
When I take a screenshot named "login-success"
When I execute JavaScript "return document.title"
```

**Reusability**: Works with any element selector, supports dynamic content capture and JavaScript execution.

---

## Advanced Reusable Patterns

### JavaScript Execution
```gherkin
When I execute JavaScript "document.getElementById('hidden-field').value = 'test'"
When I execute JavaScript "window.scrollTo(0, document.body.scrollHeight)"
When I execute JavaScript "return localStorage.getItem('user-token')"
```

**Reusability**: Execute any JavaScript code, useful for:
- Setting hidden field values
- Scrolling and navigation
- Local storage operations
- Custom validations
- Dynamic content manipulation

### Screenshot Capture
```gherkin
When I take a screenshot
When I take a screenshot named "error-state"
When I take a screenshot named "success-{timestamp}"
```

**Reusability**: 
- Automatic timestamp naming
- Custom naming for specific scenarios
- Works in any test context
- Useful for debugging and documentation

### Information Gathering
```gherkin
When I get the text from "#status-message"
When I get the text from ".error-text"
When I get the text from "[data-testid='result']"
```

**Reusability**: Extract text from any element for:
- Assertions
- Logging
- Dynamic test data
- Verification purposes

### Browser Actions
```gherkin
When I clear "#search-field"
When I press Enter in "#password"
When I reload the page
```

**Reusability**: Common browser interactions that work with any element or page state.

---

## Best Practices for Reusability

### 1. Consistent Parameter Naming
```gherkin
# Good - Clear and descriptive
When I enter "<email>" in "#email-field"
Then I should see "<message>" in ".status-message"

# Avoid - Vague parameters
When I enter "<text>" in "<selector>"
Then I should see "<content>" in "<element>"
```

### 2. Use Meaningful Selectors
```gherkin
# Good - Specific and stable
When I click on "#login-submit-button"
When I enter "text" in "[data-testid='email-input']"

# Avoid - Fragile selectors
When I click on ".btn-primary"
When I enter "text" in "input:nth-child(2)"
```

### 3. Combine Related Actions
```gherkin
# Good - Logical grouping
When I fill the form with:
  | #email    | user@example.com |
  | #password | password123      |
And I click on "#login-button"

# Avoid - Scattered actions
When I enter "user@example.com" in "#email"
When I enter "password123" in "#password"
When I click on "#login-button"
```

### 4. Error Handling and Logging
```javascript
// Zypin's built-in error handling
Then('I should see {string} in {string}', async function (text, selector) {
  console.log(`👀 Verifying text "${text}" in: ${selector}`);
  try {
    const element = await this.driver.wait(until.elementLocated(By.css(selector)), this.timeout);
    const elementText = await element.getText();
    if (!elementText.includes(text)) {
      throw new Error(`Expected to see "${text}" in ${selector}, but found: "${elementText}"`);
    }
  } catch (error) {
    // Detailed error messages for debugging
    throw new Error(`Element ${selector} not found within ${this.timeout}ms timeout. ${error.message}`);
  }
});
```

### 5. Timeout Management
```gherkin
# Zypin handles timeouts automatically
When I wait for "#loading-complete" to be visible  # Uses default timeout
When I wait for "5" seconds                        # Fixed delay
```

### 6. Maintainability
- Keep step definitions focused on single actions
- Use consistent naming conventions
- Document complex selectors
- Test step definitions independently

---

## Extending Reusable Steps

### Adding New Reusable Steps

#### 1. Follow the Existing Pattern
```javascript
// Add to zypin.steps.js
When('I hover over {string}', async function (selector) {
  console.log(`🖱️  Hovering over: ${selector}`);
  const element = await this.driver.wait(until.elementLocated(By.css(selector)), this.timeout);
  await this.driver.actions().move({origin: element}).perform();
});
```

#### 2. Support Multiple Selector Types
```javascript
// Add variations for different selector types
When('I hover over element with id {string}', async function (id) {
  console.log(`🖱️  Hovering over element with id: ${id}`);
  const element = await this.driver.wait(until.elementLocated(By.id(id)), this.timeout);
  await this.driver.actions().move({origin: element}).perform();
});
```

#### 3. Include Proper Error Handling
```javascript
When('I double-click on {string}', async function (selector) {
  console.log(`🖱️  Double-clicking on: ${selector}`);
  try {
    const element = await this.driver.wait(until.elementLocated(By.css(selector)), this.timeout);
    await this.driver.actions().doubleClick(element).perform();
  } catch (error) {
    throw new Error(`Element ${selector} not found for double-click. ${error.message}`);
  }
});
```

### Testing New Steps

#### 1. Create Test Scenarios
```gherkin
Scenario: Test new hover functionality
  Given I navigate to "https://example.com"
  When I hover over "#menu-item"
  Then I should see element ".dropdown-menu"
```

#### 2. Verify Reusability
```gherkin
Scenario Outline: Test hover with different elements
  Given I navigate to "https://example.com"
  When I hover over "<selector>"
  Then I should see element "<expected-element>"

  Examples:
    | selector     | expected-element |
    | "#menu-item" | ".dropdown-menu" |
    | ".tooltip"   | ".tooltip-text"  |
```

### Maintaining Consistency

#### 1. Follow Naming Conventions
- Use descriptive action words: `click`, `enter`, `select`, `verify`
- Include selector type in name: `element with id`, `link with text`
- Use consistent parameter types: `{string}`, `{int}`

#### 2. Include Logging
```javascript
// Always include console.log for debugging
console.log(`🖱️  Clicking on: ${selector}`);
console.log(`⌨️  Entering "${text}" in: ${selector}`);
console.log(`👀 Verifying text "${text}" in: ${selector}`);
```

#### 3. Handle Edge Cases
```javascript
// Consider different scenarios
When('I enter {string} in {string}', async function (text, selector) {
  console.log(`⌨️  Entering "${text}" in: ${selector}`);
  const element = await this.driver.wait(until.elementLocated(By.css(selector)), this.timeout);
  await element.clear();  // Clear existing content
  await element.sendKeys(text);
});
```

---

## Advanced: Writing Tests Without Step Definitions

For advanced users who need more control, flexibility, and performance, Zypin supports writing tests without step definitions. This approach gives you direct access to WebDriver and allows for more sophisticated test patterns.

### When to Use This Approach

- **Performance-critical tests** where step definition overhead matters
- **Complex interactions** that don't fit standard step patterns
- **Custom browser automation** requiring direct WebDriver access
- **Integration with existing test frameworks** or custom utilities
- **Advanced debugging** and fine-grained control

### Zypin Import Patterns

#### Understanding Zypin's Modular Structure

Zypin uses a modular approach where all WebDriver functionality is centralized in the `@zypin/selenium` package:

```javascript
// ✅ Correct - Use Zypin's unified WebDriver exports
const { By, until, createDriver } = require('@zypin/selenium/webdriver');

// ✅ Correct - Access shared step definitions
const sharedSteps = require('@zypin/selenium/cucumber-bdd/step-definitions');

// ✅ Correct - Access shared world setup and hooks
const sharedSupport = require('@zypin/selenium/cucumber-bdd/support');

// ❌ Avoid - Direct selenium-webdriver imports
const { By, until } = require('selenium-webdriver'); // Not recommended
```

#### Project Structure and Imports

The cucumber-bdd template uses a **flat directory structure** with re-export pattern:

```
cucumber-bdd-project/
├── features/              # Gherkin feature files only
│   └── demo.feature      # Example feature file
├── step-definitions/      # Step implementation files
│   └── index.js          # Re-exports shared steps
├── support/              # Test setup and configuration
│   └── index.js          # Re-exports shared world/hooks
├── package.json          # Dependencies and config
├── runner.js             # Cucumber execution runner
└── README.md             # Project documentation
```

The template uses a re-export pattern to maintain compatibility:

```javascript
// step-definitions/index.js
module.exports = require('@zypin/selenium/cucumber-bdd/step-definitions');

// support/index.js  
module.exports = require('@zypin/selenium/cucumber-bdd/support');
```

This allows you to:
- Use the shared Zypin step definitions
- Maintain the expected Cucumber directory structure
- Get automatic updates when Zypin is updated

#### Why Flat Structure?

The flat structure is used because:

1. **Simpler Paths**: Shorter, cleaner file paths
2. **Clear Separation**: Each directory has a single purpose
3. **Cucumber Compatibility**: Works with Cucumber's `--require` flags
4. **Easy Navigation**: Easy to find what you need

The runner.js configures Cucumber to look in the right places:

```javascript
// runner.js - Cucumber configuration
const cucumberArgs = [
  'cucumber-js',
  '--require', './step-definitions/**/*.js',  // Look in step-definitions/
  '--require', './support/**/*.js',           // Look in support/
  '--format', 'progress',
  ...expandedFiles
];
```

#### Adding Your Own Files

When you add new files, follow the structure:

```bash
# Add new step definitions
touch step-definitions/my-custom.steps.js

# Add new support files
touch support/my-utils.js
touch support/pages/MyPage.js

# Add new feature files
touch features/my-feature.feature
```

#### Dependency Structure

Zypin projects use a single dependency approach:

```json
// package.json
{
  "dependencies": {
    "@zypin/selenium": "https://github.com/zypin-testing/zypin-selenium"
  }
}
```

This single dependency provides:
- **WebDriver utilities** (`@zypin/selenium/webdriver`)
- **Step definitions** (`@zypin/selenium/cucumber-bdd/step-definitions`)
- **World setup** (`@zypin/selenium/cucumber-bdd/support`)
- **All selenium-webdriver exports** (re-exported for convenience)

#### Import Best Practices

```javascript
// ✅ Recommended - Use Zypin's unified exports
const { By, until, createDriver } = require('@zypin/selenium/webdriver');

// ✅ For step definitions - Use Cucumber exports
const { Given, When, Then } = require('@cucumber/cucumber');

// ✅ For shared functionality - Use Zypin's shared modules
const sharedSteps = require('@zypin/selenium/cucumber-bdd/step-definitions');

// ❌ Avoid - Direct selenium-webdriver imports
const { Builder } = require('selenium-webdriver'); // Use createDriver instead
```

### Direct WebDriver Integration

#### Accessing WebDriver in Feature Files

You can access the WebDriver instance directly in your step definitions:

```javascript
// step-definitions/advanced.steps.js
const { Given, When, Then } = require('@cucumber/cucumber');
const { By, until } = require('@zypin/selenium/webdriver');

Given('I navigate to {string} with custom headers', async function (url) {
  // Direct WebDriver access for advanced control
  await this.driver.get(url);
  
  // Custom headers, cookies, or other advanced setup
  await this.driver.manage().addCookie({
    name: 'custom-header',
    value: 'advanced-user',
    domain: new URL(url).hostname
  });
});

When('I perform advanced interaction', async function () {
  // Complex multi-step interactions
  const element = await this.driver.wait(until.elementLocated(By.css('#complex-element')), 10000);
  
  // Custom JavaScript execution
  await this.driver.executeScript(`
    const element = arguments[0];
    element.scrollIntoView({ behavior: 'smooth' });
    element.focus();
  `, element);
  
  // Advanced WebDriver actions
  await this.driver.actions()
    .move({origin: element})
    .pause(100)
    .click()
    .perform();
});
```

#### Custom Test Utilities

Create reusable utility functions for complex operations:

```javascript
// support/advanced-utils.js
class AdvancedTestUtils {
  constructor(driver) {
    this.driver = driver;
  }

  async waitForNetworkIdle(timeout = 5000) {
    return await this.driver.executeAsyncScript(`
      const callback = arguments[arguments.length - 1];
      let networkRequests = 0;
      
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name.includes('fetch') || entry.name.includes('xhr')) {
            networkRequests++;
          }
        }
      });
      
      observer.observe({entryTypes: ['resource']});
      
      const checkIdle = () => {
        if (networkRequests === 0) {
          observer.disconnect();
          callback(true);
        } else {
          networkRequests = 0;
          setTimeout(checkIdle, 100);
        }
      };
      
      setTimeout(() => {
        observer.disconnect();
        callback(false);
      }, ${timeout});
      
      checkIdle();
    `);
  }

  async captureNetworkRequests() {
    return await this.driver.executeScript(`
      return window.performance.getEntriesByType('resource').map(entry => ({
        name: entry.name,
        duration: entry.duration,
        size: entry.transferSize
      }));
    `);
  }

  async simulateMobileDevice(deviceName = 'iPhone 12') {
    const devices = {
      'iPhone 12': { width: 390, height: 844, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X)' },
      'Samsung Galaxy S21': { width: 384, height: 854, userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B)' }
    };
    
    const device = devices[deviceName];
    if (device) {
      await this.driver.manage().window().setRect({ width: device.width, height: device.height });
      await this.driver.executeScript(`Object.defineProperty(navigator, 'userAgent', { value: '${device.userAgent}' });`);
    }
  }
}

module.exports = AdvancedTestUtils;
```

### Page Object Pattern

Create sophisticated page objects with advanced functionality:

```javascript
// support/pages/AdvancedLoginPage.js
const { By, until } = require('@zypin/selenium/webdriver');

class AdvancedLoginPage {
  constructor(driver) {
    this.driver = driver;
    this.selectors = {
      email: '#email',
      password: '#password',
      loginButton: '#login-button',
      errorMessage: '.error-message',
      loadingSpinner: '.loading-spinner'
    };
  }

  async navigateToLogin() {
    await this.driver.get('https://app.example.com/login');
    await this.waitForPageLoad();
    return this;
  }

  async waitForPageLoad() {
    await this.driver.wait(until.titleContains('Login'), 10000);
    await this.driver.wait(until.elementLocated(By.css(this.selectors.email)), 10000);
  }

  async loginWithRetry(credentials, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.fillCredentials(credentials);
        await this.clickLogin();
        await this.waitForLoginSuccess();
        return true;
      } catch (error) {
        console.log(`Login attempt ${attempt} failed: ${error.message}`);
        if (attempt === maxRetries) throw error;
        await this.driver.sleep(1000);
      }
    }
  }

  async fillCredentials(credentials) {
    const emailField = await this.driver.findElement(By.css(this.selectors.email));
    const passwordField = await this.driver.findElement(By.css(this.selectors.password));
    
    // Clear and fill with retry logic
    await this.clearAndFill(emailField, credentials.email);
    await this.clearAndFill(passwordField, credentials.password);
  }

  async clearAndFill(element, text) {
    await element.clear();
    await element.sendKeys(text);
    
    // Verify the text was entered correctly
    const actualValue = await element.getAttribute('value');
    if (actualValue !== text) {
      throw new Error(`Failed to enter text. Expected: ${text}, Actual: ${actualValue}`);
    }
  }

  async clickLogin() {
    const loginButton = await this.driver.findElement(By.css(this.selectors.loginButton));
    
    // Wait for button to be clickable
    await this.driver.wait(until.elementIsEnabled(loginButton), 5000);
    
    // Scroll into view and click
    await this.driver.executeScript('arguments[0].scrollIntoView(true);', loginButton);
    await loginButton.click();
  }

  async waitForLoginSuccess() {
    // Wait for loading to complete
    await this.driver.wait(until.elementIsNotLocated(By.css(this.selectors.loadingSpinner)), 10000);
    
    // Wait for redirect or success indicator
    await this.driver.wait(until.or(
      until.titleContains('Dashboard'),
      until.urlContains('/dashboard')
    ), 15000);
  }

  async captureLoginMetrics() {
    return await this.driver.executeScript(`
      return {
        loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
        domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
        firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0
      };
    `);
  }
}

module.exports = AdvancedLoginPage;
```

### Creating Custom Step Definitions

#### Proper Integration with Zypin

When creating custom step definitions, follow Zypin's patterns:

```javascript
// step-definitions/custom.steps.js
const { Given, When, Then } = require('@cucumber/cucumber');
const { By, until } = require('@zypin/selenium/webdriver');

// ✅ Good - Follow Zypin's logging pattern
When('I perform custom action on {string}', async function (selector) {
  console.log(`🔧 Performing custom action on: ${selector}`);
  
  try {
    const element = await this.driver.wait(until.elementLocated(By.css(selector)), this.timeout);
    // Your custom logic here
    await element.click();
    console.log(`✅ Custom action completed on: ${selector}`);
  } catch (error) {
    console.error(`❌ Custom action failed on ${selector}: ${error.message}`);
    throw error;
  }
});

// ✅ Good - Use this.driver and this.timeout from Zypin's world
When('I wait for custom condition', async function () {
  console.log(`⏳ Waiting for custom condition...`);
  
  await this.driver.wait(async () => {
    const result = await this.driver.executeScript(`
      return document.readyState === 'complete' && 
             document.querySelectorAll('.loading').length === 0;
    `);
    return result;
  }, this.timeout);
  
  console.log(`✅ Custom condition met`);
});
```

#### Extending Existing Step Definitions

You can extend Zypin's step definitions by creating additional files:

```javascript
// step-definitions/extensions.steps.js
const { Given, When, Then } = require('@cucumber/cucumber');
const { By, until } = require('@zypin/selenium/webdriver');

// Add new steps that complement existing ones
When('I hover over {string}', async function (selector) {
  console.log(`🖱️  Hovering over: ${selector}`);
  const element = await this.driver.wait(until.elementLocated(By.css(selector)), this.timeout);
  await this.driver.actions().move({origin: element}).perform();
});

When('I double-click on {string}', async function (selector) {
  console.log(`🖱️  Double-clicking on: ${selector}`);
  const element = await this.driver.wait(until.elementLocated(By.css(selector)), this.timeout);
  await this.driver.actions().doubleClick(element).perform();
});
```

### Advanced Step Definitions

Create step definitions that leverage your custom utilities:

```javascript
// step-definitions/advanced-login.steps.js
const { Given, When, Then } = require('@cucumber/cucumber');
const AdvancedLoginPage = require('../support/pages/AdvancedLoginPage');
const AdvancedTestUtils = require('../support/advanced-utils');

Given('I am on the advanced login page', async function () {
  this.loginPage = new AdvancedLoginPage(this.driver);
  this.testUtils = new AdvancedTestUtils(this.driver);
  await this.loginPage.navigateToLogin();
});

When('I login with advanced retry logic', async function (dataTable) {
  const credentials = dataTable.hashes()[0];
  await this.loginPage.loginWithRetry(credentials);
});

When('I capture performance metrics', async function () {
  this.performanceMetrics = await this.loginPage.captureLoginMetrics();
  console.log('Performance Metrics:', this.performanceMetrics);
});

When('I wait for network to be idle', async function () {
  const isIdle = await this.testUtils.waitForNetworkIdle();
  if (!isIdle) {
    throw new Error('Network did not become idle within timeout');
  }
});

When('I simulate mobile device {string}', async function (deviceName) {
  await this.testUtils.simulateMobileDevice(deviceName);
});

Then('I should see login completed within {int} seconds', async function (maxSeconds) {
  const loadTime = this.performanceMetrics.loadTime;
  if (loadTime > maxSeconds * 1000) {
    throw new Error(`Login took ${loadTime}ms, expected less than ${maxSeconds * 1000}ms`);
  }
});
```

### Custom Test Data Management

Advanced data handling without step definition limitations:

```javascript
// support/test-data-manager.js
class TestDataManager {
  constructor() {
    this.testData = new Map();
    this.generatedData = new Map();
  }

  async loadTestData(source) {
    if (source.startsWith('http')) {
      const response = await fetch(source);
      const data = await response.json();
      this.testData.set('api', data);
    } else {
      const fs = require('fs');
      const data = JSON.parse(fs.readFileSync(source, 'utf8'));
      this.testData.set('file', data);
    }
  }

  generateTestUser(overrides = {}) {
    const timestamp = Date.now();
    const user = {
      email: `testuser${timestamp}@example.com`,
      password: 'TestPassword123!',
      firstName: 'Test',
      lastName: 'User',
      ...overrides
    };
    
    this.generatedData.set('currentUser', user);
    return user;
  }

  async createTestUserViaAPI(userData) {
    const response = await fetch('https://api.example.com/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create test user: ${response.statusText}`);
    }
    
    const createdUser = await response.json();
    this.generatedData.set('createdUser', createdUser);
    return createdUser;
  }

  async cleanupTestData() {
    const createdUser = this.generatedData.get('createdUser');
    if (createdUser) {
      await fetch(`https://api.example.com/users/${createdUser.id}`, {
        method: 'DELETE'
      });
    }
  }
}

module.exports = TestDataManager;
```

### Performance Optimization

Direct WebDriver usage for maximum performance:

```javascript
// step-definitions/performance.steps.js
const { Given, When, Then } = require('@cucumber/cucumber');
const { By } = require('@zypin/selenium/webdriver');

When('I perform bulk operations efficiently', async function (dataTable) {
  const items = dataTable.hashes();
  
  // Batch operations for better performance
  const promises = items.map(async (item) => {
    const element = await this.driver.findElement(By.css(item.selector));
    await element.clear();
    await element.sendKeys(item.value);
  });
  
  await Promise.all(promises);
});

When('I execute parallel JavaScript operations', async function () {
  // Execute multiple JavaScript operations in parallel
  const results = await Promise.all([
    this.driver.executeScript('return document.title'),
    this.driver.executeScript('return window.location.href'),
    this.driver.executeScript('return document.readyState'),
    this.driver.executeScript('return performance.now()')
  ]);
  
  this.pageInfo = {
    title: results[0],
    url: results[1],
    readyState: results[2],
    timestamp: results[3]
  };
});
```

### Advanced Browser Control

Direct access to WebDriver's advanced features:

```javascript
// step-definitions/browser-control.steps.js
const { Given, When, Then } = require('@cucumber/cucumber');
const { By } = require('@zypin/selenium/webdriver');

When('I configure advanced browser settings', async function () {
  // Advanced browser configuration
  await this.driver.manage().window().maximize();
  
  // Set custom timeouts
  await this.driver.manage().setTimeouts({
    implicit: 10000,
    pageLoad: 30000,
    script: 15000
  });
  
  // Configure network conditions
  await this.driver.executeCdpCommand('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: 5000000, // 5 Mbps
    uploadThroughput: 2000000,   // 2 Mbps
    latency: 100                 // 100ms
  });
});

When('I capture advanced screenshots', async function () {
  // Full page screenshot
  const fullPageScreenshot = await this.driver.takeScreenshot();
  
  // Element-specific screenshot
  const element = await this.driver.findElement(By.css('#specific-element'));
  const elementScreenshot = await element.takeScreenshot();
  
  // Save with metadata
  const fs = require('fs');
  const timestamp = new Date().toISOString();
  fs.writeFileSync(`screenshot-full-${timestamp}.png`, fullPageScreenshot, 'base64');
  fs.writeFileSync(`screenshot-element-${timestamp}.png`, elementScreenshot, 'base64');
});
```

### Integration with External Tools

Connect with external testing tools and services:

```javascript
// support/external-integrations.js
class ExternalIntegrations {
  constructor(driver) {
    this.driver = driver;
  }

  async reportToTestRail(testCaseId, status, comment = '') {
    const testRailAPI = 'https://yourcompany.testrail.io/index.php?/api/v2/';
    const auth = Buffer.from('username:password').toString('base64');
    
    await fetch(`${testRailAPI}add_result/${testCaseId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status_id: status === 'passed' ? 1 : 5,
        comment: comment
      })
    });
  }

  async sendSlackNotification(message, channel = '#testing') {
    const webhook = process.env.SLACK_WEBHOOK_URL;
    if (webhook) {
      await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: channel,
          text: message,
          username: 'Zypin Test Bot'
        })
      });
    }
  }

  async uploadScreenshotsToS3(screenshotPath) {
    const AWS = require('aws-sdk');
    const s3 = new AWS.S3();
    
    const fileContent = require('fs').readFileSync(screenshotPath);
    const params = {
      Bucket: 'your-test-screenshots',
      Key: `screenshots/${Date.now()}-${path.basename(screenshotPath)}`,
      Body: fileContent,
      ContentType: 'image/png'
    };
    
    return await s3.upload(params).promise();
  }
}

module.exports = ExternalIntegrations;
```

### Best Practices for Advanced Testing

1. **Error Handling**: Implement comprehensive error handling and recovery
2. **Performance Monitoring**: Track and optimize test execution time
3. **Resource Management**: Properly clean up resources and connections
4. **Logging**: Use structured logging for better debugging
5. **Modularity**: Keep advanced code organized and reusable
6. **Documentation**: Document complex interactions and utilities

### Migration Strategy

If you're transitioning from step definitions to advanced patterns:

1. **Start Small**: Begin with one feature or page
2. **Gradual Migration**: Move complex scenarios first
3. **Maintain Compatibility**: Keep both approaches working together
4. **Team Training**: Ensure team understands advanced patterns
5. **Performance Testing**: Measure improvements and regressions

This advanced approach gives you the flexibility and control needed for sophisticated test automation while maintaining the benefits of Zypin's WebDriver integration and world management.

### Standalone Test Files

For simple tests that don't need Cucumber, you can create standalone test files using Zypin's WebDriver utilities:

```javascript
// test.js - Standalone test file
const { By, until, createDriver } = require('@zypin/selenium/webdriver');

async function runTest() {
  console.log('🚀 Starting standalone test...');
  
  // Get configuration from environment variables
  const browser = process.env.BROWSER || 'chrome';
  const headless = process.env.HEADLESS === 'true';
  const gridUrl = process.env.SELENIUM_GRID_URL || 'http://localhost:8422';

  let driver;

  try {
    // Create WebDriver instance using Zypin's createDriver
    driver = await createDriver({
      browser,
      headless,
      gridUrl
    });

    if (!driver) {
      throw new Error('Failed to create WebDriver instance');
    }

    // Navigate to your application
    console.log('🌐 Navigating to application...');
    await driver.get('https://example.com');
    console.log('✅ Navigation completed');
    
    // Get page title
    const pageTitle = await driver.getTitle();
    console.log(`📄 Page title: ${pageTitle}`);

    // Perform your test actions
    const element = await driver.wait(until.elementLocated(By.css('h1')), 10000);
    const text = await element.getText();
    console.log(`📝 Found element text: ${text}`);

    // Take screenshot
    const screenshot = await driver.takeScreenshot();
    const fs = require('fs');
    fs.writeFileSync('test-screenshot.png', screenshot, 'base64');
    console.log('📸 Screenshot saved');

    console.log('✅ Test completed successfully!');

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
```

#### Running Standalone Tests

```bash
# Run with default settings
node test.js

# Run with custom configuration
BROWSER=firefox HEADLESS=true node test.js

# Run with custom grid
SELENIUM_GRID_URL=http://remote-grid:4444 node test.js
```

#### Integration with Zypin CLI

You can also run standalone tests through Zypin:

```bash
# Run standalone test file
zypin run --input test.js

# Run with options
zypin run --input test.js --browser firefox --headless
```

This approach is perfect for:
- **Simple smoke tests**
- **Quick verification scripts**
- **API testing with browser automation**
- **Performance monitoring scripts**
- **One-off test scenarios**

---

## Conclusion

Zypin's reusable step definitions provide a powerful foundation for writing maintainable, scalable test automation. By following these patterns and best practices, you can:

- **Write tests faster** with pre-built, reusable steps
- **Maintain consistency** across your test suite
- **Reduce maintenance overhead** with centralized step logic
- **Scale your testing** with data-driven approaches
- **Extend functionality** while maintaining consistency

### Key Takeaways

1. **Use parameterized steps** for maximum reusability
2. **Leverage multiple selector types** for flexibility
3. **Combine steps logically** for better test readability
4. **Follow consistent patterns** when extending the library
5. **Include proper error handling** and logging
6. **Test your step definitions** independently

### Next Steps

- Explore the existing step definitions in `zypin.steps.js`
- Practice writing feature files using these reusable steps
- Extend the library with domain-specific steps for your application
- Share reusable steps across your team for consistency

For debugging help, use `zypin guide --debug` to access the debugging guide.
