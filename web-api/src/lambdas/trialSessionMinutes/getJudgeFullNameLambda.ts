import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getJudgeFullNameInteractor } from '@web-api/business/useCases/trialSessionMinutes/getJudgeFullNameInteractor';

export const getJudgeFullNameLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await getJudgeFullNameInteractor(
        {
          ...event.queryStringParameters,
        },
        authorizedUser,
        applicationContext,
      );
    },
    { logResults: false },
  );
