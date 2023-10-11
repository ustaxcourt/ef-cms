import {
  CaseInventory,
  CustomCaseInventoryReportFilters,
} from '../../../web-api/src/business/useCases/caseInventoryReport/getCustomCaseInventoryReportInteractor';

export type CustomCaseInventoryReportState = {
  totalCases: number;
  cases: CaseInventory[];
  filters: CustomCaseInventoryReportFilters;
  lastIdsOfPages: { receivedAt: number; pk: string }[];
};

export const initialCustomCaseInventoryReportState: CustomCaseInventoryReportState =
  {
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
