const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * setWorkItemAsReadInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.workItemId the id of the work item to set as read
 * @returns {Promise} the promise of the setWorkItemAsRead call
 */
exports.setWorkItemAsReadInteractor = async ({
  applicationContext,
  workItemId,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.GET_READ_MESSAGES)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const workItem = await applicationContext
    .getPersistenceGateway()
    .getWorkItemById({
      applicationContext,
      workItemId,
    });

  const { caseId } = workItem;
  const { documentId } = workItem.document;

  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  const caseEntity = new Case(caseRecord, {
    applicationContext,
  });

  caseEntity
    .getDocumentById({ documentId })
    .getWorkItemById({ workItemId })
    .setAsRead();

  return await Promise.all([
    applicationContext.getPersistenceGateway().setWorkItemAsRead({
      applicationContext,
      userId: user.userId,
      workItemId,
    }),
    applicationContext.getPersistenceGateway().updateCase({
      applicationContext,
      caseToUpdate: caseEntity.validate().toRawObject(),
    }),
  ]);
};
