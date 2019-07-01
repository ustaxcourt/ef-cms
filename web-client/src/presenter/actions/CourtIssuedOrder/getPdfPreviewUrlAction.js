import { state } from 'cerebral';

/**
 * get the selected work items from state
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function used for getting the selectedWorkItems
 * @returns {object} a list of selected work items
 */
export const getPdfPreviewUrlAction = async ({
  applicationContext,
  get,
  props,
}) => {
  const { htmlString } = props;
  const documentTitle = get(state.form.documentTitle);

  if (!htmlString) {
    throw new Error('No markup found in documentHtml');
  }
  let docketNumberWithSuffix = get(
    state.formattedCaseDetail.docketNumberWithSuffix,
  );

  const pdfBlob = await applicationContext
    .getUseCases()
    .createCourtIssuedOrderPdfFromHtml({
      applicationContext,
      docketNumberWithSuffix,
      htmlString,
    });

  const pdfUrl = window.URL.createObjectURL(pdfBlob);
  const pdfFile = new File([pdfBlob], documentTitle);

  return { pdfFile, pdfUrl };
};
