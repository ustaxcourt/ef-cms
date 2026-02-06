import { getPdfJs } from '@shared/business/utilities/pdfs/getPdfJs';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { PDFDocumentProxy } from 'pdfjs-dist';

export const loadPDFForSigningInteractor = async (
  applicationContext: ClientApplicationContext,
  {
    documentStorageId,
    docketNumber,
    onlyCover = false,
    removeCover = false,
  }: {
    documentStorageId: string;
    docketNumber: string;
    onlyCover?: boolean;
    removeCover?: boolean;
  },
): Promise<PDFDocumentProxy> => {
  const { PDFDocument } = await applicationContext.getPdfLib();

  try {
    const pdfJs = await getPdfJs();
    const pdfData = await applicationContext
      .getPersistenceGateway()
      .getDocument({
        applicationContext,
        docketNumber,
        key: documentStorageId,
      });

    let formattedArrayBuffer;
    const arrayBuffer = await new Response(pdfData).arrayBuffer();

    if (removeCover) {
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      pdfDoc.removePage(0);
      formattedArrayBuffer = await pdfDoc.save({
        useObjectStreams: false,
      });
    } else if (onlyCover) {
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pdfLength = pdfDoc.getPages().length;
      for (let i = pdfLength - 1; i > 0; i--) {
        pdfDoc.removePage(i);
      }
      formattedArrayBuffer = await pdfDoc.save({
        useObjectStreams: false,
      });
    } else {
      formattedArrayBuffer = arrayBuffer;
    }
    return await pdfJs.getDocument({
      data: formattedArrayBuffer,
      isEvalSupported: false,
    }).promise;
  } catch (err) {
    throw new Error(`error loading PDF for signing: ${documentStorageId}`);
  }
};
