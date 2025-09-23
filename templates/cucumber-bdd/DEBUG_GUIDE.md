# How to Debug When You Encounter Errors

## Quick Fixes for Common Issues

### 🚨 Element Not Found
**Error**: `Element .selector not found within 30000ms timeout`

**Quick Fix**:
```gherkin
# Add explicit wait
When I wait for ".button" to be visible
And I click on ".button"

# Try different selector
When I click on element with id "submit-btn"  # Instead of CSS
When I click on element with name "submit"    # Instead of CSS
```

### 🚨 Text Not Found
**Error**: `Expected to see "text" in .selector, but found: "actual text"`

**Quick Fix**:
```gherkin
# Use partial text matching
Then I should see "Welcome" in ".message"  # Instead of exact "Welcome, John!"
```

### 🚨 Timing Issues
**Error**: Element found but interaction fails

**Quick Fix**:
```gherkin
# Wait for element to be ready
When I wait for ".button" to be visible
And I wait for "1" seconds  # Allow for animations
And I click on ".button"
```

## Debug Commands

### Run with Debug Mode
```bash
# Enable debug logging
export ZYPIN_DEBUG=true
zypin run --input features/

# Run with visible browser
zypin run --input features/ --browser chrome

# Run specific feature
zypin run --input features/login.feature
```

### Check Prerequisites
```bash
# Verify Selenium Grid is running
curl http://localhost:8422/status

# Check Java version
java -version  # Should be Java 11+

# Start Selenium Grid if needed
zypin start --packages selenium
```

## Built-in Debug Features

### 📸 Automatic Screenshots
Screenshots are automatically taken on test failures:
- **Location**: Current directory
- **Format**: `screenshot-failed-Scenario-Name-2024-01-15T10-30-45-123Z.png`

### 📝 Built-in Logging
Every action is logged with emojis:
```
🖱️  Clicking on: #login-button
⌨️  Entering "user@example.com" in: #email
👀 Verifying text "Welcome" in: .message
```

### ⏱️ Timeout Management
```bash
# Set custom timeout
export TIMEOUT=60000  # 60 seconds
zypin run --input features/
```

## Debug Steps You Can Use

### Take Screenshots
```gherkin
# Add to your feature files for debugging
When I take a screenshot named "before-login"
And I click on "#login-button"
When I take a screenshot named "after-login"
```

### Get Page Information
```gherkin
# Gather information about the page
When I get the text from "#status-message"
Then I should see the current URL contains "dashboard"
Then I should see the page title contains "Welcome"
```

### Execute Debug JavaScript
```gherkin
# Debug page state
When I execute JavaScript "console.log('Page ready:', document.readyState)"
And I execute JavaScript "console.log('Elements found:', document.querySelectorAll('.button').length)"
```

### Wait for Conditions
```gherkin
# Wait for specific elements or states
When I wait for "#loading-complete" to be visible
And I wait for "3" seconds  # Fixed delay if needed
```

## Troubleshooting Checklist

### Before Running Tests
- [ ] Selenium Grid is running (`zypin start --packages selenium`)
- [ ] Java 11+ is installed and available
- [ ] Application under test is running
- [ ] Network connectivity is good

### When Tests Fail
1. **Check console output** for detailed error messages
2. **Look for screenshots** in the current directory
3. **Verify selectors** in browser dev tools
4. **Add explicit waits** if timing is the issue
5. **Try alternative selectors** if element not found

### When Tests Are Slow
1. **Check network requests** in browser dev tools
2. **Reduce wait times** where possible
3. **Use more specific selectors**
4. **Avoid fixed delays** - use element waits instead

### When Tests Are Flaky
1. **Add explicit waits** before interactions
2. **Use more stable selectors** (IDs over classes)
3. **Check for dynamic content** that changes
4. **Verify test data** is consistent

## Browser Dev Tools Integration

### 1. Run Tests in Headed Mode
```bash
zypin run --input features/ --browser chrome
```

### 2. Use Browser Console
- Press F12 to open dev tools
- Test selectors: `document.querySelector('.button')`
- Check element properties: `element.offsetParent !== null`

### 3. Monitor Network Requests
- Check Network tab for failed requests
- Verify API responses
- Check for JavaScript errors in Console tab

## Environment-Specific Debugging

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

## Quick Reference

### Essential Debug Steps
```gherkin
# Screenshots
When I take a screenshot named "debug-point"

# Information gathering
When I get the text from "#element"
Then I should see the current URL contains "expected"

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

# Browser configuration
export BROWSER=chrome
export HEADLESS=false
```

That's it! Use these debugging techniques to quickly identify and fix issues in your tests.
