export const getPublicTrialSessionDetailsAction = async ({
  applicationContext,
  props,
}: ActionProps<{
  trialSessionId: string;
}>) => {
  const { trialSessionId } = props;
  const trialSession = await applicationContext
    .getUseCases()
    .getTrialSessionDetailsInteractor(applicationContext, {
      trialSessionId,
    });

  return { trialSession };
};
