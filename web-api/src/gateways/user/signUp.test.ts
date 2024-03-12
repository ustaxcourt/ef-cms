import { ROLES } from '@shared/business/entities/EntityConstants';
import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { signUp } from '@web-api/gateways/user/signUp';

describe('signUp', () => {
  it('should make a call to disable the user with the provided email', async () => {
    const mockEmail = 'test@example.com';
    const mockName = 'Test Petitioner';
    const mockPassword = 'P@ssword!';
    const mockRole = ROLES.petitioner;
    const mockUserId = '2a1aa887-6350-48dc-bb3b-9fe699eae776';
    const mockCognitoClientId = 'test';
    applicationContext.environment.cognitoClientId = mockCognitoClientId;
    applicationContext.getUniqueId.mockReturnValue(mockUserId);

    await signUp(applicationContext, {
      email: mockEmail,
      name: mockName,
      password: mockPassword,
      role: mockRole,
    });

    expect(applicationContext.getCognito().signUp).toHaveBeenCalledWith({
      ClientId: mockCognitoClientId,
      Password: mockPassword,
      UserAttributes: [
        {
          Name: 'email',
          Value: mockEmail,
        },
        {
          Name: 'name',
          Value: mockName,
        },
        {
          Name: 'custom:userId',
          Value: mockUserId,
        },
        {
          Name: 'custom:role',
          Value: mockRole,
        },
      ],
      Username: mockEmail,
    });
  });
});
