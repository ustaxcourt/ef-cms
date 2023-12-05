import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { resendVerificationLinkAction } from './resendVerificationLinkAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('resendVerificationLinkAction', () => {
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
      .resendVerificationLinkInteractor.mockResolvedValue(mockResponse);
  });

  it('should call the success path when we successfully call "resendVerificationLinkInteractor" with correct email', async () => {
    await runAction(resendVerificationLinkAction, {
      modules: {
        presenter,
      },
      state: {
        cognito: { email: TEST_EMAIL },
      },
    });

    expect(pathSuccessStub).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().resendVerificationLinkInteractor.mock
        .calls.length,
    ).toEqual(1);

    expect(
      applicationContext.getUseCases().resendVerificationLinkInteractor.mock
        .calls[0][1],
    ).toEqual({ email: TEST_EMAIL });
  });

  it('should call the error path when we call "resendVerificationLinkInteractor" but no CodeDeliveryDetails are returned', async () => {
    const mockResponse = {};
    applicationContext
      .getUseCases()
      .resendVerificationLinkInteractor.mockResolvedValueOnce(mockResponse);
    await runAction(resendVerificationLinkAction, {
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
      applicationContext.getUseCases().resendVerificationLinkInteractor.mock
        .calls.length,
    ).toEqual(1);

    expect(
      applicationContext.getUseCases().resendVerificationLinkInteractor.mock
        .calls[0][1],
    ).toEqual({ email: TEST_EMAIL });
  });

  it('should call the error path when "resendVerificationLinkInteractor" throws an error', async () => {
    applicationContext
      .getUseCases()
      .resendVerificationLinkInteractor.mockRejectedValue(
        new Error('TEST ERROR'),
      );
    await runAction(resendVerificationLinkAction, {
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
      applicationContext.getUseCases().resendVerificationLinkInteractor.mock
        .calls.length,
    ).toEqual(1);

    expect(
      applicationContext.getUseCases().resendVerificationLinkInteractor.mock
        .calls[0][1],
    ).toEqual({ email: TEST_EMAIL });
  });
});
