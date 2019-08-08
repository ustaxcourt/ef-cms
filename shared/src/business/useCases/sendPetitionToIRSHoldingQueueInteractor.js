const {
  isAuthorized,
  UPDATE_CASE,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { NotFoundError, UnauthorizedError } = require('../../errors/errors');

/**
 *
 * @param caseId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.sendPetitionToIRSHoldingQueueInteractor = async ({
  applicationContext,
  caseId,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, UPDATE_CASE)) {
    throw new UnauthorizedError('Unauthorized for update case');
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  if (!caseToUpdate) {
    throw new NotFoundError(`Case ${caseId} was not found.`);
  }

  const caseEntity = new Case(caseToUpdate);
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
        name: user.name,
        userId: user.userId,
        userRole: user.role,
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
    caseToUpdate: caseEntity.validate().toRawObject(),
  });
};
