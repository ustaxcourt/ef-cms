import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { checkEmailAvailabilityAction } from './checkEmailAvailabilityAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('checkEmailAvailabilityAction', () => {
  const mockEmail = 'someone@example.com';

  let pathEmailAvailableStub;
  let pathEmailInUseStub;

  beforeEach(() => {
    pathEmailAvailableStub = jest.fn();
    pathEmailInUseStub = jest.fn();

    presenter.providers.applicationContext = applicationContext;

    presenter.providers.path = {
      emailAvailable: pathEmailAvailableStub,
      emailInUse: pathEmailInUseStub,
    };

    applicationContext
      .getUseCases()
      .checkEmailAvailabilityInteractor.mockResolvedValue({
        isEmailAvailable: true,
      });
  });

  it('should call checkEmailAvailabilityInteractor with state.form.updatedEmail', async () => {
    await runAction(checkEmailAvailabilityAction, {
      modules: {
        presenter,
      },
      state: {
        form: { updatedEmail: mockEmail },
      },
    });

    expect(
      applicationContext.getUseCases().checkEmailAvailabilityInteractor.mock
        .calls[0][1],
    ).toMatchObject({ email: mockEmail });
  });

  it('should call checkEmailAvailabilityInteractor with state.form.email when state.form.updatedEmail is undefined', async () => {
    await runAction(checkEmailAvailabilityAction, {
      modules: {
        presenter,
      },
      state: {
        form: { email: mockEmail },
      },
    });

    expect(
      applicationContext.getUseCases().checkEmailAvailabilityInteractor.mock
        .calls[0][1],
    ).toMatchObject({ email: mockEmail });
  });

  it('should call path.emailAvailable when checkEmailAvailabilityInteractor returns true', async () => {
    await runAction(checkEmailAvailabilityAction, {
      modules: {
        presenter,
      },
      state: {
        form: { email: mockEmail },
      },
    });

    expect(pathEmailAvailableStub).toHaveBeenCalled();
  });

  it('should call path.emailInUse with an error when checkEmailAvailabilityInteractor returns false', async () => {
    applicationContext
      .getUseCases()
      .checkEmailAvailabilityInteractor.mockResolvedValueOnce({
        isEmailAvailable: false,
      });

    await runAction(checkEmailAvailabilityAction, {
      modules: {
        presenter,
      },
      state: {
        form: { email: mockEmail },
      },
    });

    expect(pathEmailInUseStub).toHaveBeenCalled();
    expect(pathEmailInUseStub.mock.calls[0][0]).toMatchObject({
      errors: {
        email:
          'An account with this email already exists. Enter a new email address.',
      },
    });
  });
});
