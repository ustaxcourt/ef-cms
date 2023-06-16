import { runAction } from '@web-client/presenter/test.cerebral';
import { setPDFPageForSigningAction } from './setPDFPageForSigningAction';

describe('setPDFPageForSigningAction', () => {
  it('Sets state.pdfForSigning.pageNumber', async () => {
    const newState = 2;
    const result = await runAction(setPDFPageForSigningAction, {
      props: {
        pageNumber: newState,
      },
      state: {
        pdfForSigning: {
          pageNumber: 1,
        },
      },
    });

    expect(result.state.pdfForSigning.pageNumber).toEqual(newState);
  });

  it('uses the default value if no pageNumber is provided', async () => {
    const result = await runAction(setPDFPageForSigningAction, {
      state: {
        pdfForSigning: {
          pageNumber: undefined,
        },
      },
    });

    expect(result.state.pdfForSigning.pageNumber).toEqual(1);
  });
});
