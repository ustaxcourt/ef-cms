import { state } from 'cerebral';

export const customCaseInventoryReportHelper = get => {
  const customCaseInventoryReportData =
    get(state.customCaseInventoryReportData) || {};
  const populatedFilters = get(state.customCaseInventoryFilters);
  const isRunReportButtonActive =
    populatedFilters.createStartDate && populatedFilters.createEndDate;
  return {
    customCaseInventoryReportData,
    isClearFiltersActive: true,
    isRunReportButtonActive,
  };
};
