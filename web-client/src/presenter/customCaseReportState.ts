import {
  CaseInventory,
  CustomCaseReportFilters,
  CustomCaseReportSearchAfter,
} from '@web-api/business/useCases/caseInventoryReport/getCustomCaseReportInteractor';

export type CustomCaseReportState = {
  totalCases: number;
  cases: CaseInventory[];
  filters: CustomCaseReportFilters;
  lastIdsOfPages: CustomCaseReportSearchAfter[];
};

export const initialCustomCaseReportState: CustomCaseReportState = {
  cases: [],
  filters: {
    caseStatuses: [],
    caseTypes: [],
    endDate: '',
    filingMethod: 'all',
    highPriority: false,
    judges: [],
    preferredTrialCities: [],
    procedureType: 'All',
    startDate: '',
  },
  lastIdsOfPages: [{ pk: null, receivedAt: null }],
  totalCases: 0,
};
