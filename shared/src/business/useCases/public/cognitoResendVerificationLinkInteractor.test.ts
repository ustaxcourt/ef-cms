import { applicationContext } from '../../test/createTestApplicationContext';
import { cognitoResendVerificationLinkInteractor } from '@shared/business/useCases/public/cognitoResendVerificationLinkInteractor';

describe('cognitoResendVerificationLinkInteractor', () => {
  const TEST_EMAIL = 'SOME_TEST_EMAIL@EXAMPLE.COM';
  const TEST_COGNITO_CLIENT_ID = 'TEST_COGNITO_CLIENT_ID';

  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };

    applicationContext.getCognito().resendConfirmationCode.mockReturnValue({
      promise: () => {},
    });
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should call our "resendConfirmationCode" method with correct data', async () => {
    process.env.COGNITO_CLIENT_ID = TEST_COGNITO_CLIENT_ID;
    await cognitoResendVerificationLinkInteractor(applicationContext, {
      email: TEST_EMAIL,
    });

    expect(
      applicationContext.getCognito().resendConfirmationCode,
    ).toHaveBeenCalledWith({
      ClientId: TEST_COGNITO_CLIENT_ID,
      Username: TEST_EMAIL,
    });
  });
});
