import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { validateDocketRecordAction } from './validateDocketRecordAction';

presenter.providers.applicationContext = applicationContext;

describe('validateDocketRecordAction', () => {
  let successStub;
  let errorStub;

  let mockDocketRecord;

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    mockDocketRecord = {
      description: 'hello world',
      eventCode: 'HELLO',
      filingDate: '1990-01-01T05:00:00.000Z',
      index: 1,
    };

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the success path when no errors are found', async () => {
    applicationContext
      .getUseCases()
      .validateDocketRecordInteractor.mockReturnValue(null);

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
    expect(
      applicationContext.getUseCases().validateDocketRecordInteractor,
    ).toHaveBeenCalled();
  });

  it('should call the error path when any errors are found', async () => {
    applicationContext
      .getUseCases()
      .validateDocketRecordInteractor.mockReturnValue({
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
    expect(
      applicationContext.getUseCases().validateDocketRecordInteractor,
    ).toHaveBeenCalled();
  });

  it('should call the error path when any errors are found with a document', async () => {
    applicationContext
      .getUseCases()
      .validateDocketRecordInteractor.mockReturnValue(null);
    applicationContext
      .getUseCases()
      .validateDocketEntryInteractor.mockReturnValue({
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

    expect(
      applicationContext.getUseCases().validateDocketRecordInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().validateDocketEntryInteractor,
    ).toHaveBeenCalled();
    expect(errorStub).toHaveBeenCalled();
  });

  it('should call the success path when no errors are found with a document', async () => {
    applicationContext
      .getUseCases()
      .validateDocketRecordInteractor.mockReturnValue(null);
    applicationContext
      .getUseCases()
      .validateDocketEntryInteractor.mockReturnValue(null);

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
    expect(
      applicationContext.getUseCases().validateDocketEntryInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().validateDocketRecordInteractor,
    ).toHaveBeenCalled();
  });

  it('should call the success path when no errors are found with a court-issued document', async () => {
    applicationContext
      .getUseCases()
      .validateDocketRecordInteractor.mockReturnValue(null);
    applicationContext
      .getUseCases()
      .validateCourtIssuedDocketEntryInteractor.mockReturnValue(null);

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
    expect(
      applicationContext.getUseCases().validateCourtIssuedDocketEntryInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().validateDocketRecordInteractor,
    ).toHaveBeenCalled();
  });

  it('should call the error path when any errors are found with a court-issued document', async () => {
    applicationContext
      .getUseCases()
      .validateDocketRecordInteractor.mockReturnValue(null);
    applicationContext
      .getUseCases()
      .validateCourtIssuedDocketEntryInteractor.mockReturnValue({
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
    expect(
      applicationContext.getUseCases().validateCourtIssuedDocketEntryInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().validateDocketRecordInteractor,
    ).toHaveBeenCalled();
  });
});
