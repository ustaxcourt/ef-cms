if (!process.argv[2] || !process.argv[3]) {
  console.log('please specify start and end timestamps in ISO-8601 format');
  console.log('');
  console.log('$ node resend-service-email.js [startTimestamp] [endTimestamp]');
  process.exit();
}

import { Case } from '../../src/business/entities/cases/Case';
import { INITIAL_DOCUMENT_TYPES } from '../../src/business/entities/EntityConstants';
import { createApplicationContext } from '../../../web-api/src/applicationContext';
import { sendIrsSuperuserPetitionEmail } from '../../src/business/useCaseHelper/service/sendIrsSuperuserPetitionEmail';
import { sendServedPartiesEmails } from '../../src/business/useCaseHelper/service/sendServedPartiesEmails';

const getCase = async (applicationContext, { docketNumber }) => {
  const caseToBatch = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  return new Case(caseToBatch, { applicationContext });
};
const resendServiceEmail = async (
  applicationContext,
  { docketEntryId, docketNumber },
) => {
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
