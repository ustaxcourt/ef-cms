import { migrateItems as migrate0002 } from './migrations/0002-change-employer-to-practice-type';

export const migrationsToRun = [
  { key: '0002-change-employer-to-practice-type.ts', script: migrate0002 },
];
