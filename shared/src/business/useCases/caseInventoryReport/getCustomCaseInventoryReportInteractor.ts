import { CaseStatus, CaseType } from '../../entities/EntityConstants';
import {
  CustomCaseFilingMethods,
  CustomCaseInventorySearch,
} from '../../entities/customCaseInventorySearch/CustomCaseInventorySearch';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../../errors/errors';

export type CustomCaseInventoryReportFilters = {
  caseStatuses: CaseStatus[];
  caseTypes: CaseType[];
  endDate: string;
  startDate: string;
  filingMethod: CustomCaseFilingMethods;
};

export type GetCaseInventoryReportRequest = CustomCaseInventoryReportFilters & {
  pageSize: number;
  searchAfter: {
    receivedAt: number;
    pk: string;
  };
};

export type GetCaseInventoryReportResponse = {
  foundCases: CaseInventory[];
  lastCaseId: { receivedAt: number; pk: string };
  totalCount: number;
};

export type CaseInventory = Pick<
  RawCase,
  | 'associatedJudge'
  | 'isPaper'
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
 * @param {string} providers.endDate the endDate filter
 * @param {string} providers.startDate the startDate filter
 * @param {array} providers.caseStatuses the case statuses array filter
 * @param {array} providers.caseTypes the caseTypes array filter
 * @param {string} providers.filingMethod filing method filter
 * @returns {object} the report data
 */
export const getCustomCaseInventoryReportInteractor = async (
  applicationContext: IApplicationContext,
  params: GetCaseInventoryReportRequest,
): Promise<GetCaseInventoryReportResponse> => {
  const authorizedUser = applicationContext.getCurrentUser();
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.CASE_INVENTORY_REPORT)) {
    throw new UnauthorizedError('Unauthorized for case inventory report');
  }

  params.caseStatuses = params.caseStatuses || [];
  params.caseTypes = params.caseTypes || [];

  new CustomCaseInventorySearch(params).validate();

  return await applicationContext.getPersistenceGateway().getCasesByFilters({
    applicationContext,
    params,
  });
};
