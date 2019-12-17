const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { DocketRecord } = require('../../entities/DocketRecord');
const { omit } = require('lodash');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.entryMetadata the entry metadata
 * @returns {object} the updated case after the documents are added
 */
exports.saveIntermediateDocketEntryInteractor = async ({
  applicationContext,
  entryMetadata,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.DOCKET_ENTRY)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { caseId } = entryMetadata;

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  const caseEntity = new Case(caseToUpdate, { applicationContext });

  const initialDocketEntry = caseEntity.docketRecord.find(
    entry => entry.documentId === entryMetadata.documentId,
  );

  const docketRecordEntry = new DocketRecord({
    ...initialDocketEntry,
    editState: JSON.stringify(entryMetadata),
  });

  caseEntity.updateDocketRecordEntry(omit(docketRecordEntry, 'index'));

  const currentDocument = caseEntity.getDocumentById({
    documentId: entryMetadata.documentId,
  });

  const workItemToPutInProgress = currentDocument.getQCWorkItem();

  if (workItemToPutInProgress && !workItemToPutInProgress.inProgress) {
    const workItemUpdates = [];
    Object.assign(workItemToPutInProgress, {
      inProgress: true,
    });

    const rawWorkItem = workItemToPutInProgress.validate().toRawObject();

    workItemUpdates.push(
      applicationContext.getPersistenceGateway().updateWorkItem({
        applicationContext,
        workItemToUpdate: rawWorkItem,
      }),
    );

    workItemUpdates.push(
      applicationContext.getPersistenceGateway().createUserInboxRecord({
        applicationContext,
        workItem: rawWorkItem,
      }),
    );

    workItemUpdates.push(
      applicationContext.getPersistenceGateway().createSectionInboxRecord({
        applicationContext,
        workItem: rawWorkItem,
      }),
    );
    await Promise.all(workItemUpdates);
  }

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });

  return caseEntity.toRawObject();
};
