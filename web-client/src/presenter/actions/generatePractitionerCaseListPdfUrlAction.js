/**
 * generates a PDF of the user's open and closed cases and returns pdfUrl
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @returns {object} the pdfUrl
 */
export const generatePractitionerCaseListPdfUrlAction = async ({
  applicationContext,
  props,
}) => {
  const { url } = await applicationContext
    .getUseCases()
    .generatePractitionerCaseListPdfInteractor(applicationContext, {
      userId: props.userId,
    });

  return { pdfUrl: url };
};
