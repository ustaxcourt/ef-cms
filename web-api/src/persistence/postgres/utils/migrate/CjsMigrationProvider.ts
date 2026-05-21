import * as path from 'path';
import { promises as fs } from 'fs';
import type { Migration, MigrationProvider } from 'kysely/migration';

/**
 * A kysely MigrationProvider that loads migration files via CJS require()
 * instead of the native ESM import() used by FileMigrationProvider.
 *
 * This is necessary because kysely 0.29+'s FileMigrationProvider uses
 * native import(), which bypasses ts-node's CJS transform. As a result,
 * migration files loaded that way cannot use TypeScript path aliases
 * (@shared/, @web-api/) or import .ts files from outside node_modules.
 *
 * By using require(), we stay within the ts-node CJS context (including
 * tsconfig-paths resolution), so migration files can freely import from
 * anywhere in the monorepo using the configured path aliases.
 */
export class CjsMigrationProvider implements MigrationProvider {
  constructor(private readonly migrationFolder: string) {}

  async getMigrations(): Promise<Record<string, Migration>> {
    const files = await fs.readdir(this.migrationFolder);
    const migrations: Record<string, Migration> = {};

    for (const file of files) {
      const ext = path.extname(file);
      if (ext !== '.ts' && ext !== '.js') continue;
      const name = path.basename(file, ext);
      const fullPath = path.join(this.migrationFolder, file);
      const loadedModule = require(fullPath) as Migration & {
        default?: Migration;
      };
      migrations[name] = loadedModule.default ?? loadedModule;
    }

    return migrations;
  }
}
