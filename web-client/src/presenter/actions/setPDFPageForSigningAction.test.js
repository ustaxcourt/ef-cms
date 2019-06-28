import { runAction } from 'cerebral/test';
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
});
