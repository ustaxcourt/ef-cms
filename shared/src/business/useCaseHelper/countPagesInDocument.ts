export const countPagesInDocument = async ({
  applicationContext,
  docketEntryId,
  documentBytes,
}) => {
  let bytes;
  const { PDFDocument } = await applicationContext.getPdfLib();
  if (documentBytes) {
    bytes = documentBytes;
  } else {
    bytes = await applicationContext.getPersistenceGateway().getDocument({
      applicationContext,
      key: docketEntryId,
      protocol: 'S3',
      useTempBucket: false,
    });
  }

  const pdfDoc = await PDFDocument.load(bytes);
  return pdfDoc.getPageCount();
};
