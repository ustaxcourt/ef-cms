import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateDocumentAction } from './validateDocumentAction';

describe('validateDocumentAction', () => {
  let successStub;
  let errorStub;

  let mockDocument;

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    mockDocument = {
      documentTitle: 'hello world',
      eventCode: 'HELLO',
      filingDate: '1990-01-01T05:00:00.000Z',
      index: 1,
    };

    presenter.providers.applicationContext = applicationContext;

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the success path when no errors are found', async () => {
    applicationContext
      .getUseCases()
      .validateDocumentInteractor.mockReturnValue(null);

    await runAction(validateDocumentAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockDocument,
        screenMetadata: {
          editType: 'NoDocument',
        },
      },
    });

    expect(successStub).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().validateDocumentInteractor,
    ).toHaveBeenCalled();
  });

  it('should call the error path when any errors are found', async () => {
    applicationContext
      .getUseCases()
      .validateDocumentInteractor.mockReturnValue({
        validationErrors: 'error',
      });

    await runAction(validateDocumentAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockDocument,
        screenMetadata: {
          editType: 'NoDocument',
        },
      },
    });

    expect(errorStub).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().validateDocumentInteractor,
    ).toHaveBeenCalled();
  });

  it('should call the error path when any errors are found with a document', async () => {
    applicationContext
      .getUseCases()
      .validateDocumentInteractor.mockReturnValue(null);
    applicationContext
      .getUseCases()
      .validateDocketEntryInteractor.mockReturnValue({
        validationErrors: 'error',
      });

    await runAction(validateDocumentAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockDocument,
        screenMetadata: {
          editType: 'Document',
        },
      },
    });

    expect(
      applicationContext.getUseCases().validateDocumentInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().validateDocketEntryInteractor,
    ).toHaveBeenCalled();
    expect(errorStub).toHaveBeenCalled();
  });

  it('should not cause an error if filers is empty with document type', async () => {
    applicationContext
      .getUseCases()
      .validateDocumentInteractor.mockReturnValue(null);
    applicationContext
      .getUseCases()
      .validateDocketEntryInteractor.mockReturnValue({
        filers: 'error',
      });

    await runAction(validateDocumentAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockDocument,
        screenMetadata: {
          editType: 'Document',
        },
      },
    });

    expect(errorStub).not.toHaveBeenCalled();
  });

  it('should call the success path when no errors are found with a document', async () => {
    applicationContext
      .getUseCases()
      .validateDocumentInteractor.mockReturnValue(null);
    applicationContext
      .getUseCases()
      .validateDocketEntryInteractor.mockReturnValue(null);

    await runAction(validateDocumentAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockDocument,
        screenMetadata: {
          editType: 'Document',
        },
      },
    });

    expect(successStub).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().validateDocketEntryInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().validateDocumentInteractor,
    ).toHaveBeenCalled();
  });

  it('should call the success path when no errors are found with a court-issued document', async () => {
    applicationContext
      .getUseCases()
      .validateDocumentInteractor.mockReturnValue(null);
    applicationContext
      .getUseCases()
      .validateCourtIssuedDocketEntryInteractor.mockReturnValue(null);

    await runAction(validateDocumentAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockDocument,
        screenMetadata: {
          editType: 'CourtIssued',
        },
      },
    });

    expect(successStub).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().validateCourtIssuedDocketEntryInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().validateDocumentInteractor,
    ).toHaveBeenCalled();
  });

  it('should call the error path when any errors are found with a court-issued document', async () => {
    applicationContext
      .getUseCases()
      .validateDocumentInteractor.mockReturnValue(null);
    applicationContext
      .getUseCases()
      .validateCourtIssuedDocketEntryInteractor.mockReturnValue({
        validationErrors: 'error',
      });

    await runAction(validateDocumentAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockDocument,
        screenMetadata: {
          editType: 'CourtIssued',
        },
      },
    });

    expect(errorStub).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().validateCourtIssuedDocketEntryInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().validateDocumentInteractor,
    ).toHaveBeenCalled();
  });

  describe('filingDate', () => {
    it('does not overwrite errors returned from the validateDocumentInteractor if the user enters a two-digit year', async () => {
      applicationContext
        .getUseCases()
        .validateDocumentInteractor.mockReturnValue({
          filingDate: 'The date was invalid',
        });

      await runAction(validateDocumentAction, {
        modules: {
          presenter,
        },
        state: {
          form: {
            ...mockDocument,
            filingDate: '12-12-20',
          },
          screenMetadata: {
            editType: 'CourtIssued',
          },
        },
      });

      expect(errorStub.mock.calls[0][0].errors.filingDate).toEqual(
        'The date was invalid',
      );
    });
  });
});
