import { clearPDFStampDataAction } from './clearPDFStampDataAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearPDFStampDataAction', () => {
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
