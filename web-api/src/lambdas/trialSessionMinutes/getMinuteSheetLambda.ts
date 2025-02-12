import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getMinuteSheetInteractor } from '@web-api/business/useCases/trialSessionMinutes/getMinuteSheetInteractor';

export const getMinuteSheetLambda = (event, authorizedUser: UnknownAuthUser) =>
  genericHandler(event, async () => {
    return await getMinuteSheetInteractor(
      {
        ...event.queryStringParameters,
      },
      authorizedUser,
    );
  });
