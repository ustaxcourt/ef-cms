import { FormattedPendingMotionWithWorksheet } from '@web-api/business/useCases/pendingMotion/getPendingMotionDocketEntriesForCurrentJudgeInteractor';
import { get } from '../requests';

export const getPendingMotionDocketEntriesForCurrentJudgeInteractor = (
  applicationContext,
  params: { judgeIds: string[] },
): Promise<{
  docketEntries: FormattedPendingMotionWithWorksheet[];
}> => {
  return get({
    applicationContext,
    endpoint: '/docket-entries/pending-motion',
    params,
  });
};
