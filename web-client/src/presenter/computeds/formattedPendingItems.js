import { formatSearchResultRecord } from './advancedSearchHelper';
import { sortedUniq } from 'lodash';
import { state } from 'cerebral';

export const formatPendingItem = (item, { applicationContext }) => {
  const result = formatSearchResultRecord(item, { applicationContext });
  result.formattedFiledDate = applicationContext
    .getUtilities()
    .formatDateString(result.receivedAt || result.createdAt, 'MMDDYY');
  result.associatedJudgeFormatted = result.associatedJudge.replace(
    /^Judge\s+/,
    '',
  );
  result.formattedName = result.documentTitle || result.documentType;
  return result;
};

export const formattedPendingItems = (get, applicationContext) => {
  let items = get(state.pendingItems).map(item =>
    formatPendingItem(item, { applicationContext }),
  );
  const judgeFilter = get(state.screenMetadata.pendingItemsFilters.judge);
  const judges = sortedUniq(items.map(i => i.associatedJudgeFormatted).sort());

  items = items.sort((a, b) =>
    applicationContext.getUtilities().compareStrings(a.judge, b.judge),
  );

  if (judgeFilter) {
    items = items.filter(i => i.associatedJudgeFormatted === judgeFilter);
  }

  let printUrl = '/reports/pending-report/printable';

  if (judgeFilter) {
    printUrl += `?judgeFilter=${encodeURIComponent(judgeFilter)}`;
  }

  const result = {
    items,
    judges,
    printUrl,
  };

  return result;
};
