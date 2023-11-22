import { DocketEntryWithWorksheet } from '@shared/business/useCases/pendingMotion/getPendingMotionDocketEntriesForCurrentJudgeInteractor';
import { Get } from 'cerebral';
import { isLeadCase } from '@shared/business/entities/cases/Case';
import { state } from '@web-client/presenter/app.cerebral';

export type PendingMotionsHelperResults = {
  formattedPendingMotions: (DocketEntryWithWorksheet & {
    consolidatedIconTooltipText: string;
    inConsolidatedGroup: boolean;
    isLeadCase: boolean;
  })[];
};

export const pendingMotionsHelper = (get: Get): PendingMotionsHelperResults => {
  const { docketEntries } = get(state.pendingMotions);

  const formattedPendingMotions = docketEntries
    .map(entry => {
      return {
        ...entry,
        consolidatedIconTooltipText: isLeadCase(entry) ? 'Lead case' : '',
        inConsolidatedGroup: !!entry.leadDocketNumber,
        isLeadCase: isLeadCase(entry),
      };
    })
    .sort((aCase, bCase) => {
      if (aCase.daysSinceCreated < bCase.daysSinceCreated) return -1;
      if (aCase.daysSinceCreated > bCase.daysSinceCreated) return 1;
      return 0;
    });

  return {
    formattedPendingMotions,
  };
};
