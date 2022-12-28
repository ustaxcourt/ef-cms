const {
  migrateItems: migration0003,
} = require('./migrations/0003-update-trial-session-working-copy-status');
const {
  migrateItems: migration0004,
} = require('./migrations/0004-remove-closedDate-for-open-cases');

// MODIFY THIS ARRAY TO ADD NEW MIGRATIONS OR REMOVE OLD ONES
const migrationsToRun = [
  {
    key: '0003-update-trial-session-working-copy-status.js',
    script: migration0003,
  },
  {
    key: '0004-remove-closedDate-for-open-cases.js',
    script: migration0004,
  },
];

exports.migrationsToRun = migrationsToRun;
