import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseInventoryReport } from '@web-api/persistence/postgres/reports/caseSearch/getCaseInventoryReport';
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
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.CASE_INVENTORY_REPORT)) {
    throw new UnauthorizedError('Unauthorized for case inventory report');
  }

  if (!associatedJudge && !status) {
    throw new Error('Either judge or status must be provided');
  }

  return await getCaseInventoryReport({
    associatedJudge,
    page: from, // 10502 TODO
    pageSize,
    status,
  });
};
