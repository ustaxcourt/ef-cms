import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
export const getCaseInventoryReportInteractor = async (
  applicationContext,
  {
    associatedJudge,
    from,
    pageSize,
    status,
  }: {
    associatedJudge?: string;
    from?: string;
    pageSize?: number;
    status?: string;
  },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.CASE_INVENTORY_REPORT)) {
    throw new UnauthorizedError('Unauthorized for case inventory report');
  }

  if (!associatedJudge && !status) {
    throw new Error('Either judge or status must be provided');
  }

  return await applicationContext
    .getPersistenceGateway()
    .getCaseInventoryReport({
      applicationContext,
      associatedJudge,
      from,
      pageSize,
      status,
    });
};
