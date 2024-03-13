import { ROLES } from '@shared/business/entities/EntityConstants';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UserStatusType } from '@aws-sdk/client-cognito-identity-provider';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { forgotPasswordInteractor } from '@web-api/business/useCases/auth/forgotPasswordInteractor';

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

  beforeAll(() => {
    applicationContext
      .getUserGateway()
      .getUserByEmail.mockResolvedValue(mockUser);

    applicationContext
      .getUseCaseHelpers()
      .createUserConfirmation.mockResolvedValue({
        confirmationCode: mockConfirmationCode,
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

  it('should call forgotPassword when user account has a valid status', async () => {
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
      applicationContext.getCognito().forgotPassword.mock.calls[0][0],
    ).toEqual({
      ClientId: applicationContext.environment.cognitoClientId,
      Username: email,
    });

    expect(result).toBeUndefined();
  });
});
