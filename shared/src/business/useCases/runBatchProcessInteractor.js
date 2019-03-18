const sanitize = require('sanitize-filename');
const { Case } = require('../entities/Case');
const DocketRecord = require('../entities/DocketRecord');
const { IRS_BATCH_SYSTEM_SECTION } = require('../entities/WorkQueue');
const {
  isAuthorized,
  UPDATE_CASE,
} = require('../../authorization/authorizationClientService');

const { UnauthorizedError } = require('../../errors/errors');

/**
 * runBatchProcess
 *
 * @param caseId
 * @param caseToUpdate
 * @param userId
 * @param applicationContext
 * @returns {*}
 */
exports.runBatchProcess = async ({ applicationContext }) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, UPDATE_CASE)) {
    throw new UnauthorizedError('Unauthorized for send to IRS Holding Queue');
  }

  const workItemsInHoldingQueue = await applicationContext
    .getPersistenceGateway()
    .getWorkItemsBySection({
      applicationContext,
      section: IRS_BATCH_SYSTEM_SECTION,
    });

  let zips = [];
  for (let workItem of workItemsInHoldingQueue) {
    const caseToBatch = await applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId({
        applicationContext,
        caseId: workItem.caseId,
      });

    await applicationContext.getPersistenceGateway().deleteWorkItemFromSection({
      applicationContext,
      section: IRS_BATCH_SYSTEM_SECTION,
      workItemId: workItem.workItemId,
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

    const caseEntity = new Case(caseToBatch)
      .markAsSentToIRS(new Date().toISOString())

      .addDocketRecord(
        // TODO: Remove in the future when we no longer store the batch.zip
        new DocketRecord({
          description: zipName,
          documentId: zipName,
          filingDate: new Date().toISOString(),
        }),
      );

    await applicationContext.getPersistenceGateway().updateCase({
      applicationContext,
      caseToUpdate: caseEntity.validate().toRawObject(),
    });

    zips = zips.concat({
      fileNames,
      s3Ids,
      zipName,
    });
  }

  return {
    processedCases: zips,
  };
};
