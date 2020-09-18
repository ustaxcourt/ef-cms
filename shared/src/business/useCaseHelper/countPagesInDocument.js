exports.countPagesInDocument = async ({
  applicationContext,
  docketEntryId,
}) => {
  const { PDFDocument } = await applicationContext.getPdfLib();
  const bytes = await applicationContext.getPersistenceGateway().getDocument({
    applicationContext,
    key: docketEntryId,
    protocol: 'S3',
    useTempBucket: false,
  });
  const pdfDoc = await PDFDocument.load(bytes);
  return pdfDoc.getPages().length;
};
