if (!process.argv[2] || !process.argv[3]) {
  console.log('please specify start and end timestamps in ISO-8601 format');
  console.log('');
  console.log(
    '$ npx ts-node --transpile-only scripts/email/resend-service-email.ts [startTimestamp] [endTimestamp]',
  );
  process.exit();
}

import { Case } from '@shared/business/entities/cases/Case';
import { INITIAL_DOCUMENT_TYPES } from '@shared/business/entities/EntityConstants';
import { createApplicationContext } from '@web-api/applicationContext';
import { sendIrsSuperuserPetitionEmail } from '@shared/business/useCaseHelper/service/sendIrsSuperuserPetitionEmail';
import { sendServedPartiesEmails } from '@shared/business/useCaseHelper/service/sendServedPartiesEmails';

const getCase = async (
  applicationContext: IApplicationContext,
  { docketNumber }: { docketNumber: string },
): Promise<Case> => {
  const caseToBatch = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  return new Case(caseToBatch, { applicationContext });
};

const resendServiceEmail = async (
  applicationContext: IApplicationContext,
  {
    docketEntryId,
    docketNumber,
  }: { docketEntryId: string; docketNumber: string },
): Promise<void> => {
  const caseEntity = await getCase(applicationContext, { docketNumber });
  const docketEntryEntity = caseEntity.getDocketEntryById({ docketEntryId });

  if (
    docketEntryEntity.eventCode === INITIAL_DOCUMENT_TYPES.petition.eventCode
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
      servedParties: { electronic: [] },
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
      endTimestamp: process.argv[3],
      startTimestamp: process.argv[2],
    });
  for (const docketEntryToReServe of docketEntriesToReServe) {
    await resendServiceEmail(applicationContext, docketEntryToReServe);
  }
})();
