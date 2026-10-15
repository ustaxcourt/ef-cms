import { ALLOWLIST_FEATURE_FLAGS } from '@shared/business/entities/EntityConstants';
import { loginHelper } from '@web-client/presenter/computeds/Login/LoginHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';

describe('LoginHelper', () => {
  const originalEnv = {
    IDP_NAME: process.env.IDP_NAME,
  };

  let state;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    process.env.IDP_NAME = 'entraId';

    state = {
      featureFlags: {
        [ALLOWLIST_FEATURE_FLAGS.ALLOW_IDP_LOGIN.key]: true,
      },
    };
  });

  afterAll(() => {
    process.env.IDP_NAME = originalEnv.IDP_NAME;
  });

  it('should set showIdpLoginButton true if we have the feature flag and env variable', () => {
    const result = runCompute(loginHelper, { state });
    expect(result.showIdpLoginButton).toBeTruthy();
  });

  it('should set showIdpLoginButton false if missing an environment variable', () => {
    delete process.env.IDP_NAME;
    const result = runCompute(loginHelper, { state });
    expect(result.showIdpLoginButton).toBeFalsy();
  });

  it('should set showIdpLoginButton false if missing a feature flag', () => {
    state = {
      featureFlags: {
        [ALLOWLIST_FEATURE_FLAGS.ALLOW_IDP_LOGIN.key]: false,
      },
    };
    const result = runCompute(loginHelper, { state });
    expect(result.showIdpLoginButton).toBeFalsy();
  });
});
