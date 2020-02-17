import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { validateDocketRecordAction } from './validateDocketRecordAction';

describe('validateDocketRecordAction', () => {
  let validateDocketRecordInteractorStub;
  let validateDocketEntryInteractorStub;
  let validateCourtIssuedDocketEntryInteractorStub;
  let successStub;
  let errorStub;

  let mockDocketRecord;

  beforeEach(() => {
    validateDocketRecordInteractorStub = jest.fn();
    successStub = jest.fn();
    errorStub = jest.fn();
    validateDocketEntryInteractorStub = jest.fn();
    validateCourtIssuedDocketEntryInteractorStub = jest.fn();

    mockDocketRecord = {
      description: 'hello world',
      eventCode: 'HELLO',
      filingDate: '1990-01-01T05:00:00.000Z',
      index: 1,
    };

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        validateCourtIssuedDocketEntryInteractor: validateCourtIssuedDocketEntryInteractorStub,
        validateDocketEntryInteractor: validateDocketEntryInteractorStub,
        validateDocketRecordInteractor: validateDocketRecordInteractorStub,
      }),
    };

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the success path when no errors are found', async () => {
    validateDocketRecordInteractorStub.mockReturnValue(null);
    await runAction(validateDocketRecordAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockDocketRecord,
        screenMetadata: {
          editType: 'NoDocument',
        },
      },
    });

    expect(successStub).toHaveBeenCalled();
    expect(validateDocketRecordInteractorStub).toHaveBeenCalled();
  });

  it('should call the error path when any errors are found', async () => {
    validateDocketRecordInteractorStub.mockReturnValue({
      validationErrors: 'error',
    });
    await runAction(validateDocketRecordAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockDocketRecord,
        screenMetadata: {
          editType: 'NoDocument',
        },
      },
    });

    expect(errorStub).toHaveBeenCalled();
    expect(validateDocketRecordInteractorStub).toHaveBeenCalled();
  });

  it('should call the error path when any errors are found with a document', async () => {
    validateDocketRecordInteractorStub.mockReturnValue(null);
    validateDocketEntryInteractorStub.mockReturnValue({
      validationErrors: 'error',
    });

    await runAction(validateDocketRecordAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockDocketRecord,
        screenMetadata: {
          editType: 'Document',
        },
      },
    });

    expect(validateDocketRecordInteractorStub).toHaveBeenCalled();
    expect(validateDocketEntryInteractorStub).toHaveBeenCalled();
    expect(errorStub).toHaveBeenCalled();
  });

  it('should call the success path when no errors are found with a document', async () => {
    validateDocketRecordInteractorStub.mockReturnValue(null);
    validateDocketEntryInteractorStub.mockReturnValue(null);

    await runAction(validateDocketRecordAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockDocketRecord,
        screenMetadata: {
          editType: 'Document',
        },
      },
    });

    expect(successStub).toHaveBeenCalled();
    expect(validateDocketEntryInteractorStub).toHaveBeenCalled();
    expect(validateDocketRecordInteractorStub).toHaveBeenCalled();
  });

  it('should call the success path when no errors are found with a court-issued document', async () => {
    validateDocketRecordInteractorStub.mockReturnValue(null);
    validateCourtIssuedDocketEntryInteractorStub.mockReturnValue(null);

    await runAction(validateDocketRecordAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockDocketRecord,
        screenMetadata: {
          editType: 'CourtIssued',
        },
      },
    });

    expect(successStub).toHaveBeenCalled();
    expect(validateCourtIssuedDocketEntryInteractorStub).toHaveBeenCalled();
    expect(validateDocketRecordInteractorStub).toHaveBeenCalled();
  });

  it('should call the error path when any errors are found with a court-issued document', async () => {
    validateDocketRecordInteractorStub.mockReturnValue(null);
    validateCourtIssuedDocketEntryInteractorStub.mockReturnValue({
      validationErrors: 'error',
    });

    await runAction(validateDocketRecordAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockDocketRecord,
        screenMetadata: {
          editType: 'CourtIssued',
        },
      },
    });

    expect(errorStub).toHaveBeenCalled();
    expect(validateCourtIssuedDocketEntryInteractorStub).toHaveBeenCalled();
    expect(validateDocketRecordInteractorStub).toHaveBeenCalled();
  });
});
