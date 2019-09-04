import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { setPDFForSigningAction } from './setPDFForSigningAction';

let mockPDFObj;
let removeCoverMock;

describe('setPDFForSigningAction', () => {
  beforeEach(() => {
    mockPDFObj = {
      numPages: 1,
    };
    removeCoverMock = jest.fn();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        loadPDFForSigningInteractor: ({ removeCover }) => {
          if (removeCover === true) {
            removeCoverMock();
          }
          return mockPDFObj;
        },
      }),
    };
  });

  it('Sets state.pdfForSigning.pdfjsObj and state.pdfForSigning.documentId', async () => {
    const documentId = '123';
    const result = await runAction(setPDFForSigningAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: {
          documents: [
            {
              documentId,
              documentType: 'Proposed Stipulated Decision',
            },
          ],
        },
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

  it('Will remove the cover sheet for a Proposed Stipulated Decision document type', async () => {
    const documentId = '123';
    await runAction(setPDFForSigningAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: {
          documents: [
            {
              documentId,
              documentType: 'Proposed Stipulated Decision',
            },
          ],
        },
        documentId,
      },
      state: {
        pdfForSigning: {
          documentId: null,
          pdfjsObj: null,
        },
      },
    });

    expect(removeCoverMock).toHaveBeenCalled();
  });

  it('Will NOT remove the cover sheet for a document type other than Proposed Stipulated Decision', async () => {
    const documentId = '123';
    await runAction(setPDFForSigningAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: {
          documents: [
            {
              documentId,
              documentType: 'Other Document Type',
            },
          ],
        },
        documentId,
      },
      state: {
        pdfForSigning: {
          documentId: null,
          pdfjsObj: null,
        },
      },
    });

    expect(removeCoverMock).not.toHaveBeenCalled();
  });

  it('Will NOT remove the cover sheet if no documents exist on caseDetail', async () => {
    const documentId = '123';
    await runAction(setPDFForSigningAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: {},
        documentId,
      },
      state: {
        pdfForSigning: {
          documentId: null,
          pdfjsObj: null,
        },
      },
    });

    expect(removeCoverMock).not.toHaveBeenCalled();
  });
});
