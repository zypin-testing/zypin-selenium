# Zypin Debug Guide

A practical guide to debugging Zypin Cucumber tests using built-in features and quick solutions.

## Table of Contents

1. [Quick Debug Checklist](#quick-debug-checklist)
2. [Built-in Debug Features](#built-in-debug-features)
3. [Essential Debug Steps](#essential-debug-steps)
4. [Advanced Debugging](#advanced-debugging)

---

## Quick Debug Checklist

### 🚨 Common Issues & Quick Fixes

#### Element Not Found
```gherkin
# Problem: Element .selector not found within 30000ms timeout
# Quick Fix: Add explicit wait
When I wait for ".button" to be visible
And I click on ".button"

# Alternative: Try different selector
When I click on element with id "submit-btn"  # Instead of CSS
When I click on element with name "submit"    # Instead of CSS
```

#### Text Not Found
```gherkin
# Problem: Expected to see "text" in .selector, but found: "actual text"
# Quick Fix: Use partial text matching
Then I should see "Welcome" in ".message"  # Instead of exact "Welcome, John!"
```

#### Timing Issues
```gherkin
# Problem: Element found but interaction fails
# Quick Fix: Wait for element to be ready
When I wait for ".button" to be visible
And I wait for "1" seconds  # Allow for animations
And I click on ".button"
```

### 🔧 Essential Debug Commands

```bash
# Run with visible browser for debugging
zypin run --input features/ --browser chrome

# Enable debug logging
export ZYPIN_DEBUG=true
zypin run --input features/

# Run specific feature file
zypin run --input features/demo.feature

# Run in headless mode
zypin run --input features/ --headless

# Run with different browser
zypin run --input features/ --browser firefox

# Run with custom timeout
zypin run --input features/ --timeout 60000

# Run with parallel execution
zypin run --input features/ --parallel 2
```

### 📋 Pre-Test Checklist
- [ ] Selenium Grid is running (`zypin start --packages selenium`)
- [ ] Java 11+ is installed and available
- [ ] Application under test is running
- [ ] Network connectivity is good
- [ ] Browser is properly configured

---

## Built-in Debug Features

### 📸 Automatic Screenshots
Zypin automatically takes screenshots on test failures:

```javascript
// From hooks.js - automatically captures failures
After(async function(scenario) {
  if (scenario.result.status === 'FAILED') {
    await this.takeScreenshot(`failed-${scenario.pickle.name}`);
  }
});
```

**Screenshot files**: `screenshot-failed-Scenario-Name-2024-01-15T10-30-45-123Z.png`

### 📝 Built-in Logging
All step definitions include detailed logging:

```javascript
// From zypin.steps.js - every action is logged
When('I click on {string}', async function (selector) {
  console.log(`🖱️  Clicking on: ${selector}`);
  // ... action code
});
```

**Console output**:
```
🖱️  Clicking on: #login-button
⌨️  Entering "user@example.com" in: #email
👀 Verifying text "Welcome" in: .message
```

### ⏱️ Timeout Management
Built-in timeout handling with configurable limits:

```javascript
// From world.js - configurable timeouts
this.timeout = parseInt(process.env.TIMEOUT) || 30000; // 30 seconds default
```

**Set custom timeout**:
```bash
# Via environment variable
export TIMEOUT=60000  # 60 seconds
zypin run --input features/

# Via CLI parameter
zypin run --input features/ --timeout 60000

# Via package.json config
{
  "zypin": {
    "config": {
      "timeout": 60000
    }
  }
}
```

### 🎯 Error Handling
Comprehensive error messages with context:

```javascript
// From zypin.steps.js - detailed error messages
throw new Error(`Element ${selector} not found within ${this.timeout}ms timeout. ${error.message}`);
```

---

## Essential Debug Steps

### 1. Take Screenshots at Key Points
```gherkin
# Add to your feature files for debugging
When I take a screenshot named "before-login"
And I click on "#login-button"
When I take a screenshot named "after-login"
```

### 2. Get Page Information
```gherkin
# Use built-in steps to gather information
When I get the text from "#status-message"
Then I should see the current URL contains "dashboard"
Then I should see the page title contains "Welcome"
```

### 3. Execute Debug JavaScript
```gherkin
# Debug page state
When I execute JavaScript "console.log('Page ready:', document.readyState)"
And I execute JavaScript "console.log('Elements found:', document.querySelectorAll('.button').length)"
```

### 4. Wait for Conditions
```gherkin
# Wait for specific elements or states
When I wait for "#loading-complete" to be visible
And I wait for "3" seconds  # Fixed delay if needed
```

### 5. Verify Element Properties
```gherkin
# Check if elements exist and are visible
Then I should see element "#dashboard"
Then I should not see element ".error-message"
```

---

## Advanced Debugging

### Custom Debug Steps
Add to your step definitions for specific debugging needs:

```javascript
// Add to your step-definitions/index.js
When('I debug page state', async function() {
  const url = await this.getCurrentUrl();
  const title = await this.getPageTitle();
  const elements = await this.driver.findElements(By.css('*'));
  
  console.log('🔍 Page Debug Info:');
  console.log(`   URL: ${url}`);
  console.log(`   Title: ${title}`);
  console.log(`   Total Elements: ${elements.length}`);
});

When('I highlight element {string}', async function(selector) {
  await this.driver.executeScript(`
    const element = document.querySelector('${selector}');
    if (element) {
      element.style.border = '3px solid red';
      element.style.backgroundColor = 'yellow';
    }
  `);
  console.log(`🎯 Highlighted element: ${selector}`);
});
```

### Browser Dev Tools Integration
1. **Run tests in headed mode**:
   ```bash
   zypin run --input features/ --browser chrome
   ```

2. **Use browser console**:
   - Press F12 to open dev tools
   - Test selectors: `document.querySelector('.button')`
   - Check element properties: `element.offsetParent !== null`

3. **Monitor network requests**:
   - Check Network tab for failed requests
   - Verify API responses
   - Check for JavaScript errors in Console tab

### Performance Monitoring
```javascript
// Add to hooks.js for performance tracking
Before(async function(scenario) {
  this.startTime = Date.now();
});

After(async function(scenario) {
  const duration = Date.now() - this.startTime;
  console.log(`⏱️  Scenario duration: ${duration}ms`);
  
  if (duration > 30000) {
    console.log('⚠️  Slow test detected (>30s)');
  }
});
```

### Environment-Specific Debugging
```bash
# Development
export TEST_ENV=development
export TIMEOUT=10000
zypin run --input features/

# Staging
export TEST_ENV=staging
export TIMEOUT=30000
zypin run --input features/

# Production
export TEST_ENV=production
export TIMEOUT=60000
zypin run --input features/
```

### Project Structure Debugging
The template uses a modular structure with shared libraries:

```
├── features/              # Gherkin feature files
│   └── demo.feature      # Example feature file
├── step-definitions/      # Step implementation files
│   └── index.js          # Re-exports shared steps
├── support/              # Test setup and configuration
│   └── index.js          # Re-exports shared world/hooks
├── package.json          # Dependencies and config
└── runner.js             # Cucumber execution runner
```

**Key files for debugging**:
- `features/demo.feature` - Example test scenarios
- `package.json` - Configuration and scripts
- `runner.js` - Test execution logic
- Shared libraries in `@zypin/selenium` package

---

## Debug Workflow

### When Tests Fail:
1. **Check the console output** for detailed error messages
2. **Look for screenshots** in the current directory
3. **Verify selectors** in browser dev tools
4. **Add explicit waits** if timing is the issue
5. **Try alternative selectors** if element not found

### When Tests Are Slow:
1. **Check network requests** in browser dev tools
2. **Reduce wait times** where possible
3. **Use more specific selectors**
4. **Avoid fixed delays** - use element waits instead

### When Tests Are Flaky:
1. **Add explicit waits** before interactions
2. **Use more stable selectors** (IDs over classes)
3. **Check for dynamic content** that changes
4. **Verify test data** is consistent

---

## Quick Reference

### Essential Debug Steps
```gherkin
# Screenshots
When I take a screenshot named "debug-point"

# Information gathering
When I get the text from "#element"
Then I should see the current URL contains "expected"
Then I should see the page title contains "expected"

# JavaScript execution
When I execute JavaScript "console.log('Debug info')"

# Waits
When I wait for "#element" to be visible
When I wait for "5" seconds
```

### Environment Variables
```bash
# Debug mode
export ZYPIN_DEBUG=true

# Custom timeout
export TIMEOUT=60000

# Test environment
export TEST_ENV=development

# Browser configuration
export BROWSER=chrome
export HEADLESS=false

# Selenium Grid
export SELENIUM_GRID_URL=http://localhost:8422

# Window size
export WINDOW_SIZE=1920x1080
```

### Common Selector Strategies
```gherkin
# CSS selectors (default)
When I click on "#login-button"
When I click on ".submit-btn"

# ID selectors
When I click on element with id "login-btn"

# Name selectors
When I click on element with name "submit"

# XPath selectors
When I click on element with xpath "//button[@type='submit']"

# Link text
When I click on link with text "Sign In"
```

---

## Troubleshooting Common Issues

### Java Not Found
```bash
# Install Java 11+ from Adoptium
# https://adoptium.net/
java -version  # Verify installation
```

### Selenium Grid Not Running
```bash
# Start Selenium Grid
zypin start --packages selenium

# Check if Grid is accessible
curl http://localhost:8422/status
```

### Step Definition Not Found
- Check step definition files are in `step-definitions/` directory
- Verify `step-definitions/index.js` exports shared steps
- Ensure feature files are in `features/` directory

### Test Execution Issues
```bash
# Check cucumber report
cat cucumber-report.json

# Run with verbose output
export ZYPIN_DEBUG=true
zypin run --input features/
```

## Conclusion

Zypin provides built-in debugging features that handle most common issues. Use this guide to:

- **Quickly identify** and fix common problems
- **Leverage built-in features** like automatic screenshots and logging
- **Add custom debug steps** when needed
- **Monitor performance** and optimize slow tests
- **Troubleshoot** environment and configuration issues

For writing help, use `zypin guide --write` to access the writing guide.
