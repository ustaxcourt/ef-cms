import { ClientPublicApplicationContext } from '@web-client/applicationContextPublic';
import { PublicTrialSessionDetails } from '@web-api/business/useCases/trialSessions/getPublicTrialSessionDetailsInteractor';

export const getPublicTrialSessionDetailsAction = async ({
  applicationContext,
  props,
}: ActionProps<
  {
    trialSessionId: string;
  },
  ClientPublicApplicationContext
>): Promise<{ trialSession: PublicTrialSessionDetails }> => {
  const { trialSessionId } = props;
  const trialSession = await applicationContext
    .getUseCases()
    .getPublicTrialSessionDetailsInteractor(applicationContext, {
      trialSessionId,
    });

  return { trialSession };
};
