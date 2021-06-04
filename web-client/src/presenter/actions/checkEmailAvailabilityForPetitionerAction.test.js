import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { checkEmailAvailabilityForPetitionerAction } from './checkEmailAvailabilityForPetitionerAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('checkEmailAvailabilityForPetitionerAction', () => {
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
  });

  it('should call checkEmailAvailabilityInteractor with state.form.updatedEmail', async () => {
    await runAction(checkEmailAvailabilityForPetitionerAction, {
      modules: {
        presenter,
      },
      state: {
        form: { contact: { updatedEmail: mockEmail } },
      },
    });

    expect(
      applicationContext.getUseCases().checkEmailAvailabilityInteractor.mock
        .calls[0][1],
    ).toMatchObject({ email: mockEmail });
  });

  it('should call checkEmailAvailabilityInteractor with state.form.email when state.form.updatedEmail is undefined', async () => {
    await runAction(checkEmailAvailabilityForPetitionerAction, {
      modules: {
        presenter,
      },
      state: {
        form: { contact: { updatedEmail: mockEmail } },
      },
    });

    expect(
      applicationContext.getUseCases().checkEmailAvailabilityInteractor.mock
        .calls[0][1],
    ).toMatchObject({ email: mockEmail });
  });

  it('should call checkEmailAvailabilityInteractor with state.form.contact.email', async () => {
    await runAction(checkEmailAvailabilityForPetitionerAction, {
      modules: {
        presenter,
      },
      state: {
        form: { contact: { updatedEmail: mockEmail } },
      },
    });

    expect(
      applicationContext.getUseCases().checkEmailAvailabilityInteractor.mock
        .calls[0][1],
    ).toMatchObject({ email: mockEmail });
  });

  it('should call path.emailAvailable when checkEmailAvailabilityInteractor returns true', async () => {
    applicationContext
      .getUseCases()
      .checkEmailAvailabilityInteractor.mockReturnValue(true);

    await runAction(checkEmailAvailabilityForPetitionerAction, {
      modules: {
        presenter,
      },
      state: {
        form: { contact: { email: mockEmail } },
      },
    });

    expect(pathEmailAvailableStub).toHaveBeenCalled();
  });

  it('should call path.emailInUse with an error when checkEmailAvailabilityInteractor returns false', async () => {
    applicationContext
      .getUseCases()
      .checkEmailAvailabilityInteractor.mockReturnValue(false);

    await runAction(checkEmailAvailabilityForPetitionerAction, {
      modules: {
        presenter,
      },
      state: {
        form: { contact: { updatedEmail: mockEmail } },
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
