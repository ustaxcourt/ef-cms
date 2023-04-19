import {
  CASE_STATUSES,
  CASE_TYPES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { FORMATS } from '../../../../shared/src/business/utilities/DateHandler';
import { state } from 'cerebral';

export const customCaseInventoryReportHelper = (get, applicationContext) => {
  const customCaseInventoryReportData = get(
    state.customCaseInventoryReportData,
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
    entry => ({
      ...entry,
      createdAt: formatDate(entry.createdAt),
    }),
  );

  return {
    caseStatuses,
    caseTypes,
    customCaseInventoryReportData: reportData,
  };
};
