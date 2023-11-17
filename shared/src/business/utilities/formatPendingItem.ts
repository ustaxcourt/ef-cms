import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { PendingItem } from '@web-api/business/useCases/pendingItems/fetchPendingItemsInteractor';

export type PendingItemFormatted = {
  caseTitle: string;
  formattedFiledDate: string;
  associatedJudgeFormatted: string;
  formattedName: string;
  documentLink: string;
  formattedStatus: string;
  inConsolidatedGroup: boolean;
  consolidatedIconTooltipText: string;
  shouldIndent: boolean;
  isLeadCase: boolean;
  docketNumberWithSuffix: string;
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
    associatedJudgeFormatted,
    caseTitle,
    consolidatedIconTooltipText:
      pendingItemWithConsolidatedFlags.consolidatedIconTooltipText,
    docketNumberWithSuffix:
      pendingItemWithConsolidatedFlags.docketNumberWithSuffix!,
    documentLink,
    formattedFiledDate,
    formattedName,
    formattedStatus,
    inConsolidatedGroup: pendingItemWithConsolidatedFlags.inConsolidatedGroup,
    isLeadCase: pendingItemWithConsolidatedFlags.isLeadCase,
    shouldIndent: pendingItemWithConsolidatedFlags.shouldIndent,
  };
};
