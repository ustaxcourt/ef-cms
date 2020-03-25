import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { validateDocketEntryAction } from './validateDocketEntryAction';

const applicationContext = applicationContextForClient;
presenter.providers.applicationContext = applicationContext;

describe('validateDocketEntryAction', () => {
  let successStub;
  let errorStub;

  let mockDocketEntry;

  beforeEach(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    mockDocketEntry = {
      data: 'hello world',
    };

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the success path when no errors are found', async () => {
    applicationContext
      .getUseCases()
      .validateDocketEntryInteractor.mockReturnValue(null);

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
    applicationContext
      .getUseCases()
      .validateDocketEntryInteractor.mockReturnValue('error');

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
