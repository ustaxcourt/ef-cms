const {
  migrateItems: migration0003,
} = require('./migrations/0003-case-has-sealed-documents');
const { migrateItems: migration0004 } = require('./migrations/0004-testing');

// MODIFY THIS ARRAY TO ADD NEW MIGRATIONS OR REMOVE OLD ONES
const migrationsToRun = [
  { key: '0003-case-has-sealed-documents.js', script: migration0003 },
  { key: '0004-testing.js', script: migration0004 },
];

exports.migrationsToRun = migrationsToRun;
