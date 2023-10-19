import { migrateItems as migration0012 } from './migrations/0012-remove-signed-judge-on-spos-spto';
import { migrateItems as migration0013 } from './migrations/0013-default-case-status-history';

export const migrationsToRun = [
  { key: '0012-remove-signed-judge-on-spos-spto', script: migration0012 },
  { key: '0013-default-case-status-history', script: migration0013 },
];
