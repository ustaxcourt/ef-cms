import {
  CaseInventory,
  CustomCaseInventoryReportFilters,
} from '../../../shared/src/business/useCases/caseInventoryReport/getCustomCaseInventoryReportInteractor';

export type CustomCaseInventoryReportState = {
  pageNumber: number;
  totalCases: number;
  cases: CaseInventory[];
  filters: CustomCaseInventoryReportFilters;
};

export const initialCustomCaseInventoryReportState: CustomCaseInventoryReportState =
  {
    cases: [],
    filters: {
      caseStatuses: [],
      caseTypes: [],
      createEndDate: '2024-03-01T00:00:00.000Z',
      createStartDate: '2018-03-01T00:00:00.000Z',
      filingMethod: 'electronic',
    },
    pageNumber: 0,
    totalCases: 0,
  };
