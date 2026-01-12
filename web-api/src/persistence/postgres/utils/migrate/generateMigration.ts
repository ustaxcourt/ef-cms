import { createISODateString } from '@shared/business/utilities/DateHandler';
import { writeFileSync } from 'fs';

function main() {
  const migrationContents = `import { Kysely } from 'kysely';
  
  export async function up(db: Kysely<any>): Promise<void> {
    // TODO
  }
  
  export async function down(db: Kysely<any>): Promise<void> {
    // TODO
  }
  `;

  const timeStampWithoutMilliseconds =
    createISODateString().replace(/:/g, '_').split('.')[0] + 'Z';

  writeFileSync(
    `${__dirname}/migrations/${timeStampWithoutMilliseconds}-RENAME-ME.ts`,
    migrationContents,
  );
}

void main();
