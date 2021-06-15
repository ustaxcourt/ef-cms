import { state } from 'cerebral';

/**
 * get the url of the pdf created from the passed in html string
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props the passed in props
 * @returns {object} pdfUrl
 */
export const getPdfUrlAction = async ({ applicationContext, get, props }) => {
  const { contentHtml, documentTitle, signatureText } = props;
  const docketNumber = get(state.caseDetail.docketNumber);

  const { url } = await applicationContext
    .getUseCases()
    .createCourtIssuedOrderPdfFromHtmlInteractor(applicationContext, {
      contentHtml,
      docketNumber,
      documentTitle,
      signatureText,
    });

  return { pdfUrl: url };
};
