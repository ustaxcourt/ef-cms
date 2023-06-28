import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import AWS from 'aws-sdk';

const awsRegion = 'us-east-1';
AWS.config = new AWS.Config();

AWS.config.credentials = {
  accessKeyId: process.env.CYPRESS_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.CYPRESS_AWS_SECRET_ACCESS_KEY!,
  sessionToken: process.env.CYPRESS_AWS_SESSION_TOKEN,
};
AWS.config.region = awsRegion;

const { ENV } = process.env;
const DEPLOYING_COLOR = process.env.CYPRESS_DEPLOYING_COLOR;
const DEFAULT_ACCOUNT_PASS = process.env.CYPRESS_DEFAULT_ACCOUNT_PASS;

const cognito = new CognitoIdentityProvider({
  region: 'us-east-1',
});

export const confirmUser = async ({ email }) => {
  const userPoolId = await getUserPoolId();
  const clientId = await getClientId(userPoolId);

  const initAuthResponse = await cognito.adminInitiateAuth({
    AuthFlow: 'ADMIN_NO_SRP_AUTH',
    AuthParameters: {
      PASSWORD: DEFAULT_ACCOUNT_PASS,
      USERNAME: email,
    },
    ClientId: clientId,
    UserPoolId: userPoolId,
  });

  if (initAuthResponse.Session) {
    await cognito.adminRespondToAuthChallenge({
      ChallengeName: 'NEW_PASSWORD_REQUIRED',
      ChallengeResponses: {
        NEW_PASSWORD: DEFAULT_ACCOUNT_PASS,
        USERNAME: email,
      },
      ClientId: clientId,
      Session: initAuthResponse.Session,
      UserPoolId: userPoolId,
    });
  }
};

const getClientId = async userPoolId => {
  const results = await cognito.listUserPoolClients({
    MaxResults: 60,
    UserPoolId: userPoolId,
  });
  const clientId = results.UserPoolClients[0].ClientId;
  return clientId;
};

const getUserPoolId = async () => {
  const results = await cognito.listUserPools({
    MaxResults: 50,
  });
  const userPoolId = results.UserPools.find(
    pool => pool.Name === `efcms-${ENV}`,
  ).Id;
  return userPoolId;
};

export const getUserToken = async (username, password) => {
  const userPoolId = await getUserPoolId();
  const clientId = await getClientId(userPoolId);

  return cognito.adminInitiateAuth({
    AuthFlow: 'ADMIN_NO_SRP_AUTH',
    AuthParameters: {
      PASSWORD: password,
      USERNAME: username,
    },
    ClientId: clientId,
    UserPoolId: userPoolId,
  });
};

export const getRestApi = async () => {
  let apigateway = new AWS.APIGateway({
    region: awsRegion,
  });
  const { items: apis } = await apigateway
    .getRestApis({ limit: 200 })
    .promise();

  const services = apis
    .filter(api => api.name.includes(`gateway_api_${ENV}_${DEPLOYING_COLOR}`))
    .reduce((obj, api) => {
      obj[
        api.name.replace(`_${ENV}_${DEPLOYING_COLOR}`, '')
      ] = `https://${api.id}.execute-api.${awsRegion}.amazonaws.com/${ENV}`;
      return obj;
    }, {});

  return services['gateway_api'];
};
