import { migrateItems as migration0012 } from './migrations/0012-remove-signed-judge-on-spos-spto';

export const migrationsToRun = [
  { key: '0012-remove-signed-judge-on-spos-spto', script: migration0012 },
];
