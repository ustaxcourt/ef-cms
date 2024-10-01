import { createValidationIdentifier } from '@shared/business/entities/cases/createValidationIdentifier';
import fs from 'fs/promises';
import path from 'path';

async function getEntityIdentifiers() {
  let entitiesFound = 0;
  const validationIdentityMap = new Map<string, string>();
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

      Object.keys(moduleExports).forEach(exportName => {
        const validationRegex = /validation/i;
        const individualExport = moduleExports[exportName];
        Object.keys(individualExport).forEach(key => {
          if (validationRegex.test(key)) {
            // Check if the export contains a property with 'validation' in it. We are looking for VALIDATION_RULES.
            const identifier = createValidationIdentifier(
              individualExport[key],
            );
            entitiesFound++;
            validationIdentityMap.set(`${exportName}.${key}`, identifier);
          }
        });
      });
    }
  }
  console.log(validationIdentityMap);
  console.log(`Found ${entitiesFound} entities with validation rules.`);
}

void getEntityIdentifiers();
