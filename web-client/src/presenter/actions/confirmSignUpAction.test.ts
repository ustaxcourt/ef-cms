import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { confirmSignUpAction } from './confirmSignUpAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('confirmSignUpAction', () => {
  const confirmationCode = '123456';
  const userEmail = 'someone@example.com';

  const mockYes = jest.fn();
  const mockNo = jest.fn();

  beforeAll(() => {
    presenter.providers.path = {
      no: mockNo,
      yes: mockYes,
    };

    applicationContext
      .getUseCases()
      .confirmSignUpLocalInteractor.mockReturnValue({});

    presenter.providers.applicationContext = applicationContext;
  });

  it('should call the confirmSignUpLocalInteractor with the user email and confirmation code from props and return path.yes when confirmSignUpLocalInteractor returns a response', async () => {
    await runAction(confirmSignUpAction, {
      modules: {
        presenter,
      },
      props: {
        confirmationCode,
        userEmail,
      },
      state: {},
    });

    expect(
      applicationContext.getUseCases().confirmSignUpLocalInteractor.mock
        .calls[0][1],
    ).toMatchObject({ confirmationCode, userEmail });
    expect(mockYes.mock.calls[0][0]).toEqual({
      alertSuccess: {
        alertType: 'success',
        message:
          'Your registration has been confirmed! You will be redirected shortly!',
        title: 'Account Confirmed Locally',
      },
    });
  });

  it('return an alertError when the confirmSignupLocalInteractor does not return a successful response', async () => {
    applicationContext
      .getUseCases()
      .confirmSignUpLocalInteractor.mockImplementationOnce(() => {
        throw new Error();
      });

    await runAction(confirmSignUpAction, {
      modules: {
        presenter,
      },
      props: {
        confirmationCode: 'bad code',
        userEmail,
      },
      state: {},
    });

    expect(mockNo.mock.calls[0][0]).toMatchObject({
      alertError: {
        message: 'Error confirming account',
      },
    });
  });
});
