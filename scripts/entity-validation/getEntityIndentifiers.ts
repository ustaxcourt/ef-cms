#!/usr/bin/env -S npx ts-node --transpile-only

import fs from 'fs/promises';
import path from 'path';
import { createValidationIdentifier } from 'scripts/entity-validation/createValidationIdentifier';

async function getEntityIdentifiers() {
  const validationIdentityMap = {};

  // for testing purposes, we are hardcoding the entities to check. In the future, we will want to dynamically get all entities in the shared/src/business/entities directory.
  const hardCodedEntitiesToCheck = [
    'cases/Case.ts',
    'DocketEntry.ts',
    'IrsPractitioner.ts',
    'PrivatePractitioner.ts',
    'Correspondence.ts',
    'Message.ts',
    'PractitionerDocument.ts',
    'trialSessions/TrialSessionWorkingCopy.ts',
    'trialSessions/TrialSession.ts',
    'User.ts',
    'WorkItem.ts',
  ];

  const directoryPath = path.join(
    __dirname,
    '../../shared/src/business/entities',
  );
  const files = await fs.readdir(directoryPath, { recursive: true });

  for (const file of files) {
    // console.log(file);
    const filePath = path.join(directoryPath, file);

    if (file.endsWith('.test.ts')) {
      continue;
    }
    // if (file.endsWith('.ts')) { // This is the original line, but we want to only check the hardcoded entities for now.
    if (file.endsWith('.ts') && hardCodedEntitiesToCheck.includes(file)) {
      // console.log('filepath: ', filePath);
      const moduleExports = await import(filePath);
      console.log('module exports:', moduleExports);

      Object.keys(moduleExports).forEach(exportName => {
        const validationRegex = /validation/i;
        const individualExport = moduleExports[exportName];
        Object.keys(individualExport).forEach(key => {
          if (validationRegex.test(key)) {
            // Check if the export contains a property with 'validation' in it. We are looking for VALIDATION_RULES.
            const identifier = createValidationIdentifier(
              individualExport[key],
            );
            validationIdentityMap[`${exportName}.${key}`] = identifier;
          }
        });
      });
    }
  }

  // TODO: this should be a return that is passed into the validationRuleChangeDetection script
  console.log(JSON.stringify(validationIdentityMap, null, 2));
}

void getEntityIdentifiers();
