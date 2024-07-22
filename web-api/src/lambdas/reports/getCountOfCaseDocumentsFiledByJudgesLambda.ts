import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';

export const getCountOfCaseDocumentsFiledByJudgesLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getCountOfCaseDocumentsFiledByJudgesInteractor(
        applicationContext,
        event.queryStringParameters,
        authorizedUser,
      );
  });
