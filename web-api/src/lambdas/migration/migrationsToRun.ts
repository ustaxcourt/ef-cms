import { migrateItems as migrate0001 } from './migrations/10252-add-gsis-to-messages';
import { migrateItems as migrate0002 } from './migrations/10252-add-gsis-to-work-items';
import { migrateItems as migrate0003 } from './migrations/10252-remove-work-item-archive-records';

export const migrationsToRun = [
  { key: '10252-add-gsis-to-messages.ts', script: migrate0001 },
  { key: '10252-add-gsis-to-work-items.ts', script: migrate0002 },
  { key: '10252-remove-work-item-archive-records.ts', script: migrate0003 },
];
