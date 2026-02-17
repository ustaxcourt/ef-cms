import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getPendingMotionDocketEntriesForCurrentJudgeInteractor } from '@web-api/business/useCases/pendingMotion/getPendingMotionDocketEntriesForCurrentJudgeInteractor';

export const getPendingMotionDocketEntriesForCurrentJudgeLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) => {
  console.log(
    '[9733] lambda event.queryStringParameters:',
    JSON.stringify(event.queryStringParameters),
  );
  console.log(
    '[9733] lambda event.multiValueQueryStringParameters:',
    JSON.stringify(event.multiValueQueryStringParameters),
  );

  return genericHandler(event, () =>
    getPendingMotionDocketEntriesForCurrentJudgeInteractor(
      event.queryStringParameters,
      authorizedUser,
    ),
  );
};
