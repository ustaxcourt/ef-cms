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
      endDate: '',
      filingMethod: 'all',
      startDate: '',
    },
    lastIdsOfPages: [{ pk: '', receivedAt: 0 }],
    totalCases: 0,
  };
