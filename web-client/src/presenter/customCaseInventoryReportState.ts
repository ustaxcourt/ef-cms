import {
  CaseInventory,
  CustomCaseInventoryReportFilters,
} from '../../../shared/src/business/useCases/caseInventoryReport/getCustomCaseInventoryReportInteractor';

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
      endDate: '06/13/2023',
      filingMethod: 'all',
      highPriority: false,
      judges: [],
      preferredTrialCities: [],
      procedureType: 'All',
      startDate: '06/13/2000',
    },
    lastIdsOfPages: [{ pk: '', receivedAt: 0 }],
    totalCases: 0,
  };
