import { runAction } from 'cerebral/test';
import { setPDFStampDataAction } from './setPDFStampDataAction';

describe('setPDFStampDataAction', () => {
  it('should set state.pdfForSigning.stampData', async () => {
    const newState = {
      scale: 1,
      x: 1,
      y: 1,
    };

    const result = await runAction(setPDFStampDataAction, {
      props: {
        stampData: { ...newState },
      },
      state: {
        pdfForSigning: {
          stampData: null,
        },
      },
    });

    expect(result.state.pdfForSigning.stampData).toEqual(newState);
  });
});
