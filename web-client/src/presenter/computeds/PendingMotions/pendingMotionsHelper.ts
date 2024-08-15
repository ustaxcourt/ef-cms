import { ClientApplicationContext } from '@web-client/applicationContext';
import { DOCUMENT_INTERNAL_CATEGORIES_MAP } from '@shared/business/entities/EntityConstants';
import {
  DocketEntryWorksheet,
  RawDocketEntryWorksheet,
} from '@shared/business/entities/docketEntryWorksheet/DocketEntryWorksheet';
import { FormattedPendingMotionWithWorksheet } from '@web-api/business/useCases/pendingMotion/getPendingMotionDocketEntriesForCurrentJudgeInteractor';
import { Get } from '../../../utilities/cerebralWrapper';
import { isLeadCase } from '@shared/business/entities/cases/Case';
import { state } from '@web-client/presenter/app.cerebral';

type PendingMotionsHelperResults = {
  formattedPendingMotions: (Omit<
    FormattedPendingMotionWithWorksheet,
    'docketEntryWorksheet'
  > & {
    consolidatedIconTooltipText: string;
    inConsolidatedGroup: boolean;
    isLeadCase: boolean;
    finalBriefDueDateFormatted: string;
    documentLink: string;
    documentTitle: string;
    docketEntryWorksheet: RawDocketEntryWorksheet & {
      formattedStatusOfMatter: string | undefined;
    };
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
      const formattedStatusOfMatter = entry.docketEntryWorksheet?.statusOfMatter
        ? DocketEntryWorksheet.STATUS_OF_MATTER_OPTIONS_DICTIONARY[
            entry.docketEntryWorksheet?.statusOfMatter
          ]
        : undefined;

      return {
        ...entry,
        consolidatedIconTooltipText: isLeadCase(entry) ? 'Lead case' : '',
        docketEntryWorksheet: {
          ...entry.docketEntryWorksheet,
          formattedStatusOfMatter,
        },
        documentLink: `/case-detail/${entry.docketNumber}/document-view?docketEntryId=${entry.docketEntryId}`,
        documentTitle: getDocumentTitleByEventCode(entry.eventCode),
        finalBriefDueDateFormatted,
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

function getDocumentTitleByEventCode(eventCode: string): string {
  const motionInfo = DOCUMENT_INTERNAL_CATEGORIES_MAP.Motion.find(
    motion => motion.eventCode === eventCode,
  );

  return motionInfo?.documentType || 'Motion';
}
