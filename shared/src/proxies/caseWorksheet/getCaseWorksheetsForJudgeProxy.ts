import { get } from '../requests';

export const getCaseWorksheetsForJudgeInteractor = applicationContext => {
  return get({
    applicationContext,
    endpoint: '/case-worksheet',
  });
};
