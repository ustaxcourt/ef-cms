import AWS from 'aws-sdk';

const awsRegion = 'us-east-1';

AWS.config = new AWS.Config();
AWS.config.accessKeyId = Cypress.env('AWS_ACCESS_KEY_ID');
AWS.config.secretAccessKey = Cypress.env('AWS_SECRET_ACCESS_KEY');
AWS.config.sessionToken = Cypress.env('AWS_SESSION_TOKEN');
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

export const getUserToken = async (username, password) => {
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

export const login = token => {
  cy.visit(`/log-in?token=${token}`);
  cy.get('.progress-indicator').should('not.exist');
  cy.get('.big-blue-header').should('exist');
};
