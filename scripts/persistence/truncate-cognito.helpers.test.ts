import {
  AdminDeleteUserCommand,
  CognitoIdentityProvider,
  ListUsersCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { mockClient } from 'aws-sdk-client-mock';
import { truncateAllCognitoUsers } from './truncate-cognito.helpers';

const cognitoMock = mockClient(CognitoIdentityProvider);

describe('truncateAllCognitoUsers', () => {
  const UserPoolId = 'us-east-1_test';

  beforeEach(() => {
    cognitoMock.reset();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('lists all users (across pages) and deletes each one', async () => {
    cognitoMock
      .on(ListUsersCommand)
      .resolvesOnce({
        Users: [{ Username: 'user-a' }, { Username: 'user-b' }],
        PaginationToken: 'next',
      })
      .resolvesOnce({
        Users: [{ Username: 'user-c' }],
      });

    cognitoMock.on(AdminDeleteUserCommand).resolves({});

    const cognito = new CognitoIdentityProvider({});
    const count = await truncateAllCognitoUsers({ cognito, UserPoolId });

    expect(count).toBe(3);
    const deleteCalls = cognitoMock.commandCalls(AdminDeleteUserCommand);
    expect(deleteCalls).toHaveLength(3);
    expect(deleteCalls.map(c => c.args[0].input.Username).sort()).toEqual([
      'user-a',
      'user-b',
      'user-c',
    ]);
    expect(
      deleteCalls.every(c => c.args[0].input.UserPoolId === UserPoolId),
    ).toBe(true);
  });

  it('returns 0 and issues no delete calls when there are no users', async () => {
    cognitoMock.on(ListUsersCommand).resolves({ Users: [] });

    const cognito = new CognitoIdentityProvider({});
    const count = await truncateAllCognitoUsers({ cognito, UserPoolId });

    expect(count).toBe(0);
    expect(cognitoMock.commandCalls(AdminDeleteUserCommand)).toHaveLength(0);
  });
});
