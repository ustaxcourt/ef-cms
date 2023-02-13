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
      .loadPDFForSigningInteractor.mockImplementation(
        (_applicationContext, { removeCover }) => {
          if (removeCover === true) {
            removeCoverMock();
          }
          return mockPDFObj;
        },
      );

    presenter.providers.applicationContext = applicationContext;
  });

  it('Sets state.pdfForSigning.pdfjsObj and state.pdfForSigning.docketEntryId', async () => {
    const docketEntryId = '123';
    const result = await runAction(setPDFForSigningAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId,
              documentType: 'Proposed Stipulated Decision',
            },
          ],
        },
        docketEntryId,
      },
      state: {
        pdfForSigning: {
          docketEntryId: null,
          pdfjsObj: null,
        },
      },
    });

    expect(result.state.pdfForSigning.docketEntryId).toEqual(docketEntryId);
    expect(result.state.pdfForSigning.pdfjsObj).toEqual(mockPDFObj);
  });

  it('Will remove the cover sheet for a Proposed Stipulated Decision document type', async () => {
    const docketEntryId = '123';
    await runAction(setPDFForSigningAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId,
              documentType: 'Proposed Stipulated Decision',
            },
          ],
        },
        docketEntryId,
      },
      state: {
        pdfForSigning: {
          docketEntryId: null,
          pdfjsObj: null,
        },
      },
    });

    expect(removeCoverMock).toHaveBeenCalled();
  });

  it('Will NOT remove the cover sheet for a document type other than Proposed Stipulated Decision', async () => {
    const docketEntryId = '123';
    await runAction(setPDFForSigningAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId,
              documentType: 'Other Document type',
            },
          ],
        },
        docketEntryId,
      },
      state: {
        pdfForSigning: {
          docketEntryId: null,
          pdfjsObj: null,
        },
      },
    });

    expect(removeCoverMock).not.toHaveBeenCalled();
  });

  it('Will NOT remove the cover sheet if no documents exist on caseDetail', async () => {
    const docketEntryId = '123';
    await runAction(setPDFForSigningAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: {},
        docketEntryId,
      },
      state: {
        pdfForSigning: {
          docketEntryId: null,
          pdfjsObj: null,
        },
      },
    });

    expect(removeCoverMock).not.toHaveBeenCalled();
  });

  it('calls loadPDFForSigningInteractor with expected params', async () => {
    const docketEntryId = '123';
    await runAction(setPDFForSigningAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: { docketNumber: '123-20' },
        docketEntryId,
      },
      state: {
        pdfForSigning: {
          docketEntryId: null,
          pdfjsObj: null,
        },
      },
    });

    expect(
      applicationContext.getUseCases().loadPDFForSigningInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      docketEntryId,
      docketNumber: '123-20',
      removeCover: false,
    });
  });
});
