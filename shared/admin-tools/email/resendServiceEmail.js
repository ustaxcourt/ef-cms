if (!process.argv[2] || !process.argv[3]) {
  console.log('please specify a docketNumber and a docketEntryId');
  console.log('');
  console.log('$ node resendServiceEmail.js [docketNumber] [docketEntryId]');
  process.exit();
}

const createApplicationContext = require('../../../web-api/src/applicationContext');
const {
  INITIAL_DOCUMENT_TYPES,
} = require('../../src/business/entities/EntityConstants');
const {
  reactTemplateGenerator,
} = require('../../src/business/utilities/generateHTMLTemplateForPDF/reactTemplateGenerator');
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

const resendPetitionEmail = async (
  applicationContext,
  { caseEntity, docketEntryEntity },
) => {
  const {
    caseCaption,
    docketNumber,
    docketNumberWithSuffix,
    mailingDate,
    preferredTrialCity,
    privatePractitioners,
  } = caseEntity;
  const { docketEntryId, documentType, eventCode, filingDate, servedAt } =
    docketEntryEntity;

  const currentDate = applicationContext
    .getUtilities()
    .formatNow('MMMM D, YYYY');

  const filingDateFormatted = applicationContext
    .getUtilities()
    .formatDateString(filingDate, 'MM/DD/YY');

  const formattedMailingDate =
    mailingDate || `Electronically Filed ${filingDateFormatted}`;

  const templateHtml = reactTemplateGenerator({
    componentName: 'PetitionService',
    data: {
      caseDetail: {
        caseTitle: Case.getCaseTitle(caseCaption),
        docketNumber,
        docketNumberWithSuffix,
        trialLocation: preferredTrialCity || 'No requested place of trial',
      },
      contactPrimary: caseEntity.petitioners[0],
      contactSecondary: caseEntity.petitioners[1],
      currentDate,
      docketEntryNumber: docketEntryEntity.index,
      documentDetail: {
        docketEntryId,
        documentTitle: documentType,
        eventCode,
        filingDate: filingDateFormatted,
        formattedMailingDate,
        servedAtFormatted: applicationContext
          .getUtilities()
          .formatDateString(servedAt, 'DATE_TIME_TZ'),
      },
      practitioners: privatePractitioners,
      taxCourtLoginUrl: `https://app.${process.env.EFCMS_DOMAIN}`,
    },
  });

  const destination = {
    email: 'service.agent@irs.gov',
    templateData: {
      docketNumber: docketNumberWithSuffix,
      emailContent: templateHtml,
    },
  };

  await applicationContext.getDispatchers().sendBulkTemplatedEmail({
    applicationContext,
    defaultTemplateData: {
      docketNumber: '',
      emailContent: 'A petition has been served.',
    },
    destinations: [destination],
    templateName: process.env.EMAIL_SERVED_PETITION_TEMPLATE,
  });
};

const resendDocumentEmail = async (
  applicationContext,
  { caseEntity, docketEntryEntity },
) => {
  const { caseCaption, docketNumber, docketNumberWithSuffix } = caseEntity;
  const {
    docketEntryId,
    documentTitle,
    documentType,
    eventCode,
    filedBy,
    servedAt,
  } = docketEntryEntity;

  const currentDate = applicationContext
    .getUtilities()
    .formatNow('MMMM D, YYYY');

  const templateHtml = reactTemplateGenerator({
    componentName: 'DocumentService',
    data: {
      caseDetail: {
        caseTitle: Case.getCaseTitle(caseCaption),
        docketNumber,
        docketNumberWithSuffix,
      },
      currentDate,
      docketEntryNumber: docketEntryEntity.index,
      documentDetail: {
        docketEntryId,
        documentTitle: documentTitle || documentType,
        eventCode,
        filedBy,
        servedAtFormatted: applicationContext
          .getUtilities()
          .formatDateString(servedAt, 'DATE_TIME_TZ'),
      },
      name: 'IRS',
      taxCourtLoginUrl: `https://app.${process.env.EFCMS_DOMAIN}`,
    },
  });

  const destination = {
    email: 'service.agent@irs.gov',
    templateData: {
      emailContent: templateHtml,
    },
  };

  await applicationContext.getDispatchers().sendBulkTemplatedEmail({
    applicationContext,
    defaultTemplateData: {
      docketNumber: docketNumberWithSuffix,
      emailContent: '',
    },
    destinations: [destination],
    templateName: process.env.EMAIL_DOCUMENT_SERVED_TEMPLATE,
  });
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
    await resendPetitionEmail(applicationContext, {
      caseEntity,
      docketEntryEntity,
    });
  } else {
    await resendDocumentEmail(applicationContext, {
      caseEntity,
      docketEntryEntity,
    });
    // console.log('this is not a petition!');
  }
};

(async () => {
  const applicationContext = createApplicationContext({});
  await resendServiceEmail(applicationContext, {
    docketEntryId: process.argv[3],
    docketNumber: process.argv[2],
  });
})();
