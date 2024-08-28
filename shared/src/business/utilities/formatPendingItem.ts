import { PendingItem } from '@web-api/business/useCases/pendingItems/fetchPendingItemsInteractor';

export type PendingItemFormatted = {
  docketNumber: string;
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

  const formattedStatus: string = applicationContext
    .getUtilities()
    .caseStatusWithTrialInformation({
      applicationContext,
      caseStatus: item.status,
      trialDate: item.trialDate,
      trialLocation: item.trialLocation,
    });

  const documentLink = `/case-detail/${item.docketNumber}/document-view?docketEntryId=${item.docketEntryId}`;

  return {
    associatedJudgeFormatted,
    caseTitle,
    consolidatedIconTooltipText:
      pendingItemWithConsolidatedFlags.consolidatedIconTooltipText,
    docketNumber: item.docketNumber,
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
