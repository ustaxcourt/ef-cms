import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseInventoryReport } from '@web-api/persistence/postgres/cases/reports/getCaseInventoryReport';
export const getCaseInventoryReportInteractor = async (
  {
    associatedJudge,
    selectedPage,
    pageSize,
    status,
  }: {
    associatedJudge?: string;
    selectedPage?: string;
    pageSize?: number;
    status?: string;
  },
  authorizedUser: UnknownAuthUser,
): Promise<{ foundCases: RawCase[]; totalCount: number }> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.CASE_INVENTORY_REPORT)) {
    throw new UnauthorizedError('Unauthorized for case inventory report');
  }

  if (!associatedJudge && !status) {
    throw new Error('Either judge or status must be provided');
  }

  return await getCaseInventoryReport({
    associatedJudge,
    page: selectedPage ? Number(selectedPage) : 0,
    pageSize,
    status,
  });
};
