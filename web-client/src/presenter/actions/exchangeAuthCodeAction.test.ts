import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { exchangeAuthCodeAction } from '@web-client/presenter/actions/exchangeAuthCodeAction';
import { authCodeInteractor } from '@web-client/proxies/auth/authCodeProxy';
jest.mock('@web-client/proxies/auth/authCodeProxy');

describe('exchangeAuthCodeAction', () => {
  const pathSuccessStub = jest.fn();
  const pathErrorStub = jest.fn();
  const mockauthCodeInteractor = authCodeInteractor as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  presenter.providers.applicationContext = applicationContext;

  presenter.providers.path = {
    success: pathSuccessStub,
    error: pathErrorStub,
  };

  it('should return success if auth code is successfully exchanged', async () => {
    const mockRespons = {
      accessToken: '123',
      idToken: '123abc',
      refreshToken: 'abc',
    };
    mockauthCodeInteractor.mockResolvedValue(mockRespons);

    await runAction(exchangeAuthCodeAction, {
      modules: {
        presenter,
      },
      props: {
        authCode: '1234abc',
      },
    });

    expect(mockauthCodeInteractor).toHaveBeenCalledTimes(1);
    expect(pathSuccessStub).toHaveBeenCalledTimes(1);
    expect(pathSuccessStub).toHaveBeenCalledWith({
      accessToken: '123',
      idToken: '123abc',
      refreshToken: 'abc',
    });
    expect(pathErrorStub).not.toHaveBeenCalled();
  });

  it('should return error if the auth code exchange fails', async () => {
    const mockError = { message: 'failed API call' };
    mockauthCodeInteractor.mockRejectedValue(mockError);

    await runAction(exchangeAuthCodeAction, {
      modules: {
        presenter,
      },
      props: {
        authCode: '1234abc',
      },
    });

    expect(mockauthCodeInteractor).toHaveBeenCalledTimes(1);
    expect(pathErrorStub).toHaveBeenCalledTimes(1);
    expect(pathErrorStub).toHaveBeenCalledWith({
      alertError: {
        message: 'Error when trying to login with Microsoft.',
      },
    });
    expect(pathSuccessStub).not.toHaveBeenCalled();
  });

  it('should return error if the redirect had an error', async () => {
    await runAction(exchangeAuthCodeAction, {
      modules: {
        presenter,
      },
      props: {
        error: 'Bad Request',
        errorDescription: 'Auth code expired.',
      },
    });

    expect(mockauthCodeInteractor).not.toHaveBeenCalled();
    expect(pathErrorStub).toHaveBeenCalledTimes(1);
    expect(pathErrorStub).toHaveBeenCalledWith({
      alertError: {
        title: 'Bad Request',
        message: 'Auth code expired.',
      },
    });
    expect(pathSuccessStub).not.toHaveBeenCalled();
  });
});
