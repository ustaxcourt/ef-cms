import { migrateItems as migration0003 } from './migrations/0003-update-trial-session-working-copy-status';
import { migrateItems as migration0004a } from './migrations/0004-remove-closedDate-for-open-cases';
import { migrateItems as migration0004b } from './migrations/0004-set-session-status';
import { migrateItems as migration0006 } from './migrations/0006-reformat-sortable-docket-number';
import { migrateItems as migration0007 } from './migrations/0007-update-corporate-disclosure-document';
import { migrateItems as migration0008 } from './migrations/0008-add-assignee-id-gsi2pk-to-work-item';

// MODIFY THIS ARRAY TO ADD NEW MIGRATIONS OR REMOVE OLD ONES
export const migrationsToRun = [
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
