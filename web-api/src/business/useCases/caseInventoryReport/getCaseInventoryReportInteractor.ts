import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { UnauthorizedError } from '../../../errors/errors';

/**
 * getCaseInventoryReportInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.associatedJudge the optional judge filter
 * @param {number} providers.from the item index to start from
 * @param {number} providers.pageSize the number of items to retrieve
 * @param {string} providers.status the optional status filter
 * @returns {object} the report data
 */
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
