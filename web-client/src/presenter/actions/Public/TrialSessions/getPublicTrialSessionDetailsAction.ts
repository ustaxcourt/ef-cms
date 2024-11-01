import { ClientPublicApplicationContext } from '@web-client/applicationContextPublic';

export const getPublicTrialSessionDetailsAction = async ({
  applicationContext,
  props,
}: ActionProps<
  {
    trialSessionId: string;
  },
  ClientPublicApplicationContext
>) => {
  const { trialSessionId } = props;
  const trialSession = await applicationContext
    .getUseCases()
    .getPublicTrialSessionDetailsInteractor(applicationContext, {
      trialSessionId,
    });

  return { trialSession };
};
