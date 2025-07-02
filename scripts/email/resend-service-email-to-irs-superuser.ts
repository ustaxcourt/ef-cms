#!/usr/bin/env -S npx ts-node --transpile-only

import { Case } from '@shared/business/entities/cases/Case';
import { INITIAL_DOCUMENT_TYPES } from '@shared/business/entities/EntityConstants';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import {
  type ServerApplicationContext,
  createApplicationContext,
} from '@web-api/applicationContext';
import { sendIrsSuperuserPetitionEmail } from '@web-api/business/useCaseHelper/service/sendIrsSuperuserPetitionEmail';
import { sendServedPartiesEmails } from '@web-api/business/useCaseHelper/service/sendServedPartiesEmails';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';

const scriptConfig: ScriptConfig = {
  description:
    'resend-service-email-to-irs-superuser - Resends service email for all documents filed within the given timeframe',
  environment: {
    env: 'ENV',
    region: 'REGION',
  },
  parameters: {
    endTimestamp: {
      description: 'Timestamp in ISO-8601 format',
      position: 1,
      required: true,
      type: 'string',
    },
    startTimestamp: {
      description: 'Timestamp in ISO-8601 format',
      position: 0,
      required: true,
      type: 'string',
    },
  },
  requireActiveAwsSession: true,
};
const { endTimestamp, startTimestamp } = parseArgsAndEnvVars(scriptConfig) as {
  endTimestamp: string;
  startTimestamp: string;
};

const getCase = async (
  applicationContext: ServerApplicationContext,
  { docketNumber }: { docketNumber: string },
): Promise<Case> => {
  const caseToBatch = await getCaseByDocketNumber({
    applicationContext,
    docketNumber,
  });

  return new Case(caseToBatch, { authorizedUser: undefined });
};

const resendServiceEmail = async (
  applicationContext: ServerApplicationContext,
  {
    docketEntryId,
    docketNumber,
  }: { docketEntryId: string; docketNumber: string },
): Promise<void> => {
  const caseEntity = await getCase(applicationContext, { docketNumber });
  const docketEntryEntity = caseEntity.getDocketEntryById({ docketEntryId });

  if (
    docketEntryEntity!.eventCode === INITIAL_DOCUMENT_TYPES.petition.eventCode
  ) {
    await sendIrsSuperuserPetitionEmail({
      applicationContext,
      caseEntity,
      docketEntryId,
    });
  } else {
    await sendServedPartiesEmails({
      applicationContext,
      caseEntity,
      docketEntryId,
      servedParties: { electronic: [], all: [], paper: [] },
    });
  }
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const applicationContext = createApplicationContext({});
  const docketEntriesToReServe = await applicationContext
    .getPersistenceGateway()
    .getDocketEntriesServedWithinTimeframe({
      applicationContext,
      endTimestamp,
      startTimestamp,
    });
  for (const docketEntryToReServe of docketEntriesToReServe) {
    await resendServiceEmail(applicationContext, docketEntryToReServe);
  }
})();
