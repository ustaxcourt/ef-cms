import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';

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
