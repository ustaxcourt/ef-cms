import { migrateItems as migrate0001 } from './migrations/0001-add-associated-judge-id';
import { migrateItems as migrate0002 } from './migrations/0002-jimbo-likes-cheese';

export const migrationsToRun = [
  { key: '0001-add-associated-judge-id.ts', script: migrate0001 },
  { key: '0002-jimbo-likes-cheese.ts', script: migrate0002 },
];
