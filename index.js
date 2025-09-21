/**
 * Standard plugin interface for @zypin/selenium
 * Exports the plugin interface required by @zypin/core
 * 
 * TODO:
 * - Export standard plugin interface (name, version, start, run, health, templates)
 * - Ensure all functions are properly bound and exported
 * - Add plugin metadata and capabilities
 * - Test plugin loading by @zypin/core
 */

const startModule = require('./start.js');
const runModule = require('./run.js');
const healthModule = require('./health.js');

module.exports = {
  name: 'selenium',
  version: '0.1.0',
  description: 'Selenium Grid integration for web testing',
  start: startModule.start,
  run: runModule.run,
  health: healthModule.checkHealth,
  templates: ['basic-webdriver', 'cucumber-bdd']
};
