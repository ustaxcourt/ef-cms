import { migrateItems as cleanupUserCaseMappings } from './migrations/cleanup-usercase-mappings';

export const migrationsToRun = [
  { key: 'cleanup-usercase-mappings', script: cleanupUserCaseMappings },
];
