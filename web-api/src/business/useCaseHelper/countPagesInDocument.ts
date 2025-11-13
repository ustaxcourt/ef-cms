import { ServerApplicationContext } from '@web-api/applicationContext';

export const countPagesInDocument = async ({
  applicationContext,
  documentStorageId,
  documentBytes,
}: {
  applicationContext: ServerApplicationContext;
  documentStorageId?: string;
  documentBytes?: Uint8Array;
}): Promise<number> => {
  let bytes;

  if (documentBytes) {
    bytes = documentBytes;
  } else if (documentStorageId) {
    bytes = await applicationContext.getPersistenceGateway().getDocument({
      applicationContext,
      key: documentStorageId,
    });
  }
  const { PDFDocument } = await applicationContext.getPdfLib();

  const pdfDoc = await PDFDocument.load(bytes);

  return pdfDoc.getPageCount();
};
