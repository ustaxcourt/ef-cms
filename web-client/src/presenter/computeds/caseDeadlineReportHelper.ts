import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { RawCaseDeadline } from '@shared/business/entities/CaseDeadline';
import { CASE_DEADLINES_REPORT_PAGE_SIZE } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const caseDeadlineReportHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): {
  formattedCaseDeadlines: (RawCaseDeadline & {
    caseCaption: string;
    docketNumber: string;
    docketNumberSuffix: string;
    docketNumberWithSuffix: string;
    leadDocketNumber: string;
    associatedJudgeFormatted: string;
    caseTitle: string;
    consolidatedIconTooltipText: string;
    formattedDeadline: string;
    inConsolidatedGroup: boolean;
    inLeadCase: boolean;
  })[];
  formattedFilterDateHeader;
  judges: string[];
  pageCount: number;
  showJudgeSelect: boolean;
  showNoDeadlines: boolean;
} => {
  const { CHIEF_JUDGE, DATE_FORMATS } = applicationContext.getConstants();

  const caseDeadlinesForCurrentPage =
    get(state.caseDeadlineReport.caseDeadlinesForCurrentPage) || [];
  const judgeFilter = get(state.caseDeadlineReport.judgeFilter);
  const showJudgeSelect =
    caseDeadlinesForCurrentPage.length > 0 || !!judgeFilter;
  const showNoDeadlines = caseDeadlinesForCurrentPage.length === 0;
  const judges = (get(state.judges) || [])
    .map(i => applicationContext.getUtilities().formatJudgeName(i.name))
    .concat(CHIEF_JUDGE)
    .sort();

  let filterStartDate = get(state.screenMetadata.filterStartDate);
  let filterEndDate = get(state.screenMetadata.filterEndDate);

  filterStartDate = applicationContext
    .getUtilities()
    .prepareDateFromString(filterStartDate);

  filterEndDate = applicationContext
    .getUtilities()
    .prepareDateFromString(filterEndDate);

  let formattedFilterDateHeader = applicationContext
    .getUtilities()
    .formatDateString(filterStartDate, DATE_FORMATS.MONTH_DAY_YEAR);

  if (filterEndDate && !filterStartDate.hasSame(filterEndDate, 'day')) {
    formattedFilterDateHeader +=
      ' – ' +
      applicationContext
        .getUtilities()
        .formatDateString(filterEndDate, DATE_FORMATS.MONTH_DAY_YEAR);
  }

  const pageCount = Math.ceil(
    get(state.caseDeadlineReport.caseDeadlinesTotalCount) /
      CASE_DEADLINES_REPORT_PAGE_SIZE,
  );

  const formattedCaseDeadlines = caseDeadlinesForCurrentPage.map(d => {
    const inConsolidatedGroup = !!d.leadDocketNumber;
    const inLeadCase = d.leadDocketNumber === d.docketNumber;
    let consolidatedIconTooltipText;

    if (inConsolidatedGroup) {
      if (inLeadCase) {
        consolidatedIconTooltipText = 'Lead case';
      } else {
        consolidatedIconTooltipText = 'Consolidated case';
      }
    }

    return {
      ...d,
      associatedJudgeFormatted: applicationContext
        .getUtilities()
        .getJudgeLastName(d.associatedJudge),
      caseTitle: applicationContext.getCaseTitle(d.caseCaption || ''),
      consolidatedIconTooltipText,
      formattedDeadline: applicationContext
        .getUtilities()
        .formatDateString(d.deadlineDate, 'MMDDYY'),
      inConsolidatedGroup,
      inLeadCase,
    };
  });

  return {
    formattedCaseDeadlines,
    formattedFilterDateHeader,
    judges,
    pageCount,
    showJudgeSelect,
    showNoDeadlines,
  };
};
