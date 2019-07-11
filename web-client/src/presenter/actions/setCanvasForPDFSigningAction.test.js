import { runAction } from 'cerebral/test';
import { setCanvasForPDFSigningAction } from './setCanvasForPDFSigningAction';

describe('setCanvasForPDFSigningAction', () => {
  it('Sets state.pdfForSigning.canvas', async () => {
    const newState = 'someRef';
    const result = await runAction(setCanvasForPDFSigningAction, {
      props: {
        canvasRef: newState,
      },
      state: {
        pdfForSigning: {
          signatureData: null,
        },
      },
    });

    expect(result.state.pdfForSigning.canvas).toEqual(newState);
  });
});
