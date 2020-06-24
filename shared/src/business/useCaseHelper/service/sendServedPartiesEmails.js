const {
  reactTemplateGenerator,
} = require('../../utilities/generateHTMLTemplateForPDF/reactTemplateGenerator');
const { Case } = require('../../entities/cases/Case');
const { CASE_STATUS_TYPES } = require('../../entities/EntityConstants');

exports.sendServedPartiesEmails = async ({
  applicationContext,
  caseEntity,
  documentEntity,
  servedParties,
}) => {
  const { caseCaption, docketNumber, docketNumberSuffix } = caseEntity;

  const {
    documentId,
    documentTitle,
    documentType,
    eventCode,
    filedBy,
    servedAt,
  } = documentEntity;

  const docketEntry = caseEntity.docketRecord.find(
    entry => entry.documentId === documentId,
  );

  const currentDate = applicationContext
    .getUtilities()
    .formatNow('MMMM D, YYYY');

  //serve every document on IRS superuser if case has been served to the IRS
  if (caseEntity.status !== CASE_STATUS_TYPES.new) {
    servedParties.electronic.push({
      email: applicationContext.getIrsSuperuserEmail(),
      name: 'IRS',
    });
  }

  const destinations = servedParties.electronic.map(party => ({
    email: party.email,
    templateData: {
      emailContent: reactTemplateGenerator({
        componentName: 'DocumentService',
        data: {
          caseDetail: {
            caseTitle: Case.getCaseTitle(caseCaption),
            docketNumber: `${docketNumber}${docketNumberSuffix || ''}`,
          },
          currentDate,
          docketEntryNumber: docketEntry && docketEntry.index,
          documentDetail: {
            documentId,
            documentTitle: documentTitle || documentType,
            eventCode,
            filedBy,
            servedAtFormatted: applicationContext
              .getUtilities()
              .formatDateString(servedAt, 'DATE_TIME_TZ'),
          },
          name: party.name,
          taxCourtLoginUrl: `https://ui-${process.env.STAGE}.${process.env.EFCMS_DOMAIN}`,
        },
      }),
    },
  }));

  if (destinations.length > 0) {
    await applicationContext.getDispatchers().sendBulkTemplatedEmail({
      applicationContext,
      defaultTemplateData: {
        docketNumber: `${caseEntity.docketNumber}${
          caseEntity.docketNumberSuffix || ''
        }`,
        emailContent: '',
      },
      destinations,
      templateName: process.env.EMAIL_DOCUMENT_SERVED_TEMPLATE,
    });
  }
};
