import { FormattedPendingMotionWithWorksheet } from '@web-api/business/useCases/pendingMotion/getPendingMotionDocketEntriesForCurrentJudgeInteractor';
import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getPendingMotionDocketEntriesForCurrentJudgeInteractor = (
  applicationContext: ClientApplicationContext,
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
