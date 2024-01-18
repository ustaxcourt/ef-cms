import { FormattedPendingMotionWithWorksheet } from '@shared/business/useCases/pendingMotion/getPendingMotionDocketEntriesForCurrentJudgeInteractor';
import { get } from '../requests';

export const getPendingMotionDocketEntriesForCurrentJudgeInteractor = (
  applicationContext,
  params: { judgeId: string },
): Promise<{
  docketEntries: FormattedPendingMotionWithWorksheet[];
}> => {
  return get({
    applicationContext,
    endpoint: '/docket-entries/pending-motion',
    params,
  });
};
