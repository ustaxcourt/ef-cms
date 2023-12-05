export const getCalendaredCasesForTrialSessionAction = async ({
  applicationContext,
  props,
}: ActionProps<{
  trialSessionId: string;
}>) => {
  const { trialSessionId } = props;

  const calendaredCases = await applicationContext
    .getUseCases()
    .getCalendaredCasesForTrialSessionInteractor(applicationContext, {
      trialSessionId,
    });

  return { calendaredCases };
};
