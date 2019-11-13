const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * generatePrintablePendingReportInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.judge the optional judge filter
 * @param {string} providers.caseId the optional caseId filter
 * @returns {Array} the url of the document
 */
exports.generatePrintablePendingReportInteractor = async ({
  applicationContext,
  caseId,
  judge,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.PENDING_ITEMS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const pendingItems = await applicationContext
    .getUseCaseHelpers()
    .fetchPendingItems({ applicationContext, caseId, judge });

  return await applicationContext
    .getUseCaseHelpers()
    .generatePendingReportPdf({ applicationContext, pendingItems });
};
