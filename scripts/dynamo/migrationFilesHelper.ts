import fs from 'fs';
import path from 'path';

const getFilesInDirectory = dir => {
  const files = fs.readdirSync(dir);
  return files.filter(
    file =>
      !file.endsWith('.test.js') &&
      !file.endsWith('.test.ts') &&
      !file.startsWith('0000'),
  );
};

export const getMigrationFiles = (): string[] => {
  return getFilesInDirectory(
    path.join(__dirname, '../../web-api/src/lambdas/migration/migrations'),
  );
};
