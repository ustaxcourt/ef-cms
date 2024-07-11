import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getJudgeInSectionInteractor } from '@web-api/business/useCases/user/getJudgeInSectionInteractor';

export const getJudgeInSectionLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await getJudgeInSectionInteractor(
        applicationContext,
        {
          section: event.pathParameters.section,
        },
        authorizedUser,
      );
    },
    authorizedUser,
  );
