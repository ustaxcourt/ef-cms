import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { UnauthorizedError } from '../../../errors/errors';

/**
 * generatePrintableCaseInventoryReportInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.associatedJudge the judge to filter by
 * @param {string} providers.status the status to filter by
 * @returns {Array} the url of the document
 */
export const generatePrintableCaseInventoryReportInteractor = async (
  applicationContext: IApplicationContext,
  { associatedJudge, status }: { associatedJudge?: string; status?: string },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.CASE_INVENTORY_REPORT)) {
    throw new UnauthorizedError('Unauthorized for case inventory report');
  }

  if (!associatedJudge && !status) {
    throw new Error('Either judge or status must be provided');
  }

  const results = await applicationContext
    .getPersistenceGateway()
    .getCaseInventoryReport({ applicationContext, associatedJudge, status });

  return await applicationContext
    .getUseCaseHelpers()
    .generateCaseInventoryReportPdf({
      applicationContext,
      cases: results.foundCases,
      filters: { associatedJudge, status },
    });
};
