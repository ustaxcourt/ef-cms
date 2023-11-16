import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { PendingItem } from '@web-api/business/useCases/pendingItems/fetchPendingItemsInteractor';
import { state } from '@web-client/presenter/app.cerebral';
import qs from 'qs';

type PendingItemFormatted = PendingItem & {
  caseTitle: string;
  formattedFiledDate: string;
  associatedJudgeFormatted: string;
  formattedName: string;
  status: string;
  documentLink: string;
  formattedStatus: string;
  inConsolidatedGroup: boolean;
  consolidatedIconTooltipText: string;
  shouldIndent: boolean;
  isLeadCase: boolean;
};

export const formattedPendingItemsHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): {
  printUrl: string;
  judges: string[];
  items: PendingItemFormatted[];
} => {
  const { CHIEF_JUDGE } = applicationContext.getConstants();

  const items = get(state.pendingReports.pendingItems).map(item =>
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

export const formatPendingItem = (
  item: PendingItem,
  { applicationContext }: { applicationContext: IApplicationContext },
): PendingItemFormatted => {
  const pendingItemWithConsolidatedFlags = applicationContext
    .getUtilities()
    .setConsolidationFlagsForDisplay(item);

  const caseTitle = applicationContext.getCaseTitle(item.caseCaption || '');

  const formattedFiledDate = applicationContext
    .getUtilities()
    .formatDateString(item.receivedAt, 'MMDDYY');

  const associatedJudgeFormatted = applicationContext
    .getUtilities()
    .formatJudgeName(item.associatedJudge);

  const formattedName = item.documentTitle || item.documentType;

  let formattedStatus: string = item.status;
  if (item.status === CASE_STATUS_TYPES.calendared) {
    const trialDate = applicationContext
      .getUtilities()
      .formatDateString(item.trialDate, 'MM/dd/yy');
    const trialLocation = applicationContext
      .getUtilities()
      .abbreviateState(item.trialLocation);
    formattedStatus = `${item.status} - ${trialDate} ${trialLocation}`;
  }

  const documentLink = `/case-detail/${item.docketNumber}/document-view?docketEntryId=${item.docketEntryId}`;

  return {
    ...pendingItemWithConsolidatedFlags,
    associatedJudgeFormatted,
    caseTitle,
    documentLink,
    formattedFiledDate,
    formattedName,
    formattedStatus,
  };
};
