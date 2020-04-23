import { state } from 'cerebral';

/**
 * get the pdf file and pdf blob url from the passed in htmlString
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props the passed in props
 * @returns {object} pdfUrl
 */
export const getPdfFileAction = async ({ applicationContext, get, props }) => {
  const { htmlString } = props;
  const caseDetail = get(state.caseDetail);

  if (!htmlString) {
    throw new Error('No markup found in documentHtml');
  }

  let docketNumberWithSuffix = applicationContext
    .getUtilities()
    .formatDocketNumberWithSuffix(caseDetail);

  const {
    url,
  } = await applicationContext
    .getUseCases()
    .createCourtIssuedOrderPdfFromHtmlInteractor({
      applicationContext,
      docketNumberWithSuffix,
      htmlString,
    });

  return { pdfUrl: url };
};
