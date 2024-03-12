import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { createNewPetitionerUserAction } from '@web-client/presenter/actions/CreateAccount/createNewPetitionerUserAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import React from 'react';

describe('createNewPetitionerUserAction', () => {
  const mockSuccessPath = jest.fn();
  const mockWarningPath = jest.fn();
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
      warning: mockWarningPath,
    };
  });

  it('should call the success path when the account was created successfully', async () => {
    applicationContext.getUseCases().signUpUserInteractor.mockResolvedValue({});

    await runAction(createNewPetitionerUserAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          confirmPassword: TEST_CONFIRM_PASSWORD,
          email: TEST_EMAIL,
          name: TEST_NAME,
          password: TEST_PASSWORD,
        },
      },
    });

    expect(
      applicationContext.getUseCases().signUpUserInteractor.mock.calls.length,
    ).toEqual(1);
    expect(
      applicationContext.getUseCases().signUpUserInteractor.mock.calls[0][1],
    ).toEqual({
      user: {
        confirmPassword: TEST_CONFIRM_PASSWORD,
        email: TEST_EMAIL,
        entityName: 'NewPetitionerUser',
        name: TEST_NAME,
        password: TEST_PASSWORD,
      },
    });
    expect(mockSuccessPath.mock.calls.length).toEqual(1);
    expect(mockErrorPath).not.toHaveBeenCalled();
  });

  it('should call the error path with a generic message when the account was not created because of an unknown error', async () => {
    applicationContext
      .getUseCases()
      .signUpUserInteractor.mockRejectedValue('Something unknown went wrong');

    await runAction(createNewPetitionerUserAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          confirmPassword: TEST_CONFIRM_PASSWORD,
          email: TEST_EMAIL,
          name: TEST_NAME,
          password: TEST_PASSWORD,
        },
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

  it('should call the error path when the provided email already in exists in the system as a confirmed user account', async () => {
    applicationContext.getUseCases().signUpUserInteractor.mockRejectedValue({
      originalError: { response: { data: 'User already exists' } },
    });

    await runAction(createNewPetitionerUserAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          confirmPassword: TEST_CONFIRM_PASSWORD,
          email: TEST_EMAIL,
          name: TEST_NAME,
          password: TEST_PASSWORD,
        },
      },
    });

    expect(
      applicationContext.getUseCases().signUpUserInteractor.mock.calls.length,
    ).toEqual(1);
    expect(
      applicationContext.getUseCases().signUpUserInteractor.mock.calls[0][1],
    ).toEqual({
      user: {
        confirmPassword: TEST_CONFIRM_PASSWORD,
        email: TEST_EMAIL,
        entityName: 'NewPetitionerUser',
        name: TEST_NAME,
        password: TEST_PASSWORD,
      },
    });
    expect(mockSuccessPath).not.toHaveBeenCalled();
    expect(mockWarningPath.mock.calls.length).toEqual(1);
    expect(mockWarningPath).toHaveBeenCalledWith({
      alertWarning: {
        message: (
          <>
            This email address is already associated with an account. You can{' '}
            <a href="/login">log in here</a>. If you forgot your password, you
            can <a href={'/forgot-password'}> request a password reset</a>.
          </>
        ),
        title: 'Email address already has an account',
      },
    });
  });

  it('should call the error path when the the provided email already in exists in the system as an unconfirmed user account', async () => {
    applicationContext.getUseCases().signUpUserInteractor.mockRejectedValue({
      originalError: { response: { data: 'User exists, email unconfirmed' } },
    });

    await runAction(createNewPetitionerUserAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          confirmPassword: TEST_CONFIRM_PASSWORD,
          email: TEST_EMAIL,
          name: TEST_NAME,
          password: TEST_PASSWORD,
        },
      },
    });

    expect(
      applicationContext.getUseCases().signUpUserInteractor.mock.calls.length,
    ).toEqual(1);
    expect(
      applicationContext.getUseCases().signUpUserInteractor.mock.calls[0][1],
    ).toEqual({
      user: {
        confirmPassword: TEST_CONFIRM_PASSWORD,
        email: TEST_EMAIL,
        entityName: 'NewPetitionerUser',
        name: TEST_NAME,
        password: TEST_PASSWORD,
      },
    });
    expect(mockSuccessPath).not.toHaveBeenCalled();
    expect(mockErrorPath.mock.calls.length).toEqual(1);
    expect(mockErrorPath).toHaveBeenCalledWith({
      alertError: {
        message: (
          <>
            The email address is associated with an account but is not verified.
            We sent an email with a link to verify the email address. If you
            don&apos;t see it, check your spam folder. If you&apos;re still
            having trouble, please contact{' '}
            <a href="mailto:dawson.support@ustaxcourt.gov">
              dawson.support@ustaxcourt.gov
            </a>
            .
          </>
        ),
        title: 'Email address not verified',
      },
    });
  });
});
