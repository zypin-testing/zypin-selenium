# Basic WebDriver Template

A simple WebDriver test project created with the Zypin Testing Framework.

## Getting Started

### Prerequisites
- Node.js 16+
- Java 11+ (for Selenium Grid)
- Zypin Framework

### Installation

1. Create a new project from this template:
```bash
zypin create-project my-tests --template selenium/basic-webdriver
cd my-tests
```

2. Install dependencies:
```bash
npm install
```

3. Start Selenium Grid:
```bash
zypin start --packages selenium
```

4. Run tests:
```bash
zypin run --input test.js
```

## Usage

### Basic Commands

```bash
# Run test with default settings
zypin run --input test.js

# Run in headless mode
zypin run --input test.js --headless

# Run with different browser
zypin run --input test.js --browser firefox

# Run with custom timeout
zypin run --input test.js --timeout 60000
```

### Configuration

Zypin uses a 3-tier configuration system (CLI parameters override user config, which overrides defaults):

1. **Package defaults** (built into the framework)
2. **User project config** (in your `package.json`)
3. **CLI parameters** (highest priority)

Configure your tests in `package.json`:

```json
{
  "zypin": {
    "config": {
      "browser": "chrome",
      "headless": false,
      "timeout": 30000,
      "parallel": 1,
      "retries": 0,
      "windowSize": "1920x1080"
    }
  }
}
```

## Project Structure

```
├── test.js          # Main test file
├── runner.js        # Test runner
├── package.json     # Dependencies and config
├── node_modules/    # Dependencies
└── README.md        # This file
```

## Test Example

The included test demonstrates:
- Navigating to a website
- Getting page title
- Basic test verification
- WebDriver setup and cleanup

## Troubleshooting

**Java not found:**
- Install Java 11+ from [Adoptium](https://adoptium.net/)

**Grid not running:**
- Run `zypin start --packages selenium`

**Debug mode:**
```bash
zypin run --input test.js --debug
```

## Next Steps

- Add more test files
- Implement page objects
- Add data-driven tests
- Set up CI/CD integration