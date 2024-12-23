import { state } from '@web-client/presenter/app.cerebral';

export const downloadMinuteSheetFormPdfAction = async ({
  applicationContext,
  get,
}) => {
  const { docketNumber } = get(state.caseDetail);
  const { trialSessionId } = get(state.trialSession);

  const pdfUrl = await applicationContext
    .getUseCases()
    .generateTrialSessionMinutesPdfInteractor(applicationContext, {
      docketNumber,
      trialSessionId,
    });

  await applicationContext.getUtilities().openUrlInNewTab({ url: pdfUrl });
};
