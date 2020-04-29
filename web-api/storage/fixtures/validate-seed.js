#!/usr/bin/env node

const fs = require('fs');
const { stdin } = process;

const seedPath = uuid =>
  `${__dirname}/s3/noop-documents-local-us-east-1/${uuid}._S3rver_object`;

const uuidMatch = /([-\d]+\.json).*?([-0-9a-f]{30,})/gims;

stdin.setEncoding('utf8');
stdin.on('error', console.error);

const documentIds = {};

stdin.on('data', function (chunk) {
  let match;
  while ((match = uuidMatch.exec(chunk)) !== null) {
    const uuid = match[2];
    documentIds[uuid] = match[1];
  }
});

stdin.on('end', () => {
  if (Object.keys(documentIds).length > 0) {
    console.warn('WARNING: missing s3 seed data files!');
  }
  Object.entries(documentIds).forEach(([docId, seedFile]) => {
    const path = seedPath(docId);
    checkFileExists(path, seedFile);
  });
});

/**
 * @param {string} path to the seedFile which ought to exist
 * @param {string} seedFile the dynamo seed file which referenced it
 */
function checkFileExists(path, seedFile) {
  fs.access(path, fs.F_OK, err => {
    if (err) {
      console.warn(seedFile, ': Could not find ', path);
    }
  });
}
