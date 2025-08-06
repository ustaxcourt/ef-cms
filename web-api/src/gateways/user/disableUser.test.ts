import { disableUser } from '@web-api/gateways/user/disableUser';

jest.mock('@web-api/environment', () => ({
  environment: {
    userPoolId: 'test',
  },
}));

const mockAdminDisableUser = jest.fn();
jest.mock('@web-api/persistence/cognito/getCognito', () => ({
  getCognito: () => ({
    adminDisableUser: mockAdminDisableUser,
  }),
}));

describe('disableUser', () => {
  it('should make a call to disable the user with the provided email, lowercased', async () => {
    const mockEmail = 'TeST@example.com';
    const mockUserPoolId = 'test';

    await disableUser({
      email: mockEmail,
    });

    expect(
      mockAdminDisableUser
    ).toHaveBeenCalledWith({
      UserPoolId: mockUserPoolId,
      Username: 'test@example.com',
    });
  });
});
