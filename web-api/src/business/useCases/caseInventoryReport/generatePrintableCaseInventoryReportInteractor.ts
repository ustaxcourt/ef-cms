import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

export const generatePrintableCaseInventoryReportInteractor = async (
  applicationContext: ServerApplicationContext,
  { associatedJudge, status }: { associatedJudge?: string; status?: string },
  authorizedUser: UnknownAuthUser,
) => {
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
      foundCases: foundCases.length,
    },
  );

  const result = await applicationContext
    .getUseCaseHelpers()
    .generateCaseInventoryReportPdf({
      applicationContext,
      authorizedUser,
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
