const { formatDateString } = require('../../utilities/DateHandler');

exports.sendIrsSuperuserPetitionEmail = async ({
  applicationContext,
  caseEntity,
  documentEntity,
}) => {
  const destination = {
    email: applicationContext.getIrsSuperuserEmail(),
    templateData: {
      caseCaption: caseEntity.caseCaption,
      docketNumber: caseEntity.docketNumber,
      documentName: documentEntity.documentTitle,
      loginUrl: `https://ui-${process.env.STAGE}.${process.env.EFCMS_DOMAIN}`,
      name: 'IRS',
      serviceDate: formatDateString(documentEntity.servedAt, 'MMDDYYYY'),
      serviceTime: formatDateString(documentEntity.servedAt, 'TIME'),
    },
  };

  await applicationContext.getDispatchers().sendBulkTemplatedEmail({
    applicationContext,
    defaultTemplateData: {
      caseCaption: 'undefined',
      docketNumber: 'undefined',
      documentName: 'undefined',
      loginUrl: 'undefined',
      name: 'undefined',
      serviceDate: 'undefined',
      serviceTime: 'undefined',
    },
    destinations: [destination],
    templateName: process.env.EMAIL_SERVED_TEMPLATE,
  });
};
