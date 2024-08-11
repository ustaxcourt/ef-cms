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
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

export type CustomCaseReportFilters = {
  caseStatuses: CaseStatus[];
  caseTypes: CaseType[];
  endDate?: string;
  startDate?: string;
  filingMethod: CustomCaseFilingMethods;
  preferredTrialCities: string[];
  highPriority?: boolean;
  procedureType: CustomCaseProcedureTypes;
  judges: string[];
};

export type GetCustomCaseReportRequest = CustomCaseReportFilters & {
  pageSize: number;
  searchAfter: CustomCaseReportSearchAfter;
};

export type GetCustomCaseReportResponse = {
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
  | 'leadDocketNumber'
  | 'preferredTrialCity'
  | 'receivedAt'
  | 'status'
  | 'highPriority'
>;

export type CustomCaseReportSearchAfter = {
  pk: string | null;
  receivedAt: number | null;
};

export const getCustomCaseReportInteractor = async (
  applicationContext: ServerApplicationContext,
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
  params.searchAfter = params.searchAfter || {
    pk: null,
    receivedAt: null,
  };

  new CustomCaseReportSearch(params).validate();

  return await applicationContext.getPersistenceGateway().getCasesByFilters({
    applicationContext,
    params,
  });
};
