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

  applicationContext.logger.info(
    'generatePrintableCaseInventoryReportInteractor - authorized',
  );
  const { foundCases } = await applicationContext
    .getPersistenceGateway()
    .getCaseInventoryReport({ applicationContext, associatedJudge, status });

  applicationContext.logger.info(
    'generatePrintableCaseInventoryReportInteractor - fetched cases',
    {
      foundCases: foundCases?.length,
    },
  );

  const result = await applicationContext
    .getUseCaseHelpers()
    .generateCaseInventoryReportPdf({
      applicationContext,
      cases: foundCases,
      filters: { associatedJudge, status },
    });

  applicationContext.logger.info(
    'generatePrintableCaseInventoryReportInteractor - built pdf',
    {
      result,
    },
  );

  return result;
};
