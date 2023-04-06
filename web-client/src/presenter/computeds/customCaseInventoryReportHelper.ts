import { state } from 'cerebral';

export const customCaseInventoryReportHelper = get => {
  const customCaseInventoryReportData =
    get(state.customCaseInventoryReportData) || [];
  return {
    customCaseInventoryReportData,
  };
};
