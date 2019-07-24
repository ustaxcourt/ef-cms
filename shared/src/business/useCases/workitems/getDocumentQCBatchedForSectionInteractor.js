const {
  isAuthorized,
  WORKITEM,
} = require('../../../authorization/authorizationClientService');
const { IRS_BATCH_SYSTEM_SECTION } = require('../../entities/WorkQueue');
const { UnauthorizedError } = require('../../../errors/errors');

const { Case } = require('../../entities/cases/Case');

/**
 *
 * @param applicationContext
 * @returns {Promise<*|*>}
 */
exports.getDocumentQCBatchedForSectionInteractor = async ({
  applicationContext,
  section,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, WORKITEM)) {
    throw new UnauthorizedError(
      'Unauthorized for getting completed work items',
    );
  }

  const workItems = await applicationContext
    .getPersistenceGateway()
    .getDocumentQCBatchedForSection({
      applicationContext,
      section,
    });

  return workItems.filter(
    workItem =>
      workItem.section === IRS_BATCH_SYSTEM_SECTION &&
      workItem.caseStatus === Case.STATUS_TYPES.batchedForIRS,
  );
};
