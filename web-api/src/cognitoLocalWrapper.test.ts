import { cognitoLocalWrapper } from './cognitoLocalWrapper';
const originalAdminCreateUser = jest.fn();
const originalAdminGetUser = jest.fn();
const original_SOME_NON_EXISTING_METHOD = jest.fn();

const cognitoMock = {
  SOME_NON_EXISTING_METHOD: original_SOME_NON_EXISTING_METHOD,
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
    originalAdminCreateUser.mockReturnValue({
      promise: jest.fn().mockResolvedValue(mockUserCreatedResponse),
    });
    originalAdminGetUser.mockReturnValue({
      promise: jest.fn().mockResolvedValue({}),
    });
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

  it('should reject call with FunctionUnsupported when local cognito is not yet configured', async () => {
    const mockParams = {
      ClientId: '480559f0-4d31-4743-9674-4bb8fea06684',
      Password: 'abc123',
      Username: mockUsername,
    };

    await expect(
      cognitoMock.SOME_NON_EXISTING_METHOD(mockParams).promise(),
    ).rejects.toEqual({ FunctionUnsupported: true, Params: mockParams });

    expect(original_SOME_NON_EXISTING_METHOD).not.toHaveBeenCalled();
  });
});
