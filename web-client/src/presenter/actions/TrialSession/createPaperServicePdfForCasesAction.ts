export const createPaperServicePdfForCasesAction = async ({
  applicationContext,
  props,
}: ActionProps<{
  trialNoticePdfsKeys: string[];
  trialSessionId: string;
}>): Promise<void> => {
  const { trialNoticePdfsKeys, trialSessionId } = props;

  await applicationContext
    .getUseCases()
    .generateTrialSessionPaperServicePdfInteractor(applicationContext, {
      trialNoticePdfsKeys,
      trialSessionId,
    });
};
