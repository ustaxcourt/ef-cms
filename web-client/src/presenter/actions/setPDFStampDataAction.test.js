import { runAction } from 'cerebral/test';
import { setPDFStampDataAction } from './setPDFStampDataAction';

describe('setPDFStampDataAction', () => {
  it('should set state.pdfForSigning.stampApplied from props', async () => {
    const mockStampApplied = true;

    const { state } = await runAction(setPDFStampDataAction, {
      props: {
        stampApplied: mockStampApplied,
      },
      state: {
        pdfForSigning: {
          stampApplied: null,
        },
      },
    });

    expect(state.pdfForSigning.stampApplied).toEqual(mockStampApplied);
  });
});
