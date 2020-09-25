const assert = require('assert');
const AWS = require('aws-sdk');
const axios = require('axios');

const ENV = process.argv[2];
const REGION = process.argv[3];

if (!ENV || !REGION) {
  console.error(
    "Missing required arguments: please invoke this script like so 'node smoke-tests ${ENV} ${REGION}'",
  );
  process.exit(1);
}

const cognito = new AWS.CognitoIdentityServiceProvider({
  region: 'us-east-1',
});

const getClientId = async userPoolId => {
  const results = await cognito
    .listUserPoolClients({
      MaxResults: 60,
      UserPoolId: userPoolId,
    })
    .promise();
  const clientId = results.UserPoolClients[0].ClientId;
  return clientId;
};

const getUserPoolId = async () => {
  const results = await cognito
    .listUserPools({
      MaxResults: 50,
    })
    .promise();
  const userPoolId = results.UserPools.find(
    pool => pool.Name === `efcms-${ENV}`,
  ).Id;
  return userPoolId;
};

const getUserToken = async (username, password) => {
  const userPoolId = await getUserPoolId();
  const clientId = await getClientId(userPoolId);

  const response = await cognito
    .adminInitiateAuth({
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      AuthParameters: {
        PASSWORD: password,
        USERNAME: username,
      },
      ClientId: clientId,
      UserPoolId: userPoolId,
    })
    .promise();
  return response.AuthenticationResult.IdToken;
};

(async () => {
  let apigateway = new AWS.APIGateway({
    region: REGION,
  });
  const { items: apis } = await apigateway
    .getRestApis({ limit: 200 })
    .promise();

  const services = apis
    .filter(api => api.name.includes(`gateway_api_${ENV}`))
    .reduce((obj, api) => {
      obj[
        api.name.replace(`_${ENV}`, '')
      ] = `https://${api.id}.execute-api.${REGION}.amazonaws.com/${ENV}`;
      return obj;
    }, {});

  const token = await getUserToken(
    'petitionsclerk1@example.com',
    'Testing1234$',
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
