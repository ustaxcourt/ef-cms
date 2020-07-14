import { formatSearchResultRecord } from './AdvancedSearch/advancedSearchHelper';
import { state } from 'cerebral';

export const formatPendingItem = (item, { applicationContext }) => {
  const result = formatSearchResultRecord(item, { applicationContext });
  result.formattedFiledDate = applicationContext
    .getUtilities()
    .formatDateString(result.receivedAt, 'MMDDYY');
  result.associatedJudgeFormatted = applicationContext
    .getUtilities()
    .formatJudgeName(result.associatedJudge);

  result.formattedName = result.documentTitle || result.documentType;
  return result;
};

export const formattedPendingItems = (get, applicationContext) => {
  const { CHIEF_JUDGE } = applicationContext.getConstants();

  let items = get(state.pendingItems).map(item =>
    formatPendingItem(item, { applicationContext }),
  );
  const judgeFilter = get(state.screenMetadata.pendingItemsFilters.judge);
  const judges = (get(state.judges) || [])
    .map(i => applicationContext.getUtilities().formatJudgeName(i.name))
    .concat(CHIEF_JUDGE)
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
