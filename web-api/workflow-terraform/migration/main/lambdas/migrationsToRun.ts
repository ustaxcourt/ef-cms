import { migrateItems as migrate0001 } from './migrations/0001-add-associated-judge-id';

export const migrationsToRun = [
  { key: '0001-add-associated-judge-id.ts', script: migrate0001 },
];
