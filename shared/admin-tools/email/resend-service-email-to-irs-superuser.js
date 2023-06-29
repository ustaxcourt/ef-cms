if (!process.argv[2] || !process.argv[3]) {
  console.log('please specify start and end timestamps in ISO-8601 format');
  console.log('');
  console.log('$ node resend-service-email.js [startTimestamp] [endTimestamp]');
  process.exit();
}

const {
  createApplicationContext,
} = require('../../../web-api/src/applicationContext');
const {
  INITIAL_DOCUMENT_TYPES,
} = require('../../src/business/entities/EntityConstants');
const {
  sendIrsSuperuserPetitionEmail,
} = require('../../src/business/useCaseHelper/service/sendIrsSuperuserPetitionEmail');
const {
  sendServedPartiesEmails,
} = require('../../src/business/useCaseHelper/service/sendServedPartiesEmails');
const { Case } = require('../../src/business/entities/cases/Case');

const getDocketEntriesServedWithinTimeframe = async (
  applicationContext,
  { endTimestamp, startTimestamp },
) => {
  const docketEntriesServedWithinTimeframe = await applicationContext
    .getPersistenceGateway()
    .getDocketEntriesServedWithinTimeframe({
      applicationContext,
      endTimestamp,
      startTimestamp,
    });

  return docketEntriesServedWithinTimeframe;
};
const getCase = async (applicationContext, { docketNumber }) => {
  const caseToBatch = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const caseEntity = new Case(caseToBatch, { applicationContext });
  return caseEntity;
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
  const docketEntriesToReServe = await getDocketEntriesServedWithinTimeframe(
    applicationContext,
    {
      endTimestamp: process.argv[3],
      startTimestamp: process.argv[2],
    },
  );
  for (const docketEntryToReServe of docketEntriesToReServe) {
    await resendServiceEmail(applicationContext, docketEntryToReServe);
  }
})();
