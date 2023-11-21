import { DocketEntryWithWorksheet } from '@shared/business/useCases/pendingMotion/getPendingMotionCasesForCurrentJudgeInteractor';
import { get } from '../requests';

export const getPendingMotionCasesForCurrentJudgeInteractor = (
  applicationContext,
  params: any,
): Promise<{
  docketEntries: DocketEntryWithWorksheet[];
}> => {
  return get({
    applicationContext,
    endpoint: '/pending-motion-cases',
    params,
  });
};
