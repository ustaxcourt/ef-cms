const {
  reactTemplateGenerator,
} = require('../../utilities/generateHTMLTemplateForPDF/reactTemplateGenerator');
const { Case } = require('../../entities/cases/Case');

exports.sendIrsSuperuserPetitionEmail = async ({
  applicationContext,
  caseEntity,
  docketEntryEntity,
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

  const {
    docketEntryId,
    documentType,
    eventCode,
    filingDate,
    servedAt,
  } = docketEntryEntity;

  privatePractitioners.forEach(practitioner => {
    const representingFormatted = [];
    const { representingPrimary, representingSecondary } = practitioner;

    if (representingPrimary) {
      representingFormatted.push(contactPrimary.name);
    }

    if (representingSecondary && contactSecondary) {
      representingFormatted.push(contactSecondary.name);
    }

    practitioner.representingFormatted = representingFormatted.join(', ');
  });

  const currentDate = applicationContext
    .getUtilities()
    .formatNow('MMMM D, YYYY');

  const filingDateFormatted = applicationContext
    .getUtilities()
    .formatDateString(filingDate, 'MM/DD/YY');

  const docketNumberWithSuffix = `${docketNumber}${docketNumberSuffix || ''}`;
  const formattedMailingDate =
    mailingDate || `Electronically Filed ${filingDateFormatted}`;

  const templateHtml = reactTemplateGenerator({
    componentName: 'PetitionService',
    data: {
      caseDetail: {
        caseTitle: Case.getCaseTitle(caseCaption),
        docketNumber: docketNumberWithSuffix,
        trialLocation: preferredTrialCity || 'No requested place of trial',
      },
      contactPrimary,
      contactSecondary,
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
