#!/usr/bin/env node

/**
 * Main Test Runner for Zypin Step Definitions
 * Simple entry point for running the test suite
 */

const path = require('path');
const { execSync } = require('child_process');

console.log('🧪 Zypin Step Definitions Test Runner\n');

// Get the test script path
const testScriptPath = path.join(__dirname, 'test', 'scripts', 'run-tests.js');

// Check if test script exists
const fs = require('fs');
if (!fs.existsSync(testScriptPath)) {
  console.error(`❌ Test script not found: ${testScriptPath}`);
  process.exit(1);
}

// Run the test script
try {
  console.log('🚀 Starting test execution...\n');
  execSync(`node "${testScriptPath}"`, { stdio: 'inherit' });
  console.log('\n🎉 All tests completed!');
} catch (error) {
  console.error('\n❌ Test execution failed:');
  console.error(error.message);
  process.exit(1);
}
