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
  const sort = get(state.screenMetadata.sort);
  const sortOrder = get(state.screenMetadata.sortOrder);

  const sortFuncs = {
    date: (a, b) =>
      applicationContext
        .getUtilities()
        .compareISODateStrings(a.receivedAt, b.receivedAt),
    judge: (a, b) =>
      applicationContext.getUtilities().compareStrings(a.judge, b.judge),
  };

  let items = get(state.pendingItems).map(item =>
    formatPendingItem(item, { applicationContext }),
  );
  const judgeFilter = get(state.screenMetadata.pendingItemsFilters.judge);
  const judges = sortedUniq(items.map(i => i.associatedJudgeFormatted).sort());

  items = items.sort(sortFuncs[sort]);

  if (judgeFilter) {
    items = items.filter(i => i.associatedJudgeFormatted === judgeFilter);
  }
  if (sortOrder == 'desc') {
    items = items.reverse();
  }

  const result = {
    items,
    judges,
  };

  return result;
};
