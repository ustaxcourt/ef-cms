import { FormattedPendingMotionWithWorksheet } from '@shared/business/useCases/pendingMotion/getPendingMotionDocketEntriesForCurrentJudgeInteractor';
import { get } from '../requests';

export const getPendingMotionDocketEntriesForCurrentJudgeInteractor = (
  applicationContext,
  params: {
    judges: string[];
  },
): Promise<{
  docketEntries: FormattedPendingMotionWithWorksheet[];
}> => {
  return get({
    applicationContext,
    endpoint: '/docket-entries/pending-motion',
    params,
  });
};
