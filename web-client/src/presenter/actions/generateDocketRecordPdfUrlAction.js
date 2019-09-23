import { state } from 'cerebral';
/**
 * get the pdf file and pdf blob url from the passed in htmlString
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @returns {object} the pdfUrl
 */
export const generateDocketRecordPdfUrlAction = async ({
  applicationContext,
  get,
  router,
}) => {
  const caseDetail = get(state.caseDetail);
  const docketRecordSort = get(
    state.sessionMetadata.docketRecordSort[caseDetail.caseId],
  );

  const docketRecordPdf = await applicationContext
    .getUseCases()
    .generateDocketRecordPdfInteractor({
      applicationContext,
      caseId: caseDetail.caseId,
      docketRecordSort,
    });

  const pdfFile = new Blob([docketRecordPdf], { type: 'application/pdf' });

  const pdfUrl = router.createObjectURL(pdfFile);

  return { pdfUrl };
};
