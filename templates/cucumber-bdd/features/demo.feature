Feature: Example.com Demo
  As a user
  I want to visit example.com
  So that I can verify basic web functionality

  Background:
    Given I navigate to "https://example.com"

  Scenario: Verify example.com homepage
    Given I should see the page title contains "Example Domain"
    And I should see element "h1"
    When I click on "h1"
    Then I should see element "h1"

  Scenario: Check page content
    Given I should see element "p"
    And I should see element "a[href='https://www.iana.org/domains/example']"
    When I click on "a[href='https://www.iana.org/domains/example']"
    Then I should see the page title contains "Example Domain"
