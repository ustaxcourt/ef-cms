import {
  CASE_STATUSES,
  CASE_TYPES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { CUSTOM_CASE_INVENTORY_PAGE_SIZE } from '../actions/CaseInventoryReport/getCustomCaseInventoryReportAction';
import { Case } from '../../../../shared/src/business/entities/cases/Case';
import { FORMATS } from '../../../../shared/src/business/utilities/DateHandler';
import { state } from 'cerebral';

export const customCaseInventoryReportHelper = (get, applicationContext) => {
  const cases = get(state.customCaseInventory.cases);

  const populatedFilters = get(state.customCaseInventory.filters);

  const runReportButtonIsDisabled = !(
    populatedFilters.createStartDate && populatedFilters.createEndDate
  );

  const caseStatuses = CASE_STATUSES.map(status => ({
    label: status,
    value: status,
  }));

  const caseTypes = CASE_TYPES.map(type => ({
    label: type,
    value: type,
  }));

  const formatDate = isoDateString =>
    applicationContext
      .getUtilities()
      .formatDateString(isoDateString, FORMATS.MMDDYY);

  const reportData = cases.map(entry => {
    return {
      ...entry,
      caseTitle: Case.getCaseTitle(entry.caseCaption),
      createdAt: formatDate(entry.createdAt),
    };
  });

  const clearFiltersIsDisabled = ![
    ...populatedFilters.caseStatuses,
    ...populatedFilters.caseTypes,
  ].length;

  const totalCases = get(state.customCaseInventory.totalCases);
  const pageCount = Math.ceil(totalCases / CUSTOM_CASE_INVENTORY_PAGE_SIZE);

  return {
    caseStatuses,
    caseTypes,
    cases: reportData,
    clearFiltersIsDisabled,
    pageCount,
    runReportButtonIsDisabled,
  };
};
