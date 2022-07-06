import { clearPDFStampDataAction } from './clearPDFStampDataAction';
import { runAction } from 'cerebral/test';

describe('clearPDFStampDataAction', () => {
  it('should unset state.pdfForSigning.stampData', async () => {
    const { state } = await runAction(clearPDFStampDataAction, {
      state: {
        pdfForSigning: {
          stampData: {
            scale: 1,
            x: 1,
            y: 1,
          },
        },
      },
    });

    expect(state.pdfForSigning.stampData).toBeUndefined();
  });

  it('should set state.pdfForSigning.stampApplied to false', async () => {
    const { state } = await runAction(clearPDFStampDataAction, {
      state: {
        pdfForSigning: {
          stampApplied: true,
        },
      },
    });

    expect(state.pdfForSigning.stampApplied).toBe(false);
  });
});
