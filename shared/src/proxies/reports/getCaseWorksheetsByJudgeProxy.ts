import {
  GetCasesByStatusAndByJudgeRequest,
  GetCasesByStatusAndByJudgeResponse,
} from '@web-api/business/useCases/judgeActivityReport/getCaseWorksheetsByJudgeInteractor';
import { get } from '../requests';

export const getCaseWorksheetsByJudgeInteractor = (
  applicationContext,
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
