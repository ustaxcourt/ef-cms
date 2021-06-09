import { state } from 'cerebral';
/**
 * get the pdf file and pdf blob url from the passed in htmlString
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @returns {object} the pdfUrl
 */
export const generatePractitionerCaseListPdfUrlAction = async ({
  applicationContext,
  props,
}) => {
  const {
    url,
  } = await applicationContext
    .getUseCases()
    .generatePractitionerCaseListPdfInteractor(applicationContext, {
      userId: props.userId,
    });

  return { pdfUrl: url };
};
