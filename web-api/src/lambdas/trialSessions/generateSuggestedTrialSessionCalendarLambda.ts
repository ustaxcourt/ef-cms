import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { generateSuggestedTrialSessionCalendarInteractor } from '@web-api/business/useCases/trialSessions/generateSuggestedTrialSessionCalendarInteractor';
import { genericHandler } from '../../genericHandler';

export const generateSuggestedTrialSessionCalendarLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await generateSuggestedTrialSessionCalendarInteractor(
      applicationContext,
      {
        ...JSON.parse(event.body),
      },
      authorizedUser,
    );
  });
