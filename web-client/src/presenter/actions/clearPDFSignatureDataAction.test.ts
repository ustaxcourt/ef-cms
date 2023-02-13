import { clearPDFSignatureDataAction } from './clearPDFSignatureDataAction';
import { runAction } from 'cerebral/test';

describe('clearPDFSignatureDataAction', () => {
  it('Sets state.pdfForSigning.signatureData', async () => {
    const result = await runAction(clearPDFSignatureDataAction, {
      state: {
        pdfForSigning: {
          signatureData: {
            scale: 1,
            x: 1,
            y: 1,
          },
        },
      },
    });

    expect(result.state.pdfForSigning.signatureData).toBeUndefined();
  });
});
