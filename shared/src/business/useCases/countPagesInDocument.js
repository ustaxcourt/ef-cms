const { PDFDocument } = require('pdf-lib');

exports.countPagesInDocument = async ({ applicationContext, documentId }) => {
  console.log('a');
  const bytes = await applicationContext.getPersistenceGateway().getDocument({
    applicationContext,
    documentId,
    protocol: 'S3',
    useTempBucket: false,
  });
  console.log('b');

  const pdfDoc = await PDFDocument.load(bytes);
  console.log('c');

  const pages = pdfDoc.getPages();
  console.log('d');

  return pages.length;
};
