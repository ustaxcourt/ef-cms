import {
  GetCasesByStatusAndByJudgeRequest,
  GetCasesByStatusAndByJudgeResponse,
} from '@web-api/business/useCases/judgeActivityReport/getCaseWorksheetsByJudgeInteractor';
import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getCaseWorksheetsByJudgeInteractor = (
  applicationContext: ClientApplicationContext,
  params: GetCasesByStatusAndByJudgeRequest,
): Promise<{
  cases: GetCasesByStatusAndByJudgeResponse[];
}> => {
  return get({
    applicationContext,
    endpoint: '/case-worksheets',
    params,
  });
};
