import { cognitoLocalWrapper } from './cognitoLocalWrapper';
const originalAdminCreateUser = jest.fn();
const cognitoMock = {
  adminCreateUser: originalAdminCreateUser,
};

cognitoLocalWrapper(cognitoMock);

describe('cognitoLocalWrapper', () => {
  const mockSub = 'eb1c37a6-2370-4afe-8490-c51a2f2b9073';
  const mockResponse = {
    User: {
      Attributes: [
        { Name: 'sub', Value: mockSub },
        { Name: 'email_verified', Value: 'True' },
        { Name: 'email', Value: 'example@example.com' },
        { Name: 'custom:role', Value: 'privatePractitioner' },
        { Name: 'name', Value: 'Joe Gilberto Langworth' },
      ],
      Enabled: true,
      UserStatus: 'FORCE_CHANGE_PASSWORD',
      Username: 'example@example.com',
    },
  };

  beforeAll(() => {
    originalAdminCreateUser.mockReturnValue({
      promise: jest.fn().mockResolvedValue(mockResponse),
    });
  });

  it('should modify the response object correctly', async () => {
    const response = await cognitoMock.adminCreateUser({}).promise();

    expect(response.User.Username).toBe(mockSub);
    expect(response.User.Attributes[0].Value).toBe(mockSub);

    expect(originalAdminCreateUser).toHaveBeenCalledWith(
      expect.objectContaining({ DesiredDeliveryMediums: ['EMAIL'] }),
    );
  });
});
