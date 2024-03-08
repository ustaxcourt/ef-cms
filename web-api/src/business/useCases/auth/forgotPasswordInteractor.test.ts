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

  beforeEach(() => {
    process.env.STAGE = 'local';

    applicationContext
      .getUserGateway()
      .getUserByEmail.mockResolvedValue(mockUser);

    applicationContext
      .getUseCaseHelpers()
      .createUserConfirmation.mockResolvedValue({
        confirmationCode: mockConfirmationCode,
      });
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('should return early when user account does not exist', async () => {
    applicationContext
      .getUserGateway()
      .getUserByEmail.mockResolvedValue(undefined);

    await forgotPasswordInteractor(applicationContext, {
      email,
    });

    expect(
      applicationContext.getUserGateway().getUserByEmail,
    ).toHaveBeenCalledWith(applicationContext, { email });
    expect(
      applicationContext.getUseCaseHelpers().createUserConfirmation,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getCognito().adminCreateUser,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getMessageGateway().sendEmailToUser,
    ).not.toHaveBeenCalled();
  });

  it('should throw an UnauthorizedError and resend an account confirmation email when the user`s account is unconfirmed', async () => {
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
      applicationContext.getUserGateway().getUserByEmail,
    ).toHaveBeenCalledWith(applicationContext, { email });
    expect(
      applicationContext.getUseCaseHelpers().createUserConfirmation,
    ).toHaveBeenCalledWith(applicationContext, {
      email,
      userId: mockUser.userId,
    });
  });

  it('should throw an UnauthorizedError and resend a password change email when user`s account is in a force change password state', async () => {
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
      applicationContext.getCognito().adminCreateUser,
    ).not.toHaveBeenCalledWith({
      TemporaryPassword: undefined,
    });
  });

  it('should throw an UnauthorizedErrorresend a password change email when user`s account is in a force change password state (with TemporaryPassword on non-prod environments)', async () => {
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
      applicationContext.getUserGateway().getUserByEmail,
    ).toHaveBeenCalledWith(applicationContext, { email });
    expect(
      applicationContext.getCognito().adminCreateUser,
    ).toHaveBeenCalledWith({
      DesiredDeliveryMediums: ['EMAIL'],
      MessageAction: 'RESEND',
      TemporaryPassword: process.env.DEFAULT_ACCOUNT_PASS,
      UserPoolId: applicationContext.environment.userPoolId,
      Username: email,
    });
  });

  it('should call forgotPassword when user account has a valid status', async () => {
    await forgotPasswordInteractor(applicationContext, {
      email,
    });

    expect(
      applicationContext.getUserGateway().getUserByEmail,
    ).toHaveBeenCalledWith(applicationContext, { email });
    expect(
      applicationContext.getUserGateway().forgotPassword,
    ).toHaveBeenCalledWith(applicationContext, {
      email,
    });
  });
});
