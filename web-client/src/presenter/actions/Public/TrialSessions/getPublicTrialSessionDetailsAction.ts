import { ClientPublicApplicationContext } from '@web-client/applicationContextPublic';
import type { RawPublicTrialSessionDetails } from '@shared/business/entities/trialSessions/PublicTrialSessionDetails';

export const getPublicTrialSessionDetailsAction = async ({
  applicationContext,
  props,
}: ActionProps<
  {
    trialSessionId: string;
  },
  ClientPublicApplicationContext
>): Promise<{ trialSession: RawPublicTrialSessionDetails }> => {
  const { trialSessionId } = props;
  const trialSession = await applicationContext
    .getUseCases()
    .getPublicTrialSessionDetailsInteractor(applicationContext, {
      trialSessionId,
    });

  return { trialSession };
};
