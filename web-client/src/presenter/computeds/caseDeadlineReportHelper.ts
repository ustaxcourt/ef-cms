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
  judgeOptions: Array<{ id: string; name: string }>;
  pageCount: number;
  showJudgeSelect: boolean;
  showNoDeadlines: boolean;
} => {
  const { CHIEF_JUDGE, DATE_FORMATS } = applicationContext.getConstants();

  const caseDeadlinesForCurrentPage =
    get(state.caseDeadlineReport.caseDeadlinesForCurrentPage) || [];
  const showJudgeSelect =
    caseDeadlinesForCurrentPage.length > 0 ||
    !!get(state.caseDeadlineReport.judgeIdFilter);
  const showNoDeadlines = caseDeadlinesForCurrentPage.length === 0;
  const judgeOptions = (get(state.judges) || [])
    .map(judge => ({
      id: judge.userId,
      name: applicationContext.getUtilities().formatJudgeName(judge.name),
    }))
    .concat({ id: CHIEF_JUDGE, name: CHIEF_JUDGE })
    .sort((a, b) => a.name.localeCompare(b.name));

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
    judgeOptions,
    pageCount,
    showJudgeSelect,
    showNoDeadlines,
  };
};
