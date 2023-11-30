import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { cognitoResendVerificationLinkAction } from './cognitoResendVerificationLinkAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('cognitoResendVerificationLinkAction', () => {
  const pathSuccessStub = jest.fn();
  const pathErrorStub = jest.fn();

  const TEST_EMAIL = 'example@example.com';

  beforeAll(() => {
    presenter.providers.path = {
      error: pathErrorStub,
      success: pathSuccessStub,
    };
    presenter.providers.applicationContext = applicationContext;

    const mockResponse = { CodeDeliveryDetails: {} };
    applicationContext
      .getUseCases()
      .cognitoResendVerificationLinkInteractor.mockResolvedValue(mockResponse);
  });

  it('should call the success path when we successfully call "cognitoResendVerificationLinkInteractor" with correct email', async () => {
    await runAction(cognitoResendVerificationLinkAction, {
      modules: {
        presenter,
      },
      state: {
        cognito: { email: TEST_EMAIL },
      },
    });

    expect(pathSuccessStub).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().cognitoResendVerificationLinkInteractor
        .mock.calls.length,
    ).toEqual(1);

    expect(
      applicationContext.getUseCases().cognitoResendVerificationLinkInteractor
        .mock.calls[0][1],
    ).toEqual({ email: TEST_EMAIL });
  });

  it('should call the error path when we call "cognitoResendVerificationLinkInteractor" but no CodeDeliveryDetails are returned', async () => {
    const mockResponse = {};
    applicationContext
      .getUseCases()
      .cognitoResendVerificationLinkInteractor.mockResolvedValueOnce(
        mockResponse,
      );
    await runAction(cognitoResendVerificationLinkAction, {
      modules: {
        presenter,
      },
      state: {
        cognito: { email: TEST_EMAIL },
      },
    });

    expect(pathErrorStub).toHaveBeenCalledWith({
      alertError: {
        alertType: 'error',
        message:
          'Unable parse out the code delivery details, please contact DAWSON user support',
        title: 'Unable to resend confirmation link',
      },
    });
    expect(
      applicationContext.getUseCases().cognitoResendVerificationLinkInteractor
        .mock.calls.length,
    ).toEqual(1);

    expect(
      applicationContext.getUseCases().cognitoResendVerificationLinkInteractor
        .mock.calls[0][1],
    ).toEqual({ email: TEST_EMAIL });
  });

  it('should call the error path when "cognitoResendVerificationLinkInteractor" throws an error', async () => {
    applicationContext
      .getUseCases()
      .cognitoResendVerificationLinkInteractor.mockRejectedValue(
        new Error('TEST ERROR'),
      );
    await runAction(cognitoResendVerificationLinkAction, {
      modules: {
        presenter,
      },
      state: {
        cognito: { email: TEST_EMAIL },
      },
    });

    expect(pathErrorStub).toHaveBeenCalledWith({
      alertError: {
        alertType: 'error',
        message:
          'Could not resend verification link, please contact DAWSON user support',
        title: 'Unable to resend confirmation link',
      },
    });

    expect(
      applicationContext.getUseCases().cognitoResendVerificationLinkInteractor
        .mock.calls.length,
    ).toEqual(1);

    expect(
      applicationContext.getUseCases().cognitoResendVerificationLinkInteractor
        .mock.calls[0][1],
    ).toEqual({ email: TEST_EMAIL });
  });
});
