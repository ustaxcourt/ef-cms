import { DocketEntryWithWorksheet } from '@shared/business/useCases/pendingMotion/getPendingMotionDocketEntriesForCurrentJudgeInteractor';
import { get } from '../requests';

export const getPendingMotionDocketEntriesForCurrentJudgeInteractor = (
  applicationContext,
  params: any,
): Promise<{
  docketEntries: DocketEntryWithWorksheet[];
}> => {
  return get({
    applicationContext,
    endpoint: '/docket-entries/pending-motion',
    params,
  });
};
