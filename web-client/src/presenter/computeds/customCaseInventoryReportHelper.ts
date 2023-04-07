import {
  CASE_STATUSES,
  CASE_TYPES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { state } from 'cerebral';

export const customCaseInventoryReportHelper = get => {
  const customCaseInventoryReportData =
    get(state.customCaseInventoryReportData) || {};
  const populatedFilters = get(state.customCaseInventoryFilters);
  const isRunReportButtonActive =
    populatedFilters.createStartDate && populatedFilters.createEndDate;

  const caseStatuses = CASE_STATUSES.map(status => ({
    label: status,
    value: status,
  }));

  const caseTypes = CASE_TYPES.map(type => ({
    label: type,
    value: type,
  }));

  return {
    caseStatuses,
    caseTypes,
    customCaseInventoryReportData,
    isClearFiltersActive: true,
    isRunReportButtonActive,
  };
};
