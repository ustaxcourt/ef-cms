import { runAction } from '@web-client/presenter/test.cerebral';
import { setPDFSignatureDataAction } from './setPDFSignatureDataAction';

describe('setPDFSignatureDataAction', () => {
  it('Sets state.pdfForSigning.signatureData', async () => {
    const newState = {
      scale: 1,
      x: 1,
      y: 1,
    };
    const result = await runAction(setPDFSignatureDataAction, {
      props: {
        signatureData: { ...newState },
      },
      state: {
        pdfForSigning: {
          signatureData: null,
        },
      },
    });

    expect(result.state.pdfForSigning.signatureData).toEqual(newState);
  });
});
