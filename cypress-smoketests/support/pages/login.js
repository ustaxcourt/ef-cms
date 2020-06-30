const AWS = require('aws-sdk');

const awsRegion = 'us-east-1';

AWS.config = new AWS.Config();
AWS.config.accessKeyId = Cypress.env('AWS_ACCESS_KEY_ID');
AWS.config.secretAccessKey = Cypress.env('AWS_SECRET_ACCESS_KEY');
AWS.config.region = awsRegion;

const ENV = Cypress.env('ENV');

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

exports.getUserToken = async (username, password) => {
  const userPoolId = await getUserPoolId();
  const clientId = await getClientId(userPoolId);

  return cognito
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
};

exports.login = token => {
  cy.visit(`/log-in?token=${token}`);

  cy.get('.progress-indicator').should('not.exist');
};

exports.getRestApi = async () => {
  let apigateway = new AWS.APIGateway({
    region: awsRegion,
  });
  const { items: apis } = await apigateway
    .getRestApis({ limit: 200 })
    .promise();

  const services = apis
    .filter(api => api.name.includes(`gateway_api_${ENV}`))
    .reduce((obj, api) => {
      obj[
        api.name.replace(`_${ENV}`, '')
      ] = `https://${api.id}.execute-api.${awsRegion}.amazonaws.com/${ENV}`;
      return obj;
    }, {});

  return services['gateway_api'];
};
