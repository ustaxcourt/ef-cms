import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { formatSearchResultRecord } from './AdvancedSearch/advancedSearchHelper';
import { state } from '@web-client/presenter/app.cerebral';
import qs from 'qs';

const formatPendingItem = (
  item,
  { applicationContext }: { applicationContext: ClientApplicationContext },
) => {
  let result = formatSearchResultRecord(item, { applicationContext });

  if (result.leadDocketNumber) {
    result = applicationContext
      .getUtilities()
      .setConsolidationFlagsForDisplay(result);
  }

  result.formattedFiledDate = applicationContext
    .getUtilities()
    .formatDateString(result.receivedAt, 'MMDDYY');

  result.associatedJudgeFormatted = applicationContext
    .getUtilities()
    .formatJudgeName(result.associatedJudge);

  result.formattedName = result.documentTitle || result.documentType;

  result.documentLink = `/case-detail/${item.docketNumber}/document-view?docketEntryId=${item.docketEntryId}`;

  return result;
};

export const formattedPendingItems = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const { CHIEF_JUDGE } = applicationContext.getConstants();

  let items = (get(state.pendingReports.pendingItems) || []).map(item =>
    formatPendingItem(item, { applicationContext }),
  );
  const judgeFilter = get(state.screenMetadata.pendingItemsFilters.judge);
  const judges = get(state.judges)
    .map(i => applicationContext.getUtilities().formatJudgeName(i.name))
    .concat(CHIEF_JUDGE)
    .sort();

  const queryString = qs.stringify({ judgeFilter });

  return {
    items,
    judges,
    printUrl: `/reports/pending-report/printable?${queryString}`,
  };
};
