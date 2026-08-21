import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { saveMinuteSheetToDraftsInteractor } from '@web-api/business/useCases/trialSessionMinutes/saveMinuteSheetToDraftsInteractor';

export const saveMinuteSheetToDraftsLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    const lambdaArguments = {
      ...event.pathParameters,
    };

    await saveMinuteSheetToDraftsInteractor(
      applicationContext,
      {
        ...lambdaArguments,
      },
      authorizedUser,
    );
  });
