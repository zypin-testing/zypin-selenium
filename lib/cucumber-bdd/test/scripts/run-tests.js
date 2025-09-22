#!/usr/bin/env node

/**
 * Test Runner for Zypin Step Definitions
 * Simple execution script for testing new step definitions
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🧪 Starting Zypin Step Definitions Test Suite...\n');

// Get the current directory and test paths
const currentDir = __dirname;
const testDir = path.dirname(currentDir);
const featuresDir = path.join(testDir, 'features');
const cucumberBddDir = path.dirname(testDir);
const stepDefinitionsDir = path.join(cucumberBddDir, 'step-definitions');
const supportDir = path.join(cucumberBddDir, 'support');

// Check if required directories exist
const requiredDirs = [featuresDir, stepDefinitionsDir, supportDir];
for (const dir of requiredDirs) {
  if (!fs.existsSync(dir)) {
    console.error(`❌ Required directory not found: ${dir}`);
    process.exit(1);
  }
}

// Check if feature file exists
const featureFile = path.join(featuresDir, 'step-definitions-test.feature');
if (!fs.existsSync(featureFile)) {
  console.error(`❌ Feature file not found: ${featureFile}`);
  process.exit(1);
}

console.log('✅ All required files and directories found');
console.log(`📁 Features directory: ${featuresDir}`);
console.log(`📁 Step definitions: ${stepDefinitionsDir}`);
console.log(`📁 Support directory: ${supportDir}`);
console.log(`📄 Feature file: ${featureFile}\n`);

// Run the tests
try {
  console.log('🚀 Running Cucumber tests...\n');
  
  const command = `npx cucumber-js "${featureFile}" --require "${stepDefinitionsDir}/**/*.js" --require "${supportDir}/**/*.js" --format progress`;
  
  console.log(`Command: ${command}\n`);
  
  execSync(command, { 
    stdio: 'inherit',
    cwd: cucumberBddDir
  });
  
  console.log('\n✅ Test execution completed successfully!');
  
} catch (error) {
  console.error('\n❌ Test execution failed:');
  console.error(error.message);
  process.exit(1);
}
