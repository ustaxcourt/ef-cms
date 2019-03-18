const sanitize = require('sanitize-filename');
const { Case } = require('../entities/Case');

/**
 * runBatchProcess
 *
 * @param caseId
 * @param caseToUpdate
 * @param userId
 * @param applicationContext
 * @returns {*}
 */
exports.runBatchProcess = async ({ caseId, applicationContext }) => {
  const caseToBatch = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  const s3Ids = caseToBatch.documents.map(document => document.documentId);
  const fileNames = caseToBatch.documents.map(
    document => `${document.documentType}.pdf`,
  );
  const zipName = sanitize(
    `${caseToBatch.docketNumber}_${caseToBatch.contactPrimary.name.replace(
      /\s/g,
      '_',
    )}.zip`,
  );

  await applicationContext.getPersistenceGateway().zipDocuments({
    applicationContext,
    fileNames,
    s3Ids,
    zipName,
  });

  const stinId = caseToBatch.documents.find(
    document => document.documentType === Case.documentTypes.stin,
  ).documentId;

  await applicationContext.getPersistenceGateway().deleteDocument({
    applicationContext,
    key: stinId,
  });

  return {
    fileNames,
    s3Ids,
    zipName,
  };
};
