import { migrateItems as cleanupUserCaseMappings } from './migrations/cleanup-usercase-mappings';
import { migrateItems as migration0012 } from './migrations/0012-remove-signed-judge-on-spos-spto';
import { migrateItems as migration0013a } from './migrations/0013-consolidated-cases-gsi1pk';
import { migrateItems as migration0013b } from './migrations/0013-default-case-status-history';

export const migrationsToRun = [
  { key: '0012-remove-signed-judge-on-spos-spto', script: migration0012 },
  { key: '0013-consolidated-cases-gsi1pk', script: migration0013a },
  { key: '0013-default-case-status-history', script: migration0013b },
  { key: 'cleanup-usercase-mappings', script: cleanupUserCaseMappings },
];
