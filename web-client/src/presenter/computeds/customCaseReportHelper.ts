import {
  CASE_STATUS_TYPES,
  CASE_TYPES,
  CHIEF_JUDGE,
  CUSTOM_CASE_REPORT_PAGE_SIZE,
  CaseType,
} from '@shared/business/entities/EntityConstants';
import { Case } from '@shared/business/entities/cases/Case';
import {
  CaseInventory,
  CustomCaseReportFilters,
} from '@web-api/business/useCases/caseInventoryReport/getCustomCaseReportInteractor';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { FORMATS } from '@shared/business/utilities/DateHandler';
import { Get } from 'cerebral';
import { getTrialCitiesGroupedByState } from '@shared/business/utilities/trialSession/trialCitiesGroupedByState';
import { state } from '@web-client/presenter/app.cerebral';

export const customCaseReportHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): {
  caseStatuses: { label: string; value: string }[];
  caseTypes: { label: string; value: CaseType }[];
  cases: (CaseInventory & {
    inConsolidatedGroup: boolean;
    consolidatedIconTooltipText: string;
    shouldIndent: boolean;
    isLeadCase: boolean;
  })[];
  clearFiltersIsDisabled: boolean;
  judges: { label: string; value: string }[];
  pageCount: number;
  today: string;
  trialCitiesByState: {
    label: string;
    options: {
      label: string;
      value: string;
    }[];
  }[];
} => {
  const caseStatuses = Object.values(CASE_STATUS_TYPES).map(status => ({
    label: status,
    value: status,
  }));

  const caseTypes = CASE_TYPES.map(type => ({
    label: type,
    value: type,
  }));

  const cases = get(state.customCaseReport.cases);

  const formatDate = isoDateString =>
    applicationContext
      .getUtilities()
      .formatDateString(isoDateString, FORMATS.MMDDYY);

  const reportData = cases.map(entry => {
    const consolidatedEntry = applicationContext
      .getUtilities()
      .setConsolidationFlagsForDisplay(entry);

    consolidatedEntry.caseCaption = Case.getCaseTitle(entry.caseCaption);
    consolidatedEntry.receivedAt = formatDate(entry.receivedAt);

    return consolidatedEntry;
  });

  const populatedFilters: CustomCaseReportFilters = get(
    state.customCaseReport.filters,
  );

  const clearFiltersIsDisabled = ![
    ...populatedFilters.caseStatuses,
    ...populatedFilters.caseTypes,
    ...populatedFilters.judges,
    ...populatedFilters.preferredTrialCities,
  ].length;

  const judges = get(state.judges)
    .map(judge => ({
      label: judge.name,
      value: judge.name,
    }))
    .concat({ label: CHIEF_JUDGE, value: CHIEF_JUDGE })
    .sort((a, b) => {
      return applicationContext.getUtilities().compareStrings(a.label, b.label);
    });

  const totalCases = get(state.customCaseReport.totalCases);
  const pageCount = Math.ceil(totalCases / CUSTOM_CASE_REPORT_PAGE_SIZE);

  const today = applicationContext.getUtilities().formatNow(FORMATS.YYYYMMDD);

  const trialCitiesByState = getTrialCitiesGroupedByState();

  return {
    caseStatuses,
    caseTypes,
    cases: reportData,
    clearFiltersIsDisabled,
    judges,
    pageCount,
    today,
    trialCitiesByState,
  };
};
