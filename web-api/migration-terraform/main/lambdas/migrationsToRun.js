const {
  migrateItems: migration0001,
} = require('./migrations/0001-remove-has-sealed-documents');
const {
  migrateItems: migration0002,
} = require('./migrations/0002-default-sealed-to');

// MODIFY THIS ARRAY TO ADD NEW MIGRATIONS OR REMOVE OLD ONES
const migrationsToRun = [
  { key: '0001-remove-has-sealed-documents.js', script: migration0001 },
  { key: '0002-default-sealed-to.js', script: migration0002 },
];

exports.migrationsToRun = migrationsToRun;
