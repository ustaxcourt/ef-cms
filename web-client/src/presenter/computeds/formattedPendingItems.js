import { formatSearchResultRecord } from './advancedSearchHelper';
import { sortedUniq } from 'lodash';
import { state } from 'cerebral';

export const formatPendingItem = (item, { applicationContext }) => {
  console.log(item);
  const result = formatSearchResultRecord(item, { applicationContext });
  result.formattedFiledDate = applicationContext
    .getUtilities()
    .formatDateString(result.receivedAt || result.createdAt, 'MMDDYY');
  result.associatedJudgeFormatted = result.associatedJudge.replace(
    /^Judge\s+/,
    '',
  );
  return result;
};

export const formattedPendingItems = (get, applicationContext) => {
  const items = get(state.pendingItems).map(item =>
    formatPendingItem(item, { applicationContext }),
  );
  const judges = sortedUniq(items.map(i => i.associatedJudgeFormatted).sort());

  const result = {
    items,
    judges,
  };

  return result;
};
