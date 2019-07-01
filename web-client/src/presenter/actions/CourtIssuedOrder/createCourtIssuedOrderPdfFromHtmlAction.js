import { state } from 'cerebral';

/**
 * generate pdf url from html string
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get helper function
 * @returns {object} the prop object with the pdf url
 */
export const createCourtIssuedOrderPdfFromHtmlAction = ({
  applicationContext,
  get,
}) => {
  const htmlString = get(state.form.richText);
  const documentTitle = get(state.form.documentTitle);

  if (!htmlString) {
    throw new Error('No markup found in documentHtml');
  }

  let pdfBlob = applicationContext
    .getUseCases()
    .createCourtIssuedOrderPdfFromHtml({
      applicationContext,
      htmlString,
    });

  return {
    pdfFile: new File([pdfBlob], documentTitle),
    pdfUrl: window.URL.createObjectURL(pdfBlob),
  };
};
