const {
  isAuthorized,
  UPDATE_CASE,
} = require('../../authorization/authorizationClientService');
const { Case, STATUS_TYPES } = require('../entities/Case');
const { NotFoundError, UnauthorizedError } = require('../../errors/errors');

/**
 *
 * @param caseId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.sendPetitionToIRSHoldingQueue = async ({
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

  for (let workItem of caseEntity.getWorkItems()) {
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
    workItem.setStatus(STATUS_TYPES.batchedForIRS);

    await applicationContext.getPersistenceGateway().updateWorkItem({
      applicationContext,
      workItemToUpdate: workItem.validate().toRawObject(),
    });
  }

  return await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });
};
