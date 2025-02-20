#!/usr/bin/env -S npx ts-node --transpile-only

import fs from 'fs';
import path from 'path';

const PATH_TO_MIGRATIONS =
  'web-api/src/persistence/postgres/utils/migrate/migrations';

function getMigrationFiles(cwd: string): string[] {
  const migrationsDir = `${cwd}/${PATH_TO_MIGRATIONS}`;
  try {
    // Read the directory and filter to include only files.
    const items = fs.readdirSync(migrationsDir);
    return items
      .filter(item => {
        const itemPath = path.join(migrationsDir, item);
        return fs.statSync(itemPath).isFile();
      })
      .sort();
  } catch (error) {
    console.error(
      `Error reading migrations directory at ${migrationsDir}:`,
      error,
    );
    process.exit(1);
  }
}

const currentDirPath = './currentBranch';
const targetDirPath = './targetBranch';

const currentBranchMigrationFiles = getMigrationFiles(currentDirPath);
const targetBranchMigrationFiles = getMigrationFiles(targetDirPath);
const numFilesToCheck = Math.min(
  currentBranchMigrationFiles.length,
  targetBranchMigrationFiles.length,
);

for (let i = 0; i < numFilesToCheck; i++) {
  if (currentBranchMigrationFiles[i] !== targetBranchMigrationFiles[i]) {
    console.log(
      `\nMigrations do not match at index ${i}: current branch has ${currentBranchMigrationFiles[i]} but targetBranch has ${targetBranchMigrationFiles[i]}`,
    );
    process.exit(1);
  }
}
process.exit(0);
