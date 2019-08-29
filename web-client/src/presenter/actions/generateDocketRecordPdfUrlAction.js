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
}) => {
  const caseDetail = get(state.formattedCaseDetail);
  const caseDetailHelper = get(state.caseDetailHelper);

  const docketRecordPdf = await applicationContext
    .getUseCases()
    .createDocketRecordPdfInteractor({
      applicationContext,
      caseDetail: {
        ...caseDetail,
        showCaseNameForPrimary: caseDetailHelper.showCaseNameForPrimary,
        caseCaptionPostfix: caseDetailHelper.caseCaptionPostfix,
      },
    });

  const pdfFile = new Blob([docketRecordPdf], { type: 'application/pdf' });

  const pdfUrl = window.URL.createObjectURL(pdfFile);

  return { pdfUrl };
};
