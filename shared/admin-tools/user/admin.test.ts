jest.mock('@web-api/persistence/postgres/users/upsertUsers');
jest.mock('../util');
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import {
  legacyJudgeUser,
  MOCK_INTERNAL_USERS,
  MOCK_PRACTITIONER,
  MOCK_USERS,
  petitionerUser,
  petitionsClerkUser,
} from '@shared/test/mockUsers';
import {
  createOrUpdateUser,
  disableUser,
  enableUser,
  getAuthToken,
} from '../user/admin';
import { upsertUsers as upsertUsersMock } from '@web-api/persistence/postgres/users/upsertUsers';
import { User } from '@shared/business/entities/User';
import { mockClient } from 'aws-sdk-client-mock';
import {
  CognitoIdentityProvider,
  AdminEnableUserCommand,
  AdminDisableUserCommand,
  AdminInitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { getUserPoolId as getUserPoolIdMock } from '../util';
import { getClientId as getClientIdMock } from '../util';

const upsertUsers = jest.mocked(upsertUsersMock);
const getUserPoolId = jest.mocked(getUserPoolIdMock);
const getClientId = jest.mocked(getClientIdMock);

const cognitoMock = mockClient(CognitoIdentityProvider);

const password = 'pwd';
const userId = 'a5546ed1-6f67-4001-a2f7-0cf25e0489bb';
const MOCK_INTERNAL_USER = MOCK_INTERNAL_USERS[petitionsClerkUser.userId];
const { userPoolId } = applicationContext.environment;
const cognitoUserName = 'username';

describe('createOrUpdateUser', () => {
  const originalEnvironment = process.env;

  beforeAll(() => {
    applicationContext.getUniqueId.mockReturnValue(userId);
    applicationContext.getUserGateway().createUser.mockReturnValue({
      Username: cognitoUserName,
    });
    process.env = {
      IDP_NAME: 'idp',
    };
  });

  afterAll(() => {
    process.env = originalEnvironment;
  });

  it('should create a practitioner user', async () => {
    await createOrUpdateUser(applicationContext, {
      password,
      setPasswordAsPermanent: false,
      user: MOCK_PRACTITIONER,
    });

    expect(applicationContext.getUniqueId).toHaveBeenCalled();
    expect(upsertUsers.mock.calls[0][0][0].entityName).toEqual('Practitioner');
    expect(
      applicationContext.getUserGateway().updateUser,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUserGateway().createUser.mock.calls[0][1],
    ).toMatchObject({
      email: MOCK_PRACTITIONER.email,
      name: MOCK_PRACTITIONER.name,
      poolId: userPoolId,
      role: MOCK_PRACTITIONER.role,
      sendWelcomeEmail: true,
      temporaryPassword: password,
      userId,
    });
    expect(
      applicationContext.getCognito().adminLinkProviderForUser,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUserGateway().disableUser,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getCognito().adminSetUserPassword,
    ).toHaveBeenCalledWith({
      Password: password,
      Permanent: false,
      UserPoolId: userPoolId,
      Username: MOCK_PRACTITIONER.email,
    });
  });

  it('should create an internal user', async () => {
    await createOrUpdateUser(applicationContext, {
      password,
      setPasswordAsPermanent: false,
      user: MOCK_INTERNAL_USER,
    });

    expect(applicationContext.getUniqueId).toHaveBeenCalled();
    expect(upsertUsers.mock.calls[0][0][0].entityName).toEqual('User');
    expect(
      applicationContext.getUserGateway().createUser.mock.calls[0][1],
    ).toMatchObject({
      email: MOCK_INTERNAL_USER.email,
      name: MOCK_INTERNAL_USER.name,
      poolId: applicationContext.environment.userPoolId,
      role: MOCK_INTERNAL_USER.role,
      sendWelcomeEmail: true,
      temporaryPassword: password,
      userId,
    });
    expect(
      applicationContext.getCognito().adminLinkProviderForUser,
    ).toHaveBeenCalledWith({
      UserPoolId: userPoolId,
      SourceUser: {
        ProviderName: 'idp',
        ProviderAttributeName: 'email',
        ProviderAttributeValue: MOCK_INTERNAL_USER.email,
      },
      DestinationUser: {
        ProviderName: 'Cognito',
        ProviderAttributeValue: cognitoUserName,
      },
    });
    expect(
      applicationContext.getUserGateway().disableUser,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getCognito().adminSetUserPassword,
    ).toHaveBeenCalledWith({
      Password: password,
      Permanent: false,
      UserPoolId: applicationContext.environment.userPoolId,
      Username: MOCK_INTERNAL_USER.email,
    });
  });

  it('should update a practitioner user', async () => {
    applicationContext.getUserGateway().getUserByEmail.mockReturnValueOnce({
      userId: MOCK_PRACTITIONER.userId,
      email: MOCK_PRACTITIONER.email,
      accountStatus: 'CONFIRMED',
      role: 'privatePractitoner',
      name: MOCK_PRACTITIONER.name,
    });

    await createOrUpdateUser(applicationContext, {
      password,
      setPasswordAsPermanent: false,
      user: MOCK_PRACTITIONER,
    });

    expect(applicationContext.getUniqueId).not.toHaveBeenCalled();
    expect(upsertUsers.mock.calls[0][0][0].entityName).toEqual('Practitioner');
    expect(
      applicationContext.getUserGateway().updateUser.mock.calls[0][1],
    ).toMatchObject({
      attributesToUpdate: {
        name: MOCK_PRACTITIONER.name,
        role: MOCK_PRACTITIONER.role,
      },
      email: MOCK_PRACTITIONER.email,
      poolId: userPoolId,
    });
    expect(
      applicationContext.getUserGateway().createUser,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getCognito().adminLinkProviderForUser,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUserGateway().disableUser,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getCognito().adminSetUserPassword,
    ).toHaveBeenCalledWith({
      Password: password,
      Permanent: false,
      UserPoolId: applicationContext.environment.userPoolId,
      Username: MOCK_PRACTITIONER.email,
    });
  });

  it('should update an internal user', async () => {
    applicationContext.getUserGateway().getUserByEmail.mockReturnValueOnce({
      userId: MOCK_INTERNAL_USER.userId,
      email: MOCK_INTERNAL_USER.email,
      accountStatus: 'CONFIRMED',
      role: 'petitionsClerk',
      name: MOCK_INTERNAL_USER.name,
    });

    await createOrUpdateUser(applicationContext, {
      password,
      setPasswordAsPermanent: false,
      user: MOCK_INTERNAL_USER,
    });

    expect(applicationContext.getUniqueId).not.toHaveBeenCalled();
    expect(upsertUsers.mock.calls[0][0][0].entityName).toEqual('User');
    expect(
      applicationContext.getUserGateway().updateUser.mock.calls[0][1],
    ).toMatchObject({
      attributesToUpdate: {
        name: MOCK_INTERNAL_USER.name,
        role: MOCK_INTERNAL_USER.role,
      },
      email: MOCK_INTERNAL_USER.email,
      poolId: userPoolId,
    });
    expect(
      applicationContext.getUserGateway().createUser,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getCognito().adminLinkProviderForUser,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUserGateway().disableUser,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getCognito().adminSetUserPassword,
    ).toHaveBeenCalledWith({
      Password: password,
      Permanent: false,
      UserPoolId: applicationContext.environment.userPoolId,
      Username: MOCK_INTERNAL_USER.email,
    });
  });

  it('should not attempt to link a new user if they are a petitioner', async () => {
    await createOrUpdateUser(applicationContext, {
      password,
      setPasswordAsPermanent: false,
      user: MOCK_USERS[petitionerUser.userId] as unknown as User,
    });
    expect(
      applicationContext.getCognito().adminLinkProviderForUser,
    ).not.toHaveBeenCalled();
  });

  it('should disable access for a legacy judge user', async () => {
    await createOrUpdateUser(applicationContext, {
      password,
      setPasswordAsPermanent: false,
      user: legacyJudgeUser,
    });
    expect(
      applicationContext.getUserGateway().disableUser,
    ).toHaveBeenCalledWith({
      email: legacyJudgeUser.email,
    });
  });
});

describe('enableUser', () => {
  beforeEach(() => {
    cognitoMock.reset();
    getUserPoolId.mockResolvedValue(userPoolId);
  });

  it('should enable a user', async () => {
    cognitoMock.on(AdminEnableUserCommand).resolves({});

    await enableUser('test@example.com');

    const calls = cognitoMock.commandCalls(AdminEnableUserCommand);
    expect(calls).toHaveLength(1);
    expect(calls[0].args[0].input).toEqual({
      UserPoolId: userPoolId,
      Username: 'test@example.com',
    });
  });
});

describe('disableUser', () => {
  beforeEach(() => {
    cognitoMock.reset();
    getUserPoolId.mockResolvedValue(userPoolId);
  });

  it('should disable a user', async () => {
    cognitoMock.on(AdminDisableUserCommand).resolves({});

    await disableUser('test@example.com');

    const calls = cognitoMock.commandCalls(AdminDisableUserCommand);
    expect(calls).toHaveLength(1);
    expect(calls[0].args[0].input).toEqual({
      UserPoolId: userPoolId,
      Username: 'test@example.com',
    });
  });
});

describe('getAuthToken', () => {
  beforeAll(() => {
    getUserPoolId.mockResolvedValue(userPoolId);
    getClientId.mockResolvedValue('clientId');
  });

  it('should get a fresh auth token, then a cached one', async () => {
    cognitoMock.on(AdminInitiateAuthCommand).resolves({
      AuthenticationResult: { IdToken: 'token-abc' },
    });
    await expect(getAuthToken()).resolves.toEqual('token-abc');
    let calls = cognitoMock.commandCalls(AdminInitiateAuthCommand);
    expect(calls).toHaveLength(1);
    expect(calls[0].args[0].input).toEqual({
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      AuthParameters: {
        PASSWORD: undefined,
        USERNAME: undefined,
      },
      ClientId: 'clientId',
      UserPoolId: userPoolId,
    });

    await expect(getAuthToken()).resolves.toEqual('token-abc');
    calls = cognitoMock.commandCalls(AdminInitiateAuthCommand);
    expect(calls).toHaveLength(1);
  });
});
