import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { updateMinuteSheetInteractor } from '@web-api/business/useCases/trialSessionMinutes/updateMinuteSheetInteractor';

export const updateMinuteSheetLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async () => {
    return await updateMinuteSheetInteractor(
      JSON.parse(event.body),
      authorizedUser,
    );
  });
