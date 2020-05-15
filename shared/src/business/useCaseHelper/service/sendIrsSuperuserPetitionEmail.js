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
    preferredTrialCity,
    privatePractitioners,
  } = applicationContext.getUtilities().setServiceIndicatorsForCase(caseEntity);

  const { documentId, documentType, eventCode, servedAt } = documentEntity;

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

  const templateHtml = reactTemplateGenerator({
    componentName: 'PetitionService',
    data: {
      caseDetail: {
        caseTitle: Case.getCaseTitle(caseCaption),
        docketNumber: `${docketNumber}${docketNumberSuffix || ''}`,
        trialLocation: preferredTrialCity,
      },
      contactPrimary,
      contactSecondary,
      currentDate,
      docketEntryNumber: docketEntry && docketEntry.index,
      documentDetail: {
        documentId,
        documentTitle: documentType,
        eventCode,
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
      emailContent: templateHtml,
    },
  };

  await applicationContext.getDispatchers().sendBulkTemplatedEmail({
    applicationContext,
    defaultTemplateData: {
      emailContent: 'A petition has been served.',
    },
    destinations: [destination],
    templateName: process.env.EMAIL_SERVED_PETITION_TEMPLATE,
  });
};
