import { ROLES } from '@shared/business/entities/EntityConstants';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UserStatusType } from '@aws-sdk/client-cognito-identity-provider';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { forgotPasswordInteractor } from '@web-api/business/useCases/auth/forgotPasswordInteractor';
import qs from 'qs';

describe('forgotPasswordInteractor', () => {
  const OLD_ENV = process.env;

  const email = 'example@example.com';
  const name = 'Antoninus Sara';
  const userId = 'c3f56e3d-0e6e-44bb-98f1-7c4a91dca1b9';
  const userStatus = UserStatusType.CONFIRMED;
  const mockConfirmationCode = '09d0322d-12da-47c8-8d8b-cc76f97022c2';
  const mockUser = {
    accountStatus: userStatus,
    email,
    name,
    role: ROLES.petitioner,
    userId,
  };
  const expectedForgotPasswordCode = 'b0f56806-a9ab-4152-ac3f-2da231499368';

  beforeAll(() => {
    applicationContext
      .getUserGateway()
      .getUserByEmail.mockResolvedValue(mockUser);

    applicationContext
      .getUseCaseHelpers()
      .createUserConfirmation.mockResolvedValue({
        confirmationCode: mockConfirmationCode,
      });

    applicationContext
      .getPersistenceGateway()
      .generateForgotPasswordCode.mockResolvedValue({
        code: expectedForgotPasswordCode,
      });
  });

  beforeEach(() => {
    process.env.DEFAULT_ACCOUNT_PASS = 'password';
    process.env.STAGE = 'local';
  });

  afterEach(() => {
    applicationContext.environment.stage = 'local';
    process.env = OLD_ENV;
  });

  it('should return early when user account does not exist', async () => {
    applicationContext
      .getUserGateway()
      .getUserByEmail.mockResolvedValueOnce(undefined);

    const result = await forgotPasswordInteractor(applicationContext, {
      email,
    });

    expect(
      applicationContext.getUserGateway().getUserByEmail.mock.calls[0][1],
    ).toEqual({ email });
    expect(
      applicationContext.getUseCaseHelpers().createUserConfirmation,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getCognito().adminCreateUser,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getMessageGateway().sendEmailToUser,
    ).not.toHaveBeenCalled();

    expect(result).toBeUndefined();
  });

  it('should throw an UnauthorizedError and call createUserConfirmation when user account is unconfirmed', async () => {
    applicationContext.getUserGateway().getUserByEmail.mockResolvedValueOnce({
      ...mockUser,
      accountStatus: UserStatusType.UNCONFIRMED,
    });

    await expect(
      forgotPasswordInteractor(applicationContext, {
        email,
      }),
    ).rejects.toThrow(new UnauthorizedError('User is unconfirmed'));

    expect(
      applicationContext.getUserGateway().getUserByEmail.mock.calls[0][1],
    ).toEqual({ email });

    expect(
      applicationContext.getUseCaseHelpers().createUserConfirmation.mock
        .calls[0][1],
    ).toEqual({ email, userId: mockUser.userId });
  });

  it('should throw an UnauthorizedError and call adminCreateUser (without TemporaryPassword on prod) when user account is in FORCE_CHANGE_PASSWORD status', async () => {
    process.env.STAGE = 'prod';

    applicationContext.getUserGateway().getUserByEmail.mockResolvedValueOnce({
      ...mockUser,
      accountStatus: UserStatusType.FORCE_CHANGE_PASSWORD,
    });

    await expect(
      forgotPasswordInteractor(applicationContext, {
        email,
      }),
    ).rejects.toThrow(new UnauthorizedError('User is unconfirmed'));

    expect(
      applicationContext.getCognito().adminCreateUser.mock.calls[0][0]
        .TemporaryPassword,
    ).toBeUndefined();
  });

  it('should throw an UnauthorizedError and call adminCreateUser (with TemporaryPassword on non-prod environments) when user account is in FORCE_CHANGE_PASSWORD status', async () => {
    applicationContext.getUserGateway().getUserByEmail.mockResolvedValueOnce({
      ...mockUser,
      accountStatus: UserStatusType.FORCE_CHANGE_PASSWORD,
    });

    await expect(
      forgotPasswordInteractor(applicationContext, {
        email,
      }),
    ).rejects.toThrow(new UnauthorizedError('User is unconfirmed'));

    expect(
      applicationContext.getUserGateway().getUserByEmail.mock.calls[0][1],
    ).toEqual({ email });
    expect(
      applicationContext.getUseCaseHelpers().createUserConfirmation,
    ).not.toHaveBeenCalled();

    expect(
      applicationContext.getCognito().adminCreateUser.mock.calls[0][0],
    ).toEqual({
      DesiredDeliveryMediums: ['EMAIL'],
      MessageAction: 'RESEND',
      TemporaryPassword: process.env.DEFAULT_ACCOUNT_PASS,
      UserPoolId: applicationContext.environment.userPoolId,
      Username: email,
    });
  });

  it('should generate a forgot password code and send it to the user when user account has a valid status', async () => {
    const queryString = qs.stringify(
      { code: expectedForgotPasswordCode, email },
      { encode: true },
    );
    const expectedVerificationLink = `https://app.${process.env.EFCMS_DOMAIN}/reset-password?${queryString}`;

    const result = await forgotPasswordInteractor(applicationContext, {
      email,
    });

    expect(
      applicationContext.getUserGateway().getUserByEmail.mock.calls[0][1],
    ).toEqual({ email });
    expect(
      applicationContext.getUseCaseHelpers().createUserConfirmation,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getCognito().adminCreateUser,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().generateForgotPasswordCode.mock
        .calls[0][1],
    ).toEqual({ userId: mockUser.userId });
    expect(
      applicationContext.getMessageGateway().sendEmailToUser.mock.calls[0][1]
        .subject,
    ).toEqual('U.S. Tax Court DAWSON Account Verification');
    expect(
      applicationContext.getMessageGateway().sendEmailToUser.mock.calls[0][1]
        .to,
    ).toEqual(email);
    expect(
      applicationContext.getMessageGateway().sendEmailToUser.mock.calls[0][1]
        .body,
    ).toEqual(`<div>
    <h3>Welcome to DAWSON!</h3>
    <span>
      ${email} requested a password reset. Use the button below to reset your password. <span style="font-weight: bold;">This will expire in 24 hours</span>.
    </span>
    <div style="margin-top: 20px;">
      <a href="${expectedVerificationLink}" style="background-color: #005ea2; color: white; line-height: 0.9; border-radius: 0.25rem; text-decoration: none; font-size: 1.06rem; padding: .6rem 2.25rem; font-family: Source Sans Pro Web,Helvetica Neue,Helvetica,Roboto,Arial,sans-serif;">Reset Password</a>
    </div>
    <div style="margin-top: 20px;">
      <span>Or you can use this URL: </span>
      <a href="${expectedVerificationLink}">${expectedVerificationLink}</a>
    </div>
    <div style="margin-top: 20px;">
    <span>If you did not request to reset your password, contact <a href="mailto:dawson.support@ustaxcourt.gov">dawson.support@ustaxcourt.gov</a>.</span>
    </div>

    <hr style="border-top:1px solid #000000;">
    <div style="margin-top: 20px;">
      <span>This is an automated email. We are unable to respond to any messages to this email address.</span>
    </div>
  </div>`);

    expect(result).toEqual({
      code: expectedForgotPasswordCode,
      email,
      userId: mockUser.userId,
    });
  });

  it('should omit code and userId from response when not on local', async () => {
    applicationContext.environment.stage = 'notLocal';

    const result = await forgotPasswordInteractor(applicationContext, {
      email,
    });

    expect(result).toEqual({
      email,
    });
  });
});
