# Basic WebDriver Template

## Why Use This Template?

### 🎯 Direct WebDriver Control
Get full control over browser automation with direct JavaScript and Selenium WebDriver access. No abstraction layers, no limitations.

### ⚡ Maximum Performance
Write tests that run fast with minimal overhead. Direct WebDriver access means no framework bloat slowing down your tests.

### 🔧 Ultimate Flexibility
Support any testing pattern - unit, integration, e2e. Use any selector type, implement custom logic, integrate with any tool.

## What You Get

- **Direct WebDriver Access**: Full control over WebDriver operations using JavaScript
- **Multiple Browsers**: Test across Chrome, Firefox, and other browsers
- **Screenshots**: Manual and automatic screenshot capture for debugging
- **Flexible Testing**: Support for any testing pattern (unit, integration, e2e)
- **Async/Await Patterns**: Modern JavaScript with clean, readable test code

## Quick Start

```bash
# Create project
zypin create-project my-webdriver-tests --template selenium/basic-webdriver
cd my-webdriver-tests

# Install dependencies
npm install

# Start Selenium Grid
zypin start --packages selenium

# Run tests
zypin run --input test.js
```

## Need Help?

- **Writing**: See `WRITE_GUIDE.md`
- **Debugging**: See `DEBUG_GUIDE.md`