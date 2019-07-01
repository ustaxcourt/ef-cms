import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { setPDFForSigningAction } from './setPDFForSigningAction';

const mockPDFObj = {
  numPages: 1,
};

presenter.providers.applicationContext = {
  getUseCases: () => ({
    loadPDFForSigning: () => mockPDFObj,
  }),
};

describe('setPDFForSigningAction', () => {
  it('Sets state.pdfForSigning.pdfjsObj and state.pdfForSigning.documentId', async () => {
    const documentId = '123';
    const result = await runAction(setPDFForSigningAction, {
      modules: {
        presenter,
      },
      props: {
        documentId,
      },
      state: {
        pdfForSigning: {
          documentId: null,
          pdfjsObj: null,
        },
      },
    });

    expect(result.state.pdfForSigning.documentId).toEqual(documentId);
    expect(result.state.pdfForSigning.pdfjsObj).toEqual(mockPDFObj);
  });
});
