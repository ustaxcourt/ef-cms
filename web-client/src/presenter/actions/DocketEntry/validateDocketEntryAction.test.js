import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { validateDocketEntryAction } from './validateDocketEntryAction';

describe('validateDocketEntryAction', () => {
  let validateDocketEntryStub;
  let successStub;
  let errorStub;

  let mockDocketEntry;

  beforeEach(() => {
    validateDocketEntryStub = jest.fn();
    successStub = jest.fn();
    errorStub = jest.fn();

    mockDocketEntry = {
      data: 'hello world',
    };

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        validateDocketEntryInteractor: validateDocketEntryStub,
      }),
    };

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the success path when no errors are found', async () => {
    validateDocketEntryStub = jest.fn().mockReturnValue(null);
    await runAction(validateDocketEntryAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockDocketEntry,
      },
    });

    expect(successStub.mock.calls.length).toEqual(1);
  });

  it('should call the error path when any errors are found', async () => {
    validateDocketEntryStub = jest.fn().mockReturnValue('error');
    await runAction(validateDocketEntryAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockDocketEntry,
      },
    });

    expect(errorStub.mock.calls.length).toEqual(1);
  });
});
