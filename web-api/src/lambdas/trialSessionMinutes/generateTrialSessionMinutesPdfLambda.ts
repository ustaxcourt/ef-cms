import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { generateTrialSessionMinutesPdfInteractor } from '@web-api/business/useCases/trialSessionMinutes/generateTrialSessionMinutesPdfInteractor';
import { genericHandler } from '../../genericHandler';

export const generateTrialSessionMinutesPdfLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await generateTrialSessionMinutesPdfInteractor(
        applicationContext,
        authorizedUser,
      );
    },
    { logResults: false },
  );
