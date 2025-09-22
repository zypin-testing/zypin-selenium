Feature: Test New Step Definitions
  As a developer
  I want to test all the new step definitions
  So that I can verify they work correctly

  Background:
    Given I navigate to "file:///Users/tien.h.nguyen/Repositories/zypin-testing/zypin-selenium/lib/cucumber-bdd/test/static/test-page.html"

  Scenario: Test Navigation Steps
    When I take a screenshot
    Then I should see the page title is "Zypin Test Page"
    Then I should see the current URL contains "test-page.html"
    When I click on "#page2-link"
    Then I should see the page title is "Page 2 - Zypin Test"
    When I go back to the previous page
    Then I should see the page title is "Zypin Test Page"
    When I go forward to the next page
    Then I should see the page title is "Page 2 - Zypin Test"
    When I reload the page
    Then I should see the page title is "Page 2 - Zypin Test"

  Scenario: Test Information Gathering Steps
    Given I navigate to "file:///Users/tien.h.nguyen/Repositories/zypin-testing/zypin-selenium/lib/cucumber-bdd/test/static/test-page.html"
    When I take a screenshot named "test-screenshot.png"
    Then I should see the page title is "Zypin Test Page"
    Then I should see the current URL contains "test-page.html"
    When I get the text from ".welcome-text"
    Then I should see "Welcome to the Zypin test page" in ".welcome-text"

  Scenario: Test Form Interactions
    Given I navigate to "file:///Users/tien.h.nguyen/Repositories/zypin-testing/zypin-selenium/lib/cucumber-bdd/test/static/test-page.html"
    When I fill the form with:
      | #email    | test@example.com |
      | #password | password123      |
      | #fullname | John Doe         |
    When I select "United States" from "#country"
    When I enter "This is a test message" in "#message"
    Then I should see element "#email"
    Then I should see element "#password"
    Then I should see element "#fullname"
    Then I should see element "#country"
    Then I should see element "#message"

  Scenario: Test JavaScript Execution
    Given I navigate to "file:///Users/tien.h.nguyen/Repositories/zypin-testing/zypin-selenium/lib/cucumber-bdd/test/static/test-page.html"
    When I execute JavaScript "return document.title"
    When I execute JavaScript "return window.location.href"
    When I execute JavaScript "return document.getElementById('main-title').textContent"
    When I click on "#js-test-btn"
    Then I should see element "#js-result"

  Scenario: Test Advanced Selectors
    Given I navigate to "file:///Users/tien.h.nguyen/Repositories/zypin-testing/zypin-selenium/lib/cucumber-bdd/test/static/test-page.html"
    When I click on element with id "submit-btn"
    When I enter "test@example.com" in field with name "email"
    When I enter "password123" in field with id "password"
    Then I should see element with id "main-title"
    Then I should see element with name "email"
    When I click on link with text "Go to Page 2"
    Then I should see the page title is "Page 2 - Zypin Test"
    When I click on link containing text "Back to Main"
    Then I should see the page title is "Zypin Test Page"

  Scenario: Test Dynamic Content
    Given I navigate to "file:///Users/tien.h.nguyen/Repositories/zypin-testing/zypin-selenium/lib/cucumber-bdd/test/static/test-page.html"
    When I wait for "#dynamic-content" to be visible
    Then I should see element "#dynamic-content"
    Then I should see "dynamically added content" in "#dynamic-content"
