import '@web-api/persistence/postgres/users/mocks.jest';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { confirmSignUpInteractor } from './confirmSignUpInteractor';
import { upsertUsers as upsertUsersMock } from '@web-api/persistence/postgres/users/upsertUsers';
import { getUserConfirmationCode as getUserConfirmationCodeMock } from '@web-api/persistence/postgres/users/getUserConfirmationCode';

const upsertUsers = upsertUsersMock as jest.Mock;
const getUserConfirmationCode = getUserConfirmationCodeMock as jest.Mock;

describe('confirmSignUpInteractor', () => {
  const mockConfirmationCode = 'b4a9ccf0-ad83-4aa5-9241-90bc88f29c5d';
  const mockUserId = '8a36f1bf-aa46-4495-b33f-4bb34319fa87';
  const mockEmail = 'example@example.com';

  it('should throw an error when the confirmation code has expired', async () => {
    getUserConfirmationCode(undefined);

    await expect(
      confirmSignUpInteractor(applicationContext, {
        confirmationCode: mockConfirmationCode,
        email: mockEmail,
        userId: mockUserId,
      }),
    ).rejects.toThrow('Confirmation code expired');
  });

  it('should throw an error when the user is not found in persistence by the provided email', async () => {
    getUserConfirmationCode.mockResolvedValue(mockConfirmationCode);
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
    getUserConfirmationCode.mockResolvedValue(mockConfirmationCode);
    applicationContext.getUserGateway().confirmSignUp.mockResolvedValue({});
    applicationContext.getUserGateway().getUserByEmail.mockResolvedValue({
      email: mockEmail,
      name: 'Test Petitioner',
    });

    await confirmSignUpInteractor(applicationContext, {
      confirmationCode: mockConfirmationCode,
      email: mockEmail,
      userId: mockUserId,
    });

    expect(
      applicationContext.getUserGateway().confirmSignUp,
    ).toHaveBeenCalled();
    expect(applicationContext.getUserGateway().updateUser).toHaveBeenCalled();
    expect(upsertUsers).toHaveBeenCalled();
  });
});
