jest.mock('@web-api/persistence/cognito/getCognito');
import { cognitoPreSignupLambdaHandler } from '@web-api/lambdas/cognitoPreSignup/cognitoPreSignupLambda';
import { getCognito as getCognitoMock } from '@web-api/persistence/cognito/getCognito';

const getCognito = jest.mocked(getCognitoMock);

const adminGetUser = jest.fn();
const adminLinkProviderForUser = jest.fn();

getCognito.mockReturnValue({
  adminGetUser,
  adminLinkProviderForUser,
} as unknown as ReturnType<typeof getCognitoMock>);

const userNotFoundException = new Error('User not found');
userNotFoundException.name = 'UserNotFoundException';

describe('cognitoPreSignupLambda', () => {
  const originalEnvironment = process.env;
  const userPoolId = 'userPoolId';
  const email = 'NewUser@example.com';
  const cognitoUserName = 'cognitoUserName';

  beforeAll(() => {
    process.env = {
      IDP_NAME: 'idp',
    };
  });

  beforeEach(() => {
    adminGetUser.mockReset();
    adminLinkProviderForUser.mockReset();
  });

  afterAll(() => {
    process.env = originalEnvironment;
  });

  it('should link an incoming user to an existing cognito user in the pool', async () => {
    adminGetUser.mockReturnValueOnce({
      Username: cognitoUserName,
    });

    await cognitoPreSignupLambdaHandler({
      userPoolId,
      request: {
        userAttributes: {
          email,
        },
      },
    });

    expect(getCognito().adminGetUser).toHaveBeenCalledWith({
      UserPoolId: userPoolId,
      Username: 'newuser@example.com',
    });
    expect(getCognito().adminLinkProviderForUser).toHaveBeenCalledWith({
      UserPoolId: userPoolId,
      SourceUser: {
        ProviderName: process.env.IDP_NAME,
        ProviderAttributeName: 'email',
        ProviderAttributeValue: email,
      },
      DestinationUser: {
        ProviderName: 'Cognito',
        ProviderAttributeValue: cognitoUserName,
      },
    });
  });

  it('should not try to link an incoming user if no cognito user exists in the pool', async () => {
    adminGetUser.mockRejectedValueOnce(userNotFoundException);

    await cognitoPreSignupLambdaHandler({
      userPoolId,
      request: {
        userAttributes: {
          email,
        },
      },
    });

    expect(getCognito().adminGetUser).toHaveBeenCalledWith({
      UserPoolId: userPoolId,
      Username: 'newuser@example.com',
    });
    expect(getCognito().adminLinkProviderForUser).not.toHaveBeenCalled();
  });

  it('should throw an exception if one besides UserNotFound occurs', async () => {
    adminGetUser.mockRejectedValueOnce(
      new Error('Error connecting with cognito'),
    );

    await expect(
      cognitoPreSignupLambdaHandler({
        userPoolId,
        request: {
          userAttributes: {
            email,
          },
        },
      }),
    ).rejects.toThrow('Error connecting with cognito');
  });
});
