import * as fs from 'fs';
import * as sass from 'sass';

const { css } = sass.compile(
  'shared/src/business/utilities/htmlGenerator/index-main.scss',
);
fs.writeFileSync('shared/src/business/utilities/htmlGenerator/index.scss', css);

// USAGE EXAMPLE: npx ts-node --transpile-only createModule.ts path1/file1 path2/file2
const targets = [
  'shared/src/business/utilities/htmlGenerator/index.pug',
  'shared/src/business/utilities/htmlGenerator/index.scss',
];

// specify mime-types for supported base64 encodings here.
const BINARY_BASE64 = { png: 'image/png' };

// returns the name of original file, but with a JS extension
const asModulePath = (filePath: string): string => `${filePath}_.js`;

const createModule = (filePath: string): void => {
  const contents = readFile(filePath);
  const escapedContents = contents.replace(/`/gs, '\\`');
  const theCode = `// This is a generated file, do not edit\nmodule.exports =\n  \`${escapedContents}\`;\n`;
  const outputPath = asModulePath(filePath);
  console.info(outputPath);
  fs.writeFileSync(outputPath, theCode);
};

const readFile = (filePath: string): string => {
  const base64Ext = Object.keys(BINARY_BASE64).find(extension =>
    filePath.toLowerCase().endsWith(extension),
  );
  const contents = fs.readFileSync(filePath, {
    encoding: base64Ext ? 'base64' : 'utf8',
  });
  return base64Ext
    ? `data:${BINARY_BASE64[base64Ext]};base64,${contents}`
    : contents;
};

const files = [...targets, ...process.argv.slice(2)];
files.forEach(createModule);
