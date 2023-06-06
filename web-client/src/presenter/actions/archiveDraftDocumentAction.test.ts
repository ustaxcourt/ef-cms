import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { archiveDraftDocumentAction } from './archiveDraftDocumentAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('archiveDraftDocumentAction', () => {
  const mockSuccessPath = jest.fn();
  const mockErrorPath = jest.fn();

  presenter.providers.path = {
    error: mockErrorPath,
    success: mockSuccessPath,
  };

  presenter.providers.applicationContext = applicationContext;

  beforeEach(() => {
    applicationContext
      .getUseCases()
      .archiveDraftDocumentInteractor.mockResolvedValue(MOCK_CASE);
  });

  it('archives a drafted document successfully', async () => {
    await runAction(archiveDraftDocumentAction, {
      modules: {
        presenter,
      },
      state: {
        archiveDraftDocument: {
          docketEntryId: 'e7df98c8-b310-41bb-953c-d9390c6c5884',
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
    expect(mockSuccessPath).toHaveBeenCalledWith({
      alertSuccess: {
        message: 'Document deleted.',
      },
      caseDetail: MOCK_CASE,
    });
  });

  it('archives a drafted document successfully, saves alerts for navigation, and returns docketNumber if state.archiveDraftDocument.redirectToCaseDetail is true', async () => {
    const result = await runAction(archiveDraftDocumentAction, {
      modules: {
        presenter,
      },
      state: {
        archiveDraftDocument: {
          docketEntryId: 'def-gfed213-441-abce-312f',
          documentTitle: 'document-title-123',
          redirectToCaseDetail: true,
        },
        caseDetail: {
          docketNumber: MOCK_CASE.docketNumber,
        },
      },
    });

    expect(
      applicationContext.getUseCases().archiveDraftDocumentInteractor,
    ).toHaveBeenCalled();
    expect(mockSuccessPath).toHaveBeenCalledWith({
      alertSuccess: {
        message: 'Document deleted.',
      },
      caseDetail: MOCK_CASE,
      docketNumber: MOCK_CASE.docketNumber,
    });
    expect(result.state.saveAlertsForNavigation).toEqual(true);
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
