import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { confirmSignUpInteractor } from './confirmSignUpInteractor';

describe('confirmSignUpInteractor', () => {
  const mockConfirmationCode = 'b4a9ccf0-ad83-4aa5-9241-90bc88f29c5d';
  const mockUserId = '8a36f1bf-aa46-4495-b33f-4bb34319fa87';
  const mockEmail = 'example@example.com';

  it('should throw an error when the confirmation code has expired', async () => {
    applicationContext
      .getPersistenceGateway()
      .getAccountConfirmationCode(undefined);

    await expect(
      confirmSignUpInteractor(applicationContext, {
        confirmationCode: mockConfirmationCode,
        email: mockEmail,
        userId: mockUserId,
      }),
    ).rejects.toThrow('Confirmation code expired');
  });

  it('should throw an error when the user is not found in persistence by the provided email', async () => {
    applicationContext
      .getPersistenceGateway()
      .getAccountConfirmationCode.mockResolvedValue(mockConfirmationCode);
    applicationContext
      .getUserGateway()
      .getUserByEmail.mockResolvedValue(undefined);

    await expect(
      confirmSignUpInteractor(applicationContext, {
        confirmationCode: mockConfirmationCode,
        email: mockEmail,
        userId: mockUserId,
      }),
    ).rejects.toThrow(`User not found with email: ${mockEmail}`);
  });

  it('should make several calls to persistence to confirm the petitioner account', async () => {
    applicationContext
      .getPersistenceGateway()
      .getAccountConfirmationCode.mockResolvedValue(mockConfirmationCode);
    applicationContext.getCognito().adminConfirmSignUp.mockResolvedValue({});
    applicationContext
      .getUserGateway()
      .getUserByEmail.mockResolvedValue({ email: mockEmail });

    await confirmSignUpInteractor(applicationContext, {
      confirmationCode: mockConfirmationCode,
      email: mockEmail,
      userId: mockUserId,
    });

    expect(
      applicationContext.getCognito().adminConfirmSignUp,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getCognito().adminUpdateUserAttributes,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().createPetitionerAccountInteractor,
    ).toHaveBeenCalled();
  });
});
