import { createValidationIdentifier } from '@shared/business/entities/cases/createValidationIdentifier';
import fs from 'fs/promises';
import path from 'path';

async function getExportedConstants() {
  const directoryPath = path.join(
    process.cwd(),
    './shared/src/business/entities',
  );
  const files = await fs.readdir(directoryPath, { recursive: true });

  for (const file of files) {
    const filePath = path.join(directoryPath, file);

    if (file.endsWith('.test.ts')) {
      continue;
    }
    if (file.endsWith('.ts')) {
      const moduleExports = await import(filePath);

      Object.keys(moduleExports).forEach(exportKey => {
        console.log();
        if (moduleExports?.[exportKey]?.VALIDATION_RULES) {
          const identifier = createValidationIdentifier(
            moduleExports[exportKey].VALIDATION_RULES,
          );
          console.log(`Hash for ${exportKey}: ${identifier}`);
        }
      });
    }
  }
}

void getExportedConstants();
