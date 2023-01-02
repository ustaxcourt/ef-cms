const {
  migrateItems: migration0003,
} = require('./migrations/0003-update-trial-session-working-copy-status');
const {
  migrateItems: migration0004a,
} = require('./migrations/0004-remove-closedDate-for-open-cases');
const {
  migrateItems: migration0004b,
} = require('./migrations/0004-set-session-status');

// MODIFY THIS ARRAY TO ADD NEW MIGRATIONS OR REMOVE OLD ONES
const migrationsToRun = [
  {
    key: '0003-update-trial-session-working-copy-status.js',
    script: migration0003,
  },
  {
    key: '0004-remove-closedDate-for-open-cases.js',
    script: migration0004a,
  },
  {
    key: '0004-set-session-status.js',
    script: migration0004b,
  },
];

exports.migrationsToRun = migrationsToRun;
