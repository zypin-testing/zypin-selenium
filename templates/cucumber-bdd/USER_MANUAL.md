# Zypin Cucumber Step Definitions - User Manual

A comprehensive guide to using Zypin's Cucumber step definitions for web automation testing.

## Table of Contents

1. [Quick Reference](#quick-reference)
2. [Navigation Steps](#navigation-steps)
3. [Click Actions](#click-actions)
4. [Text Input Actions](#text-input-actions)
5. [Wait Actions](#wait-actions)
6. [Verification Steps](#verification-steps)
7. [Form Actions](#form-actions)
8. [Browser Actions](#browser-actions)
9. [Selector Strategies](#selector-strategies)
10. [Best Practices](#best-practices)
11. [Troubleshooting](#troubleshooting)
12. [Advanced Usage](#advanced-usage)

---

## Quick Reference

### Navigation
| Step | Parameters | Example |
|------|------------|---------|
| `I navigate to {string}` | URL | `I navigate to "https://example.com"` |
| `I go back to the previous page` | None | `I go back to the previous page` |
| `I go forward to the next page` | None | `I go forward to the next page` |
| `I reload the page` | None | `I reload the page` |

### Click Actions
| Step | Parameters | Example |
|------|------------|---------|
| `I click on {string}` | CSS selector | `I click on ".submit-button"` |
| `I click on element with name {string}` | Name attribute | `I click on element with name "submit"` |
| `I click on element with id {string}` | ID attribute | `I click on element with id "login-btn"` |
| `I click on element with xpath {string}` | XPath expression | `I click on element with xpath "//button[@type='submit']"` |
| `I click on link with text {string}` | Exact link text | `I click on link with text "Sign In"` |
| `I click on link containing text {string}` | Partial link text | `I click on link containing text "Sign"` |

### Text Input
| Step | Parameters | Example |
|------|------------|---------|
| `I enter {string} in {string}` | Text, CSS selector | `I enter "john@example.com" in "#email"` |
| `I enter {string} in field with name {string}` | Text, Name attribute | `I enter "password123" in field with name "password"` |
| `I enter {string} in field with id {string}` | Text, ID attribute | `I enter "John Doe" in field with id "fullname"` |
| `I enter {string} in field with xpath {string}` | Text, XPath expression | `I enter "12345" in field with xpath "//input[@type='tel']"` |

### Wait Actions
| Step | Parameters | Example |
|------|------------|---------|
| `I wait for {string} to be visible` | CSS selector | `I wait for ".loading-spinner" to be visible` |
| `I wait for {string} seconds` | Number of seconds | `I wait for "5" seconds` |

### Verification Steps
| Step | Parameters | Example |
|------|------------|---------|
| `I should see {string} in {string}` | Text, CSS selector | `I should see "Welcome" in ".message"` |
| `I should not see {string} in {string}` | Text, CSS selector | `I should not see "Error" in ".alert"` |
| `I should see the page title contains {string}` | Title text | `I should see the page title contains "Dashboard"` |
| `I should see element {string}` | CSS selector | `I should see element ".success-message"` |
| `I should not see element {string}` | CSS selector | `I should not see element ".error-message"` |
| `I should see element with name {string}` | Name attribute | `I should see element with name "username"` |
| `I should see element with id {string}` | ID attribute | `I should see element with id "header"` |
| `I should see element with xpath {string}` | XPath expression | `I should see element with xpath "//h1[@class='title']"` |
| `I should see link with text {string}` | Exact link text | `I should see link with text "Logout"` |
| `I should see link containing text {string}` | Partial link text | `I should see link containing text "Log"` |

### Form & Browser Actions
| Step | Parameters | Example |
|------|------------|---------|
| `I submit the form {string}` | CSS selector | `I submit the form "#login-form"` |
| `I press Enter in {string}` | CSS selector | `I press Enter in "#search-input"` |
| `I clear {string}` | CSS selector | `I clear "#username"` |
| `I select {string} from {string}` | Value, Selector | `I select "Option 1" from "#dropdown"` |
| `I fill the form with:` | Data table | `I fill the form with: \| field \| value \|` |
| `I execute JavaScript {string}` | Script | `I execute JavaScript "return document.title"` |

### Information Gathering
| Step | Parameters | Example |
|------|------------|---------|
| `I take a screenshot` | None | `I take a screenshot` |
| `I take a screenshot named {string}` | Filename | `I take a screenshot named "test.png"` |
| `I should see the current URL is {string}` | URL | `I should see the current URL is "https://example.com"` |
| `I should see the current URL contains {string}` | URL part | `I should see the current URL contains "example"` |
| `I should see the page title is {string}` | Title | `I should see the page title is "Home Page"` |
| `I get the text from {string}` | Selector | `I get the text from ".message"` |

---

## Navigation Steps

### I navigate to {string}
Navigates the browser to the specified URL.

**Parameters:**
- `{string}` - The URL to navigate to

**Examples:**
```gherkin
Given I navigate to "https://example.com"
Given I navigate to "http://localhost:3000"
Given I navigate to "https://app.example.com/login"
```

**Best Practices:**
- Use HTTPS when possible
- Include protocol (http:// or https://)
- For local development, use localhost with port numbers

---

## Click Actions

### CSS Selector Click
```gherkin
When I click on {string}
```

**Examples:**
```gherkin
When I click on ".submit-button"
When I click on "#login-btn"
When I click on "button[type='submit']"
When I click on ".nav-item:nth-child(2)"
```

### Name Attribute Click
```gherkin
When I click on element with name {string}
```

**Examples:**
```gherkin
When I click on element with name "submit"
When I click on element with name "login"
When I click on element with name "add-to-cart"
```

### ID Attribute Click
```gherkin
When I click on element with id {string}
```

**Examples:**
```gherkin
When I click on element with id "login-button"
When I click on element with id "submit-form"
When I click on element with id "menu-toggle"
```

### XPath Click
```gherkin
When I click on element with xpath {string}
```

**Examples:**
```gherkin
When I click on element with xpath "//button[@type='submit']"
When I click on element with xpath "//div[@class='card']//button"
When I click on element with xpath "//input[@value='Login']"
```

### Link Text Click
```gherkin
When I click on link with text {string}
When I click on link containing text {string}
```

**Examples:**
```gherkin
When I click on link with text "Sign In"
When I click on link with text "Forgot Password?"
When I click on link containing text "Sign"
When I click on link containing text "Password"
```

---

## Text Input Actions

### CSS Selector Input
```gherkin
When I enter {string} in {string}
```

**Examples:**
```gherkin
When I enter "john@example.com" in "#email"
When I enter "password123" in ".password-field"
When I enter "John Doe" in "input[name='fullname']"
```

### Name Attribute Input
```gherkin
When I enter {string} in field with name {string}
```

**Examples:**
```gherkin
When I enter "john@example.com" in field with name "email"
When I enter "password123" in field with name "password"
When I enter "John Doe" in field with name "fullname"
```

### ID Attribute Input
```gherkin
When I enter {string} in field with id {string}
```

**Examples:**
```gherkin
When I enter "john@example.com" in field with id "email-input"
When I enter "password123" in field with id "password-field"
When I enter "John Doe" in field with id "fullname"
```

### XPath Input
```gherkin
When I enter {string} in field with xpath {string}
```

**Examples:**
```gherkin
When I enter "john@example.com" in field with xpath "//input[@type='email']"
When I enter "password123" in field with xpath "//input[@name='password']"
When I enter "12345" in field with xpath "//input[@type='tel']"
```

---

## Wait Actions

### Element Visibility Wait
```gherkin
When I wait for {string} to be visible
```

**Examples:**
```gherkin
When I wait for ".loading-spinner" to be visible
When I wait for "#success-message" to be visible
When I wait for ".modal" to be visible
```

### Time-based Wait
```gherkin
When I wait for {string} seconds
```

**Examples:**
```gherkin
When I wait for "3" seconds
When I wait for "10" seconds
When I wait for "0.5" seconds
```

**Best Practices:**
- Use element visibility waits instead of time-based waits when possible
- Time-based waits should be used sparingly
- Consider using shorter waits and combining with element visibility

---

## Verification Steps

### Text Content Verification
```gherkin
Then I should see {string} in {string}
Then I should not see {string} in {string}
```

**Examples:**
```gherkin
Then I should see "Welcome, John!" in ".welcome-message"
Then I should see "Login successful" in ".alert-success"
Then I should not see "Error" in ".alert-danger"
Then I should not see "Loading..." in ".status"
```

### Page Title Verification
```gherkin
Then I should see the page title contains {string}
```

**Examples:**
```gherkin
Then I should see the page title contains "Dashboard"
Then I should see the page title contains "Login"
Then I should see the page title contains "Example.com"
```

### Element Existence Verification
```gherkin
Then I should see element {string}
Then I should not see element {string}
```

**Examples:**
```gherkin
Then I should see element ".success-message"
Then I should see element "#user-menu"
Then I should not see element ".error-message"
Then I should not see element ".loading-spinner"
```

### Element with Specific Attributes
```gherkin
Then I should see element with name {string}
Then I should see element with id {string}
Then I should see element with xpath {string}
```

**Examples:**
```gherkin
Then I should see element with name "username"
Then I should see element with id "header"
Then I should see element with xpath "//h1[@class='title']"
```

### Link Verification
```gherkin
Then I should see link with text {string}
Then I should see link containing text {string}
```

**Examples:**
```gherkin
Then I should see link with text "Sign Out"
Then I should see link with text "Forgot Password?"
Then I should see link containing text "Sign"
Then I should see link containing text "Password"
```

---

## Form Actions

### Form Submission
```gherkin
When I submit the form {string}
```

**Examples:**
```gherkin
When I submit the form "#login-form"
When I submit the form ".contact-form"
When I submit the form "form[name='registration']"
```

---

## Browser Actions

### Enter Key Press
```gherkin
When I press Enter in {string}
```

**Examples:**
```gherkin
When I press Enter in "#search-input"
When I press Enter in ".username-field"
When I press Enter in "input[name='query']"
```

### Field Clearing
```gherkin
When I clear {string}
```

**Examples:**
```gherkin
When I clear "#email"
When I clear ".password-field"
When I clear "input[name='username']"
```

---

## Selector Strategies

### CSS Selectors (Recommended)
**Best for:** Most common use cases, fast execution, readable

```gherkin
# Class selector
When I click on ".submit-button"

# ID selector
When I click on "#login-btn"

# Attribute selector
When I click on "button[type='submit']"

# Descendant selector
When I click on ".form .submit-button"

# Pseudo-selector
When I click on ".nav-item:first-child"
```

### ID Selectors
**Best for:** Unique elements, fastest execution

```gherkin
When I click on element with id "login-button"
When I enter "john@example.com" in field with id "email"
Then I should see element with id "success-message"
```

### Name Selectors
**Best for:** Form elements, semantic meaning

```gherkin
When I click on element with name "submit"
When I enter "password123" in field with name "password"
Then I should see element with name "username"
```

### XPath Selectors
**Best for:** Complex element relationships, dynamic content

```gherkin
# Simple XPath
When I click on element with xpath "//button[@type='submit']"

# Complex XPath
When I click on element with xpath "//div[@class='card']//button[contains(text(), 'Add')]"

# XPath with multiple conditions
When I click on element with xpath "//input[@type='email' and @name='username']"
```

### Link Text Selectors
**Best for:** Links with specific text content

```gherkin
# Exact text match
When I click on link with text "Sign In"
Then I should see link with text "Logout"

# Partial text match
When I click on link containing text "Sign"
Then I should see link containing text "Log"
```

---

## Best Practices

### 1. Selector Priority
1. **ID selectors** - Fastest, most reliable
2. **Name selectors** - Good for form elements
3. **CSS selectors** - Flexible, readable
4. **XPath selectors** - For complex scenarios
5. **Link text selectors** - For specific link interactions

### 2. Wait Strategies
```gherkin
# Good: Wait for specific element
When I wait for ".success-message" to be visible
Then I should see "Success" in ".success-message"

# Avoid: Unnecessary time waits
When I wait for "5" seconds
```

### 3. Text Verification
```gherkin
# Good: Specific text verification
Then I should see "Welcome, John!" in ".welcome-message"

# Good: Partial text verification
Then I should see "Welcome" in ".welcome-message"

# Avoid: Too generic
Then I should see "text" in "body"
```

### 4. Error Handling
```gherkin
# Good: Check for absence of error
Then I should not see "Error" in ".alert-danger"
Then I should not see element ".error-message"

# Good: Verify success state
Then I should see "Success" in ".alert-success"
Then I should see element ".success-message"
```

### 5. Form Interactions
```gherkin
# Good: Clear before entering text
When I clear "#email"
When I enter "john@example.com" in "#email"

# Good: Use form submission
When I submit the form "#login-form"

# Good: Use Enter key for search
When I press Enter in "#search-input"
```

---

## Troubleshooting

### Common Issues

#### 1. Element Not Found
**Error:** `Element .selector not found within 30000ms timeout`

**Solutions:**
- Check if selector is correct
- Verify element exists on the page
- Increase timeout if needed
- Use different selector strategy

```gherkin
# Try different selectors
When I click on "#login-btn"  # Instead of ".login-btn"
When I click on element with name "login"  # Instead of CSS
```

#### 2. Text Not Found
**Error:** `Expected to see "text" in .selector, but found: "actual text"`

**Solutions:**
- Check exact text content
- Use partial text matching
- Verify element contains the text

```gherkin
# Use partial matching
Then I should see "Welcome" in ".message"  # Instead of exact "Welcome, John!"
```

#### 3. Timing Issues
**Error:** Element found but interaction fails

**Solutions:**
- Add explicit waits
- Wait for element to be visible
- Check if element is clickable

```gherkin
# Add wait before interaction
When I wait for ".button" to be visible
When I click on ".button"
```

#### 4. XPath Issues
**Error:** Invalid XPath expression

**Solutions:**
- Test XPath in browser dev tools
- Use simpler XPath expressions
- Consider CSS selectors instead

```gherkin
# Simple XPath
When I click on element with xpath "//button[@type='submit']"

# Instead of complex XPath
# When I click on element with xpath "//div[@class='form']//div[@class='button-group']//button[@type='submit' and @class='primary']"
```

### Debug Tips

1. **Use browser dev tools** to test selectors
2. **Add console.log statements** in step definitions
3. **Take screenshots** on failures
4. **Use explicit waits** instead of implicit waits
5. **Verify element states** before interactions

---

## Advanced Usage

### 1. Dynamic Content Handling
```gherkin
# Wait for dynamic content to load
When I wait for ".dynamic-content" to be visible
Then I should see "Loaded" in ".dynamic-content"

# Handle AJAX responses
When I click on ".load-data"
When I wait for ".data-loaded" to be visible
Then I should see "Data loaded successfully" in ".status"
```

### 2. Form Validation Testing
```gherkin
# Test required field validation
When I click on ".submit-button"
Then I should see "This field is required" in ".error-message"

# Test email validation
When I enter "invalid-email" in "#email"
When I click on ".submit-button"
Then I should see "Invalid email format" in ".error-message"
```

### 3. Multi-step Workflows
```gherkin
# Login workflow
Given I navigate to "https://app.example.com/login"
When I enter "john@example.com" in "#email"
When I enter "password123" in "#password"
When I click on "#login-button"
Then I should see the page title contains "Dashboard"
Then I should see "Welcome, John!" in ".welcome-message"

# Search workflow
When I enter "test query" in "#search-input"
When I press Enter in "#search-input"
When I wait for ".search-results" to be visible
Then I should see "Search results" in ".results-header"
```

### 4. Error State Testing
```gherkin
# Test error handling
When I enter "invalid@email" in "#email"
When I enter "wrongpassword" in "#password"
When I click on "#login-button"
Then I should see "Invalid credentials" in ".error-message"
Then I should not see element ".dashboard"
```

### 5. Integration with Zypin Framework
```gherkin
# Use Zypin configuration
# In package.json:
{
  "zypin": {
    "config": {
      "timeout": 30000,
      "browser": "chrome",
      "headless": false
    }
  }
}

# Run with specific configuration
# zypin run --input features/ --browser firefox --timeout 60000
```

---

## Performance Tips

1. **Use specific selectors** - ID and name selectors are fastest
2. **Minimize waits** - Use element visibility waits instead of time waits
3. **Avoid complex XPath** - Use CSS selectors when possible
4. **Group related steps** - Reduce browser context switching
5. **Use parallel execution** - Configure Zypin for parallel test runs

---

## Conclusion

This user manual provides comprehensive coverage of all available step definitions in the Zypin Cucumber framework. For experienced testers, the Quick Reference section provides fast lookup, while the detailed sections offer in-depth guidance for complex scenarios.

Remember to:
- Choose appropriate selectors for your use case
- Use explicit waits for reliable test execution
- Follow best practices for maintainable test code
- Leverage the Zypin framework's configuration options

For additional support or feature requests, refer to the main Zypin documentation or contact the development team.
