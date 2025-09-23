# How to Use This Template

## Writing Your First Test

### 1. Create a Feature File
Create a new `.feature` file in the `features/` directory:

```gherkin
Feature: Login functionality
  As a user
  I want to login to the application
  So that I can access my account

  Scenario: Successful login
Given I navigate to "https://app.example.com/login"
    When I enter "user@example.com" in "#email"
    And I enter "password123" in "#password"
    And I click on "#login-button"
    Then I should see "Welcome" in ".welcome-message"
```

### 2. Run Your Test
```bash
zypin run --input features/login.feature
```

## Available Step Definitions

### Navigation
```gherkin
Given I navigate to "https://example.com"
When I go back to the previous page
When I reload the page
```

### Clicking Elements
```gherkin
When I click on "#button-id"
When I click on ".css-class"
When I click on element with id "submit-btn"
When I click on element with name "submit"
When I click on link with text "Sign In"
```

### Entering Text
```gherkin
When I enter "text" in "#input-field"
When I enter "text" in field with name "username"
When I clear "#input-field"
```

### Verifying Content
```gherkin
Then I should see "Welcome" in ".message"
Then I should not see "Error" in ".error-container"
Then I should see element "#dashboard"
Then I should see the page title contains "Dashboard"
```

### Waiting
```gherkin
When I wait for "#loading" to be visible
When I wait for "3" seconds
```

### Screenshots
```gherkin
When I take a screenshot
When I take a screenshot named "login-success"
```

## Data-Driven Testing

### Using Data Tables
```gherkin
When I fill the form with:
  | field     | value              |
  | #email    | user@example.com   |
  | #password | password123        |
```

### Scenario Outlines
```gherkin
Scenario Outline: Login with different users
  Given I navigate to "https://app.example.com/login"
  When I enter "<email>" in "#email"
  And I enter "<password>" in "#password"
  And I click on "#login-button"
  Then I should see "<message>" in ".message"

  Examples:
    | email              | password   | message        |
    | admin@example.com  | admin123   | Welcome Admin! |
    | user@example.com   | user123    | Welcome User!  |
```

## Running Tests

### Basic Commands
```bash
# Run all tests
zypin run --input features/

# Run specific feature
zypin run --input features/login.feature

# Run with visible browser
zypin run --input features/ --browser chrome

# Run in headless mode
zypin run --input features/ --headless

# Run with different browser
zypin run --input features/ --browser firefox
```

### Environment Variables
```bash
# Set custom timeout
export TIMEOUT=60000
zypin run --input features/

# Enable debug mode
export ZYPIN_DEBUG=true
zypin run --input features/
```

## Best Practices

### 1. Use Stable Selectors
```gherkin
# Good - Use IDs or data attributes
When I click on "#login-button"
When I click on "[data-testid='submit']"

# Avoid - Fragile CSS selectors
When I click on ".btn-primary"
```

### 2. Wait for Elements
```gherkin
# Always wait before interacting
When I wait for "#button" to be visible
And I click on "#button"
```

### 3. Use Descriptive Names
```gherkin
# Good - Clear and specific
When I take a screenshot named "login-form-filled"

# Avoid - Generic names
When I take a screenshot named "test"
```

### 4. Group Related Actions
```gherkin
# Good - Logical flow
When I enter "user@example.com" in "#email"
And I enter "password123" in "#password"
And I click on "#login-button"
```

## Adding Custom Steps

Create a new file in `step-definitions/`:

```javascript
const { Given, When, Then } = require('@cucumber/cucumber');

When('I hover over {string}', async function (selector) {
  console.log(`🖱️  Hovering over: ${selector}`);
  const element = await this.driver.wait(until.elementLocated(By.css(selector)), this.timeout);
  await this.driver.actions().move({origin: element}).perform();
});
```

## Project Structure

```
your-project/
├── features/              # Your .feature files
│   └── login.feature
├── step-definitions/      # Custom step definitions
│   └── index.js
├── support/              # Test setup
│   └── index.js
├── package.json          # Dependencies
└── runner.js             # Test runner
```

That's it! You now know how to write and run BDD tests with this template.
