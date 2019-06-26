/**
 * get the selected work items from state
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function used for getting the selectedWorkItems
 * @returns {object} a list of selected work items
 */
export const getPdfPreviewUrlAction = async ({ applicationContext, props }) => {
  const { htmlString } = props;
  if (!htmlString) {
    throw new Error('No markup found in documentHtml');
  }

  const pdfUrl = await applicationContext
    .getUseCases()
    .createCourtIssuedOrderPdfFromHtml({
      applicationContext,
      htmlString,
    });

  return { pdfUrl };
};
