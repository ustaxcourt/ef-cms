import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { createUserConfirmation } from '@web-api/business/useCaseHelper/auth/createUserConfirmation';
import qs from 'qs';

describe('createUserConfirmation', () => {
  const mockUserId = '674fdded-1d17-4081-b9fa-950abc677cee';
  const mockConfirmationCode = '60dd21b3-5abb-447f-b036-9794962252a0';
  const mockNewConfirmationCode = '6811248a-e7c1-400e-b11c-63bc0f476d35';
  const mockEmail = 'testing@example.com';

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getAccountConfirmationCode.mockReturnValue(mockConfirmationCode);

    applicationContext
      .getPersistenceGateway()
      .generateAccountConfirmationCode.mockReturnValue({
        confirmationCode: mockNewConfirmationCode,
      });

    applicationContext
      .getPersistenceGateway()
      .refreshConfirmationCodeExpiration.mockReturnValueOnce({
        confirmationCode: mockConfirmationCode,
      });
  });

  it('should generate a new confirmation code when one does not already exist and add said code to the verification email sent', async () => {
    const queryString = qs.stringify(
      {
        confirmationCode: mockNewConfirmationCode,
        email: mockEmail,
        userId: mockUserId,
      },
      { encode: true },
    );
    const mockVerificationLink = `https://app.${process.env.EFCMS_DOMAIN}/confirm-signup?${queryString}`;

    applicationContext
      .getPersistenceGateway()
      .getAccountConfirmationCode.mockReturnValueOnce(undefined);

    await createUserConfirmation(applicationContext, {
      email: mockEmail,
      userId: mockUserId,
    });
    expect(
      applicationContext.getPersistenceGateway().getAccountConfirmationCode,
    ).toHaveBeenCalledTimes(1);
    expect(
      applicationContext.getPersistenceGateway()
        .generateAccountConfirmationCode,
    ).toHaveBeenCalledTimes(1);
    expect(
      applicationContext.getPersistenceGateway()
        .refreshConfirmationCodeExpiration,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getMessageGateway().sendEmailToUser.mock.calls[0][1]
        .to,
    ).toEqual(mockEmail);
    expect(
      applicationContext.getMessageGateway().sendEmailToUser.mock.calls[0][1]
        .body,
    ).toContain(mockVerificationLink);
  });

  it('should reset the confirmation code expiration time to 24 hours when it already exists', async () => {
    const queryString = qs.stringify(
      {
        confirmationCode: mockConfirmationCode,
        email: mockEmail,
        userId: mockUserId,
      },
      { encode: true },
    );
    const mockVerificationLink = `https://app.${process.env.EFCMS_DOMAIN}/confirm-signup?${queryString}`;

    const result = await createUserConfirmation(applicationContext, {
      email: mockEmail,
      userId: mockUserId,
    });

    expect(result).toEqual({ confirmationCode: mockConfirmationCode });
    expect(
      applicationContext.getPersistenceGateway().getAccountConfirmationCode,
    ).toHaveBeenCalledTimes(1);
    expect(
      applicationContext.getPersistenceGateway()
        .refreshConfirmationCodeExpiration,
    ).toHaveBeenCalledTimes(1);
    expect(
      applicationContext.getPersistenceGateway()
        .generateAccountConfirmationCode,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getMessageGateway().sendEmailToUser.mock.calls[0][1]
        .to,
    ).toEqual(mockEmail);
    expect(
      applicationContext.getMessageGateway().sendEmailToUser.mock.calls[0][1]
        .body,
    ).toContain(mockVerificationLink);
  });
});
