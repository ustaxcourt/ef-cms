export const downloadMinutesSheetFormPdfAction = async ({
  applicationContext,
}) => {
  const pdfUrl = await applicationContext
    .getUseCases()
    .generateTrialSessionMinutesPdfInteractor(applicationContext, {
      docketNumber: 'docketNumber',
      trialSessionId: 'trialSessionId',
    });

  // 10419 TODO: download to user's machine

  return { pdfUrl };
};
