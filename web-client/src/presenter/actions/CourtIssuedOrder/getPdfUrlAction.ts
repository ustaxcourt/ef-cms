import { state } from '@web-client/presenter/app.cerebral';

/**
 * get the url of the pdf created from the passed in html string
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props the passed in props
 * @returns {object} pdfUrl
 */
export const getPdfUrlAction = async ({
  applicationContext,
  get,
  props,
}: ActionProps) => {
  const { contentHtml, documentTitle, signatureText } = props;
  const docketNumber = get(state.caseDetail.docketNumber);
  const addedDocketNumbers = get(state.addedDocketNumbers);

  const { url } = await applicationContext
    .getUseCases()
    .createCourtIssuedOrderPdfFromHtmlInteractor(applicationContext, {
      addedDocketNumbers,
      contentHtml,
      docketNumber,
      documentTitle,
      signatureText,
    });

  return { pdfUrl: url };
};
