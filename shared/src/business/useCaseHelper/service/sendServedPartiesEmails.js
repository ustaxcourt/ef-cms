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
      emailContent: applicationContext.getEmailGenerators().documentService({
        caseCaption: caseEntity.caseCaption,
        docketNumber: caseEntity.docketNumber,
        documentName: documentEntity.documentTitle,
        loginUrl: `https://ui-${process.env.STAGE}.${process.env.EFCMS_DOMAIN}`,
        name: party.name,
        serviceDate: formatDateString(documentEntity.servedAt, 'MMDDYYYY'),
        serviceTime: formatDateString(documentEntity.servedAt, 'TIME'),
      }),
    },
  }));

  if (destinations.length > 0) {
    await applicationContext.getDispatchers().sendBulkTemplatedEmail({
      applicationContext,
      defaultTemplateData: {
        docketNumber: caseEntity.docketNumber,
        emailContent: 'undefined',
      },
      destinations,
      templateName: process.env.EMAIL_SERVED_TEMPLATE,
    });
  }
};
