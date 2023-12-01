import { state } from '@web-client/presenter/app.cerebral';

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
export const caseDeadlineReportHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const { CHIEF_JUDGE, DATE_FORMATS } = applicationContext.getConstants();

  let caseDeadlines = get(state.caseDeadlineReport.caseDeadlines) || [];
  const totalCount = get(state.caseDeadlineReport.totalCount) || 0;
  const judgeFilter = get(state.caseDeadlineReport.judgeFilter);
  const showLoadMoreButton = caseDeadlines.length < totalCount;

  const showJudgeSelect = caseDeadlines.length > 0 || judgeFilter;
  const showNoDeadlines = caseDeadlines.length === 0;

  let filterStartDate = get(state.screenMetadata.filterStartDate);
  let filterEndDate = get(state.screenMetadata.filterEndDate);
  const judges = (get(state.judges) || [])
    .map(i => applicationContext.getUtilities().formatJudgeName(i.name))
    .concat(CHIEF_JUDGE)
    .sort();

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
    filterEndDate = applicationContext
      .getUtilities()
      .prepareDateFromString(filterEndDate);

    formattedFilterDateHeader +=
      ' – ' +
      applicationContext
        .getUtilities()
        .formatDateString(filterEndDate, DATE_FORMATS.MONTH_DAY_YEAR);
  }

  caseDeadlines = caseDeadlines.map(d => {
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
    caseDeadlines,
    formattedFilterDateHeader,
    judges,
    showJudgeSelect,
    showLoadMoreButton,
    showNoDeadlines,
    totalCount,
  };
};
