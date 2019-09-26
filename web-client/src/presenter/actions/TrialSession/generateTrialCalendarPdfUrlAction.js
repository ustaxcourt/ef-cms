import { state } from 'cerebral';
/**
 * get the pdf file and pdf blob url from the passed in htmlString
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @returns {object} the pdfUrl
 */
export const generateTrialCalendarPdfUrlAction = async ({
  applicationContext,
  get,
  router,
}) => {
  const trialSession = get(state.trialSession);

  const trialCalendarPdf = await applicationContext
    .getUseCases()
    .generateTrialCalendarPdfInteractor({
      applicationContext,
      trialSessionId: trialSession.trialSessionId,
    });

  const pdfFile = new Blob([trialCalendarPdf], { type: 'application/pdf' });

  const pdfUrl = router.createObjectURL(pdfFile);

  return { pdfUrl };
};
