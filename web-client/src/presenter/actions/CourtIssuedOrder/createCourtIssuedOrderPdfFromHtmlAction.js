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

  if (!htmlString) {
    throw new Error('No markup found in documentHtml');
  }

  let pdfUrl = applicationContext
    .getUseCases()
    .createCourtIssuedOrderPdfFromHtml({
      applicationContext,
      htmlString,
    });

  return { pdfUrl };
};
