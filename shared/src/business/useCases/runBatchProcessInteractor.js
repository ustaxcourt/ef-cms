const stream = require('stream');
const s3Zip = require('s3-zip');
const aws = require('aws-sdk');
const sanitize = require('sanitize-filename');

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

  await applicationContext.getPersistenceGateway().zipS3Documents({
    applicationContext,
    fileNames,
    s3Ids,
    zipName,
  });

  return {
    fileNames,
    s3Ids,
    zipName,
  };
};
