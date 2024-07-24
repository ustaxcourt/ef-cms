import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getCountOfCaseDocumentsFiledByJudgesInteractor } from '@web-api/business/useCases/judgeActivityReport/getCountOfCaseDocumentsFiledByJudgesInteractor';

export const getCountOfCaseDocumentsFiledByJudgesLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await getCountOfCaseDocumentsFiledByJudgesInteractor(
      applicationContext,
      event.queryStringParameters,
      authorizedUser,
    );
  });
