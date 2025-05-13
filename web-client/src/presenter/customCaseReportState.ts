import {
  CaseInventory,
  CustomCaseReportFilters,
} from '@web-api/business/useCases/caseInventoryReport/getCustomCaseReportInteractor';

export type CustomCaseReportState = {
  totalCases: number;
  cases: CaseInventory[];
  filters: CustomCaseReportFilters;
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
  totalCases: 0,
};
