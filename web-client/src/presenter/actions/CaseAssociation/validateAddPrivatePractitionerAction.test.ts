import { applicationContextForClient } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateAddPrivatePractitionerAction } from './validateAddPrivatePractitionerAction';

describe('validateAddPrivatePractitioner', () => {
  let successStub;
  let errorStub;

  let mockAddPrivatePractitioner;

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    mockAddPrivatePractitioner = {
      representingPrimary: true,
      user: { userId: '15adf875-8c3c-4e94-91e9-a4c1bff51291' },
    };

    presenter.providers.applicationContext = applicationContextForClient;
    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the success path when no errors are found', async () => {
    applicationContextForClient
      .getUseCases()
      .validateAddPrivatePractitionerInteractor.mockReturnValue(null);

    await runAction(validateAddPrivatePractitionerAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockAddPrivatePractitioner,
      },
    });

    expect(successStub).toHaveBeenCalledTimes(1);
  });

  it('should call the error path when any errors are found', async () => {
    applicationContextForClient
      .getUseCases()
      .validateAddPrivatePractitionerInteractor.mockReturnValue('error');

    await runAction(validateAddPrivatePractitionerAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockAddPrivatePractitioner,
      },
    });

    expect(errorStub).toHaveBeenCalledTimes(1);
  });
});
