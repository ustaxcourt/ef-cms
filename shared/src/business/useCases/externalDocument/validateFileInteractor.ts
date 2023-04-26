/**
 * Validates an uploaded file
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {Array} providers.primaryDocumentFile the primary document file getting uploaded
 * @returns {void}
 */
export const validateFileInteractor = async (
  applicationContext: any,
  {
    primaryDocumentFile,
  }: {
    applicationContext: any;
    primaryDocumentFile: any;
  },
) => {
  const aBlob = new Blob([primaryDocumentFile]);
  const arrayBuffer = await aBlob.arrayBuffer();

  const { PDFDocument } = await applicationContext.getPdfLib();
  try {
    await PDFDocument.load(arrayBuffer);
  } catch (e) {
    if (
      e.message.includes('Input document to `PDFDocument.load` is encrypted')
    ) {
      throw new Error('');
    }
  }
};
