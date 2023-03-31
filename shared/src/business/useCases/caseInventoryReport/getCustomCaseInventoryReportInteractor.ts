import { CaseStatus, CaseType } from '../../entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../../errors/errors';

export type GetCaseInventoryReportInteractorRequest = {
  caseStatuses: CaseStatus[];
  caseTypes: CaseType[];
  createEndDate: string;
  createStartDate: string;
  filingMethod: 'all' | 'electronic' | 'paper';
};

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
export const getCustomCaseInventoryReportInteractor = async (
  applicationContext,
  params: GetCaseInventoryReportInteractorRequest,
) => {
  const authorizedUser = applicationContext.getCurrentUser();
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.CASE_INVENTORY_REPORT)) {
    throw new UnauthorizedError('Unauthorized for case inventory report');
  }

  const {
    caseStatuses,
    caseTypes,
    createEndDate,
    createStartDate,
    filingMethod,
  } = params;
  if (
    !createEndDate ||
    !createStartDate ||
    !filingMethod ||
    !caseStatuses ||
    !caseTypes
  ) {
    throw new Error(
      'Missing required params to run a Custom Case Inventory Report',
    );
  }

  return await applicationContext
    .getPersistenceGateway()
    .getCaseInventoryReport({
      applicationContext,
    });
};
