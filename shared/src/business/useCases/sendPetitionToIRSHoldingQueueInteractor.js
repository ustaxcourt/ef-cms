const { Case } = require('../entities/Case');
const {
  isAuthorized,
  UPDATE_CASE,
} = require('../../authorization/authorizationClientService');

const { UnauthorizedError } = require('../../errors/errors');

/**
 *
 * @param caseId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.sendPetitionToIRSHoldingQueue = async ({
  caseId,
  applicationContext,
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

  const caseEntity = new Case(caseToUpdate);
  caseEntity.sendToIRSHoldingQueue();

  for (let workItem of caseEntity.getWorkItems()) {
    workItem.caseStatus = caseEntity.status;
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
    await applicationContext.getPersistenceGateway().updateWorkItem({
      applicationContext,
      workItemToUpdate: workItem.validate().toRawObject(),
    });
  }

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });

  return { message: 'success' };
};
