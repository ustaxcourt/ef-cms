import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { generateTrialSessionMinutesPdfInteractor } from '@web-api/business/useCases/trialSessionMinutes/generateTrialSessionMinutesPdfInteractor';
import { genericHandler } from '../../genericHandler';

export const generateTrialSessionMinutesPdfLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    const lambdaArguments = {
      ...event.pathParameters,
    };
    return await generateTrialSessionMinutesPdfInteractor(
      applicationContext,
      {
        ...lambdaArguments,
      },
      authorizedUser,
    );
  });
