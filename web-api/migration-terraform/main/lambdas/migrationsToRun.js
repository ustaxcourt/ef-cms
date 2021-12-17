const {
  migrateItems: migration0003,
} = require('./migrations/0003-case-has-sealed-documents');

// MODIFY THIS ARRAY TO ADD NEW MIGRATIONS OR REMOVE OLD ONES
const migrationsToRun = [
  { key: '0003-case-has-sealed-documents.js', script: migration0003 },
];

exports.migrationsToRun = migrationsToRun;
