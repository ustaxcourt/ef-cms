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

export type CaseInventory = Pick<
  TCase,
  | 'associatedJudge'
  | 'isPaper'
  | 'createdAt'
  | 'procedureType'
  | 'caseType'
  | 'caseTitle'
  | 'docketNumber'
  | 'preferredTrialCity'
  | 'receivedAt'
  | 'status'
  | 'highPriority'
>;

/**
 * getCustomCaseInventoryReportInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.createEndDate the createEndDate filter
 * @param {string} providers.createStartDate the createStartDate filter
 * @param {array} providers.caseStatuses the case statuses array filter
 * @param {array} providers.caseTypes the caseTypes array filter
 * @param {string} providers.filingMethod filing method filter
 * @returns {object} the report data
 */
export const getCustomCaseInventoryReportInteractor = async (
  applicationContext: IApplicationContext,
  params: GetCaseInventoryReportInteractorRequest,
): Promise<{ totalCount: number; foundCases: CaseInventory[] }> => {
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

  return await applicationContext.getPersistenceGateway().getCasesByFilters({
    applicationContext,
    params,
  });
};
