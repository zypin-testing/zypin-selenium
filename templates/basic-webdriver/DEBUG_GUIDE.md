# How to Debug When You Encounter Errors

## Quick Fixes for Common Issues

### 🚨 Element Not Found
**Error**: `NoSuchElementError: no such element: Unable to locate element`
**Quick Fix**: Add explicit wait or try different selector
```javascript
// Add explicit wait
const element = await driver.wait(until.elementLocated(By.css('.button')), 10000);
await element.click();

// Try different selector
const element = await driver.findElement(By.id('submit-btn')); // Instead of CSS
```

### 🚨 Text Not Found
**Error**: `Expected text not found in element`
**Quick Fix**: Use partial text matching
```javascript
const element = await driver.findElement(By.css('.message'));
const text = await element.getText();
if (!text.includes('Welcome')) { // Instead of exact match
  throw new Error(`Expected to see "Welcome" but found: "${text}"`);
}
```

### 🚨 Timing Issues
**Error**: `Element found but interaction fails`
**Quick Fix**: Wait for element to be ready
```javascript
await driver.wait(until.elementIsVisible(element), 10000);
await driver.sleep(1000); // Allow for animations
await element.click();
```

### 🚨 Selenium Grid Not Running
**Error**: `Connection refused to localhost:8422`
**Quick Fix**: Start Selenium Grid
```bash
zypin start --packages selenium
```

## Debug Commands

```bash
# Run with visible browser for debugging
zypin run --input test.js --browser chrome

# Enable debug logging
export ZYPIN_DEBUG=true
zypin run --input test.js

# Run with custom timeout
zypin run --input test.js --timeout 60000

# Run in headless mode
zypin run --input test.js --headless

# Run with different browser
zypin run --input test.js --browser firefox
```

## Built-in Debug Features

### 📸 Screenshots
Take screenshots at any point in your test:
```javascript
const screenshot = await driver.takeScreenshot();
const fs = require('fs');
fs.writeFileSync('debug-screenshot.png', screenshot, 'base64');
```

### 📝 Logging
Add logging to your test operations:
```javascript
console.log('🖱️  Clicking on element:', selector);
await element.click();

console.log('⌨️  Entering text:', text);
await element.sendKeys(text);
```

### ⏱️ Timeout Management
Set custom timeouts for different operations:
```javascript
const timeout = parseInt(process.env.TIMEOUT) || 30000;
await driver.wait(until.elementLocated(By.css(selector)), timeout);
```

## Troubleshooting Checklist

- [ ] Selenium Grid is running (`zypin start --packages selenium`)
- [ ] Java 11+ is installed and available
- [ ] Application under test is running
- [ ] Network connectivity is good
- [ ] Browser is properly configured
- [ ] Check console output for detailed error messages
- [ ] Look for screenshots in the current directory
- [ ] Verify selectors in browser dev tools
- [ ] Add explicit waits if timing is the issue
- [ ] Try alternative selectors if element not found

## Quick Reference

### Essential Debug Methods
```javascript
// Screenshots
const screenshot = await driver.takeScreenshot();

// Information gathering
const url = await driver.getCurrentUrl();
const title = await driver.getTitle();
const text = await element.getText();

// JavaScript execution
const result = await driver.executeScript('return document.title');

// Waits
await driver.wait(until.elementLocated(By.css('#element')), 10000);
await driver.sleep(5000);
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

# Selenium Grid
export SELENIUM_GRID_URL=http://localhost:8422
```

### Common Selector Strategies
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
