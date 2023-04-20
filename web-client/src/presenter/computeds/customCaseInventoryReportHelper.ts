import {
  CASE_STATUSES,
  CASE_TYPES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { FORMATS } from '../../../../shared/src/business/utilities/DateHandler';
import { state } from 'cerebral';

export const customCaseInventoryReportHelper = (get, applicationContext) => {
  const customCaseInventoryReportData =
    get(state.customCaseInventoryReportData) || {};

  const populatedFilters = get(state.customCaseInventoryFilters);

  const isRunReportButtonDisabled = !(
    populatedFilters.originalCreatedEndDate &&
    populatedFilters.originalCreatedStartDate
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

  let priority = false; // hack to add priority, will need to add to mappings
  const reportData = (customCaseInventoryReportData.foundCases || []).map(
    entry => {
      priority = !priority;
      return {
        ...entry,
        caseTitle: 'Brett Osborne', // hack to add caseTitle, will need to add to mappings
        createdAt: formatDate(entry.createdAt),
        highPriority: priority,
      };
    },
  );

  const noCustomCasesAfterReportRan = !reportData.length;

  const isClearFiltersDisabled = ![
    ...(populatedFilters.caseStatuses || []),
    ...(populatedFilters.caseTypes || []),
  ].length;

  return {
    caseStatuses,
    caseTypes,
    customCaseInventoryReportData: reportData,
    isClearFiltersDisabled,
    isRunReportButtonDisabled,
    noCustomCasesAfterReportRan,
  };
};
