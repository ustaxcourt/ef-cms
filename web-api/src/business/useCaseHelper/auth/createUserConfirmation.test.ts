jest.mock(
  '@web-api/persistence/postgres/users/confirmationCodes/getUserConfirmationCode',
);
jest.mock(
  '@web-api/persistence/postgres/users/confirmationCodes/generateUserConfirmationCode',
);
jest.mock(
  '@web-api/persistence/postgres/users/confirmationCodes/refreshUserConfirmationCodeExpiration',
);
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { createUserConfirmation } from '@web-api/business/useCaseHelper/auth/createUserConfirmation';
import { generateUserConfirmationCode as generateUserConfirmationCodeMock } from '@web-api/persistence/postgres/users/confirmationCodes/generateUserConfirmationCode';
import { getUserConfirmationCode as getUserConfirmationCodeMock } from '@web-api/persistence/postgres/users/confirmationCodes/getUserConfirmationCode';
import { refreshUserConfirmationCodeExpiration as refreshUserConfirmationCodeExpirationMock } from '@web-api/persistence/postgres/users/confirmationCodes/refreshUserConfirmationCodeExpiration';
import qs from 'qs';

describe('createUserConfirmation', () => {
  const mockUserId = '674fdded-1d17-4081-b9fa-950abc677cee';
  const mockConfirmationCode = '60dd21b3-5abb-447f-b036-9794962252a0';
  const mockNewConfirmationCode = '6811248a-e7c1-400e-b11c-63bc0f476d35';
  const mockEmail = 'testing@example.com';
  const getUserConfirmationCode = jest.mocked(getUserConfirmationCodeMock);
  const generateUserConfirmationCode = jest.mocked(
    generateUserConfirmationCodeMock,
  );
  const refreshUserConfirmationCodeExpiration = jest.mocked(
    refreshUserConfirmationCodeExpirationMock,
  );

  beforeEach(() => {
    getUserConfirmationCode.mockResolvedValue(mockConfirmationCode);

    generateUserConfirmationCode.mockResolvedValue({
      confirmationCode: mockNewConfirmationCode,
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

    getUserConfirmationCode.mockResolvedValueOnce(undefined);

    await createUserConfirmation(applicationContext, {
      email: mockEmail,
      userId: mockUserId,
    });
    expect(getUserConfirmationCode).toHaveBeenCalledTimes(1);
    expect(generateUserConfirmationCode).toHaveBeenCalledTimes(1);
    expect(refreshUserConfirmationCodeExpiration).not.toHaveBeenCalled();
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
    expect(getUserConfirmationCode).toHaveBeenCalledTimes(1);
    expect(refreshUserConfirmationCodeExpiration).toHaveBeenCalledTimes(1);
    expect(generateUserConfirmationCode).not.toHaveBeenCalled();
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
