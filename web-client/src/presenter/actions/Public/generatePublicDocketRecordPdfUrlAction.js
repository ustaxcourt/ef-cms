import { state } from 'cerebral';
/**
 * invokes the generate public docket record endpoint to get back the pdf
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} provider.router the router objected needed to create an object url
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
