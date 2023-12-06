import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { cognitoLocalWrapper } from '@web-api/cognitoLocalWrapper';

let cognitoClientCache: CognitoIdentityServiceProvider;

export function getCognito() {
  if (!cognitoClientCache) {
    cognitoClientCache = new CognitoIdentityServiceProvider({
      httpOptions: {
        connectTimeout: 3000,
        timeout: 5000,
      },
      maxRetries: 3,
      region: 'us-east-1',
    });
  }
  return cognitoClientCache;
}

export function getMockCognito() {
  if (!cognitoClientCache) {
    cognitoClientCache = {
      adminCreateUser: () => ({
        promise: () => ({
          User: {
            Username: uuidv4(),
          },
        }),
      }),
      adminDisableUser: () => ({
        promise: () => {},
      }),
      adminGetUser: ({ Username }) => ({
        promise: async () => {
          // TODO: this scan might become REALLY slow while doing a full integration
          // test run.
          const items = await scan({
            applicationContext: {
              environment,
              getDocumentClient,
            },
          });
          const users = items.filter(
            ({ pk, sk }) => pk.startsWith('user|') && sk.startsWith('user|'),
          );
          const foundUser = users.find(({ email }) => email === Username);
          if (foundUser) {
            return {
              UserAttributes: [],
              Username: foundUser.userId,
            };
          } else {
            const error = new Error();
            error.code = 'UserNotFoundException';
            throw error;
          }
        },
      }),
      adminUpdateUserAttributes: () => ({
        promise: () => {},
      }),
      listUsers: () => ({
        promise: () => {
          throw new Error(
            'Please use cognito locally by running npm run start:api:cognito-local',
          );
        },
      }),
    };
  }

  return cognitoClientCache;
}

export function getLocalCognito() {
  if (!cognitoClientCache) {
    cognitoClientCache = cognitoLocalWrapper(
      new CognitoIdentityServiceProvider({
        endpoint: 'http://localhost:9229/',
        httpOptions: {
          connectTimeout: 3000,
          timeout: 5000,
        },
        maxRetries: 3,
        region: 'local',
      }),
    );
  }
  return cognitoClientCache;
}
