import {
  AdminDeleteUserCommand,
  AdminResetUserPasswordCommand,
  ListUsersCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  deleteUserFromCognito,
  getAllCognitoUsers,
  getEnabledCognitoUsers,
  resetUserPassword,
} from './cognito';

jest.mock('@aws-sdk/client-cognito-identity-provider');

describe('Cognito Helpers', () => {
  const mockUserPoolId = 'us-east-1_abc123';
  let mockCognito;

  beforeEach(() => {
    mockCognito = {
      send: jest.fn(),
    };
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getAllCognitoUsers', () => {
    it('retrieves all users from cognito with pagination', async () => {
      mockCognito.send
        .mockResolvedValueOnce({
          PaginationToken: 'token1',
          Users: [{ Username: 'user1' }],
        })
        .mockResolvedValueOnce({
          PaginationToken: undefined,
          Users: [{ Username: 'user2' }],
        });

      const users = await getAllCognitoUsers({
        UserPoolId: mockUserPoolId,
        cognito: mockCognito,
      });

      expect(users).toEqual([{ Username: 'user1' }, { Username: 'user2' }]);
      expect(mockCognito.send).toHaveBeenCalledTimes(2);
      expect(ListUsersCommand).toHaveBeenCalledWith({
        Limit: 60,
        PaginationToken: undefined,
        UserPoolId: mockUserPoolId,
      });
      expect(ListUsersCommand).toHaveBeenCalledWith({
        Limit: 60,
        PaginationToken: 'token1',
        UserPoolId: mockUserPoolId,
      });
    });

    it('handles a response where response.Users is undefined', async () => {
      mockCognito.send.mockResolvedValueOnce({
        PaginationToken: undefined,
        Users: undefined,
      });

      const users = await getAllCognitoUsers({
        UserPoolId: mockUserPoolId,
        cognito: mockCognito,
      });

      expect(users).toEqual([]);
    });

    it("throws an error if it can't connect to Cognito", async () => {
      mockCognito.send.mockRejectedValue(new Error('Cognito error'));

      await expect(
        getAllCognitoUsers({
          UserPoolId: mockUserPoolId,
          cognito: mockCognito,
        }),
      ).rejects.toThrow('Cognito error');
      expect(console.error).toHaveBeenCalledWith(
        'Error listing users:',
        expect.any(Error),
      );
    });

    it('paginates results using the provided Limit', async () => {
      mockCognito.send.mockResolvedValueOnce({
        Users: [],
      });

      await getAllCognitoUsers({
        Limit: 100,
        UserPoolId: mockUserPoolId,
        cognito: mockCognito,
      });

      expect(ListUsersCommand).toHaveBeenCalledWith(
        expect.objectContaining({
          Limit: 100,
        }),
      );
    });
  });

  describe('getEnabledCognitoUsers', () => {
    it('retrieves only enabled users from cognito', async () => {
      mockCognito.send.mockResolvedValueOnce({
        PaginationToken: undefined,
        Users: [
          { Enabled: true, Username: 'enabledUser' },
          { Enabled: false, Username: 'disabledUser' },
        ],
      });

      const users = await getEnabledCognitoUsers({
        UserPoolId: mockUserPoolId,
        cognito: mockCognito,
      });

      expect(users).toEqual([{ Enabled: true, Username: 'enabledUser' }]);
    });

    it('handles a response where response.Users is undefined', async () => {
      mockCognito.send.mockResolvedValueOnce({
        PaginationToken: undefined,
        Users: undefined,
      });

      const users = await getEnabledCognitoUsers({
        UserPoolId: mockUserPoolId,
        cognito: mockCognito,
      });

      expect(users).toEqual([]);
    });

    it("throws an error if it can't connect to Cognito", async () => {
      mockCognito.send.mockRejectedValue(new Error('Cognito error'));

      await expect(
        getEnabledCognitoUsers({
          UserPoolId: mockUserPoolId,
          cognito: mockCognito,
        }),
      ).rejects.toThrow('Cognito error');
      expect(console.error).toHaveBeenCalledWith(
        'Error listing users:',
        expect.any(Error),
      );
    });

    it('paginates results using the provided Limit', async () => {
      mockCognito.send.mockResolvedValueOnce({
        Users: [],
      });

      await getEnabledCognitoUsers({
        Limit: 100,
        UserPoolId: mockUserPoolId,
        cognito: mockCognito,
      });

      expect(ListUsersCommand).toHaveBeenCalledWith(
        expect.objectContaining({
          Limit: 100,
        }),
      );
    });
  });

  describe('deleteUserFromCognito', () => {
    it('returns true when user is successfully deleted', async () => {
      mockCognito.send.mockResolvedValueOnce({});

      const result = await deleteUserFromCognito({
        UserPoolId: mockUserPoolId,
        cognito: mockCognito,
        user: { Username: 'testUser' },
      });

      expect(result).toBe(true);
      expect(AdminDeleteUserCommand).toHaveBeenCalledWith({
        Username: 'testUser',
        UserPoolId: mockUserPoolId,
      });
      expect(console.log).toHaveBeenCalledWith('Deleted user: ', 'testUser');
    });

    it('returns false and logs an error when deletion fails', async () => {
      mockCognito.send.mockRejectedValue(new Error('Delete error'));

      const result = await deleteUserFromCognito({
        UserPoolId: mockUserPoolId,
        cognito: mockCognito,
        user: { Username: 'testUser' },
      });

      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        'Error deleting user Username: ',
        'testUser',
      );
    });
  });

  describe('resetUserPassword', () => {
    it('returns true when password is successfully reset', async () => {
      mockCognito.send.mockResolvedValueOnce({});

      const result = await resetUserPassword({
        Password: 'newPassword123!',
        UserPoolId: mockUserPoolId,
        cognito: mockCognito,
        user: { Username: 'testUser' },
      });

      expect(result).toBe(true);
      expect(AdminResetUserPasswordCommand).toHaveBeenCalledWith({
        Password: 'newPassword123!',
        Permanent: true,
        UserPoolId: mockUserPoolId,
        Username: 'testUser',
      });
      expect(console.log).toHaveBeenCalledWith(
        'Reset password for user: ',
        'testUser',
      );
    });

    it('returns false and logs error when password reset fails', async () => {
      mockCognito.send.mockRejectedValue(new Error('Reset error'));

      const result = await resetUserPassword({
        Password: 'newPassword123!',
        UserPoolId: mockUserPoolId,
        cognito: mockCognito,
        user: { Username: 'testUser' },
      });

      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        'Error resetting password for user: ',
        'testUser',
      );
    });
  });
});
