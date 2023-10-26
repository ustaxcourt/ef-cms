import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { createNewAccountAction } from './createNewAccountAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('createNewAccountAction', () => {
  const email = 'something@example.com';
  const name = 'John James Jimothy';
  const password = 'Pa$$word!';

  const mockYes = jest.fn();
  const mockNo = jest.fn();

  beforeAll(() => {
    presenter.providers.path = {
      no: mockNo,
      yes: mockYes,
    };

    applicationContext
      .getUseCases()
      .createUserCognitoInteractor.mockReturnValue({});

    presenter.providers.applicationContext = applicationContext;
  });

  it('should get email, name, and password from state.form and pass them to createUserCognitoInteractor', async () => {
    await runAction(createNewAccountAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          email,
          name,
          password,
        },
      },
    });

    expect(
      applicationContext.getUseCases().createUserCognitoInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      user: {
        email,
        name,
        password,
      },
    });
  });

  it('should return a correctly formatted alertSuccess with a correctly formatted linkUrl when createUserCognitoInteractor returns successfully', async () => {
    const expectedAlertSuccess = {
      linkText: 'Verify Email',
      linkUrl:
        '/confirm-signup-local?confirmationCode=123456&email=something@example.com',
      message:
        'New user account created successfully for something@example.com! Please click the link below to verify your email address.',
      newTab: false,
    };

    await runAction(createNewAccountAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          email,
          name,
          password,
        },
      },
    });

    expect(mockYes.mock.calls[0][0]).toMatchObject({
      alertSuccess: expectedAlertSuccess,
    });
  });

  it('should return a correctly formatted alertError when createUserCognitoInteractor does not return successfully', async () => {
    applicationContext
      .getUseCases()
      .createUserCognitoInteractor.mockImplementationOnce(() => {
        throw new Error();
      });

    const expectedAlertError = {
      message:
        'New user account could not be created for something@example.com',
    };

    await runAction(createNewAccountAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          email,
          name,
          password,
        },
      },
    });

    expect(mockNo.mock.calls[0][0]).toMatchObject({
      alertError: expectedAlertError,
    });
  });
});
