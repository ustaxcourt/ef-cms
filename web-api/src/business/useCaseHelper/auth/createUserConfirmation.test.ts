import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { createUserConfirmation } from '@web-api/business/useCaseHelper/auth/createUserConfirmation';

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
    const mockVerificationLink = `https://app.${process.env.EFCMS_DOMAIN}/confirm-signup?confirmationCode=${mockNewConfirmationCode}&email=${mockEmail}&userId=${mockUserId}`;
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
    ).toEqual(`<div>
    <h3>Welcome to DAWSON!</h3>
    <span>
      Your account with DAWSON has been created. Use the button below to verify your email address. After 24 hours, this link will expire. 
    </span>
    <div style="margin-top: 20px;">
      <a href="${mockVerificationLink}" style="background-color: #005ea2; color: white; line-height: 0.9; border-radius: 0.25rem; text-decoration: none; font-size: 1.06rem; padding: .6rem 2.25rem; font-family: Source Sans Pro Web,Helvetica Neue,Helvetica,Roboto,Arial,sans-serif;">Verify Email</a>
    </div>
    <div style="margin-top: 20px;">
    <span>Or you can use this URL: </span>
    <a href="${mockVerificationLink}">${mockVerificationLink}</a>
  </div>
    <div style="margin-top: 20px;">
      <span>If you did not create an account with DAWSON, please contact support at <a href="mailto:dawson.support@ustaxcourt.gov">dawson.support@ustaxcourt.gov</a>.</span>
    </div>
    <hr style="border-top:1px solid #000000;">
    <div style="margin-top: 20px;">
      <span>This is an automated email. We are unable to respond to any messages to this email address.</span>
    </div>
  </div>`);
  });

  it('should refresh the existing confirmation code when it already exists', async () => {
    const mockVerificationLink = `https://app.${process.env.EFCMS_DOMAIN}/confirm-signup?confirmationCode=${mockConfirmationCode}&email=${mockEmail}&userId=${mockUserId}`;

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
    ).toEqual(`<div>
    <h3>Welcome to DAWSON!</h3>
    <span>
      Your account with DAWSON has been created. Use the button below to verify your email address. After 24 hours, this link will expire. 
    </span>
    <div style="margin-top: 20px;">
      <a href="${mockVerificationLink}" style="background-color: #005ea2; color: white; line-height: 0.9; border-radius: 0.25rem; text-decoration: none; font-size: 1.06rem; padding: .6rem 2.25rem; font-family: Source Sans Pro Web,Helvetica Neue,Helvetica,Roboto,Arial,sans-serif;">Verify Email</a>
    </div>
    <div style="margin-top: 20px;">
    <span>Or you can use this URL: </span>
    <a href="${mockVerificationLink}">${mockVerificationLink}</a>
  </div>
    <div style="margin-top: 20px;">
      <span>If you did not create an account with DAWSON, please contact support at <a href="mailto:dawson.support@ustaxcourt.gov">dawson.support@ustaxcourt.gov</a>.</span>
    </div>
    <hr style="border-top:1px solid #000000;">
    <div style="margin-top: 20px;">
      <span>This is an automated email. We are unable to respond to any messages to this email address.</span>
    </div>
  </div>`);
  });
});
