import { Case } from '@shared/business/entities/cases/Case';
import { PendingItem } from '@web-api/business/useCases/pendingItems/fetchPendingItemsInteractor';
import { caseStatusWithTrialInformation } from '@shared/business/utilities/caseStatusWithTrialInformation';
import { formatDateString } from '@shared/business/utilities/DateHandler';
import { formatJudgeName } from '@shared/business/utilities/getFormattedJudgeName';
import { setConsolidationFlagsForDisplay } from '@shared/business/utilities/setConsolidationFlagsForDisplay';

export type PendingItemFormatted = {
  docketEntryId: string;
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
  receivedAt: string;
};

export const formatPendingItem = (item: PendingItem): PendingItemFormatted => {
  const pendingItemWithConsolidatedFlags =
    setConsolidationFlagsForDisplay(item);

  const caseTitle = Case.getCaseTitle(item.caseCaption || '');

  const formattedFiledDate = formatDateString(item.receivedAt, 'MMDDYY');

  const associatedJudgeFormatted = formatJudgeName(item.associatedJudge);

  const formattedName = item.documentTitle || item.documentType;

  const formattedStatus: string = caseStatusWithTrialInformation({
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
    docketEntryId: item.docketEntryId,
    docketNumber: item.docketNumber,
    docketNumberWithSuffix:
      pendingItemWithConsolidatedFlags.docketNumberWithSuffix!,
    documentLink,
    formattedFiledDate,
    formattedName,
    formattedStatus,
    inConsolidatedGroup: pendingItemWithConsolidatedFlags.inConsolidatedGroup,
    isLeadCase: pendingItemWithConsolidatedFlags.isLeadCase,
    receivedAt: item.receivedAt,
    shouldIndent: pendingItemWithConsolidatedFlags.shouldIndent,
  };
};
