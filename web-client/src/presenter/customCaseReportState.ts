import {
  CaseInventory,
  CustomCaseReportFilters,
} from '../../../web-api/src/business/useCases/caseInventoryReport/getCustomCaseReportInteractor';

export type CustomCaseReportState = {
  totalCases: number;
  cases: CaseInventory[];
  filters: CustomCaseReportFilters;
  lastIdsOfPages: { receivedAt: number; pk: string }[];
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
  lastIdsOfPages: [{ pk: '', receivedAt: 0 }],
  totalCases: 0,
};
