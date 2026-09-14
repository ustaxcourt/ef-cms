import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { idpLoginAction } from '@web-client/presenter/actions/Login/idpLoginAction';
import { calculatePKCECodeChallenge } from 'openid-client';
jest.mock('openid-client', () => ({
  ...jest.requireActual('openid-client'),
  calculatePKCECodeChallenge: jest.fn(),
}));

describe('idpLoginAction', () => {
  let routeExternalStub: jest.Mock;
  const originalEnv = {
    IDP_NAME: process.env.IDP_NAME,
    MANAGED_LOGIN_DOMAIN: process.env.MANAGED_LOGIN_DOMAIN,
    COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID,
    EFCMS_DOMAIN: process.env.EFCMS_DOMAIN,
  };

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    routeExternalStub = jest.fn();
    process.env.IDP_NAME = 'entraId';
    process.env.MANAGED_LOGIN_DOMAIN = 'https://example.com';
    process.env.COGNITO_CLIENT_ID = 'test-client-id';
    process.env.EFCMS_DOMAIN = 'efcms.example.com';

    presenter.providers.applicationContext = applicationContext;
    presenter.providers.router = {
      externalRoute: routeExternalStub,
    };
  });

  afterAll(() => {
    process.env.IDP_NAME = originalEnv.IDP_NAME;
    process.env.MANAGED_LOGIN_DOMAIN = originalEnv.MANAGED_LOGIN_DOMAIN;
    process.env.COGNITO_CLIENT_ID = originalEnv.COGNITO_CLIENT_ID;
    process.env.EFCMS_DOMAIN = originalEnv.EFCMS_DOMAIN;
  });

  it('should successfully navigate to the idp login', async () => {
    (calculatePKCECodeChallenge as jest.Mock).mockResolvedValue('1234abcd');
    await expect(
      runAction(idpLoginAction, {
        modules: { presenter },
      }),
    ).resolves.not.toThrow();

    expect(routeExternalStub).toHaveBeenCalled();
    expect(routeExternalStub).toHaveBeenCalledTimes(1);
    const expectedCallValue = JSON.stringify(
      routeExternalStub.mock.calls[0][0],
    );
    expect(expectedCallValue).toEqual(
      // Could not get toHaveBeenCalledWith to work, this was the workaround
      // eslint-disable-next-line no-useless-escape
      '\"https://example.com/oauth2/authorize?identity_provider=entraId&redirect_uri=https%3A%2F%2Fapp.efcms.example.com%2Fauth-code&code_challenge=1234abcd&code_challenge_method=S256&client_id=test-client-id&response_type=code\"',
    );
  });

  describe('missing environment variables', () => {
    it('IDP name', async () => {
      delete process.env.IDP_NAME;
      await expect(runAction(idpLoginAction, {})).rejects.toThrow(
        'Missing env variables to perform idp login.',
      );
    });
    it('Managed login domain', async () => {
      delete process.env.MANAGED_LOGIN_DOMAIN;
      await expect(runAction(idpLoginAction, {})).rejects.toThrow(
        'Missing env variables to perform idp login.',
      );
    });
    it('Cognito client ID', async () => {
      delete process.env.COGNITO_CLIENT_ID;
      await expect(runAction(idpLoginAction, {})).rejects.toThrow(
        'Missing env variables to perform idp login.',
      );
    });
    it('EFCMS domain', async () => {
      delete process.env.EFCMS_DOMAIN;
      await expect(runAction(idpLoginAction, {})).rejects.toThrow(
        'Missing env variables to perform idp login.',
      );
    });
  });
});
