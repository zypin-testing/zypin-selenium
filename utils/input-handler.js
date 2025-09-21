/**
 * Input handling utility for Zypin Framework templates
 * Provides consistent input file processing across all templates
 * 
 * TODO:
 * - Add support for glob patterns in input
 * - Implement file type validation and filtering
 * - Add recursive directory scanning with depth limits
 * - Support for file exclusion patterns
 * - Add input validation and error reporting
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

/**
 * Input handler class for processing test file inputs
 */
class InputHandler {
  constructor() {
    this.supportedExtensions = {
      'basic-webdriver': ['.js'],
      'cucumber-bdd': ['.feature']
    };
    
    this.excludePatterns = [
      'node_modules',
      '.git',
      '.DS_Store',
      'coverage',
      'screenshots',
      'reports'
    ];
  }

  /**
   * Process input files for a specific template
   * @param {string|Array} inputFiles - Input files or directories
   * @param {string} templateType - Template type
   * @param {Object} options - Processing options
   * @returns {Array<string>} Array of processed file paths
   */
  processInput(inputFiles, templateType, options = {}) {
    console.log(chalk.gray(`🔍 Processing input for template: ${templateType}`));
    
    // Normalize input to array
    const files = Array.isArray(inputFiles) ? inputFiles : [inputFiles];
    
    // Get supported extensions for template
    const extensions = this.supportedExtensions[templateType] || ['.js'];
    
    // Process each input
    const processedFiles = [];
    for (const file of files) {
      const processed = this.processSingleInput(file, extensions, options);
      processedFiles.push(...processed);
    }
    
    // Remove duplicates and sort
    const uniqueFiles = [...new Set(processedFiles)].sort();
    
    console.log(chalk.gray(`✓ Found ${uniqueFiles.length} file(s) to process`));
    
    if (options.verbose && uniqueFiles.length > 0) {
      console.log(chalk.gray(`Files: ${uniqueFiles.join(', ')}`));
    }
    
    return uniqueFiles;
  }

  /**
   * Process a single input (file or directory)
   * @param {string} input - Input file or directory path
   * @param {Array<string>} extensions - Supported file extensions
   * @param {Object} options - Processing options
   * @returns {Array<string>} Array of file paths
   */
  processSingleInput(input, extensions, options = {}) {
    const files = [];
    
    if (!fs.existsSync(input)) {
      console.log(chalk.yellow(`Warning: Input not found: ${input}`));
      return files;
    }
    
    const stat = fs.statSync(input);
    
    if (stat.isFile()) {
      // Single file
      if (this.isValidFile(input, extensions)) {
        files.push(input);
      } else {
        console.log(chalk.yellow(`Warning: Unsupported file type: ${input}`));
      }
    } else if (stat.isDirectory()) {
      // Directory - scan recursively
      const depth = options.maxDepth || 10;
      const dirFiles = this.scanDirectory(input, extensions, depth, options);
      files.push(...dirFiles);
    } else {
      console.log(chalk.yellow(`Warning: Unknown input type: ${input}`));
    }
    
    return files;
  }

  /**
   * Scan directory for valid files
   * @param {string} dir - Directory path
   * @param {Array<string>} extensions - Supported extensions
   * @param {number} maxDepth - Maximum scan depth
   * @param {Object} options - Scan options
   * @returns {Array<string>} Array of file paths
   */
  scanDirectory(dir, extensions, maxDepth, options = {}) {
    const files = [];
    
    if (maxDepth <= 0) {
      return files;
    }
    
    try {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        // Skip excluded patterns
        if (this.shouldExclude(item)) {
          continue;
        }
        
        const itemPath = path.join(dir, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isFile()) {
          if (this.isValidFile(itemPath, extensions)) {
            files.push(itemPath);
          }
        } else if (stat.isDirectory()) {
          // Recursively scan subdirectory
          const subFiles = this.scanDirectory(itemPath, extensions, maxDepth - 1, options);
          files.push(...subFiles);
        }
      }
    } catch (error) {
      console.log(chalk.yellow(`Warning: Could not scan directory ${dir}: ${error.message}`));
    }
    
    return files;
  }

  /**
   * Check if file has valid extension
   * @param {string} filePath - File path
   * @param {Array<string>} extensions - Valid extensions
   * @returns {boolean} True if file is valid
   */
  isValidFile(filePath, extensions) {
    const ext = path.extname(filePath).toLowerCase();
    return extensions.includes(ext);
  }

  /**
   * Check if item should be excluded
   * @param {string} item - Item name
   * @returns {boolean} True if item should be excluded
   */
  shouldExclude(item) {
    return this.excludePatterns.some(pattern => {
      if (pattern.startsWith('.')) {
        return item.startsWith(pattern);
      }
      return item === pattern;
    });
  }

  /**
   * Validate input files exist and are accessible
   * @param {Array<string>} files - Array of file paths
   * @returns {Object} Validation result
   */
  validateFiles(files) {
    const result = {
      valid: [],
      invalid: [],
      total: files.length
    };
    
    for (const file of files) {
      try {
        if (fs.existsSync(file) && fs.statSync(file).isFile()) {
          result.valid.push(file);
        } else {
          result.invalid.push(file);
        }
      } catch (error) {
        result.invalid.push(file);
      }
    }
    
    return result;
  }

  /**
   * Get file statistics
   * @param {Array<string>} files - Array of file paths
   * @returns {Object} File statistics
   */
  getFileStats(files) {
    const stats = {
      total: files.length,
      byExtension: {},
      totalSize: 0,
      averageSize: 0
    };
    
    for (const file of files) {
      try {
        const ext = path.extname(file).toLowerCase();
        const fileStat = fs.statSync(file);
        
        stats.byExtension[ext] = (stats.byExtension[ext] || 0) + 1;
        stats.totalSize += fileStat.size;
      } catch (error) {
        // Skip files that can't be accessed
      }
    }
    
    stats.averageSize = stats.total > 0 ? Math.round(stats.totalSize / stats.total) : 0;
    
    return stats;
  }

  /**
   * Expand glob patterns in input
   * @param {string} pattern - Glob pattern
   * @returns {Array<string>} Array of matching files
   */
  expandGlobPattern(pattern) {
    // Simple glob pattern expansion (can be enhanced with glob library)
    const files = [];
    
    if (pattern.includes('*')) {
      const dir = path.dirname(pattern);
      const basePattern = path.basename(pattern);
      
      if (fs.existsSync(dir)) {
        const items = fs.readdirSync(dir);
        const regex = new RegExp(basePattern.replace(/\*/g, '.*'));
        
        for (const item of items) {
          if (regex.test(item)) {
            files.push(path.join(dir, item));
          }
        }
      }
    } else {
      files.push(pattern);
    }
    
    return files;
  }

  /**
   * Group files by directory
   * @param {Array<string>} files - Array of file paths
   * @returns {Object} Files grouped by directory
   */
  groupFilesByDirectory(files) {
    const groups = {};
    
    for (const file of files) {
      const dir = path.dirname(file);
      if (!groups[dir]) {
        groups[dir] = [];
      }
      groups[dir].push(file);
    }
    
    return groups;
  }

  /**
   * Get relative paths from base directory
   * @param {Array<string>} files - Array of file paths
   * @param {string} baseDir - Base directory
   * @returns {Array<string>} Array of relative paths
   */
  getRelativePaths(files, baseDir = process.cwd()) {
    return files.map(file => path.relative(baseDir, file));
  }

  /**
   * Filter files by pattern
   * @param {Array<string>} files - Array of file paths
   * @param {string} pattern - Filter pattern
   * @returns {Array<string>} Filtered files
   */
  filterFiles(files, pattern) {
    const regex = new RegExp(pattern, 'i');
    return files.filter(file => regex.test(file));
  }

  /**
   * Sort files by various criteria
   * @param {Array<string>} files - Array of file paths
   * @param {string} sortBy - Sort criteria (name, size, date)
   * @returns {Array<string>} Sorted files
   */
  sortFiles(files, sortBy = 'name') {
    const sorted = [...files];
    
    switch (sortBy.toLowerCase()) {
      case 'name':
        return sorted.sort();
      
      case 'size':
        return sorted.sort((a, b) => {
          try {
            const statA = fs.statSync(a);
            const statB = fs.statSync(b);
            return statA.size - statB.size;
          } catch (error) {
            return 0;
          }
        });
      
      case 'date':
        return sorted.sort((a, b) => {
          try {
            const statA = fs.statSync(a);
            const statB = fs.statSync(b);
            return statA.mtime - statB.mtime;
          } catch (error) {
            return 0;
          }
        });
      
      default:
        return sorted;
    }
  }
}

// Export singleton instance
module.exports = new InputHandler();
