/**
 * Retrieves a pdf from persistence from the url provided
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.pdfUrl the url to the pdf to retrieve
 * @returns {object} the pdf file
 */
export const getPdfFromUrlInteractor = async (
  applicationContext: any,
  { pdfUrl }: { pdfUrl: string },
) => {
  const pdfFile = await applicationContext
    .getPersistenceGateway()
    .getPdfFromUrl({ applicationContext, url: pdfUrl });

  return { pdfFile };
};
