const {
  isAuthorized,
  WORKITEM,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { IRS_BATCH_SYSTEM_SECTION } = require('../../entities/WorkQueue');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * getDocumentQCBatchedForUserInteractor
 *
 * @param userId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getDocumentQCBatchedForUserInteractor = async ({
  applicationContext,
  userId,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, WORKITEM)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const workItems = await applicationContext
    .getPersistenceGateway()
    .getDocumentQCBatchedForUser({
      applicationContext,
      userId,
    });

  return workItems.filter(
    workItem =>
      workItem.section === IRS_BATCH_SYSTEM_SECTION &&
      workItem.caseStatus === Case.STATUS_TYPES.batchedForIRS,
  );
};
