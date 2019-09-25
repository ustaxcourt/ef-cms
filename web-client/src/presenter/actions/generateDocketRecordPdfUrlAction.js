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
  console.log('1');
  const caseDetail = get(state.caseDetail);
  console.log('caseDetail', caseDetail);
  console.log(
    'state.sessionMetadata.docketRecordSort',
    get(state.sessionMetadata.docketRecordSort),
  );
  const docketRecordSort = get(
    state.sessionMetadata.docketRecordSort[caseDetail.caseId],
  );

  console.log('c');

  const docketRecordPdf = await applicationContext
    .getUseCases()
    .generateDocketRecordPdfInteractor({
      applicationContext,
      caseId: caseDetail.caseId,
      docketRecordSort,
    });

  console.log('d');

  const pdfFile = new Blob([docketRecordPdf], { type: 'application/pdf' });

  const pdfUrl = router.createObjectURL(pdfFile);

  console.log('e');

  return { pdfUrl };
};
