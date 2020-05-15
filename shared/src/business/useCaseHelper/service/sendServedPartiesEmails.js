const {
  reactTemplateGenerator,
} = require('../../utilities/generateHTMLTemplateForPDF/reactTemplateGenerator');
const { formatDateString } = require('../../utilities/DateHandler');

exports.sendServedPartiesEmails = async ({
  applicationContext,
  caseEntity,
  documentEntity,
  servedParties,
}) => {
  const destinations = servedParties.electronic.map(party => ({
    email: party.email,
    templateData: {
      emailContent: reactTemplateGenerator({
        componentName: 'DocumentService',
        data: {
          caseCaption: caseEntity.caseCaption,
          docketNumber: `${caseEntity.docketNumber}${
            caseEntity.docketNumberSuffix || ''
          }`,
          documentName: documentEntity.documentTitle,
          loginUrl: `https://ui-${process.env.STAGE}.${process.env.EFCMS_DOMAIN}`,
          name: party.name,
          serviceDate: formatDateString(documentEntity.servedAt, 'MMDDYYYY'),
          serviceTime: formatDateString(documentEntity.servedAt, 'TIME'),
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
