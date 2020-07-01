/* eslint-disable spellcheck/spell-checker */
const fs = require('fs');

// USAGE EXAMPLE: node createModule.js path1/file1 path2/file2
const targets = [
  'shared/src/business/utilities/htmlGenerator/index.pug',
  'shared/src/business/utilities/htmlGenerator/index.scss',
];

// specify mime-types for supported base64 encodings here.
const BINARY_BASE64 = { png: 'image/png' };

/**
 * Generates a JS file based on name and path of original file.
 * If you change this, you'll need to alter rules to .gitignore,
 * test coverage exclusions, and linter exclusions
 *
 * @param {string} filePath path of original file
 * @returns {string} name of file, but with a JS extension
 */
const asModulePath = filePath => `${filePath}_.js`;

const createModule = filePath => {
  const contents = readFile(filePath);
  const escapedContents = contents.replace(/`/gs, '\\`');
  const theCode = `// This is a generated file, do not edit\nmodule.exports =\n  \`${escapedContents}\`;\n`;
  const outputPath = asModulePath(filePath);
  console.info(outputPath);
  fs.writeFileSync(outputPath, theCode);
};

const readFile = filePath => {
  const base64Ext = Object.keys(BINARY_BASE64).find(extension =>
    filePath.toLowerCase().endsWith(extension),
  );
  const contents = fs.readFileSync(filePath, {
    encoding: base64Ext ? 'base64' : 'utf8',
  });
  const mimeType = BINARY_BASE64[base64Ext];
  return base64Ext ? `data:${mimeType};base64,${contents}` : contents;
};

const files = [...targets, ...process.argv.slice(2)];
files.forEach(createModule);
