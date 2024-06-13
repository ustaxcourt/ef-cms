import { ServerApplicationContext } from '@web-api/applicationContext';

export const countPagesInDocument = async ({
  applicationContext,
  docketEntryId,
  documentBytes,
}: {
  applicationContext: ServerApplicationContext;
  docketEntryId?: string;
  documentBytes?: any;
}) => {
  let bytes;
  const { PDFDocument } = await applicationContext.getPdfLib();
  if (documentBytes) {
    bytes = documentBytes;
  } else if (docketEntryId) {
    bytes = await applicationContext.getPersistenceGateway().getDocument({
      applicationContext,
      key: docketEntryId,
      useTempBucket: false,
    });
  }

  const pdfDoc = await PDFDocument.load(bytes);
  return pdfDoc.getPageCount();
};
