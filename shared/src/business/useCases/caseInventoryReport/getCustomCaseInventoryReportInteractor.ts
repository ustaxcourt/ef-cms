import { CaseStatus, CaseType } from '../../entities/EntityConstants';
import { CustomCaseFilingMethods } from '../../entities/customCaseInventorySearch/CustomCaseInventorySearch';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../../errors/errors';

export type CustomCaseInventoryReportFilters = {
  caseStatuses: CaseStatus[];
  caseTypes: CaseType[];
  createEndDate: string;
  createStartDate: string;
  filingMethod: CustomCaseFilingMethods;
};

export type GetCaseInventoryReportRequest = CustomCaseInventoryReportFilters & {
  pageSize: number;
  searchAfter: number;
};

export type GetCaseInventoryReportResponse = {
  foundCases: CaseInventory[];
  lastCaseId: number;
  totalCount: number;
};

export type CaseInventory = Pick<
  TCase,
  | 'associatedJudge'
  | 'isPaper'
  | 'createdAt'
  | 'procedureType'
  | 'caseCaption'
  | 'caseType'
  | 'docketNumber'
  | 'preferredTrialCity'
  | 'receivedAt'
  | 'status'
  | 'highPriority'
>;

/**
 * getCustomCaseInventoryReportInteractor
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.createEndDate the createEndDate filter
 * @param {string} providers.createStartDate the createStartDate filter
 * @param {array} providers.caseStatuses the case statuses array filter
 * @param {array} providers.caseTypes the caseTypes array filter
 * @param {string} providers.filingMethod filing method filter
 * @returns {object} the report data
 */
export const getCustomCaseInventoryReportInteractor = (
  applicationContext: IApplicationContext,
  params: GetCaseInventoryReportRequest,
): Promise<GetCaseInventoryReportResponse> => {
  const authorizedUser = applicationContext.getCurrentUser();
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.CASE_INVENTORY_REPORT)) {
    throw new UnauthorizedError('Unauthorized for case inventory report');
  }

  params.caseStatuses = params.caseStatuses || [];
  params.caseTypes = params.caseTypes || [];

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

  return applicationContext.getPersistenceGateway().getCasesByFilters({
    applicationContext,
    params,
  });
};
