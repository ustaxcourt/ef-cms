import { PDFDocument } from 'pdf-lib';
import { waitForLoadingComponentToHide, waitForModalsToHide } from '../helpers';
import http from 'http';

export const docketClerkVerifiesPetitionReceiptLength = (
  cerebralTest,
  expectedLength,
) => {
  return it('the receipt should have the clinic letter appended', async () => {
    expect(cerebralTest.getState('currentPage')).toEqual('ReviewSavedPetition');

    await cerebralTest.runSequence('openConfirmServeToIrsModalSequence');

    await cerebralTest.runSequence('serveCaseToIrsSequence');

    await waitForLoadingComponentToHide({ cerebralTest });
    await waitForModalsToHide({ cerebralTest, maxWait: 120000 });

    expect(cerebralTest.getState('currentPage')).toEqual(
      'PrintPaperPetitionReceipt',
    );

    const pdfPreviewUrl = cerebralTest.getState('pdfPreviewUrl');

    const chunks: Buffer[] = [];
    const buffer = await new Promise((resolve, reject) => {
      http.get(pdfPreviewUrl, function (response) {
        response.on('data', chunk => chunks.push(Buffer.from(chunk)));
        response.on('error', err => reject(err));
        response.on('end', () => resolve(Buffer.concat(chunks)));
      });
    });

    const pdfDoc = await PDFDocument.load(new Uint8Array(buffer));

    const numberOfPages = pdfDoc.getPageCount();

    expect(numberOfPages).toEqual(expectedLength);

    await cerebralTest.runSequence('completePrintPaperPetitionReceiptSequence');
  });
};
