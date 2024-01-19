import { cognitoLocalWrapper } from './cognitoLocalWrapper';
const originalAdminCreateUser = jest.fn();
const originalAdminGetUser = jest.fn();

const cognitoMock = {
  adminCreateUser: originalAdminCreateUser,
  adminGetUser: originalAdminGetUser,
  resendConfirmationCode: jest.fn(),
};

cognitoLocalWrapper(cognitoMock);

describe('cognitoLocalWrapper', () => {
  const mockSub = 'eb1c37a6-2370-4afe-8490-c51a2f2b9073';
  const mockUsername = 'TEST_USERNAME@TEST.COM';
  const mockUserCreatedResponse = {
    User: {
      Attributes: [
        { Name: 'sub', Value: mockSub },
        { Name: 'email_verified', Value: 'True' },
        { Name: 'email', Value: mockUsername },
        { Name: 'custom:role', Value: 'privatePractitioner' },
        { Name: 'name', Value: 'Joe Gilberto Langworth' },
      ],
      Enabled: true,
      UserStatus: 'FORCE_CHANGE_PASSWORD',
      Username: mockUsername,
    },
  };

  beforeAll(() => {
    originalAdminCreateUser.mockResolvedValue(mockUserCreatedResponse);
    originalAdminGetUser.mockResolvedValue({});
  });

  it('should modify the params and response object correctly when calling adminCreateUser', async () => {
    const response = await cognitoMock.adminCreateUser({}).promise();

    expect(response.User.Username).toBe(mockSub);
    expect(response.User.Attributes[0].Value).toBe(mockSub);

    expect(originalAdminCreateUser).toHaveBeenCalledWith(
      expect.objectContaining({ DesiredDeliveryMediums: ['EMAIL'] }),
    );
  });

  it('should not modify params when not calling adminCreateUser', async () => {
    await cognitoMock.adminGetUser({}).promise();

    expect(originalAdminGetUser).not.toHaveBeenCalledWith(
      expect.objectContaining({ DesiredDeliveryMediums: ['EMAIL'] }),
    );
  });

  it('should return a mocked method for "resendConfirmationCode"', async () => {
    const options = { Username: mockUsername };
    const results = await cognitoMock.resendConfirmationCode(options).promise();

    expect(results).toEqual({
      CodeDeliveryDetails: {
        AttributeName: 'Email',
        DeliveryMedium: 'Email',
        Destination: mockUsername,
      },
    });
  });
});
