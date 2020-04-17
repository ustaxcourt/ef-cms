import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setPDFForSigningAction } from './setPDFForSigningAction';

describe('setPDFForSigningAction', () => {
  let mockPDFObj;
  let removeCoverMock;

  beforeAll(() => {
    mockPDFObj = {
      numPages: 1,
    };

    removeCoverMock = jest.fn();

    applicationContext
      .getUseCases()
      .loadPDFForSigningInteractor.mockImplementation(({ removeCover }) => {
        if (removeCover === true) {
          removeCoverMock();
        }
        return mockPDFObj;
      });

    presenter.providers.applicationContext = applicationContext;
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
              documentType: 'Other Document type',
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
