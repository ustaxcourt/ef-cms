import {
  CaseStatus,
  CaseType,
} from '@shared/business/entities/EntityConstants';
import {
  CustomCaseFilingMethods,
  CustomCaseProcedureTypes,
  CustomCaseReportSearch,
} from '@shared/business/entities/customCaseReportSearch/CustomCaseReportSearch';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCasesByFilters } from '@web-api/persistence/postgres/cases/reports/getCasesByFilters';

export type CustomCaseReportFilters = {
  caseStatuses: CaseStatus[];
  caseTypes: CaseType[];
  endDate?: string;
  startDate?: string;
  filingMethod: CustomCaseFilingMethods;
  preferredTrialCities: string[];
  procedureType: CustomCaseProcedureTypes;
  judges: string[];
};

export type GetCustomCaseReportRequest = CustomCaseReportFilters & {
  pageSize: number;
  page: number;
};

export type GetCustomCaseReportResponse = {
  foundCases: CaseInventory[];
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
  | 'docketNumberWithSuffix'
  | 'leadDocketNumber'
  | 'preferredTrialCity'
  | 'receivedAt'
  | 'status'
>;

export const getCustomCaseReportInteractor = async (
  params: GetCustomCaseReportRequest,
  authorizedUser: UnknownAuthUser,
): Promise<GetCustomCaseReportResponse> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.CASE_INVENTORY_REPORT)) {
    throw new UnauthorizedError('Unauthorized for case inventory report');
  }

  params.caseStatuses = params.caseStatuses || [];
  params.caseTypes = params.caseTypes || [];
  params.judges = params.judges || [];
  params.preferredTrialCities = params.preferredTrialCities || [];
  params.page = params.page || 0;

  new CustomCaseReportSearch(params).validate();

  return await getCasesByFilters({
    params,
  });
};
