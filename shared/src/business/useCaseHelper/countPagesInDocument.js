const { PDFDocument } = require('pdf-lib');

exports.countPagesInDocument = async ({ applicationContext, documentId }) => {
  const bytes = await applicationContext.getPersistenceGateway().getDocument({
    applicationContext,
    documentId,
    protocol: 'S3',
    useTempBucket: false,
  });
  const pdfDoc = await PDFDocument.load(bytes);
  return pdfDoc.getPages().length;
};
