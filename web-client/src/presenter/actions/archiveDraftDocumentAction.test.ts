import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { archiveDraftDocumentAction } from './archiveDraftDocumentAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

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
          docketEntryId: 'd3455b15-bd48-42f6-a03b-c5735cd44eab',
          docketNumber: MOCK_CASE.docketNumber,
          documentTitle: 'document-title-123',
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
            docketEntryId: 'e1a5ca3e-3a65-4399-b84c-00dbdebcd52d',
            docketNumber: MOCK_CASE.docketNumber,
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
          docketEntryId: 'f51f402b-bc95-448a-b0b3-cf1914a81e99',
          docketNumber: MOCK_CASE.docketNumber,
        },
      },
    });

    expect(mockErrorPath).toHaveBeenCalledWith({
      showModal: 'DocketEntryHasAlreadyBeenServedModal',
    });
  });
});
