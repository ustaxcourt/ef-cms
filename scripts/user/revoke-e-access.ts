#!/usr/bin/env -S npx ts-node --transpile-only

import { Case } from '@shared/business/entities/cases/Case';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getUniqueId } from '@shared/sharedAppContext';
import { upsertCases } from '@web-api/persistence/postgres/cases/upsertCases';
import { disassociateUsersFromCases } from '@web-api/persistence/postgres/cases/userOnCase/disassociateUsersFromCases';

const scriptConfig: ScriptConfig = {
  description:
    'revoke-e-access - Switches the provided petitioner to paper service in the provided case.',
  environment: {
    dynamoDbTableName: 'DYNAMODB_TABLE_NAME',
    env: 'ENV',
  },
  parameters: {
    docketNumber: {
      position: 1,
      required: true,
      type: 'string',
    },
    userId: {
      position: 0,
      required: true,
      type: 'string',
    },
  },
  requireActiveAwsSession: true,
};
const { docketNumber, userId } = parseArgsAndEnvVars(scriptConfig) as {
  docketNumber: string;
  userId: string;
};

// TODO: 10495 - this script seems similar to the removePetitionerEmailInteractor; do we need it?

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const rawCase = await getCaseByDocketNumber({
    docketNumber,
  });
  if (!rawCase.docketNumber) {
    console.error(`Error: Unable to find case ${docketNumber}.`);
    process.exit(1);
  }

  const offendingPetitioner = rawCase.petitioners.find(
    p => p.contactId === userId,
  );
  if (!offendingPetitioner) {
    console.error(
      `Error: Unable to find petitioner with id ${userId} in case ${docketNumber}.`,
    );
    process.exit(1);
  }

  offendingPetitioner.contactId = getUniqueId();
  offendingPetitioner.serviceIndicator = 'Paper';
  delete offendingPetitioner.email;
  const caseToUpdate = new Case(rawCase, { authorizedUser: undefined })
    .validate()
    .toRawObject();

  await upsertCases([caseToUpdate]);

  await disassociateUsersFromCases([{ docketNumber, userId }]);

  console.log(
    `Electronic access to case ${docketNumber} has been revoked for ${offendingPetitioner.name}.`,
  );
})();
