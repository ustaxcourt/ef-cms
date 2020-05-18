const {
  reactTemplateGenerator,
} = require('../../utilities/generateHTMLTemplateForPDF/reactTemplateGenerator');
const { Case } = require('../../entities/cases/Case');

exports.sendIrsSuperuserPetitionEmail = async ({
  applicationContext,
  caseEntity,
  documentEntity,
}) => {
  const {
    caseCaption,
    contactPrimary,
    contactSecondary,
    docketNumber,
    docketNumberSuffix,
    mailingDate,
    privatePractitioners,
    trialLocation,
  } = caseEntity;

  const {
    documentId,
    documentTitle,
    eventCode,
    filingDate,
    servedAt,
  } = documentEntity;

  const docketEntry = caseEntity.docketRecord.find(
    entry => entry.documentId === documentId,
  );

  privatePractitioners.forEach(practitioner => {
    const representing = [];
    const { representingPrimary, representingSecondary } = practitioner;

    if (representingPrimary) {
      representing.push(contactPrimary.name);
    }

    if (representingSecondary && contactSecondary) {
      representing.push(contactSecondary.name);
    }

    practitioner.representing = representing.join(', ');
  });

  const currentDate = applicationContext
    .getUtilities()
    .formatNow('MMMM D, YYYY');

  const filingDateFormatted = applicationContext
    .getUtilities()
    .formatDateString(filingDate, 'MM/DD/YY');

  const docketNumberWithSuffix = `${docketNumber}${docketNumberSuffix || ''}`;

  const templateHtml = reactTemplateGenerator({
    componentName: 'PetitionService',
    data: {
      caseDetail: {
        caseTitle: Case.getCaseTitle(caseCaption),
        docketNumber: docketNumberWithSuffix,
        trialLocation: trialLocation || 'No requested place of trial',
      },
      contactPrimary,
      contactSecondary,
      currentDate,
      docketEntryNumber: docketEntry && docketEntry.index,
      documentDetail: {
        documentTitle,
        eventCode,
        filingDate: filingDateFormatted,
        mailingDate,
        servedAtFormatted: applicationContext
          .getUtilities()
          .formatDateString(servedAt, 'DATE_TIME_TZ'),
      },
      practitioners: privatePractitioners,
      taxCourtLoginUrl: `https://ui-${process.env.STAGE}.${process.env.EFCMS_DOMAIN}`,
    },
  });

  const destination = {
    email: applicationContext.getIrsSuperuserEmail(),
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
