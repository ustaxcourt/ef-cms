import { formatSearchResultRecord } from './AdvancedSearch/advancedSearchHelper';
import { state } from 'cerebral';
import qs from 'qs';

export const formatPendingItem = (item, { applicationContext }) => {
  const result = formatSearchResultRecord(item, { applicationContext });
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

export const formattedPendingItems = (get, applicationContext) => {
  const { CHIEF_JUDGE } = applicationContext.getConstants();

  let items = (get(state.pendingReports.pendingItems) || []).map(item =>
    formatPendingItem(item, { applicationContext }),
  );
  const judgeFilter = get(state.screenMetadata.pendingItemsFilters.judge);
  const judges = get(state.judges)
    .map(i => applicationContext.getUtilities().formatJudgeName(i.name))
    .concat(CHIEF_JUDGE)
    .sort();

  items = items.sort((a, b) =>
    applicationContext
      .getUtilities()
      .compareISODateStrings(a.receivedAt, b.receivedAt),
  );

  const queryString = qs.stringify({ judgeFilter });

  const result = {
    items,
    judges,
    printUrl: `/reports/pending-report/printable?${queryString}`,
  };

  return result;
};
