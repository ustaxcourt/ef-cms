if (!process.argv[2] || !process.argv[3]) {
  console.log('please specify a docketNumber and a docketEntryId');
  console.log('');
  console.log('$ node resend-service-email.js [docketNumber] [docketEntryId]');
  process.exit();
}

const createApplicationContext = require('../../../web-api/src/applicationContext');
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

  console.log(docketEntryEntity.eventCode);
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
  await resendServiceEmail(applicationContext, {
    docketEntryId: process.argv[3],
    docketNumber: process.argv[2],
  });
})();
