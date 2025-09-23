# Cucumber BDD Template

## Why Use This Template?

### 🎯 **Write Tests in Plain English**
- Use natural language (Gherkin) that anyone can understand
- Business stakeholders can read and validate your tests
- No need to learn complex programming syntax

### ⚡ **Get Started in Minutes**
- Pre-built step definitions for common web actions
- Ready-to-run example tests
- No complex setup or configuration needed

### 🔧 **Built-in Debugging**
- Automatic screenshots on test failures
- Detailed error messages with context
- Built-in logging for every action

### 🌐 **Cross-Browser Testing**
- Test on Chrome, Firefox, and other browsers
- Run tests in headless mode for CI/CD
- Parallel execution for faster results

### 📈 **Scalable & Maintainable**
- Reusable step definitions across all tests
- Data-driven testing with tables
- Easy to extend with custom steps

## What You Get

- **BDD Testing**: Write tests using Given-When-Then scenarios
- **Web Automation**: Automate browser interactions with Selenium
- **Multiple Browsers**: Test across different browsers
- **Screenshots**: Automatic failure screenshots for debugging
- **Flexible Selectors**: CSS, ID, Name, XPath, and Link Text selectors

## Quick Start

```bash
# Create project
zypin create-project my-tests --template selenium/cucumber-bdd
cd my-tests

# Install dependencies
npm install

# Start Selenium Grid
zypin start --packages selenium

# Run tests
zypin run --input features/
```

## Need Help?

- **Writing tests**: See `WRITE_GUIDE.md`
- **Debugging**: See `DEBUG_GUIDE.md`
