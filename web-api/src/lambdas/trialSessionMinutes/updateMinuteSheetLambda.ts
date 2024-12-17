import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { updateMinuteSheetInteractor } from '@web-api/business/useCases/trialSessionMinutes/updateMinuteSheetInteractor';

export const updateMinuteSheetLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await updateMinuteSheetInteractor(
        applicationContext,
        {
          minuteSheet: JSON.parse(event.body),
        },
        authorizedUser,
      );
    },
    { logResults: false },
  );
