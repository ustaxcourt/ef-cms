import {
  ClerkDashboardStats,
  getClerkDashboardStats,
} from '@web-api/persistence/postgres/cases/reports/getClerkDashboardStats';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { InvalidRequest, UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

export type GetClerkDashboardStatsRequest = {
  year?: number;
};

export const getClerkDashboardStatsInteractor = async (
  params: GetClerkDashboardStatsRequest,
  authorizedUser: UnknownAuthUser,
): Promise<ClerkDashboardStats> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.CASE_INVENTORY_REPORT)) {
    throw new UnauthorizedError('Unauthorized for clerk dashboard stats');
  }

  if (params.year !== undefined && !Number.isFinite(params.year)) {
    throw new InvalidRequest('Invalid year parameter');
  }

  return await getClerkDashboardStats({ year: params.year });
};
