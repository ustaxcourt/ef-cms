import { ClientApplicationContext } from '@web-client/applicationContext';
import {
  GetCasesByStatusAndByJudgeRequest,
  GetCasesByStatusAndByJudgeResponse,
} from '@shared/business/useCases/judgeActivityReport/getCasesByStatusAndByJudgeInteractor';
import { get } from '../requests';

export const getCasesByStatusAndByJudgeInteractor = (
  applicationContext: ClientApplicationContext,
  params: GetCasesByStatusAndByJudgeRequest,
): Promise<{
  cases: GetCasesByStatusAndByJudgeResponse[];
}> => {
  return get({
    applicationContext,
    endpoint: '/cases/status-and-judge',
    params,
  });
};
