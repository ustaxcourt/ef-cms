#!/usr/bin/env node

const fs = require('fs');
const { stdin } = process;

const EXISTING_UUID = '1f1aa3f7-e2e3-43e6-885d-4ce341588c76';

const uuidMatch = /([-\d]+\.json).*?([-0-9a-f]{36})/gims;

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
  Object.entries(documentIds).forEach(checkFilesExist);
});

/**
 * @param {Array} entry to the seedFile which ought to exist
 * @param {string} entry.uuid the documentId's UUID
 */
function checkFilesExist([uuid]) {
  const createFiles = {
    [`${__dirname}/s3/noop-documents-local-us-east-1/${uuid}._S3rver_metadata.json`]: `${__dirname}/s3/noop-documents-local-us-east-1/${EXISTING_UUID}._S3rver_metadata.json`,
    [`${__dirname}/s3/noop-documents-local-us-east-1/${uuid}._S3rver_object`]: `${__dirname}/s3/noop-documents-local-us-east-1/${EXISTING_UUID}._S3rver_object`,
    [`${__dirname}/s3/noop-documents-local-us-east-1/${uuid}._S3rver_object.md5`]: `${__dirname}/s3/noop-documents-local-us-east-1/${EXISTING_UUID}._S3rver_object.md5`,
  };

  Object.entries(createFiles).forEach(([desired, copyFrom]) => {
    fs.access(desired, fs.F_OK, err => {
      if (err) {
        // console.warn(`WARNING: missing s3 seed data files from ${seedFile}!`);
        console.warn(`cp "${copyFrom}" "${desired}"`);
      }
    });
  });
}
