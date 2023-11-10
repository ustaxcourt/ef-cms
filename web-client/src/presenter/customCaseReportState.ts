import {
  CaseInventory,
  CustomCaseInventoryReportFilters,
} from '../../../web-api/src/business/useCases/caseInventoryReport/getCustomCaseInventoryReportInteractor';

export type CustomCaseReportState = {
  totalCases: number;
  cases: CaseInventory[];
  filters: CustomCaseInventoryReportFilters;
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
