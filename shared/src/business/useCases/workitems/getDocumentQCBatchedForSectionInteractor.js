const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { IRS_BATCH_SYSTEM_SECTION } = require('../../entities/WorkQueue');
const { UnauthorizedError } = require('../../../errors/errors');

const { Case } = require('../../entities/cases/Case');

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.section the section to get the document qc
 * @returns {object} the work items in the section document batched inbox
 */
exports.getDocumentQCBatchedForSectionInteractor = async ({
  applicationContext,
  section,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.WORKITEM)) {
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
