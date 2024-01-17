import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { confirmSignUpAction } from './confirmSignUpAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('confirmSignUpAction', () => {
  const mockConfirmationCode = '03588683-483b-4f37-826a-9295089c82a6';
  const mockEmail = 'someone@example.com';
  const mockUserId = '976f5b46-d509-4b4a-a02f-8cbc86dd3e35';

  const mockSuccessPath = jest.fn();
  const mockErrorPath = jest.fn();

  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;

    presenter.providers.path = {
      error: mockErrorPath,
      success: mockSuccessPath,
    };
  });

  it('should return path.success when the user is confirmed successfully', async () => {
    await runAction(confirmSignUpAction, {
      modules: {
        presenter,
      },
      props: {
        confirmationCode: mockConfirmationCode,
        email: mockEmail,
        userId: mockUserId,
      },
    });

    expect(
      applicationContext.getUseCases().confirmSignUpInteractor.mock.calls[0][1],
    ).toMatchObject({
      confirmationCode: mockConfirmationCode,
      email: mockEmail,
      userId: mockUserId,
    });
    expect(mockSuccessPath.mock.calls[0][0]).toEqual({
      alertSuccess: {
        message:
          'Your email address is verified. You can now sign in to DAWSON.',
        title: 'Email address verified',
      },
    });
  });

  it('should return an path.error when the link the user clicked is more than 24 hours old and therefore the confirmation link has expired', async () => {
    applicationContext
      .getUseCases()
      .confirmSignUpInteractor.mockRejectedValue({});

    await runAction(confirmSignUpAction, {
      modules: {
        presenter,
      },
      props: {
        confirmationCode: mockConfirmationCode,
        userEmail: mockEmail,
        userId: mockUserId,
      },
    });

    expect(mockErrorPath.mock.calls[0][0]).toMatchObject({
      alertError: {
        message:
          'Enter your email address and password below, then log in to be sent a new verification email.',
        title: 'Verification email link expired',
      },
    });
  });
});
