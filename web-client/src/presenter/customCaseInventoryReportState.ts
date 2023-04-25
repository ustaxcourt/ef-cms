import {
  CaseInventory,
  CustomCaseInventoryReportFilters,
} from '../../../shared/src/business/useCases/caseInventoryReport/getCustomCaseInventoryReportInteractor';

export type CustomCaseInventoryReportState = {
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
      createEndDate: '',
      createStartDate: '',
      filingMethod: 'all',
    },
    totalCases: 0,
  };
