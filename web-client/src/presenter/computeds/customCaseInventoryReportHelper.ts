import {
  CASE_STATUSES,
  CASE_TYPES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { Case } from '../../../../shared/src/business/entities/cases/Case';
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

  const reportData = (customCaseInventoryReportData.foundCases || []).map(
    entry => {
      return {
        ...entry,
        caseTitle: Case.getCaseTitle(entry.caseCaption),
        createdAt: formatDate(entry.createdAt),
      };
    },
  );

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
  };
};
