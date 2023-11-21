import { get } from '../requests';

export const getPendingMotionCasesForCurrentJudgeInteractor = (
  applicationContext,
  params: any,
): Promise<{
  cases: any[];
}> => {
  return get({
    applicationContext,
    endpoint: '/pending-motion-cases',
    params,
  });
};
