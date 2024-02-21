import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { checkEmailAvailabilityForPetitionerAction } from './checkEmailAvailabilityForPetitionerAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('checkEmailAvailabilityForPetitionerAction', () => {
  const mockEmail = 'someone@example.com';

  let mockEmailAvailablePath;
  let mockEmailInUsePath;
  let mockaccountIsUnverifiedPath;

  beforeEach(() => {
    mockEmailAvailablePath = jest.fn();
    mockEmailInUsePath = jest.fn();
    mockaccountIsUnverifiedPath = jest.fn();

    presenter.providers.applicationContext = applicationContext;

    presenter.providers.path = {
      accountIsUnconfirmed: mockaccountIsUnverifiedPath,
      emailAvailable: mockEmailAvailablePath,
      emailInUse: mockEmailInUsePath,
    };
  });

  it('should call checkEmailAvailabilityInteractor with state.form.contact.email', async () => {
    applicationContext
      .getUseCases()
      .checkEmailAvailabilityInteractor.mockResolvedValue({
        isAccountUnverified: false,
        isEmailAvailable: false,
      });

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

  it('should call path.emailAvailable when the email is not already associated with an account in the system', async () => {
    applicationContext
      .getUseCases()
      .checkEmailAvailabilityInteractor.mockResolvedValue({
        isAccountUnverified: true,
        isEmailAvailable: true,
      });

    await runAction(checkEmailAvailabilityForPetitionerAction, {
      modules: {
        presenter,
      },
      state: {
        form: { contact: { email: mockEmail } },
      },
    });

    expect(mockEmailAvailablePath).toHaveBeenCalled();
  });

  it('should call path.accountIsUnconfirmed when the email is already associated with an account in the system but it is unverified', async () => {
    applicationContext
      .getUseCases()
      .checkEmailAvailabilityInteractor.mockResolvedValue({
        isAccountUnverified: false,
        isEmailAvailable: false,
      });

    await runAction(checkEmailAvailabilityForPetitionerAction, {
      modules: {
        presenter,
      },
      state: {
        form: { contact: { updatedEmail: mockEmail } },
      },
    });

    expect(mockaccountIsUnverifiedPath).toHaveBeenCalled();
  });

  it('should call path.emailInUse with an error when the email is already associated with an account in the system', async () => {
    applicationContext
      .getUseCases()
      .checkEmailAvailabilityInteractor.mockResolvedValue({
        isAccountUnverified: true,
        isEmailAvailable: false,
      });

    await runAction(checkEmailAvailabilityForPetitionerAction, {
      modules: {
        presenter,
      },
      state: {
        form: { contact: { updatedEmail: mockEmail } },
      },
    });

    expect(mockEmailInUsePath.mock.calls[0][0]).toMatchObject({
      errors: {
        email:
          'An account with this email already exists. Enter a new email address.',
      },
    });
  });
});
