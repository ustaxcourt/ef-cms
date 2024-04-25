import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { getServices } from './importHelpers';
import assert from 'assert';
import axios from 'axios';

const ENV = process.argv[2] || process.env.ENV;
const REGION = process.argv[3] || process.env.REGION;
const DEPLOYING_COLOR = process.argv[4] || process.env.DEPLOYING_COLOR;
const DEFAULT_ACCOUNT_PASS =
  process.argv[5] || process.env.DEFAULT_ACCOUNT_PASS;

if (!ENV || !REGION || !DEPLOYING_COLOR || !DEFAULT_ACCOUNT_PASS) {
  console.error(
    "Missing required arguments: please invoke this script like so 'ts-node smoke-tests ${ENV} ${REGION} ${DEPLOYING_COLOR} ${DEFAULT_ACCOUNT_PASS}'",
  );
  process.exit(1);
}

const cognito = new CognitoIdentityProvider({
  region: 'us-east-1',
});

const getClientId = async (userPoolId: string): Promise<string> => {
  const results = await cognito.listUserPoolClients({
    MaxResults: 60,
    UserPoolId: userPoolId,
  });
  let clientId = '';
  if (
    results &&
    'UserPoolClients' in results &&
    results.UserPoolClients &&
    results.UserPoolClients[0] &&
    'ClientId' in results.UserPoolClients[0] &&
    results.UserPoolClients[0].ClientId
  ) {
    clientId = results.UserPoolClients[0].ClientId;
  }
  return clientId;
};

const getUserPoolId = async (): Promise<string> => {
  const results = await cognito.listUserPools({
    MaxResults: 50,
  });
  let userPoolId = '';
  if (results && 'UserPools' in results && results.UserPools) {
    const userPool = results.UserPools.find(
      pool => pool.Name === `efcms-${ENV}`,
    );
    if (userPool && 'Id' in userPool && userPool.Id) {
      userPoolId = userPool.Id;
    }
  }
  return userPoolId;
};

const getUserToken = async (
  username: string,
  password: string,
): Promise<string> => {
  const userPoolId = await getUserPoolId();
  const clientId = await getClientId(userPoolId);

  const response = await cognito.adminInitiateAuth({
    AuthFlow: 'ADMIN_NO_SRP_AUTH',
    AuthParameters: {
      PASSWORD: password,
      USERNAME: username,
    },
    ClientId: clientId,
    UserPoolId: userPoolId,
  });
  let idToken = '';
  if (
    response &&
    'AuthenticationResult' in response &&
    response.AuthenticationResult &&
    'IdToken' in response.AuthenticationResult &&
    response.AuthenticationResult.IdToken
  ) {
    idToken = response.AuthenticationResult.IdToken;
  }
  return idToken;
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const services = getServices({
    color: DEPLOYING_COLOR,
    environmentName: ENV,
    region: REGION,
  });

  const token = await getUserToken(
    'petitionsclerk1@example.com',
    DEFAULT_ACCOUNT_PASS,
  );

  const response = await axios.get(`${services['gateway_api']}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  assert(response.status === 200);

  console.log('----------------------------------------------');
  console.log(`API Smoke Tests - ${ENV} - ${REGION} - successfully ran`);
  console.log('----------------------------------------------');
})();
