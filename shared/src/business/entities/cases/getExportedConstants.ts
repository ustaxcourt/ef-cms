import { createHash } from 'crypto';
import { stringifyEverything } from '@shared/business/entities/cases/somFile';
import fs from 'fs/promises';
import path from 'path';

const directoryPath = path.join(__dirname, './');

async function getExportedConstants() {
  try {
    const files = await fs.readdir(directoryPath);

    for (const file of files) {
      const filePath = path.join(directoryPath, file);

      if (file.endsWith('.test.ts')) {
        continue;
      }
      if (file.endsWith('.ts')) {
        const moduleExports = await import(filePath);

        Object.keys(moduleExports).forEach(exportKey => {
          if (moduleExports?.[exportKey]?.VALIDATION_RULES) {
            const validationString = stringifyEverything(
              moduleExports[exportKey].VALIDATION_RULES,
            );
            const hash = createHash('sha256')
              .update(validationString)
              .digest('hex');
            console.log(`Hash for ${exportKey}: ${hash}`);
          }
        });
      }
    }
  } catch (err) {
    console.error('Error reading directory:', err);
  }
}

void getExportedConstants();
