import { state } from 'cerebral';
/**
 * get the pdf file and pdf blob url from the passed in htmlString
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @returns {object} the pdfUrl
 */
export const generatePublicDocketRecordPdfUrlAction = async ({
  applicationContext,
  get,
  router,
}) => {
  const caseDetail = get(state.caseDetail);

  const docketRecordPdf = await applicationContext
    .getUseCases()
    .generatePublicDocketRecordPdfInteractor({
      applicationContext,
      caseId: caseDetail.caseId,
    });

  const pdfFile = new Blob([docketRecordPdf], { type: 'application/pdf' });

  const pdfUrl = router.createObjectURL(pdfFile);

  return { pdfUrl };
};
