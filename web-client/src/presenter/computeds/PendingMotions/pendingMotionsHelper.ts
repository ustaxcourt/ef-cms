import { ClientApplicationContext } from '@web-client/applicationContext';
import { FormattedPendingMotionWithWorksheet } from '@shared/business/useCases/pendingMotion/getPendingMotionDocketEntriesForCurrentJudgeInteractor';
import { Get } from 'cerebral';
import { isLeadCase } from '@shared/business/entities/cases/Case';
import { state } from '@web-client/presenter/app.cerebral';

type PendingMotionsHelperResults = {
  formattedPendingMotions: (FormattedPendingMotionWithWorksheet & {
    consolidatedIconTooltipText: string;
    inConsolidatedGroup: boolean;
    isLeadCase: boolean;
    finalBriefDueDateFormatted: string;
    documentLink: string;
  })[];
};

export const pendingMotionsHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): PendingMotionsHelperResults => {
  const { docketEntries } = get(state.pendingMotions);

  const formattedPendingMotions = docketEntries
    .map(entry => {
      const finalBriefDueDateFormatted = entry.docketEntryWorksheet
        .finalBriefDueDate
        ? applicationContext
            .getUtilities()
            .formatDateString(
              entry.docketEntryWorksheet.finalBriefDueDate,
              applicationContext.getConstants().DATE_FORMATS.MMDDYY,
            )
        : '';
      return {
        ...entry,
        consolidatedIconTooltipText: isLeadCase(entry) ? 'Lead case' : '',
        documentLink: `/case-detail/${entry.docketNumber}/document-view?docketEntryId=${entry.docketEntryId}`,
        finalBriefDueDateFormatted: finalBriefDueDateFormatted || '',
        inConsolidatedGroup: !!entry.leadDocketNumber,
        isLeadCase: isLeadCase(entry),
      };
    })
    .sort((aCase, bCase) => {
      if (aCase.daysSinceCreated < bCase.daysSinceCreated) return 1;
      if (aCase.daysSinceCreated > bCase.daysSinceCreated) return -1;
      return 0;
    });

  return {
    formattedPendingMotions,
  };
};
