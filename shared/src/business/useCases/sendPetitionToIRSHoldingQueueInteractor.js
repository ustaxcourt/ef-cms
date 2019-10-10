const {
  isAuthorized,
  UPDATE_CASE,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { NotFoundError, UnauthorizedError } = require('../../errors/errors');

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to send to the IRS holding queue
 * @returns {Promise<*>} the promise of the updateCase call
 */
exports.sendPetitionToIRSHoldingQueueInteractor = async ({
  applicationContext,
  caseId,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, UPDATE_CASE)) {
    throw new UnauthorizedError('Unauthorized for update case');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  if (!caseToUpdate) {
    throw new NotFoundError(`Case ${caseId} was not found.`);
  }

  const caseEntity = new Case(caseToUpdate, { applicationContext });
  caseEntity.sendToIRSHoldingQueue();

  const processWorkItem = async workItem => {
    // when a work item is processed in this manner, is it necessary
    // that each of the following steps be done sequentially?
    // could further unwind these serial promises...
    if (workItem.isInitializeCase) {
      await applicationContext.getPersistenceGateway().deleteWorkItemFromInbox({
        applicationContext,
        workItem: workItem.validate().toRawObject(),
      });

      workItem.assignToIRSBatchSystem({
        applicationContext,
        name: user.name,
        userId: user.userId,
        userSection: user.section,
      });

      await applicationContext.getPersistenceGateway().putWorkItemInOutbox({
        applicationContext,
        workItem: workItem.validate().toRawObject(),
      });

      await applicationContext
        .getPersistenceGateway()
        .addWorkItemToSectionInbox({
          applicationContext,
          workItem: workItem.validate().toRawObject(),
        });
    }
    workItem.setStatus(Case.STATUS_TYPES.batchedForIRS);

    await applicationContext.getPersistenceGateway().updateWorkItem({
      applicationContext,
      workItemToUpdate: workItem.validate().toRawObject(),
    });
  };

  await Promise.all(caseEntity.getWorkItems().map(processWorkItem));

  return await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity
      .updateCaseTitleDocketRecord()
      .updateDocketNumberRecord()
      .validate()
      .toRawObject(),
  });
};
