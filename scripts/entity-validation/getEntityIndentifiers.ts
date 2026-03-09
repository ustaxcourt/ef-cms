#!/usr/bin/env -S npx ts-node --transpile-only

import fs from 'fs/promises';
import path from 'path';
import { createValidationIdentifier } from 'scripts/entity-validation/createValidationIdentifier';
import { entityValidationFunctions } from 'scripts/entity-validation/EntityValidationScript';
import { getSSMItem, putSSMItem } from 'shared/admin-tools/aws/ssmHelper';

const SSM_KEY = 'entity-validation-fingerprints-map';
const VALIDATION_REGEX = /validation/i;

// TODO: Replace with dynamic entity discovery from shared/src/business/entities
const ENTITIES_TO_CHECK = [
  // 'cases/Case.ts',
  // 'DocketEntry.ts',
  // 'IrsPractitioner.ts',
  // 'PrivatePractitioner.ts',
  // 'Correspondence.ts',
  'Message.ts',
  'PractitionerDocument.ts',
  'trialSessions/TrialSessionWorkingCopy.ts',
  'trialSessions/TrialSession.ts',
  'User.ts',
  'WorkItem.ts',
];

async function getEntityIdentifiers(): Promise<string> {
  const validationIdentityMap: Record<string, string> = {};
  const directoryPath = path.join(
    __dirname,
    '../../shared/src/business/entities',
  );
  const files = await fs.readdir(directoryPath, { recursive: true });

  for (const file of files) {
    if (
      !file.endsWith('.ts') ||
      file.endsWith('.test.ts') ||
      !ENTITIES_TO_CHECK.includes(file)
    ) {
      continue;
    }

    const moduleExports = await import(path.join(directoryPath, file));

    for (const exportName of Object.keys(moduleExports)) {
      const individualExport = moduleExports[exportName];
      for (const key of Object.keys(individualExport)) {
        if (VALIDATION_REGEX.test(key)) {
          validationIdentityMap[`${exportName}.${key}`] =
            createValidationIdentifier(individualExport[key]);
        }
      }
    }
  }

  return JSON.stringify(validationIdentityMap, null, 2);
}

function detectEntityValidationChange(
  currFingerprint: Record<string, string>,
  newFingerprint: Record<string, string>,
): string[] {
  return Array.from(
    new Set<string>(
      Object.keys(newFingerprint).filter(
        entity =>
          !currFingerprint[entity] ||
          currFingerprint[entity] !== newFingerprint[entity],
      ),
    ),
  );
}

async function validateEntitiesWithNewRules(
  changedEntities: string[],
): Promise<string[]> {
  const validationOutput: string[] = [];
  for (const entity of changedEntities) {
    const entityName = entity.split('.')[0];
    try {
      validationOutput.concat(await entityValidationFunctions[entityName]());
    } catch (error) {
      throw new Error(`Error validating entity ${entityName}: ${error}`);
    }
  }
  console.log('All changed entities successfully validated!');
  return validationOutput;
}

async function getCurrentFingerprintFromSSM(): Promise<string | undefined> {
  try {
    return await getSSMItem(SSM_KEY);
  } catch {
    return undefined;
  }
}

async function main(): Promise<void> {
  const currFingerprint = await getCurrentFingerprintFromSSM();
  const newFingerprint = await getEntityIdentifiers();

  const changedEntities = detectEntityValidationChange(
    JSON.parse(currFingerprint ?? '{}'),
    JSON.parse(newFingerprint),
  );

  // if (!currFingerprint) {
  //   console.log(
  //     'No prior Entity validation fingerprints were found. Attempting to validate all entities...',
  //   );
  //   await validateEntitiesWithNewRules(changedEntities);
  //   console.log('Validation Successful. Writing new fingerprint to SSM.');
  //   await putSSMItem(SSM_KEY, newFingerprint);
  //   return;
  // }

  if (changedEntities.length === 0) {
    console.log('Entity validation fingerprints have not changed.');
    return;
  }

  console.log(await validateEntitiesWithNewRules(changedEntities));
  console.log(
    'Entity validation fingerprints have changed. Writing new fingerprint to SSM.',
  );
  await putSSMItem(SSM_KEY, newFingerprint);
}

void main();
