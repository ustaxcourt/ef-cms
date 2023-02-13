/**
 * Retrieves a pdf from persistence from the signed url provided
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the passed in props
 * @returns {object} the pdf file
 */
export const getPdfFromUrlAction = async ({ applicationContext, props }) => {
  return await applicationContext
    .getUseCases()
    .getPdfFromUrlInteractor(applicationContext, { pdfUrl: props.pdfUrl });
};
