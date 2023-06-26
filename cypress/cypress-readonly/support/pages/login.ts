import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import AWS from 'aws-sdk';

const awsRegion = 'us-east-1';

AWS.config = new AWS.Config();
AWS.config.accessKeyId = Cypress.env('AWS_ACCESS_KEY_ID');
AWS.config.secretAccessKey = Cypress.env('AWS_SECRET_ACCESS_KEY');
AWS.config.sessionToken = Cypress.env('AWS_SESSION_TOKEN');
AWS.config.region = awsRegion;

const ENV = Cypress.env('ENV');

const cognito = new CognitoIdentityProvider({
  region: 'us-east-1',
});

const getClientId = async userPoolId => {
  const results = await cognito.listUserPoolClients({
    MaxResults: 60,
    UserPoolId: userPoolId,
  });
  if (!results.UserPoolClients) {
    throw new Error(`No client found for ${userPoolId}`);
  }
  const clientId = results.UserPoolClients[0].ClientId;
  return clientId;
};

const getUserPoolId = async () => {
  const { UserPools } = await cognito.listUserPools({
    MaxResults: 50,
  });
  if (!UserPools) {
    throw new Error('no user pools found on cognito');
  }
  const userPoolId = UserPools.find(pool => pool.Name === `efcms-${ENV}`)?.Id;
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

export const login = token => {
  cy.visit(`/log-in?token=${token}`);
  cy.get('.progress-indicator').should('not.exist');
  cy.get('.big-blue-header').should('exist');
};
