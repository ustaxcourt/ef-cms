import { get } from '../requests';
import qs from 'qs';

export const getJudgeFullNameInteractor = async (
  applicationContext,
  { judgeUserId },
) => {
  const queryString = qs.stringify({
    judgeUserId,
  });
  return await get({
    applicationContext,
    endpoint: `/trial-sessions/minutes/judge?${queryString}`,
  });
};
