import { ServerApplicationContext } from '@web-api/applicationContext';

export const countPagesInDocument = async ({
  applicationContext,
  docketEntryId,
  documentBytes,
}: {
  applicationContext: ServerApplicationContext;
  docketEntryId?: string;
  documentBytes?: Uint8Array;
}): Promise<number> => {
  let bytes;

  if (documentBytes) {
    bytes = documentBytes;
  } else if (docketEntryId) {
    bytes = await applicationContext.getPersistenceGateway().getDocument({
      applicationContext,
      key: docketEntryId,
    });
  }
  const { PDFDocument } = await applicationContext.getPdfLib();

  const pdfDoc = await PDFDocument.load(bytes);

  return pdfDoc.getPageCount();
};
