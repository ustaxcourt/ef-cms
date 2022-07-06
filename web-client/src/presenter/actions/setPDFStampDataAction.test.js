import { runAction } from 'cerebral/test';
import { setPDFStampDataAction } from './setPDFStampDataAction';

describe('setPDFStampDataAction', () => {
  it('should set state.pdfForSigning.stampData from props', async () => {
    const mockStampData = {
      scale: 1,
      x: 1,
      y: 1,
    };

    const { state } = await runAction(setPDFStampDataAction, {
      props: {
        stampData: mockStampData,
      },
      state: {
        pdfForSigning: {
          stampData: null,
        },
      },
    });

    expect(state.pdfForSigning.stampData).toEqual(mockStampData);
  });

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

  it('should set state.pdfForSigning.isPdfAlreadyStamped from props', async () => {
    const mockIsPdfAlreadyStamped = true;

    const { state } = await runAction(setPDFStampDataAction, {
      props: {
        isPdfAlreadyStamped: mockIsPdfAlreadyStamped,
      },
      state: {
        pdfForSigning: {
          stamisPdfAlreadyStampedpData: null,
        },
      },
    });

    expect(state.pdfForSigning.isPdfAlreadyStamped).toEqual(
      mockIsPdfAlreadyStamped,
    );
  });
});
