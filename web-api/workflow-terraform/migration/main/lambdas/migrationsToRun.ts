const {
  migrateItems: migration0003,
} = require('./migrations/0003-update-trial-session-working-copy-status');
const {
  migrateItems: migration0004a,
} = require('./migrations/0004-remove-closedDate-for-open-cases');
const {
  migrateItems: migration0004b,
} = require('./migrations/0004-set-session-status');
const {
  migrateItems: migration0006,
} = require('./migrations/0006-reformat-sortable-docket-number');
const {
  migrateItems: migration0007,
} = require('./migrations/0007-update-corporate-disclosure-document');
const {
  migrateItems: migration0008,
} = require('./migrations/0008-add-assignee-id-gsi2pk-to-work-item');

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
  {
    key: '0006-reformat-sortable-docket-number.js',
    script: migration0006,
  },
  {
    key: '0007-update-corporate-disclosure-document.ts',
    script: migration0007,
  },
  {
    key: '0008-add-assignee-id-gsi2pk-to-work-item.ts',
    script: migration0008,
  },
];

exports.migrationsToRun = migrationsToRun;
