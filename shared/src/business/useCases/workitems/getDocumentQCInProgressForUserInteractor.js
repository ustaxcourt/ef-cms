const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');
const { WorkItem } = require('../../entities/WorkItem');

/**
 * getDocumentQCInProgressForUserInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.userId the user to get the document qc
 * @returns {object} the work items in the user document in progress box
 */
exports.getDocumentQCInProgressForUserInteractor = async (
  applicationContext,
  { userId },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.WORKITEM)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const workItems = await applicationContext
    .getPersistenceGateway()
    .getDocumentQCInProgressForUser({
      applicationContext,
      userId,
    });

  const filteredWorkItems = applicationContext
    .getUtilities()
    .filterWorkItemsForUser({
      user,
      workItems,
    });

  return WorkItem.validateRawCollection(filteredWorkItems, {
    applicationContext,
  });
};
