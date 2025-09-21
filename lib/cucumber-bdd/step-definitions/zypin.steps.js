/**
 * Unified Step Definitions for Zypin Framework
 * All step definitions in one file with selector-based patterns
 */

const { Given, When, Then } = require('@cucumber/cucumber');
const { By, until } = require('../../webdriver');

// Navigation steps
Given('I navigate to {string}', async function (url) {
  console.log(`🌐 Navigating to: ${url}`);
  await this.driver.get(url);
});

// Click actions
When('I click on {string}', async function (selector) {
  console.log(`🖱️  Clicking on: ${selector}`);
  const element = await this.driver.wait(until.elementLocated(By.css(selector)), this.timeout);
  await element.click();
});

// Text input actions
When('I enter {string} in {string}', async function (text, selector) {
  console.log(`⌨️  Entering "${text}" in: ${selector}`);
  const element = await this.driver.wait(until.elementLocated(By.css(selector)), this.timeout);
  await element.clear();
  await element.sendKeys(text);
});

// Wait actions
When('I wait for {string} to be visible', async function (selector) {
  console.log(`⏳ Waiting for element to be visible: ${selector}`);
  await this.driver.wait(until.elementLocated(By.css(selector)), this.timeout);
});

When('I wait for {string} seconds', async function (seconds) {
  console.log(`⏳ Waiting for ${seconds} seconds`);
  await this.driver.sleep(parseInt(seconds) * 1000);
});

// Verification steps
Then('I should see {string} in {string}', async function (text, selector) {
  console.log(`👀 Verifying text "${text}" in: ${selector}`);
  try {
    const element = await this.driver.wait(until.elementLocated(By.css(selector)), this.timeout);
    const elementText = await element.getText();
    if (!elementText.includes(text)) {
      throw new Error(`Expected to see "${text}" in ${selector}, but found: "${elementText}". Element was found but text didn't match.`);
    }
  } catch (error) {
    if (error.message.includes('Expected to see')) {
      throw error;
    }
    throw new Error(`Element ${selector} not found within ${this.timeout}ms timeout. ${error.message}`);
  }
});

Then('I should not see {string} in {string}', async function (text, selector) {
  console.log(`👀 Verifying text "${text}" is NOT in: ${selector}`);
  try {
    const element = await this.driver.wait(until.elementLocated(By.css(selector)), this.timeout);
    const elementText = await element.getText();
    if (elementText.includes(text)) {
      throw new Error(`Expected NOT to see "${text}" in ${selector}, but found: "${elementText}". Element was found and contained the text.`);
    }
  } catch (error) {
    if (error.message.includes('Expected NOT to see')) {
      throw error;
    }
    throw new Error(`Element ${selector} not found within ${this.timeout}ms timeout. ${error.message}`);
  }
});

Then('I should see the page title contains {string}', async function (expectedTitle) {
  console.log(`📄 Verifying page title contains: ${expectedTitle}`);
  await this.driver.wait(until.titleContains(expectedTitle), this.timeout);
  const actualTitle = await this.driver.getTitle();
  console.log(`📄 Actual page title: ${actualTitle}`);
});

Then('I should see element {string}', async function (selector) {
  console.log(`👀 Verifying element exists: ${selector}`);
  try {
    await this.driver.wait(until.elementLocated(By.css(selector)), this.timeout);
  } catch (error) {
    throw new Error(`Element ${selector} not found within ${this.timeout}ms timeout. ${error.message}`);
  }
});

Then('I should not see element {string}', async function (selector) {
  console.log(`👀 Verifying element does NOT exist: ${selector}`);
  try {
    await this.driver.wait(until.elementLocated(By.css(selector)), 1000);
    throw new Error(`Expected element ${selector} to NOT exist, but it was found within 1 second.`);
  } catch (error) {
    if (error.message.includes('Expected element')) {
      throw error;
    }
    // Element not found - this is what we want
    console.log(`✅ Element ${selector} correctly not found`);
  }
});

// Form submission
When('I submit the form {string}', async function (selector) {
  console.log(`📤 Submitting form: ${selector}`);
  const form = await this.driver.wait(until.elementLocated(By.css(selector)), this.timeout);
  await form.submit();
});

// Browser actions
When('I press Enter in {string}', async function (selector) {
  console.log(`⌨️  Pressing Enter in: ${selector}`);
  const element = await this.driver.wait(until.elementLocated(By.css(selector)), this.timeout);
  await element.sendKeys('\n');
});

When('I clear {string}', async function (selector) {
  console.log(`🧹 Clearing field: ${selector}`);
  const element = await this.driver.wait(until.elementLocated(By.css(selector)), this.timeout);
  await element.clear();
});

// Advanced selectors support
When('I click on element with name {string}', async function (name) {
  console.log(`🖱️  Clicking on element with name: ${name}`);
  const element = await this.driver.wait(until.elementLocated(By.name(name)), this.timeout);
  await element.click();
});

When('I enter {string} in field with name {string}', async function (text, name) {
  console.log(`⌨️  Entering "${text}" in field with name: ${name}`);
  const element = await this.driver.wait(until.elementLocated(By.name(name)), this.timeout);
  await element.clear();
  await element.sendKeys(text);
});

Then('I should see element with name {string}', async function (name) {
  console.log(`👀 Verifying element with name exists: ${name}`);
  await this.driver.wait(until.elementLocated(By.name(name)), this.timeout);
});

// ID selector support
When('I click on element with id {string}', async function (id) {
  console.log(`🖱️  Clicking on element with id: ${id}`);
  const element = await this.driver.wait(until.elementLocated(By.id(id)), this.timeout);
  await element.click();
});

When('I enter {string} in field with id {string}', async function (text, id) {
  console.log(`⌨️  Entering "${text}" in field with id: ${id}`);
  const element = await this.driver.wait(until.elementLocated(By.id(id)), this.timeout);
  await element.clear();
  await element.sendKeys(text);
});

Then('I should see element with id {string}', async function (id) {
  console.log(`👀 Verifying element with id exists: ${id}`);
  await this.driver.wait(until.elementLocated(By.id(id)), this.timeout);
});

// XPath selector support
When('I click on element with xpath {string}', async function (xpath) {
  console.log(`🖱️  Clicking on element with xpath: ${xpath}`);
  const element = await this.driver.wait(until.elementLocated(By.xpath(xpath)), this.timeout);
  await element.click();
});

When('I enter {string} in field with xpath {string}', async function (text, xpath) {
  console.log(`⌨️  Entering "${text}" in field with xpath: ${xpath}`);
  const element = await this.driver.wait(until.elementLocated(By.xpath(xpath)), this.timeout);
  await element.clear();
  await element.sendKeys(text);
});

Then('I should see element with xpath {string}', async function (xpath) {
  console.log(`👀 Verifying element with xpath exists: ${xpath}`);
  await this.driver.wait(until.elementLocated(By.xpath(xpath)), this.timeout);
});

// Link text support
When('I click on link with text {string}', async function (linkText) {
  console.log(`🖱️  Clicking on link with text: ${linkText}`);
  const element = await this.driver.wait(until.elementLocated(By.linkText(linkText)), this.timeout);
  await element.click();
});

Then('I should see link with text {string}', async function (linkText) {
  console.log(`👀 Verifying link with text exists: ${linkText}`);
  await this.driver.wait(until.elementLocated(By.linkText(linkText)), this.timeout);
});

// Partial link text support
When('I click on link containing text {string}', async function (partialLinkText) {
  console.log(`🖱️  Clicking on link containing text: ${partialLinkText}`);
  const element = await this.driver.wait(until.elementLocated(By.partialLinkText(partialLinkText)), this.timeout);
  await element.click();
});

Then('I should see link containing text {string}', async function (partialLinkText) {
  console.log(`👀 Verifying link containing text exists: ${partialLinkText}`);
  await this.driver.wait(until.elementLocated(By.partialLinkText(partialLinkText)), this.timeout);
});