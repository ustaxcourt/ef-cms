import { readdirSync, statSync } from 'fs';
import * as path from 'path';
import { env, memoryUsage } from 'process';

function getDirectorySize(dirPath: string): number {
  let totalSize = 0;

  const entries = readdirSync(dirPath, {
    recursive: true,
    withFileTypes: true,
  });

  for (const entry of entries) {
    if (entry.isFile()) {
      const fullPath = path.join(entry.parentPath, entry.name);
      const stat = statSync(fullPath, { throwIfNoEntry: false });
      totalSize += stat?.size || 0;
    }
  }

  return totalSize;
}

export function logLambdaStats(message?: string) {
  const memoryUsedMB = memoryUsage.rss() / (1024 * 1024);
  const memoryAllocatedMB = parseInt(
    env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE || '0',
  );

  const tmpUsedMB = getDirectorySize('/tmp') / 1024 / 1024;

  // Log stats
  console.log(`
    ${message}
    PDF Investigation: Lambda Runtime Stats:
  - Memory Used: ${memoryUsedMB.toFixed(2)} MB / ${memoryAllocatedMB} MB
  - Ephemeral Storage: ${tmpUsedMB} / 512 MB
  `);
}
