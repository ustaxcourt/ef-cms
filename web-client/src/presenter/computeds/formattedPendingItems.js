import { formatSearchResultRecord } from './advancedSearchHelper';
import { sortedUniq } from 'lodash';
import { state } from 'cerebral';

export const formatPendingItem = (item, { applicationContext }) => {
  const result = formatSearchResultRecord(item, { applicationContext });
  result.formattedFiledDate = applicationContext
    .getUtilities()
    .formatDateString(result.receivedAt, 'MMDDYY');
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
  const judges = (get(state.judges) || [])
    .map(i => i.name.replace(/^Judge\s+/, ''))
    .concat('Chief Judge')
    .sort();

  items = items.sort((a, b) =>
    applicationContext
      .getUtilities()
      .compareISODateStrings(a.receivedAt, b.receivedAt),
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
