jest.mock('../../genericHandler');
jest.mock('@web-api/business/useCases/auth/exchangeAuthCodeInteractor');
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { genericHandler as genericHandlerMock } from '../../genericHandler';
import { exchangeAuthCodeInteractor as exchangeAuthCodeInteractorMock } from '@web-api/business/useCases/auth/exchangeAuthCodeInteractor';
import { exchangeAuthCodeLambda } from '@web-api/lambdas/auth/exchangeAuthCodeLambda';

describe('exchangeAuthCodeLambda', () => {
  const genericHandler = genericHandlerMock as jest.Mock;
  const exchangeAuthCodeInteractor =
    exchangeAuthCodeInteractorMock as jest.Mock;
  genericHandler.mockImplementation((_awsEvent, cb) => {
    return cb({ applicationContext });
  });
  exchangeAuthCodeInteractor.mockResolvedValue({
    accessToken: 'accessToken',
    idToken: 'idToken',
    refreshToken: 'refreshToken',
    expiresAt: '2026-10-01T00:00:00-04:00',
  });

  it('should run interactor with correct arguments, return response, and set refresh cookie', async () => {
    const response = await exchangeAuthCodeLambda({
      headers: {},
      body: '{"authCode": "12345", "code_verifier": "abcde"}',
    });

    expect(exchangeAuthCodeInteractor).toHaveBeenCalledWith(
      applicationContext,
      {
        authCode: '12345',
        code_verifier: 'abcde',
      },
      false,
    );

    expect(response.body).toEqual({
      accessToken: 'accessToken',
      idToken: 'idToken',
      refreshToken: 'refreshToken',
    });
    expect(response.statusCode).toEqual(200);
    expect(response.headers).toEqual({
      'Set-Cookie':
        'refreshToken=refreshToken; Expires=Thu, 01 Oct 2026 04:00:00 GMT; HttpOnly',
    });
  });

  it('should run interactor with isTestUser = true if x-test-user header is provided', async () => {
    await exchangeAuthCodeLambda({
      headers: { 'x-test-user': true },
      body: '{"authCode": "12345", "code_verifier": "abcde"}',
    });

    expect(exchangeAuthCodeInteractor).toHaveBeenCalledWith(
      applicationContext,
      {
        authCode: '12345',
        code_verifier: 'abcde',
      },
      true,
    );
  });
});
