import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { archiveDraftDocumentAction } from './archiveDraftDocumentAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('archiveDraftDocumentAction', () => {
  const mockSuccessPath = jest.fn();
  const mockErrorPath = jest.fn();

  presenter.providers.applicationContext = applicationContext;

  presenter.providers.path = {
    error: mockErrorPath,
    success: mockSuccessPath,
  };

  it('archives a drafted document successfully', async () => {
    const result = await runAction(archiveDraftDocumentAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        archiveDraftDocument: {
          docketEntryId: 'def-gfed213-441-abce-312f',
          documentTitle: 'document-title-123',
        },
        caseDetail: {
          docketNumber: '101-20',
        },
      },
    });

    expect(
      applicationContext.getUseCases().archiveDraftDocumentInteractor,
    ).toHaveBeenCalled();
    expect(result.state.alertSuccess).toMatchObject({
      message: 'Document deleted.',
    });
  });

  it('archives a drafted document successfully, saves alerts for navigation, and returns docketNumber if state.archiveDraftDocument.redirectToCaseDetail is true', async () => {
    const result = await runAction(archiveDraftDocumentAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        archiveDraftDocument: {
          docketEntryId: 'def-gfed213-441-abce-312f',
          documentTitle: 'document-title-123',
          redirectToCaseDetail: true,
        },
        caseDetail: {
          docketNumber: '101-20',
        },
      },
    });

    expect(
      applicationContext.getUseCases().archiveDraftDocumentInteractor,
    ).toHaveBeenCalled();
    expect(result.state.alertSuccess).toMatchObject({
      message: 'Document deleted.',
    });
    expect(result.state.saveAlertsForNavigation).toEqual(true);
    expect(result.output.docketNumber).toEqual('101-20');
  });

  it('should unset state.viewerDraftDocumentToDisplay and state.draftDocumentViewerDocketEntryId so the viewer does not display an archived document', async () => {
    const { state } = await runAction(archiveDraftDocumentAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        archiveDraftDocument: {
          docketEntryId: 'def-gfed213-441-abce-312f',
          documentTitle: 'document-title-123',
          redirectToCaseDetail: true,
        },
        caseDetail: {
          docketNumber: '101-20',
        },
        draftDocumentViewerDocketEntryId: '99999999',
        viewerDraftDocumentToDisplay: { docketEntryId: '999999' },
      },
    });

    expect(state.draftDocumentViewerDocketEntryId).toBeUndefined();
    expect(state.viewerDraftDocumentToDisplay).toBeUndefined();
  });

  it('should re-throw an error when the error is generic', async () => {
    const mockError = new Error('I died :(');
    applicationContext
      .getUseCases()
      .archiveDraftDocumentInteractor.mockRejectedValue(mockError);

    await expect(
      runAction(archiveDraftDocumentAction, {
        modules: {
          presenter,
        },
        state: {
          archiveDraftDocument: {
            docketEntryId: 'def-gfed213-441-abce-312f',
            redirectToCaseDetail: true,
          },
          caseDetail: {
            docketNumber: '101-20',
          },
        },
      }),
    ).rejects.toEqual(mockError);
  });

  it('should return path.error when the docket entry has already been served', async () => {
    applicationContext
      .getUseCases()
      .archiveDraftDocumentInteractor.mockRejectedValue({
        originalError: {
          response: {
            data: 'Cannot archive docket entry that has already been served.',
          },
        },
        responseCode: 422,
      });

    await runAction(archiveDraftDocumentAction, {
      modules: {
        presenter,
      },
      state: {
        archiveDraftDocument: {
          docketEntryId: 'def-gfed213-441-abce-312f',
          redirectToCaseDetail: true,
        },
        caseDetail: {
          docketNumber: '101-20',
        },
      },
    });

    expect(mockErrorPath).toHaveBeenCalledWith({
      showModal: 'DocketEntryHasAlreadyBeenServedModal',
    });
  });
});
