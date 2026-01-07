#!/usr/bin/env node

import { readFileSync, existsSync, copyFileSync } from 'fs';
import { join } from 'path';

// Read the docketEntries.ts file
const docketEntriesPath =
  'web-api/src/persistence/postgres/utils/seed/fixtures/docketEntries.ts';
const docketEntriesContent = readFileSync(docketEntriesPath, 'utf8');

// Extract all docketEntryId values using regex
const docketEntryIdRegex = /docketEntryId:\s*'([a-f0-9-]+)'/g;
const docketEntryIds = [];
let match;
while ((match = docketEntryIdRegex.exec(docketEntriesContent)) !== null) {
  docketEntryIds.push(match[1]);
}

// Create a set of unique IDs
const uniqueIds = new Set(docketEntryIds);

// Source ID (alternative source for missing IDs)
const alternativeSourceId = '26c93d0e-2568-468f-b117-2af9b17e475b';

// Target directory
const targetDir = 'web-api/storage/fixtures/s3/noop-documents-local-us-east-1';

// Source files template
const sourceFiles = [
  '._S3rver_metadata.json',
  '._S3rver_object',
  '._S3rver_object.md5',
];

// Function to check if files exist for an ID
function filesExist(id) {
  const metadataFile = join(targetDir, `${id}._S3rver_metadata.json`);
  return existsSync(metadataFile);
}

// Function to clone files
function cloneFiles(sourceId, targetId) {
  sourceFiles.forEach(suffix => {
    const sourceFile = `${sourceId}${suffix}`;
    const targetFile = `${targetId}${suffix}`;
    const sourcePath = join(targetDir, sourceFile);
    const targetPath = join(targetDir, targetFile);

    // Check if source file exists
    if (!existsSync(sourcePath)) {
      console.error(`Source file not found: ${sourcePath}`);
      return;
    }

    // Copy the file
    copyFileSync(sourcePath, targetPath);
    console.log(`Copied: ${sourceFile} -> ${targetFile}`);
  });
}

// Process each ID
let clonedCount = 0;
let skippedCount = 0;

uniqueIds.forEach(id => {
  // Skip if it's the alternative source ID itself
  if (id === alternativeSourceId) {
    return;
  }

  if (filesExist(id)) {
    // Files already exist, skip
    skippedCount++;
    return;
  }

  // Files don't exist, clone from alternative source
  cloneFiles(alternativeSourceId, id);
  clonedCount++;
});

console.log(`\nCompleted!`);
console.log(`Processed ${uniqueIds.size} unique IDs.`);
console.log(
  `Cloned from alternative source (${alternativeSourceId}): ${clonedCount} IDs`,
);
console.log(`Skipped (already exist): ${skippedCount} IDs`);
