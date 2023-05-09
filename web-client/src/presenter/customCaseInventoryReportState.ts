import {
  CaseInventory,
  CustomCaseInventoryReportFilters,
} from '../../../shared/src/business/useCases/caseInventoryReport/getCustomCaseInventoryReportInteractor';

export type CustomCaseInventoryReportState = {
  totalCases: number;
  cases: CaseInventory[];
  filters: CustomCaseInventoryReportFilters;
  lastIdsOfPages: number[];
};

export const initialCustomCaseInventoryReportState: CustomCaseInventoryReportState =
  {
    cases: [],
    filters: {
      caseStatuses: [],
      caseTypes: [],
      createEndDate: '',
      createStartDate: '',
      filingMethod: 'all',
    },
    lastIdsOfPages: [0],
    totalCases: 0,
  };
