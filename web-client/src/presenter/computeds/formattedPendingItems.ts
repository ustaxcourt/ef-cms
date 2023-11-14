import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { addConsolidatedProperties } from './utilities/addConsolidatedProperties';
import { formatSearchResultRecord } from './AdvancedSearch/advancedSearchHelper';
import { state } from '@web-client/presenter/app.cerebral';
import qs from 'qs';

export const formatPendingItem = (
  item,
  { applicationContext }: { applicationContext: ClientApplicationContext },
) => {
  let result = formatSearchResultRecord(item, { applicationContext });

  if (result.leadDocketNumber) {
    result = addConsolidatedProperties({
      applicationContext,
      consolidatedObject: result,
    });
  }

  result.formattedFiledDate = applicationContext
    .getUtilities()
    .formatDateString(result.receivedAt, 'MMDDYY');

  result.associatedJudgeFormatted = applicationContext
    .getUtilities()
    .formatJudgeName(result.associatedJudge);

  result.formattedName = result.documentTitle || result.documentType;

  if (result.status === CASE_STATUS_TYPES.calendared) {
    const trialDate = applicationContext
      .getUtilities()
      .formatDateString(result.trialDate, 'MM/dd/yy');
    const trialLocation = applicationContext
      .getUtilities()
      .abbreviateState(result.trialLocation);
    result.status = `${result.status} - ${trialDate} ${trialLocation}`;
  }

  result.documentLink = `/case-detail/${item.docketNumber}/document-view?docketEntryId=${item.docketEntryId}`;

  return result;
};

export const formattedPendingItemsHelper = (
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
