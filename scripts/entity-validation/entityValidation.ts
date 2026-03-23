#!/usr/bin/env -S npx ts-node --transpile-only

import fs from 'fs/promises';
import path from 'path';
import { createValidationIdentifier } from './createValidationIdentifier';
import { entityValidationFunctions } from './entityValidationHelper';
import { getSSMItem, putSSMItem } from '../../shared/admin-tools/aws/ssmHelper';

const SSM_KEY = 'entity-validation-fingerprints-map';
const VALIDATION_REGEX = /validation/i;

// TODO: Replace with dynamic entity discovery from shared/src/business/entities

const ENTITIES_OF_CASE = [
  'Case.ts',
  'DocketEntry.ts',
  'IrsPractitioner.ts',
  'PrivatePractitioner.ts',
  'Correspondence.ts',
];

const ENTITIES_TO_CHECK = [
  'Message.ts',
  'PractitionerDocument.ts', // passing
  'TrialSessionWorkingCopy.ts', // passing
  'TrialSession.ts', // passing
  'User.ts',
  'WorkItem.ts',
  ...ENTITIES_OF_CASE,
];

export async function getEntityIdentifiers(): Promise<string> {
  const validationIdentityMap: Record<string, string> = {};
  const directoryPath = path.join(
    __dirname,
    '../../shared/src/business/entities',
  );
  const files = await fs.readdir(directoryPath, { recursive: true });

  for (const file of files) {
    const fileName = path.basename(file.toString());
    if (!ENTITIES_TO_CHECK.includes(fileName)) {
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

export function detectEntityValidationChange(
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

export async function validateEntitiesWithNewRules(
  changedEntities: string[],
): Promise<string[]> {
  let validationOutput: string[] = [];
  let isEntityOfCase = false;
  const processedEntityNames = new Set<string>();

  for (const entity of changedEntities) {
    const entityName = entity.split('.')[0];
    if (processedEntityNames.has(entityName)) continue;
    processedEntityNames.add(entityName);

    if (ENTITIES_OF_CASE.includes(`${entityName}.ts`)) {
      isEntityOfCase = true;
    } else {
      try {
        const val: string[] = await entityValidationFunctions[entityName]();
        if (val.length > 0) validationOutput = validationOutput.concat(val);
      } catch (error) {
        throw new Error(`Error validating entity ${entityName}: ${error}`);
      }
    }
  }
  if (isEntityOfCase) {
    try {
      const val: string[] = await entityValidationFunctions['Case']();
      if (val.length > 0) validationOutput = validationOutput.concat(val);
    } catch (error) {
      throw new Error(`Error validating entity Case: ${error}`);
    }
  }
  console.log('All changed entities successfully validated!');
  return validationOutput;
}

export async function getCurrentFingerprintFromSSM(): Promise<
  string | undefined
> {
  try {
    return await getSSMItem(SSM_KEY);
  } catch {
    return undefined;
  }
}

export function resolveChangedEntities(
  currFingerprint: string | undefined,
  newFingerprint: string,
  entityValidationRequired: string | undefined,
): string[] {
  if (entityValidationRequired === 'true') {
    return ENTITIES_TO_CHECK;
  }
  return detectEntityValidationChange(
    JSON.parse(currFingerprint ?? '{}'),
    JSON.parse(newFingerprint),
  );
}

export async function runEntityValidation(): Promise<number> {
  const currFingerprint = await getCurrentFingerprintFromSSM();
  const newFingerprint = await getEntityIdentifiers();
  let entityValidationRequired: string | undefined;
  try {
    entityValidationRequired = await getSSMItem('entity-validation-required');
  } catch {
    entityValidationRequired = undefined;
  }

  const changedEntities = resolveChangedEntities(
    currFingerprint,
    newFingerprint,
    entityValidationRequired,
  );

  if (changedEntities.length === 0) {
    console.log('Entity validation fingerprints have not changed.');
    return 0;
  }

  const validationErrors = await validateEntitiesWithNewRules(changedEntities);

  if (validationErrors.length > 0) {
    console.log(validationErrors);
    return validationErrors.length;
  } else {
    console.log(
      'Entity validation fingerprints have changed. Writing new fingerprint to SSM.',
    );
    await putSSMItem(SSM_KEY, newFingerprint);
    return 0;
  }
}
export async function main(): Promise<void> {
  await runEntityValidation()
    .then(returnVal => {
      process.exit(returnVal);
    })
    .catch(err => {
      console.log('Error:', err);
      process.exit(1);
    });
}
