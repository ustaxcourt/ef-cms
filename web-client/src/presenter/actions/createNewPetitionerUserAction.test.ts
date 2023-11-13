import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { createNewPetitionerUserAction } from '@web-client/presenter/actions/createNewPetitionerUserAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('createNewPetitionerUserAction', () => {
  const mockSuccessPath = jest.fn();
  const mockErrorPath = jest.fn();

  const TEST_EMAIL = 'example@example.com';
  const TEST_NAME = 'John Cena';
  const TEST_PASSWORD = 'aA1!aaaa';
  const TEST_CONFIRM_PASSWORD = TEST_PASSWORD;

  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      error: mockErrorPath,
      success: mockSuccessPath,
    };
  });

  it('should call the success path when the account was created', async () => {
    const createUserCognitoInteractorResults = { UserConfirmed: {} };
    applicationContext
      .getUseCases()
      .createUserCognitoInteractor.mockResolvedValue(
        createUserCognitoInteractorResults,
      );

    const FORM = {
      confirmPassword: TEST_CONFIRM_PASSWORD,
      email: TEST_EMAIL,
      name: TEST_NAME,
      password: TEST_PASSWORD,
    };
    await runAction(createNewPetitionerUserAction, {
      modules: {
        presenter,
      },
      state: {
        form: FORM,
      },
    });

    expect(
      applicationContext.getUseCases().createUserCognitoInteractor.mock.calls
        .length,
    ).toEqual(1);
    expect(
      applicationContext.getUseCases().createUserCognitoInteractor.mock
        .calls[0][1],
    ).toEqual({
      user: {
        ...FORM,
        entityName: 'NewPetitionerUser',
      },
    });

    expect(mockSuccessPath.mock.calls.length).toEqual(1);
    expect(mockSuccessPath.mock.calls[0][0]).toEqual({ email: TEST_EMAIL });
    expect(mockErrorPath).not.toHaveBeenCalled();
  });

  it('should throw an error if the form does not pass validation', async () => {
    const FORM = {
      confirmPassword: TEST_CONFIRM_PASSWORD,
      email: TEST_EMAIL,
      name: TEST_NAME,
      password: TEST_PASSWORD + 'NOT MATCHING',
    };

    await expect(
      runAction(createNewPetitionerUserAction, {
        modules: {
          presenter,
        },
        state: {
          form: FORM,
        },
      }),
    ).rejects.toThrow();

    expect(
      applicationContext.getUseCases().createUserCognitoInteractor,
    ).not.toHaveBeenCalled();

    expect(mockSuccessPath).not.toHaveBeenCalled();
    expect(mockErrorPath).not.toHaveBeenCalled();
  });

  it('should call the error path when the account was not created', async () => {
    const createUserCognitoInteractorResults = {};
    applicationContext
      .getUseCases()
      .createUserCognitoInteractor.mockResolvedValue(
        createUserCognitoInteractorResults,
      );

    const FORM = {
      confirmPassword: TEST_CONFIRM_PASSWORD,
      email: TEST_EMAIL,
      name: TEST_NAME,
      password: TEST_PASSWORD,
    };
    await runAction(createNewPetitionerUserAction, {
      modules: {
        presenter,
      },
      state: {
        form: FORM,
      },
    });

    expect(
      applicationContext.getUseCases().createUserCognitoInteractor.mock.calls
        .length,
    ).toEqual(1);
    expect(
      applicationContext.getUseCases().createUserCognitoInteractor.mock
        .calls[0][1],
    ).toEqual({
      user: {
        ...FORM,
        entityName: 'NewPetitionerUser',
      },
    });

    expect(mockSuccessPath).not.toHaveBeenCalled();
    expect(mockErrorPath.mock.calls.length).toEqual(1);
    expect(mockErrorPath.mock.calls[0][0]).toEqual({
      alertError: {
        message:
          'Could not parse authentication results, please contact DAWSON user support',
        title: 'Error creating account',
      },
    });
  });

  it('should call the error path when the interactor throws an error because email already in system', async () => {
    applicationContext
      .getUseCases()
      .createUserCognitoInteractor.mockRejectedValueOnce({
        originalError: { response: { data: 'User already exists' } },
      });

    const FORM = {
      confirmPassword: TEST_CONFIRM_PASSWORD,
      email: TEST_EMAIL,
      name: TEST_NAME,
      password: TEST_PASSWORD,
    };

    const cognitoLoginUrl = 'cognitoLoginUrl';
    const cognitoRequestPasswordResetUrl = 'cognitoRequestPasswordResetUrl';

    await runAction(createNewPetitionerUserAction, {
      modules: {
        presenter,
      },
      state: {
        cognitoLoginUrl,
        cognitoRequestPasswordResetUrl,
        form: FORM,
      },
    });

    expect(
      applicationContext.getUseCases().createUserCognitoInteractor.mock.calls
        .length,
    ).toEqual(1);
    expect(
      applicationContext.getUseCases().createUserCognitoInteractor.mock
        .calls[0][1],
    ).toEqual({
      user: {
        ...FORM,
        entityName: 'NewPetitionerUser',
      },
    });

    expect(mockSuccessPath).not.toHaveBeenCalled();
    expect(mockErrorPath.mock.calls.length).toEqual(1);
    expect(mockErrorPath.mock.calls[0][0]).toEqual({
      alertError: {
        alertType: 'warning',
        message: `This email address is already associated with an account. You can <a href="${cognitoLoginUrl}">log in here</a>. If you forgot your password, you can <a href="${cognitoRequestPasswordResetUrl}">request a password reset</a>.`,
        title: 'Email address already has an account',
      },
    });
  });

  it('should call the error path when the interactor throws an error cognito throws', async () => {
    applicationContext
      .getUseCases()
      .createUserCognitoInteractor.mockRejectedValueOnce({
        message: 'SOME COGNITO ERROR',
      });

    const FORM = {
      confirmPassword: TEST_CONFIRM_PASSWORD,
      email: TEST_EMAIL,
      name: TEST_NAME,
      password: TEST_PASSWORD,
    };

    await runAction(createNewPetitionerUserAction, {
      modules: {
        presenter,
      },
      state: {
        form: FORM,
      },
    });

    expect(
      applicationContext.getUseCases().createUserCognitoInteractor.mock.calls
        .length,
    ).toEqual(1);
    expect(
      applicationContext.getUseCases().createUserCognitoInteractor.mock
        .calls[0][1],
    ).toEqual({
      user: {
        ...FORM,
        entityName: 'NewPetitionerUser',
      },
    });

    expect(mockSuccessPath).not.toHaveBeenCalled();
    expect(mockErrorPath.mock.calls.length).toEqual(1);
    expect(mockErrorPath.mock.calls[0][0]).toEqual({
      alertError: {
        message:
          'Could not create user account, please contact DAWSON user support',
        title: 'Error creating account',
      },
    });
  });
});
