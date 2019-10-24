const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { IRS_BATCH_SYSTEM_SECTION } = require('../../entities/WorkQueue');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * getDocumentQCBatchedForUserInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.userId the user to get the document qc
 * @returns {object} the work items in the user document batched inbox
 */
exports.getDocumentQCBatchedForUserInteractor = async ({
  applicationContext,
  userId,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.WORKITEM)) {
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
